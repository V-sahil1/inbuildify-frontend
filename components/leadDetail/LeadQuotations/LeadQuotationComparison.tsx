import React, { useEffect, useState } from 'react';
import { Modal, Checkbox, Button, Table, message, Tag } from 'antd';
import { Quotation, QuotationVersionDetails } from '@redux/feature/quotation/IQuotationState';
import { getQuotationCompareThunk } from '@redux/feature/quotation/quotationThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { usePdf } from '@hooks/usePdf';
import { QuotationComparisionPdf } from '@/components/common/pdf/QuotationComparisionPdf';

const { Column } = Table;

interface Props {
  open: boolean;
  onClose: () => void;
  quotation: Quotation;
}

const LeadQuotationComparison: React.FC<Props> = ({ open, onClose, quotation }) => {
  const [selectedVersions, setSelectedVersions] = useState<QuotationVersionDetails[]>([]);
  const [comparisonResult, setComparisonResult] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const quotations = useAppSelector(state => state.quotation.quotation);
  const { previewPdf } = usePdf(QuotationComparisionPdf);
  const dispatch = useAppDispatch();
  const selectedQuotation = quotations.find(i => i.quotationId === quotation.quotationId);
  // useEffect(() => {
  //   async function fetchQuotation() {
  //     try {
  //       const res = await dispatch(getQuotationById(quotation.quotationId)).unwrap();
  //       // setQuotationVersion(res.versions as QuotationVersions);//todo
  //     } catch (error) {
  //       message.error(error || 'Failed to fetch quotation Version');
  //     }
  //   }
  //   fetchQuotation();
  // }, [quotation.quotationId, dispatch]);

  useEffect(() => {
    if (selectedVersions.length < 2) {
      setComparisonResult([]);
    } else {
      handleFetchComparison();
    }
  }, [selectedVersions]);

  const handleFetchComparison = async (showall?: boolean) => {
    try {
      await dispatch(
        getQuotationCompareThunk({
          version1Id: selectedVersions[0]?.quotationVersionId,
          version2Id: selectedVersions[1]?.quotationVersionId,
          quoteId: quotation.quotationId,
          showAll: showall ?? !showAll,
        })
      ).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch compariso');
    }
  };

  const handleCheckboxChange = async (versionId: string) => {
    if (!Array.isArray(quotation.versions)) return;
    const version = quotation.versions.find(v => v.quotationVersionId === versionId);
    if (!version) return;
    setSelectedVersions(prev => {
      if (prev.some(v => v.quotationVersionId === versionId)) {
        return prev.filter(v => v.quotationVersionId !== versionId);
      }
      return prev.length < 2 ? [...prev, version] : prev;
    });
  };

  const handleCancel = () => {
    onClose();
    setComparisonResult([]);
    setSelectedVersions([]);
    setShowAll(false);
  };

  const handleCompareClick = async (shouldShowAll = showAll) => {
    handleFetchComparison(false);
    setShowAll(false);
    // if (selectedVersions.length !== 2) {
    //   message.warning('Please select exactly 2 versions');
    //   return;
    // }
    // const [leftVersion, rightVersion] = selectedVersions;
    // const leftItems = quotationVersion[String(leftVersion.quotationVersionNo)] || [];
    // const rightItems = quotationVersion[String(rightVersion.quotationVersionNo)] || [];

    // const rows: any[] = [];
    // const allItemIds = new Set([
    //   ...leftItems.map(i => i.categoryItemId),
    //   ...rightItems.map(i => i.categoryItemId),
    // ]);

    // const formatItem = (item: any) => {
    //   if (!item) return { value: '-', cost: 0, quantity: 0, total: 0 };
    //   const quantity = item?.categoryItemQuantity || 1;
    //   const cost = parseFloat(item?.categoryItemCost);
    //   const total = quantity * cost;
    //   return {
    //     value: total,
    //     cost: cost,
    //     quantity: quantity,
    //     total: total,
    //     formattedValue: `$${total?.toFixed(2)}`,
    //     details: `(${quantity} × ${cost?.toFixed(2)})`,
    //   };
    // };

    // allItemIds.forEach(itemId => {
    //   const itemLeft = leftItems.find(i => i?.categoryItemId === itemId);
    //   const itemRight = rightItems.find(i => i?.categoryItemId === itemId);

    //   const rawLeftValue = itemLeft
    //     ? `${itemLeft?.categoryItemQuantity || 1}x${parseFloat(itemLeft?.categoryItemCost).toFixed(2)}`
    //     : null;
    //   const rawRightValue = itemRight
    //     ? `${itemRight?.categoryItemQuantity || 1}x${parseFloat(itemRight?.categoryItemCost).toFixed(2)}`
    //     : null;

    //   const isDifferent = rawLeftValue !== rawRightValue;

    //   // if (showAll || isDifferent) {
    //   if (shouldShowAll || rawLeftValue !== rawRightValue) {
    //     rows.push({
    //       key: itemId,
    //       categoryName: (itemLeft || itemRight)?.caterogyName,
    //       description: (itemLeft || itemRight)?.categoryItemDescription,
    //       left: formatItem(itemLeft),
    //       right: formatItem(itemRight),
    //       isDifferent: isDifferent,
    //     });
    //   }
    // });
    // setComparisonResult(rows);
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      footer={null}
      width={900}
      title={`Quotation Version Comparison - ${quotation.referenceNumber}`}
    >
      <div className="flex items-center gap-4 mb-4 justify-between">
        <div className="flex gap-2">
          <span>Select two versions:</span>
          <div className="flex flex-wrap gap-2">
            {quotation.versions &&
              Array.isArray(quotation.versions) &&
              quotation.versions.map(v => (
                <Checkbox
                  key={v.quotationVersionId}
                  checked={selectedVersions?.some(
                    sv => sv.quotationVersionId === v.quotationVersionId
                  )}
                  onChange={() => handleCheckboxChange(v.quotationVersionId)}
                >
                  V{v.quotationVersionNo}
                </Checkbox>
              ))}
          </div>
        </div>
        <div className="flex align-middle items-center gap-2">
          <Button type="primary" onClick={() => handleCompareClick(showAll)}>
            Compare
          </Button>
          <Button
            type="dashed"
            onClick={() =>
              previewPdf({
                comparisonResult,
                // propertyAddress: quotation.propertyAddress,
                selectedVersions: selectedVersions,
                slugId: selectedQuotation.referenceNumber,
              })
            }
          >
            Print
          </Button>
          <Checkbox
            checked={showAll}
            onChange={e => {
              setShowAll(e.target.checked);
              if (e.target.checked) {
                handleFetchComparison();
              } else {
                handleFetchComparison();
              }
            }}
          >
            Show All
          </Checkbox>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 mb-3">
        <span className="font-semibold">Property Address:</span>
        {/* <span> {quotation.propertyAddress}</span> */}
      </div>
      <Table
        dataSource={selectedQuotation?.comparison?.items || []}
        pagination={selectedQuotation?.comparison?.items?.length > 10 ? { pageSize: 10 } : false}
        bordered
        size="small"
        // rowKey="key"
        // rowClassName={record => (record.isDifferent && showAll ? 'bg-primary-10' : '')}
      >
        <Column
          title="Items"
          dataIndex="name"
          key="name"
          width="60%"
          render={(_, record) => (
            <div>
              <Tag color="blue">
                {record.type === 'pricelist_item' ? record.priceListName : record.type}
              </Tag>
              <p>{record.name}</p>
            </div>
          )}
        />
        {selectedVersions[0] && (
          <Column
            title={
              <div className="flex flex-col justify-center items-center">
                <span>V{selectedVersions[0].quotationVersionNo}</span>
                <span>${Number(selectedVersions[0].grandTotalCost).toFixed(2)}</span>
              </div>
            }
            dataIndex="left"
            key="left"
            width="20%"
            align="center"
            render={(_, record) => (
              <div className="text-font-color align-middle">
                <div className="font-bold">
                  {record.type === 'pricelist_item'
                    ? record.version1TotalPrice || '-'
                    : record.version1Value || '-'}
                </div>
              </div>
            )}
          />
        )}
        {selectedVersions[1] && (
          <Column
            title={
              <div className="flex flex-col justify-center items-center">
                <span>V{selectedVersions[1].quotationVersionNo}</span>
                <span>${Number(selectedVersions[1].grandTotalCost).toFixed(2)}</span>
              </div>
            }
            dataIndex="right"
            key="right"
            width="20%"
            align="center"
            render={(_, record) => (
              <div className="text-font-color align-middle">
                <div className="text-xs text-gray-500">
                  {record.type === 'pricelist_item'
                    ? record.version2TotalPrice || '-'
                    : record.version2Value || '-'}
                </div>
              </div>
            )}
          />
        )}
      </Table>
    </Modal>
  );
};

export default LeadQuotationComparison;
