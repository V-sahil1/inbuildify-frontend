import React, { useState } from 'react';
import { Collapse, Table, Button, Empty } from 'antd';
import { QuotationStatus } from 'data/types';
import { IconChevronDown, IconChevronUp, IconFileTypePdf } from '@tabler/icons-react';
// import dayjs from "dayjs";
import LeadQuotationComparison from './LeadQuotationComparison';
import { useAppSelector } from '@hooks/redux';
import { useRouter } from 'next/router';
import { Quotation, QuotationResponse } from '@redux/feature/quotation/IQuotationState';
import { timeAgo } from '@lib/utils/timeAgo';
import SystemRoutes from '@lib/constants/Routes';

const { Panel } = Collapse;
const { Column } = Table;

const statusTagColor: Record<QuotationStatus, string> = {
  approved: 'green',
  pending: 'orange',
  rejected: 'red',
  all: 'default',
};

const LeadQuotationList = () => {
  const router = useRouter();
  const [openComparison, setOpenComparison] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const { quotation } = useAppSelector(state => state.quotation);
  const handleCompareClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setOpenComparison(true);
  };

  return (
    <>
      {quotation?.length === 0 ? (
        <div className="p-6 text-center bg-card-color rounded-md">
          <Empty description="No quotations found" />
        </div>
      ) : (
        <Collapse
          className="bg-card-color"
          bordered={false}
          defaultActiveKey={quotation?.[0]?.quotationId}
          expandIcon={({ isActive }) =>
            isActive ? (
              <IconChevronUp color="var(--font-color)" className="mt-2" size={20} />
            ) : (
              <IconChevronDown color="var(--font-color)" className="mt-2" size={20} />
            )
          }
        >
          {quotation?.map((quotation: Quotation) => (
            <Panel
              header={
                <div className="flex justify-between items-center text-[var(--font-color)] w-full">
                  <span>{quotation?.referenceNumber}</span>
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
                scroll={{ x: 'max-content' }}
                onRow={record => ({
                  onClick: () =>
                    router.push(`${SystemRoutes.QUOTATION}/${record.quotationVersionId}`),
                  style: { cursor: 'pointer' },
                })}
              >
                <Column
                  title="Version"
                  dataIndex="quotationVersionNo"
                  key="quotationVersionNo"
                  render={(quotationVersionNo: string) =>
                    quotationVersionNo ? `v${quotationVersionNo}` : '-'
                  }
                />
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
                  render={(date: string) => (date ? timeAgo(date) : '-')}
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
