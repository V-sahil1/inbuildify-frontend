import { useEffect } from 'react';
import { Table, Input, Button, Space, Dropdown, Menu } from 'antd';
import { IconDownload, IconTruck } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import type { ColumnsType } from 'antd/es/table';
import { todoDummyData, TodoDataType } from 'data/tasklistData';
import AssigneeSelect from '@/components/common/custom-selects/AssigneeSelect';
import CustomAvtar from '@/components/common/CustomAvtar';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';

const TodosPage: React.FC = () => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: [
      'jobAddress',
      'taskName',
      'supplier',
      'bookingDate',
      'startDate',
      'siteSupervisor',
    ],
  });

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: TodoDataType[], type: string) => {
    const column = {
      JobAddress: 'Job Address',
      taskName: 'Task Name',
      supplier: 'Supplier',
      bookingDate: 'Booking Date',
      startDate: 'start Date',
      siteSupervisor: 'Site Supervisor',
    };
    exportToExcel({
      data,
      fileName: type,
      sheetName: type,
      columnHeaders: column,
    });
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log('Selected filter:', selectedType);
    // You can call your API or set state here
  };

  const columns: ColumnsType<TodoDataType> = [
    {
      title: (
        <div>
          <span>Job Address</span>
          <Input
            value={filters.jobAddress}
            onChange={e => setParams({ jobAddress: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'jobAddress',
      key: 'jobAddress',
      width: 250,
    },
    {
      title: (
        <div>
          <span>Task Name</span>
          <Input value={filters.taskName} onChange={e => setParams({ taskName: e.target.value })} />
        </div>
      ),
      dataIndex: 'taskName',
      key: 'taskName',
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Booking Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ bookingDate: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ bookingDate: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: 150,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Start Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ startDate: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ startDate: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 150,
      render: date => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Site Supervisor</span>
          <AssigneeSelect
            value={filters.siteSupervisor}
            onChange={value => setParams({ siteSupervisor: value })}
          />
        </div>
      ),
      dataIndex: 'siteSupervisor',
      key: 'siteSupervisor',
      width: 150,
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <CustomAvtar label={record.siteSupervisor} />
          <IconTruck size={20} className="text-blue cursor-pointer" />
        </div>
      ),
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Export Today list',
          onClick: () => handleExport(todoDummyData, 'today'),
        },
        {
          key: '2',
          label: 'Export Today and overdue list',
          onClick: () => handleExport(todoDummyData, 'todayAndOverdue'),
        },
        {
          key: '3',
          label: 'Export All list',
          onClick: () => handleExport(todoDummyData, 'all'),
        },
        {
          key: '4',
          label: (
            <span className="text-red-500">
              Export will take 2 to 3 <br /> min of time
            </span>
          ),
          disabled: true,
        },
      ]}
    />
  );

  type FilterType = 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'today', label: 'Today', count: todoDummyData.length },
    { type: 'tomorrow', label: 'Tomorrow', count: todoDummyData.length },
    { type: 'this-week', label: 'This Week', count: todoDummyData.length },
    { type: 'next-week', label: 'Next Week', count: todoDummyData.length },
    { type: 'overdue', label: 'Overdue', count: todoDummyData.length },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <Space>
          <Dropdown overlay={menu} className="w-[100px]" trigger={['click']}>
            <Button icon={<IconDownload />}>Export</Button>
          </Dropdown>
        </Space>
      </div>

      {/* Filter Tabs */}

      <Table
        columns={columns}
        dataSource={todoDummyData}
        rowSelection={{
          type: 'checkbox',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default TodosPage;
