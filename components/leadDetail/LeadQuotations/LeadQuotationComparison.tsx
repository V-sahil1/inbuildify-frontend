// LeadQuotationComparison.tsx
import React, { useEffect, useState } from "react";
import { Modal, Checkbox, Button, Table, message } from "antd";
// import { Quotation } from "data/types";
import { QuotationResponse } from "@redux/feature/quotation/IQuotationState";
import { getQuotationById } from "@redux/feature/quotation/quotationThunk";
import { useAppDispatch } from "@hooks/redux";
import { QuotationVersionBasic, QuotationVersions } from "data/types";

const { Column } = Table;

interface Props {
  open: boolean;
  onClose: () => void;
  quotation: QuotationResponse
}

const LeadQuotationComparison: React.FC<Props> = ({
  open,
  onClose,
  quotation,
}) => {
  const [selectedVersions, setSelectedVersions] = useState<QuotationVersionBasic[]>([]);
  const [quotationVersion, setQuotationVersion] = useState<QuotationVersions>({});
  const [comparisonResult, setComparisonResult] = useState<any[]>([]);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchQuotation() {
      try {
        const res = await dispatch(
          getQuotationById(quotation.quotationId)
        ).unwrap();
        setQuotationVersion(res.versions as QuotationVersions);
      } catch (error) {
        message.error(error || "Failed to fetch quotation Version");
      }
    }
    fetchQuotation();
  }, [quotation.quotationId, dispatch]);

  useEffect(() => {
    if (selectedVersions.length < 2) {
      setComparisonResult([]);
    }
  }, [selectedVersions]);
  
  const handleCheckboxChange = (versionId: string) => {
    // Make sure we're working with an array of versions
    if (!Array.isArray(quotation.versions)) return;
    
    const version = quotation.versions.find(
      (v) => v.quotationVersionId === versionId
    );
    if (!version) return;

    setSelectedVersions((prev) => {
      if (prev.some((v) => v.quotationVersionId === versionId)) {
        // Remove if already selected
        return prev.filter((v) => v.quotationVersionId !== versionId);
      }
      // Allow only 2 versions
      return prev.length < 2 ? [...prev, version] : prev;
    });
  };

    const handleCancel = () => {
      onClose();
    setComparisonResult([]);
        setSelectedVersions([]);
        setShowAll(false);
     };
  const handleCompareClick = () => {
    if (selectedVersions.length !== 2) {
      message.warning("Please select exactly 2 versions");
      return;
    }

    // Always take the first selected as left column, second as right column
    const [leftVersion, rightVersion] = selectedVersions;

    const leftItems = quotationVersion[String(leftVersion.versionNumber)] || [];
    const rightItems = quotationVersion[String(rightVersion.versionNumber)] || [];

    const rows: any[] = [];
    const allItemIds = new Set([
      ...leftItems.map((i) => i.categoryItemId),
      ...rightItems.map((i) => i.categoryItemId),
    ]);

    allItemIds.forEach((itemId) => {
      const itemLeft = leftItems.find((i) => i.categoryItemId === itemId);
      const itemRight = rightItems.find((i) => i.categoryItemId === itemId);

      if (itemLeft && !itemRight) {
        rows.push({
          key: itemId,
          description: itemLeft.categoryItemDescription,
          left: `${itemLeft.quantity || 1} × $${itemLeft.categoryItemCost}`,
          right: "-",
        });
        return;
      }
      if (itemRight && !itemLeft) {
        rows.push({
          key: itemId,
          description: itemRight.categoryItemDescription,
          left: "-",
          right: `${itemRight.quantity || 1} × $${itemRight.categoryItemCost}`,
        });
        return;
      }

      if (itemLeft && itemRight) {
        const vLeft = `${itemLeft.quantity || 1} × $${
          itemLeft.categoryItemCost
        }`;
        const vRight = `${itemRight.quantity || 1} × $${
          itemRight.categoryItemCost
        }`;

        if (vLeft !== vRight) {
          rows.push({
            key: itemId,
            description: itemLeft.categoryItemDescription,
            left: vLeft,
            right: vRight,
          });
        }
      }
    });
    setComparisonResult(rows);
  };

        return (
          <Modal
            open={open}
            onCancel={handleCancel}
            footer={null}
            width={900}
            title={`Quotation Version Comparison - ${quotation.slugId}`}
          >
            {/* Select versions */}
            <div className="flex items-center gap-4 mb-4 justify-between">
              <div className="flex gap-2">
                <span>Select two versions:</span>
                <div className="flex flex-wrap gap-2">
                  {quotation.versions && Array.isArray(quotation.versions) && quotation.versions.map((v) => (
                    <Checkbox
                      key={v.quotationVersionId}
                      checked={selectedVersions?.some(
                        (sv) => sv.quotationVersionId === v.quotationVersionId
                      )}
                      onChange={() => handleCheckboxChange(v.quotationVersionId)}
                    >
                      {v.versionNumber}
                    </Checkbox>
                  ))}
                </div>
        </div>
        <div className="flex align-middle items-center gap-2">
          <Button type="primary" onClick={handleCompareClick}>
            Compare
          </Button>
          {/* <Button>Print</Button> */}
          {/* <Checkbox
            checked={showAll}
            onChange={(e) => setShowAll(e.target.checked)}
          >
            Show All
          </Checkbox> */}
        </div>
      </div>

            {/* Comparison Table */}
            <div className="mt-4 flex flex-wrap gap-2 mb-3">
              <span className="font-semibold">Property Address:</span>
              <span> {quotation.propertyAddress}</span>
            </div>
            <Table
              dataSource={comparisonResult}
              pagination={comparisonResult.length > 10 ? { pageSize: 10 } : false}
              bordered
              size="small"
              rowKey="key"
            >
        <Column
          title="Items"
          dataIndex="description"
          key="description"
          width="60%"
        />
        {selectedVersions[0] && (
          <Column
            title={
              <div className="flex flex-col justify-center items-center">
                <span>{selectedVersions[0].versionNumber}</span>
                <span>
                  ${Number(selectedVersions[0].totalAmount).toFixed(2)}
                </span>
                        </div>
                        }
                        dataIndex="left"
                        key="left"
                        width="20%"
                        align="center"
                    />
                    )}
                    {selectedVersions[1] && (
                    <Column
                        title={
                        <div className="flex flex-col justify-center items-center">
                          <span>{selectedVersions[1].versionNumber}</span>
                          <span>
                  ${Number(selectedVersions[1].totalAmount).toFixed(2)}
                </span>
                             </div>
                        }
                        dataIndex="right"
                        key="right"
                        width="20%"
                        align="center"
                    />
                )}
            </Table>
        </Modal>
    );
};

export default LeadQuotationComparison;
