import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Button, Space, message } from 'antd';
import { IconFilter, IconDownload, IconBell } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import SystemRoutes from '@lib/constants/Routes';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';
import { CreateTaskModal } from '@/components/common/Models/CreatetaskModel';
import { TaskColumn } from '@/components/table-columns/TaskColumn';
import { fetchAllTask } from '@redux/feature/task/taskThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';
import { ITask } from '@redux/feature/task/ITaskStates';
const TaskTable: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<'create' | null>(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { debouncedUpdateURL, setParams, filters,instantFilters } = debouncedURL({
    filtersKey: ['name', 'contactName', 'phone', 'dueDate', 'priority', 'status', 'assignedTo'],
  });
  const { columns, taskSubmit } = TaskColumn(selectedTask, instantFilters, setParams, setModalOpen);
  const { tasks, pagination } = useAppSelector(state => state.task);
  const PAGE_SIZE = 10;
  const fetchTask = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      const params = {
        page,
        limit,
        name: filters?.name || undefined,
        status: filters?.status || undefined,
        priority: filters?.priority || undefined,
        due_date: filters?.dueDate || undefined,
        assignee_id: filters?.assignedTo || undefined,
      };
      await dispatch(fetchAllTask(params)).unwrap();
    } catch (error) {
      message.error(error || 'Faied to fetch all tasks');
    }
  };
  useEffect(() => {
    fetchTask();
  }, [filters, currentPage]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: ITask[]) => {
    const column = {
      name: 'Name',
      contactName: 'Contact Name',
      phone: 'Phone',
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
    console.log('Selected filter:', selectedType);
    // You can call your API or set state here
  };

  type FilterType = 'today' | 'tomorrow' | 'this-week' | 'next-week' | 'overdue' | 'pending';

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: 'today', label: 'Today', count: tasks.length },
    { type: 'tomorrow', label: 'Tomorrow', count: tasks.length },
    { type: 'this-week', label: 'This Week', count: tasks.length },
    { type: 'next-week', label: 'Next Week', count: tasks.length },
    { type: 'overdue', label: 'Overdue', count: tasks.length },
    {
      type: 'pending',
      label: 'Pending',
      count: tasks.filter(d => d.status === 'yettostart').length,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div>
          <TimelineActionsBar
            tabs={filterOptions}
            onTabChange={handleFilterTabChange}
            isActionShow={false}
            isCountShow={true}
          />
        </div>
        <Space>
          <Button
            icon={<IconBell />}
            shape="circle"
            onClick={() => router.push(SystemRoutes.TODO)}
          />
          <Button
            icon={<IconDownload />}
            onClick={() => {
              handleExport(tasks);
            }}
          >
            Export
          </Button>
          <Button icon={<IconFilter />}>Filter</Button>
        </Space>
      </div>

      {/* Filter Tabs */}

      <Table
        columns={columns}
        dataSource={tasks}
        rowSelection={{
          type: 'checkbox',
        }}
        pagination={getPaginationConfig({
          currentPage,
          limit: pagination?.limit,
          totalRecords: pagination?.totalRecords,
          setCurrentPage,
        })}
        onRow={record => ({
          onClick: () => {
            setModalOpen('create');
            setSelectedTask(record);
          },
          style: { cursor: 'pointer' },
        })}
      />
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
          // status={contactData.filter(i => i.id === selectedTask.contactName)[0].type === 'Job'}
          status={false}
        />
      )}
    </div>
  );
};

export default TaskTable;
