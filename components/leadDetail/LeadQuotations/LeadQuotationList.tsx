import React, { useState } from "react";
import { Collapse, Table, Tag, Button, Empty } from "antd";
import { Quotation, QuotationStatus } from "data/types";
import { IconChevronDown, IconChevronUp, IconFileTypePdf } from "@tabler/icons-react";
import dayjs from "dayjs";
import LeadQuotationComparison from "./LeadQuotationComparison";

const { Panel } = Collapse;
const { Column } = Table;

const statusTagColor: Record<QuotationStatus, string> = {
  approved: "green",
  pending: "orange",
  rejected: "red",
  all: "default",
};

const LeadQuotationList: React.FC<{ quotations: Quotation[] }> = ({ quotations }) => {
  const [openComparison, setOpenComparison] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const handleCompareClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setOpenComparison(true);
  };

  return (
    <>
      {
        quotations.length === 0 ? (
          <div className="p-6 text-center bg-card-color rounded-md">
            <Empty description="No quotations found" />
          </div>
        ) : (
          <Collapse className="bg-card-color" bordered={false} defaultActiveKey={quotations[0].quotationId}
            expandIcon={({ isActive }) => isActive ? <IconChevronUp color="var(--font-color)" className="mt-2" size={20} /> : <IconChevronDown color="var(--font-color)" className="mt-2" size={20} />}
          >
            {quotations.map((quotation) => (
              <Panel
                header={
                  <div className="flex justify-between items-center text-[var(--font-color)] w-full">
                    <span>{quotation.quotationId}</span>
                    <Button type="primary" onClick={() => handleCompareClick(quotation)}>
                      Compare
                    </Button>
                  </div>
                }
                key={quotation.quotationId}
              >
                <Table
                  dataSource={quotation.versions}
                  rowKey="id"
                  pagination={false}
                  size="small"
                  bordered
                  scroll={{ x: "max-content" }}
                >
                  <Column title="Version" dataIndex="version" key="version" />
                  <Column
                    title="Status"
                    dataIndex="status"
                    key="status"
                    render={(status: QuotationStatus) => (
                      <Tag color={statusTagColor[status]}>{status.toUpperCase()}</Tag>
                    )}
                  />
                  <Column
                    title="Created By"
                    dataIndex="createdBy"
                    key="createdBy"
                  />
                  <Column
                    title="Created At"
                    dataIndex="createdAt"
                    key="createdAt"
                    render={(date: string) => date ? dayjs(date).format("MM/DD/YYYY hh:mm A") : "-"}
                  />
                  <Column
                    title="Actions"
                    key="actions"
                    render={(_, record) => (
                      <Button
                        type="link"
                        icon={<IconFileTypePdf />}
                      >
                        PDF
                      </Button>
                    )}
                  />
                </Table>
              </Panel>
            ))}
          </Collapse>
        )
      }
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
