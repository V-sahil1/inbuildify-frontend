import React, { useEffect, useState } from 'react';
import { Modal, Checkbox, Button, Table, message, Tag } from 'antd';
import {
  IQuotationItem,
  Quotation,
  QuotationVersionDetails,
} from '@redux/feature/quotation/IQuotationState';
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
  const [comparisonResult, setComparisonResult] = useState<IQuotationItem[]>([]);
  const [showAll, setShowAll] = useState(true);
  const quotations = useAppSelector(state => state.quotation.quotation);
  const { leadDetail } = useAppSelector(state => state.lead);
  const { previewPdf } = usePdf(QuotationComparisionPdf);
  const dispatch = useAppDispatch();
  const selectedQuotation = quotations.find(i => i.quotationId === quotation.quotationId);

  useEffect(() => {
    if (selectedVersions.length < 2) {
      setComparisonResult([]);
    } else {
      handleFetchComparison();
    }
  }, [selectedVersions]);

  useEffect(() => {
    setComparisonResult(selectedQuotation?.comparison?.items || []);
  }, [quotations]);

  const handleFetchComparison = async (showall?: boolean) => {
    try {
      await dispatch(
        getQuotationCompareThunk({
          version1Id: selectedVersions[0]?.quotationVersionId,
          version2Id: selectedVersions[1]?.quotationVersionId,
          quoteId: quotation.quotationId,
          showAll: showall ?? showAll,
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

  const handleCompareClick = async () => {
    if (showAll) {
      handleFetchComparison(false);
    }
    setShowAll(false);
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
          <Button type="primary" onClick={() => handleCompareClick()}>
            Compare
          </Button>
          <Button
            type="dashed"
            onClick={() =>
              previewPdf({
                comparisonResult,
                propertyAddress: leadDetail?.property?.addressLine1 || '',
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
                handleFetchComparison(true);
              } else {
                handleFetchComparison(false);
              }
            }}
          >
            Show All
          </Checkbox>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2 mb-3">
        <span className="font-semibold">Property Address:</span>
        <span> {leadDetail?.property?.addressLine1 || ''}</span>
      </div>
      <Table
        dataSource={(selectedVersions?.length === 2 && selectedQuotation?.comparison?.items) || []}
        pagination={selectedQuotation?.comparison?.items?.length > 10 ? { pageSize: 10 } : false}
        bordered
        size="small"
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
                <div className="text-sm">
                  {record.type === 'pricelist_item'
                    ? record.version1TotalPrice || '-'
                    : record.version1Value || '-'}
                </div>
                {record.type === 'pricelist_item' && (
                  <div className="text-xs text-font-color-100">
                    {Math.floor(record.version1Quantity) + '*' + record.itemCost}
                  </div>
                )}
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
                <div className="text-sm">
                  {record.type === 'pricelist_item'
                    ? record.version2TotalPrice || '-'
                    : record.version2Value || '-'}
                </div>
                {record.type === 'pricelist_item' && (
                  <div className="text-xs  text-font-color-100">
                    {Math.floor(record.version2Quantity) + '*' + record.itemCost}
                  </div>
                )}
              </div>
            )}
          />
        )}
      </Table>
    </Modal>
  );
};

export default LeadQuotationComparison;
