import { UIEvent, useEffect, useState } from 'react';
import { Table, Button, Space, message } from 'antd';
import { IconDownload, IconPlus } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';
import { CreateTaskModal } from '@/components/common/Models/CreatetaskModel';
import { TaskColumn } from '@/components/table-columns/TaskColumn';
import { fetchAllTask } from '@redux/feature/task/taskThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ITask } from '@redux/feature/task/ITaskStates';
import { useUsersHook } from '@hooks/useUserHook';

const DATE_FILTER_MAP: Record<string, string> = {
  all: '',
  today: 'today',
  tomorrow: 'tomorrow',
  'this-week': 'this_week',
  'next-week': 'next_week',
  overdue: 'overdue',
  pending: 'pending',
};

const TaskTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState<'create' | null>(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [taskRows, setTaskRows] = useState<ITask[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { userOptions } = useUsersHook();
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['name', 'dueDate', 'priority', 'status', 'assignedTo', 'dateFilter'],
  });
  const { columns, taskSubmit } = TaskColumn(
    selectedTask,
    instantFilters,
    setParams,
    setModalOpen,
    userOptions
  );
  const { counters } = useAppSelector(state => state.task);
  const PAGE_SIZE = 10;

  const fetchTask = async (
    page: number = 1,
    limit: number = PAGE_SIZE,
    append: boolean = false
  ) => {
    try {
      const params = {
        page,
        limit,
        name: filters?.name || undefined,
        status: filters?.status || undefined,
        priority: filters?.priority || undefined,
        due_date: filters?.dueDate || undefined,
        assignee_id: filters?.assignedTo || undefined,
        date_filter: filters?.dateFilter || undefined,
      };
      const response = await dispatch(fetchAllTask(params)).unwrap();
      const incomingTasks = response?.tasks ?? [];
      setTaskRows(prev => (append ? [...prev, ...incomingTasks] : incomingTasks));
      setHasMore(page < (response?.pagination?.totalPages ?? 0));
    } catch (error) {
      message.error(error || 'Failed to fetch all tasks');
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    setHasMore(true);
    fetchTask(1, PAGE_SIZE, false);
  }, [filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: ITask[]) => {
    const column = {
      name: 'Name',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      assigneeName: 'Assignee',
    };
    exportToExcel({
      data,
      fileName: 'TaskList',
      sheetName: 'TaskList',
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

  type FilterType = 'all' | 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue' | 'pending';

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
    { type: 'pending', label: 'Pending', count: counters?.pendingCount ?? 0 },
  ];

  const handleTableScroll = async (e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight > 80 || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    const nextPage = currentPage + 1;
    await fetchTask(nextPage, PAGE_SIZE, true);
    setCurrentPage(nextPage);
    setIsLoadingMore(false);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <h1 className="text-2xl font-bold leading-tight">Tasks</h1>
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
        <Space wrap className="order-2 self-start lg:order-3 lg:self-auto">
          <Button
            icon={<IconDownload />}
            onClick={() => {
              handleExport(taskRows);
            }}
          >
            Export
          </Button>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setSelectedTask(null);
              setModalOpen('create');
            }}
          >
            Add Task
          </Button>
        </Space>
      </div>

      <div className="max-h-[65vh] overflow-auto" onScroll={handleTableScroll}>
        <Table
          columns={columns}
          dataSource={taskRows}
          rowKey="taskId"
          rowSelection={{
            type: 'checkbox',
          }}
          pagination={false}
          scroll={{ x: 1200 }}
          onRow={record => ({
            onClick: () => {
              setModalOpen('create');
              setSelectedTask(record);
            },
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      {modalOpen === 'create' && (
        <CreateTaskModal
          open={modalOpen === 'create'}
          onClose={() => setModalOpen(null)}
          title={!!selectedTask ? 'Edit Task' : 'Create Task'}
          loading={false}
          onSubmit={values => {
            taskSubmit(values.task);
          }}
          initialData={selectedTask}
          status={false}
        />
      )}
    </div>
  );
};

export default TaskTable;
