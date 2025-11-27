import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Table, Input, Button, Space } from 'antd';
import { IconFilter, IconDownload, IconBell } from '@tabler/icons-react';
import { exportToExcel } from '@lib/utils/exportToExcel';
import SystemRoutes from '@lib/constants/Routes';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { debouncedURL } from '@lib/utils/debounceURL';
import { TaskDetails } from 'data/types';
import { CreateTaskModal } from '@/components/common/Models/CreatetaskModel';
import { TaskColumn } from '@/components/table-columns/TaskColumn';
import { contactData } from '@/components/common/TimeLineComponents/CreateTaskCard';
const TaskTable: React.FC = () => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState<'create' | null>(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['name', 'contactName', 'phone', 'dueDate', 'priority', 'status', 'assignedTo'],
  });
  const { columns, taskData, taskSubmit } = TaskColumn(selectedTask, filters, setParams);
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const handleExport = (data: TaskDetails[]) => {
    const column = {
      name: 'Name',
      contactName: 'Contact Name',
      phone: 'Phone',
      dueDate: 'Due Date',
      priority: 'Priority',
      status: 'Status',
      assignedTo: 'Assignee',
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
    { type: 'today', label: 'Today', count: taskData.length },
    { type: 'tomorrow', label: 'Tomorrow', count: taskData.length },
    { type: 'this-week', label: 'This Week', count: taskData.length },
    { type: 'next-week', label: 'Next Week', count: taskData.length },
    { type: 'overdue', label: 'Overdue', count: taskData.length },
    {
      type: 'pending',
      label: 'Pending',
      count: taskData.filter(d => d.status === 'yettostart').length,
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
              handleExport(taskData);
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
        dataSource={taskData}
        rowSelection={{
          type: 'checkbox',
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
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
            console.log('task submit', values.task);
            taskSubmit(values.task);
            setModalOpen(null);
          }}
          initialData={selectedTask}
          status={contactData.filter(i => i.id === selectedTask.contactName)[0].type === 'Job'}
        />
      )}
    </div>
  );
};

export default TaskTable;
