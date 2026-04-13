import { UIEvent, useEffect, useState } from 'react';
import { Table, Input, Button, Space, Dropdown, Menu, Select, message } from 'antd';
import { IconDownload, IconPlus, IconTruck } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import type { ColumnsType } from 'antd/es/table';
import CustomAvtar from '@/components/common/CustomAvtar';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';
import { TodoFormDrawer } from '@/components/common/todo/TodoFormDrawer';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllTodos } from '@redux/feature/todo/todoThunk';
import { ITodo } from '@redux/feature/todo/IToDoState';
import { useSupplierHook } from '@hooks/useSupplierHook';

const DATE_FILTER_MAP: Record<string, string> = {
  all: '',
  today: 'today',
  tomorrow: 'tomorrow',
  'this-week': 'this_week',
  'next-week': 'next_week',
  overdue: 'overdue',
};

const TodosPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [drawerOpen, setDrawerOpen] = useState<ITodo | null>(null);
  const [createDrawerOpen, setCreateDrawerOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [todoRows, setTodoRows] = useState<ITodo[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { counters } = useAppSelector(state => state.todo);
  const { supplierOptions } = useSupplierHook();
  const PAGE_SIZE = 10;

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: [
      'jobAddress',
      'taskName',
      'supplier',
      'bookingDateFrom',
      'bookingDateTo',
      'startDateFrom',
      'startDateTo',
      'dateFilter',
    ],
  });

  const fetchTodos = async (page: number = 1, limit: number = PAGE_SIZE, append: boolean = false) => {
    try {
      const response = await dispatch(
        fetchAllTodos({
          page,
          limit,
          task_name: filters?.taskName || undefined,
          job_address: filters?.jobAddress || undefined,
          supplier_id: filters?.supplier || undefined,
          booking_date_from: filters?.bookingDateFrom || undefined,
          booking_date_to: filters?.bookingDateTo || undefined,
          start_date_from: filters?.startDateFrom || undefined,
          start_date_to: filters?.startDateTo || undefined,
          date_filter: filters?.dateFilter || undefined,
        })
      ).unwrap();
      const incomingTodos = response?.todos ?? [];
      setTodoRows(prev => (append ? [...prev, ...incomingTodos] : incomingTodos));
      setHasMore(page < (response?.pagination?.totalPages ?? 0));
    } catch (err) {
      message.error('Failed to fetch todos');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchTodos(1, PAGE_SIZE, false);
  }, [filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: ITodo[], type: string) => {
    const column = {
      jobAddress: 'Job Address',
      taskName: 'Task Name',
      supplierName: 'Supplier',
      bookingDate: 'Booking Date',
      startDate: 'Start Date',
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
    if (selectedType === 'all') {
      setParams({ dateFilter: '' });
      return;
    }
    const mapped = DATE_FILTER_MAP[selectedType] ?? selectedType;
    const current = filters?.dateFilter;
    setParams({ dateFilter: current === mapped ? '' : mapped });
  };

  const columns: ColumnsType<ITodo> = [
    {
      title: (
        <div>
          <span>Job Address</span>
          <Input
            value={instantFilters.jobAddress}
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
          <Input
            value={instantFilters.taskName}
            onChange={e => setParams({ taskName: e.target.value })}
          />
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
              const from = dates ? dates[0].toISOString() : '';
              const to = dates ? dates[1].toISOString() : '';
              setParams({ bookingDateFrom: from, bookingDateTo: to });
            }}
            onClear={() => {
              setParams({ bookingDateFrom: '', bookingDateTo: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'bookingDate',
      key: 'bookingDate',
      width: 150,
      render: date => (date ? new Date(date).toLocaleDateString() : '—'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Start Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const from = dates ? dates[0].toISOString() : '';
              const to = dates ? dates[1].toISOString() : '';
              setParams({ startDateFrom: from, startDateTo: to });
            }}
            onClear={() => {
              setParams({ startDateFrom: '', startDateTo: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 150,
      render: date => (date ? new Date(date).toLocaleDateString() : '—'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Supplier</span>
          <Select
            mode="multiple"
            value={instantFilters.supplier ? instantFilters.supplier.split(',').filter(Boolean) : []}
            onChange={values => setParams({ supplier: values.join(',') })}
            options={supplierOptions}
            allowClear
            showSearch
            optionFilterProp="label"
          />
        </div>
      ),
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 150,
      render: (_, record) => (
        <div className="flex items-center justify-between">
          <CustomAvtar label={record.supplierName} />
          <IconTruck size={20} className="text-blue cursor-pointer" />
        </div>
      ),
    },
  ];

  type FilterType = 'all' | 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'all', label: 'All', count: counters?.allCount ?? 0 },
    { type: 'today', label: 'Today', count: counters?.todayCount ?? 0 },
    { type: 'tomorrow', label: 'Tomorrow', count: counters?.tomorrowCount ?? 0 },
    { type: 'this-week', label: 'This Week', count: counters?.thisWeekCount ?? 0 },
    { type: 'next-week', label: 'Next Week', count: counters?.nextWeekCount ?? 0 },
    { type: 'overdue', label: 'Overdue', count: counters?.overdueCount ?? 0 },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: 'Export Today list',
          onClick: () => handleExport(todoRows, 'today'),
        },
        {
          key: '2',
          label: 'Export Today and overdue list',
          onClick: () => handleExport(todoRows, 'todayAndOverdue'),
        },
        {
          key: '3',
          label: 'Export All list',
          onClick: () => handleExport(todoRows, 'all'),
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

  const handleTableScroll = async (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > 80 || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    await fetchTodos(nextPage, PAGE_SIZE, true);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-bold leading-tight">Todo</h1>
        <div className="order-3 lg:order-2 lg:flex-1 lg:px-2">
          <div className="overflow-x-auto">
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
          </div>
        </div>
        <Space className="order-2 self-start lg:order-3 lg:self-auto">
          <Dropdown overlay={menu} className="w-[100px]" trigger={['click']}>
            <Button icon={<IconDownload />}>Export</Button>
          </Dropdown>
          <Button type="primary" icon={<IconPlus size={16} />} onClick={() => setCreateDrawerOpen(true)}>
            Add Todo
          </Button>
        </Space>
      </div>

      <div className="max-h-[65vh] overflow-auto" onScroll={handleTableScroll}>
        <Table
          columns={columns}
          dataSource={todoRows}
          rowKey="todoId"
          rowSelection={{
            type: 'checkbox',
          }}
          onRow={record => ({
            onClick: () => setDrawerOpen(record),
            style: { cursor: 'pointer' },
          })}
          pagination={false}
          scroll={{ x: 1100 }}
        />
      </div>
      {!!drawerOpen && (
        <TodoFormDrawer
          open={!!drawerOpen}
          initialData={drawerOpen}
          onCancel={() => setDrawerOpen(null)}
          onSubmit={() => {
            setDrawerOpen(null);
            fetchTodos();
          }}
        />
      )}
      {createDrawerOpen && (
        <TodoFormDrawer
          open={createDrawerOpen}
          onCancel={() => setCreateDrawerOpen(false)}
          onSubmit={() => {
            setCreateDrawerOpen(false);
            fetchTodos(1, PAGE_SIZE, false);
            setCurrentPage(1);
          }}
        />
      )}
    </div>
  );
};

export default TodosPage;
