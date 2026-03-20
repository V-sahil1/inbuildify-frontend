import React, { useEffect, useState } from 'react';
import { Modal, Checkbox, Button, Table, message, Tag } from 'antd';
import {
  IQuotationItem,
  Quotation,
  QuotationVersionDetails,
} from '@redux/feature/quotation/IQuotationState';
import { createQuotationCompareThunk } from '@redux/feature/quotation/quotationThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { usePdf } from '@hooks/usePdf';
import { QuotationComparisionPdf } from '@/components/common/pdf/QuotationComparisionPdf';

const { Column } = Table;

interface Props {
  open: boolean;
  onClose: () => void;
  quotation: Quotation;
  selectedVersionsData?: {
    [quotationId: string]: {
      version: QuotationVersionDetails;
      quotation: Quotation;
    }[];
  };
}

const LeadQuotationComparison: React.FC<Props> = ({
  open,
  onClose,
  quotation,
  selectedVersionsData,
}) => {
  const [selectedVersions, setSelectedVersions] = useState<
    { version: QuotationVersionDetails; quotation: Quotation }[]
  >([]);
  const [showAll, setShowAll] = useState(true);
  const quotations = useAppSelector(state => state.quotation.quotation);
  const { comparison } = useAppSelector(state => state.quotation);
  const { leadDetail } = useAppSelector(state => state.lead);
  const { previewPdf } = usePdf(QuotationComparisionPdf);
  const dispatch = useAppDispatch();
  const selectedQuotation = quotations.find(i => i.quotationId === quotation.quotationId);

  // Auto-populate selected versions from selectedVersionsData
  useEffect(() => {
    if (selectedVersionsData) {
      const allSelectedItems = Object.values(selectedVersionsData).flat();
      setSelectedVersions(allSelectedItems);
    }
  }, [selectedVersionsData]);

  useEffect(() => {
    if (selectedVersions.length === 2) {
      handleFetchComparison();
    }
  }, [selectedVersions]);

  const handleFetchComparison = async (showall?: boolean) => {
    try {
      const payload = {
        versions: [
          {
            quotationId: selectedVersions[0]?.quotation?.quotationId,
            versionId: selectedVersions[0]?.version?.quotationVersionId,
          },
          {
            quotationId: selectedVersions[1]?.quotation?.quotationId,
            versionId: selectedVersions[1]?.version?.quotationVersionId,
          },
        ],
        showAll: showall ?? showAll,
      };
      await dispatch(
        createQuotationCompareThunk({ data: payload, leadId: leadDetail?.lead?.leadsId })
      ).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch compariso');
    }
  };

  const handleCancel = () => {
    onClose();
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
      title={`Quotation Version Comparison`}
    >
      <div className="flex items-center gap-4 mb-4 justify-end">
        <div className="flex align-middle items-center gap-2">
          <Button type={showAll ? 'default' : 'primary'} onClick={() => handleCompareClick()}>
            Compare
          </Button>
          <Button
            type="dashed"
            onClick={() =>
              previewPdf({
                comparisonResult: comparison?.items,
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
        dataSource={(selectedVersions?.length === 2 && comparison?.items) || []}
        pagination={comparison?.items?.length > 10 ? { pageSize: 10 } : false}
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
                <span>
                  {selectedVersions[0]?.quotation?.referenceNumber} - V
                  {selectedVersions[0].version?.quotationVersionNo}
                </span>
                <span className="text-xs text-gray-500">
                  Dwelling Type: {selectedVersions[0].version?.dwellingTypeName || ''}
                </span>
                <span className="text-xs text-gray-500">
                  Range: {selectedVersions[0].version?.rangeName || ''}
                </span>
                <span>${Number(selectedVersions[0].version?.grandTotalCost).toFixed(2)}</span>
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
                {record.type === 'pricelist_item' && Math.floor(record.version1Quantity) > 0 && (
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
                <span>
                  {selectedVersions[1]?.quotation?.referenceNumber} - V
                  {selectedVersions[1].version?.quotationVersionNo}
                </span>
                <span className="text-xs text-gray-500">
                  Dwelling Type: {selectedVersions[1].version?.dwellingTypeName || ''}
                </span>
                <span className="text-xs text-gray-500">
                  Range: {selectedVersions[1].version?.rangeName || ''}
                </span>
                <span>${Number(selectedVersions[1].version?.grandTotalCost).toFixed(2)}</span>
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
                {record.type === 'pricelist_item' && Math.floor(record.version2Quantity) > 0 && (
                  <div className="text-xs text-font-color-100">
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
