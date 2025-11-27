import { Button, Input, Popconfirm, Tag, Tooltip } from 'antd';
import { ColumnsType } from 'antd/es/table';
import { TaskDetails } from 'data/types';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import PrioritySelect from '../common/custom-selects/PrioritySelect';
import StatusSelect from '../common/custom-selects/StatusSelect';
import AssigneeSelect from '../common/custom-selects/AssigneeSelect';
import CustomAvtar from '../common/CustomAvtar';
import { IconCalendarX, IconExternalLink } from '@tabler/icons-react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { setTask, updateTask } from '@redux/feature/task/taskSlice';
import { contactData } from '@/components/common/TimeLineComponents/CreateTaskCard';
export const TaskColumn = (selectedTask, filters, setParams) => {
  const { task } = useAppSelector(state => state.task);
  const dispatch = useAppDispatch();
  const columns: ColumnsType<TaskDetails> = [
    {
      title: (
        <>
          <span>Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value })} />
        </>
      ),
      dataIndex: 'name',
      key: 'name',
      width: 250,
      render: (_, record) => (
        <>
          <p className={record.status === 'Cancelled' ? 'line-through' : ''}>{record.name}</p>
          <Tag color="purple">{contactData.filter(i => i.id === record.contactName)[0]?.type}</Tag>
        </>
      ),
    },
    {
      title: (
        <>
          <span>Contact Name</span>
          <Input
            value={filters.contactName}
            onChange={e => setParams({ contactName: e.target.value })}
          />
        </>
      ),
      dataIndex: 'contactName',
      key: 'contactName',
      width: 200,
      render: (_, record) => contactData.filter(i => i.id === record.contactName)[0]?.name,
    },
    {
      title: (
        <>
          <span>Phone</span>
          <Input value={filters.phone} onChange={e => setParams({ phone: e.target.value })} />
        </>
      ),
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
      render: (_, record) => contactData.filter(i => i.id === record.contactName)[0]?.phone,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Due Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates ? `${dates[0].toISOString()},${dates[1].toISOString()}` : '';
              setParams({ dueDate: dateString });
            }}
            onClear={() => {
              console.log('Cleared date filter');
              setParams({ dueDate: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 150,
      render: dueDate => new Date(dueDate).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Priority</span>
          <PrioritySelect
            value={filters.priority}
            onChange={value => setParams({ priority: value })}
          />
        </div>
      ),
      dataIndex: 'priority',
      key: 'priority',
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <StatusSelect value={filters.status} onChange={value => setParams({ status: value })} />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: (
        <>
          <span>Assignee</span>
          <AssigneeSelect
            value={filters.assignedTo}
            onChange={value => setParams({ assignedTo: value })}
          />
        </>
      ),
      dataIndex: 'assignee',
      key: 'assignee',
      width: 200,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={record?.assignee?.name} />
          {record.status === 'yettostart' && (
            <Popconfirm title="Do you want to cancel?" okText="Yes" cancelText="No">
              <Tooltip title="Cancel Task">
                <Button type="text" icon={<IconCalendarX size={15} />} />
              </Tooltip>
            </Popconfirm>
          )}
          <Link href={`job/jobStatus/${record.taskId}`}>
            <IconExternalLink size={22} className="cursor-pointer text-blue" />
          </Link>
        </div>
      ),
    },
  ];
  function handleSubmit(values) {
    selectedTask
      ? dispatch(updateTask({ id: selectedTask.taskId, value: values }))
      : dispatch(setTask({ ...values, taskId: Math.floor(Math.random() * 100000).toString() }));
  }
  return { columns, taskData: task, taskSubmit: handleSubmit };
};
