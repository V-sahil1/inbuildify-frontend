import React, { useState } from 'react';
import { Collapse, Table, Button, Empty, Checkbox } from 'antd';
import { QuotationStatus } from 'data/types';
import { IconChevronDown, IconChevronUp, IconFileTypePdf } from '@tabler/icons-react';
// import dayjs from "dayjs";
import LeadQuotationComparison from './LeadQuotationComparison';
import { useAppSelector } from '@hooks/redux';
import { useRouter } from 'next/router';
import { Quotation, QuotationVersionDetails } from '@redux/feature/quotation/IQuotationState';
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
  const [selectedVersions, setSelectedVersions] = useState<{
    [key: string]: {
      version: QuotationVersionDetails;
      quotation: Quotation;
    }[];
  }>({});
  const { quotation } = useAppSelector(state => state.quotation);

  const handleCompareClick = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setOpenComparison(true);
  };
  const handleVersionSelect = (
    quotationId: string,
    version: QuotationVersionDetails,
    checked: boolean
  ) => {
    setSelectedVersions(prev => {
      const currentVersions = prev[quotationId] || [];
      const currentQuotation = quotation.find(q => q.quotationId === quotationId);

      if (checked) {
        // Check total selected versions across all quotations
        const totalSelected = Object.values(prev).reduce(
          (total, versions) => total + versions.length,
          0
        );

        if (totalSelected >= 2) {
          // Find the FIRST selected version across all quotations and remove it (FIFO)
          const newState = { ...prev };
          for (const qId in prev) {
            if (prev[qId].length > 0) {
              const [firstToRemove, ...remaining] = prev[qId];
              newState[qId] = remaining;
              break; // Only remove the first one
            }
          }
          // Add the new version with quotation details
          newState[quotationId] = [
            ...(newState[quotationId] || []),
            { version, quotation: currentQuotation },
          ];
          return newState;
        }

        // Otherwise just add the new version with quotation details
        return {
          ...prev,
          [quotationId]: [...currentVersions, { version, quotation: currentQuotation }],
        };
      } else {
        // Remove the version
        return {
          ...prev,
          [quotationId]: currentVersions.filter(
            item => item.version.quotationVersionId !== version.quotationVersionId
          ),
        };
      }
    });
  };

  // Check if a specific version is selected
  const isVersionSelected = (quotationId: string, versionId: string) => {
    return selectedVersions[quotationId]?.some(
      item => item.version.quotationVersionId === versionId
    );
  };

  // Get total selected versions across all quotations
  const totalSelectedVersions = Object.values(selectedVersions).reduce(
    (total, versions) => total + versions.length,
    0
  );

  return (
    <div className="bg-card-color">
      <div className="text-end p-2">
        <Button
          type="primary"
          disabled={totalSelectedVersions !== 2}
          onClick={() => {
            // Find any quotation with selected versions for comparison
            const quotationWithSelection = quotation?.find(
              q => selectedVersions[q.quotationId]?.length > 0
            );
            console.log(quotationWithSelection);
            if (quotationWithSelection) {
              handleCompareClick(quotationWithSelection);
            }
          }}
        >
          Compare {totalSelectedVersions > 0 && `(${totalSelectedVersions})`}
        </Button>
      </div>
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
              <IconChevronUp color="var(--font-color)" size={20} />
            ) : (
              <IconChevronDown color="var(--font-color)" size={20} />
            )
          }
        >
          {quotation?.map((quotation: Quotation) => (
            <Panel
              header={
                <div className="flex gap-2 items-center text-[var(--font-color)] w-full">
                  <span>{quotation?.referenceNumber}</span>
                  <div className="flex gap-3 items-center" onClick={e => e.stopPropagation()}>
                    {Array.isArray(quotation.versions) &&
                      quotation.versions.map((version: any) => (
                        <Checkbox
                          key={version.quotationVersionId}
                          checked={isVersionSelected(
                            quotation.quotationId,
                            version.quotationVersionId
                          )}
                          onChange={e => {
                            e.stopPropagation();
                            handleVersionSelect(quotation.quotationId, version, e.target.checked);
                          }}
                        >
                          v{version.quotationVersionNo}
                        </Checkbox>
                      ))}
                  </div>
                </div>
              }
              className="!border-none"
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
      {selectedQuotation && openComparison && (
        <LeadQuotationComparison
          open={openComparison}
          onClose={() => setOpenComparison(false)}
          quotation={selectedQuotation}
          selectedVersionsData={selectedVersions}
        />
      )}
    </div>
  );
};

export default LeadQuotationList;
