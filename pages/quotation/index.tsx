import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Table, Input, Space, Dropdown, Switch, Button, Tooltip } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IconFilter, IconDownload, IconShare3, IconCopy } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import TooltipButton from '@/components/common/TooltipButtton';
import { QuotationDataType, quotationDummyData } from 'data/quotationlistData';
import CustomAvtar from '@/components/common/CustomAvtar';
import Link from 'next/link';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import HLPackageCopyModal from '@/components/common/Models/HLPackageCopyModal';
import { debouncedURL } from '@lib/utils/debounceURL';

const QuotationPage: React.FC = () => {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    refrenceId: string;
    customerName: string;
    contactAddress: string;
    approver: string;
    created: string;
    propertyAddress: string;
    assignee: string;
  }>({
    refrenceId: searchParams.get('refrenceId') || '',
    customerName: searchParams.get('customerName') || '',
    contactAddress: searchParams.get('contactAddress') || '',
    approver: searchParams.get('approver') || '',
    created: searchParams.get('created') || '',
    propertyAddress: searchParams.get('propertyAddress') || '',
    assignee: searchParams.get('assignee') || '',
  });
  const [showBlocked, setShowBlocked] = useState(false);
  const [isCopyModalOpen, setIsCopyModalOpen] = useState(false);
  const debouncedUpdateURL = debouncedURL();

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: QuotationDataType[]) => {
    const column = {
      refrenceId: 'Refrence ID',
      CustomerName: 'Customer Name',
      contactAddress: 'Contact Address',
      approver: 'Approver',
      created: 'Created At',
      propertyAddress: 'Property Address',
      assignee: 'Assignee',
    };
    exportToExcel({
      data,
      fileName: 'Jobs',
      sheetName: 'Jobs',
      columnHeaders: column,
    });
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    // You can call your API or set state here
  };

  const columns: ColumnsType<QuotationDataType> = [
    {
      title: (
        <div>
          <span>Refrence ID</span>
          <Input
            value={filters.refrenceId}
            onChange={e => handleFilterChange({ refrenceId: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'slugId',
      key: 'slugId',
      width: 250,
    },
    {
      title: (
        <div>
          <span>Customer Name</span>
          <Input
            value={filters.customerName}
            onChange={e => handleFilterChange({ customerName: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'customerName',
      key: 'customerName',
      width: 250,
    },
    {
      title: (
        <div>
          <span>Property Address</span>
          <Input
            value={filters.propertyAddress}
            onChange={e =>
              handleFilterChange({
                propertyAddress: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: 'propertyAdress',
      key: 'propertyAdress',
      width: 200,
    },
    {
      title: (
        <div>
          <span>Contact Address</span>
          <Input
            value={filters.contactAddress}
            onChange={e =>
              handleFilterChange({
                contactAddress: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: 'contactAddress',
      key: 'contactAddress',
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Created</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              handleFilterChange({ created: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              handleFilterChange({ created: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div>
          <span>Approver</span>
          <AssigneeSelect
            value={filters.approver}
            onChange={value => handleFilterChange({ approver: value })}
          />
        </div>
      ),
      dataIndex: 'approver',
      key: 'approver',
      width: 200,
      render: approver => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={approver?.name} />
        </div>
      ),
    },
    {
      title: (
        <div>
          <span>Assignee</span>
          <AssigneeSelect
            value={filters.assignee}
            onChange={value => handleFilterChange({ assignee: value })}
          />
        </div>
      ),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 200,
      render: assignee => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={assignee?.name} />
          <div className="flex gap-3">
            <Tooltip title="Copy Quotation">
              <IconCopy
                size={15}
                onClick={e => {
                  e.stopPropagation();
                  setIsCopyModalOpen(true);
                }}
                className="cursor-pointer"
              />
            </Tooltip>
            <Link href="#">
              <IconShare3 size={15} className="cursor-pointer text-blue" />
            </Link>
          </div>
        </div>
      ),
    },
  ];
  type FilterType =
    | 'all'
    | 'draft'
    | 'approved'
    | 'modified'
    | 'pendingApproval'
    | 'cancelled'
    | 'expired';
  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'all', label: 'All', count: quotationDummyData.length },
    { type: 'draft', label: 'Draft', count: quotationDummyData.length },
    { type: 'approved', label: 'Approved', count: quotationDummyData.length },
    { type: 'modified', label: 'Modified', count: quotationDummyData.length },
    {
      type: 'pendingApproval',
      label: 'Pending Approval',
      count: quotationDummyData.length,
    },
    { type: 'cancelled', label: 'Cancelled', count: quotationDummyData.length },
    { type: 'expired', label: 'Expired', count: quotationDummyData.length },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quotatioln List</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <Space>
          <Button>Filtered Records: {quotationDummyData.length}</Button>
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                {
                  key: '1',
                  label: (
                    <Space>
                      <Switch checked={showBlocked} onChange={val => setShowBlocked(val)} />
                      <span>Show Blocklisted Quotations</span>
                    </Space>
                  ),
                },
              ],
            }}
          >
            <TooltipButton title="Filter" icon={<IconFilter />} />
          </Dropdown>
          <Space>
            <TooltipButton
              title="Export"
              icon={<IconDownload />}
              onClick={() => handleExport(quotationDummyData)}
            />
          </Space>
        </Space>
      </div>
      <Table
        columns={columns}
        dataSource={quotationDummyData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
        onRow={record => ({
          onClick: () => {
            // router.push(`${SystemRoutes.QUOTATION}/${record.slugId}`);
          },
          style: { cursor: 'pointer' },
        })}
      />
      <HLPackageCopyModal
        title="Copy Quation"
        open={isCopyModalOpen}
        onCancel={() => setIsCopyModalOpen(false)}
        onOk={() => {
          setIsCopyModalOpen(false);
        }}
      />
    </div>
  );
};

export default QuotationPage;
