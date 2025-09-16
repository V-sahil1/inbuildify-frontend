import React, { useState } from "react";
import { Collapse, Table, Button, Empty } from "antd";
import { QuotationStatus } from "data/types";
import {
  IconChevronDown,
  IconChevronUp,
  IconFileTypePdf,
} from "@tabler/icons-react";
// import dayjs from "dayjs";
import LeadQuotationComparison from "./LeadQuotationComparison";
import { useAppSelector } from "@hooks/redux";
import { QuotationResponse } from "@redux/feature/quotation/IQuotationState";
import { timeAgo } from "@lib/utils/timeAgo";

const { Panel } = Collapse;
const { Column } = Table;

const statusTagColor: Record<QuotationStatus, string> = {
  approved: "green",
  pending: "orange",
  rejected: "red",
  all: "default",
};

const LeadQuotationList = () => {
  const [openComparison, setOpenComparison] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationResponse | null>(
    null
  );
  const quotations = useAppSelector(
    (state) => state.lead.leadDetail.createdQuotations?.quotations
  );
  const handleCompareClick = (quotation: QuotationResponse) => {
    setSelectedQuotation(quotation);
    setOpenComparison(true);
  };

  console.log("selectedQuotation",selectedQuotation)
  return (
    <>
      {quotations?.length === 0 ? (
        <div className="p-6 text-center bg-card-color rounded-md">
          <Empty description="No quotations found" />
        </div>
      ) : (
        <Collapse
          className="bg-card-color"
          bordered={false}
          defaultActiveKey={quotations?.[0]?.quotationId}
          expandIcon={({ isActive }) =>
            isActive ? (
              <IconChevronUp
                color="var(--font-color)"
                className="mt-2"
                size={20}
              />
            ) : (
              <IconChevronDown
                color="var(--font-color)"
                className="mt-2"
                size={20}
              />
            )
          }
        >
          {quotations?.map((quotation: QuotationResponse) => (
              <Panel
                header={
                  <div className="flex justify-between items-center text-[var(--font-color)] w-full">
                    <span>{quotation?.slugId}</span>
                    <Button
                    type="primary"
                    disabled={Array.isArray(quotation.versions) && quotation.versions.length < 2}
                    onClick={() => handleCompareClick(quotation)}
                  >
                      Compare
                    </Button>
                  </div>
                }
                key={quotation?.quotationId}
              >
                <Table
                  dataSource={Array.isArray(quotation.versions) ? quotation.versions : []}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ x: "max-content" }}
                >
                  <Column title="Version" dataIndex="versionNumber" key="versionNumber" render={(versionNumber: string) => versionNumber ? `v${versionNumber}` : "-"} />
                  {/* <Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status: QuotationStatus) => (
                      <Tag color={statusTagColor[status]}>
                      {status.toUpperCase()}
                    </Tag>
                    )}
                  /> */}
                  {/* <Column
                    title="Notes"
                    dataIndex="notes"
                    key="notes"
                    render={(notes: string) => notes ? notes : "-"}
                  /> */}
                  <Column
                    title="Created At"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(date: string) =>
                    date ? timeAgo(date) : "-"
                  }
                  />
                  {/* <Column
                    title="Actions"
                    key="actions"
                    render={(_, record) => (
                      <Button type="link" icon={<IconFileTypePdf />}>
                        PDF
                      </Button>
                    )}
                  /> */}
                </Table>
              </Panel>
            ))}
          </Collapse>
        )}
      {selectedQuotation && (
        <LeadQuotationComparison
          open={openComparison}
          onClose={() => setOpenComparison(false)}
          quotation={selectedQuotation}
        />
      )}
    </>
  );
};

export default LeadQuotationList;
