import { Input, message, Popconfirm, Select, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';
import DateFilterDropdown from '../common/custom-selects/DateFilterDropdown';
import PrioritySelect from '../common/custom-selects/PrioritySelect';
import { IconCalendarX, IconExternalLink, IconTrash } from '@tabler/icons-react';
import Link from 'next/link';
import { useAppDispatch } from '@hooks/redux';
import { createTask, deleteTask, updateTask } from '@redux/feature/task/taskThunk';
import { ITask } from '@redux/feature/task/ITaskStates';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import TooltipButton from '../common/TooltipButton';
import CustomAvtar from '../common/CustomAvtar';

export const TaskColumn = (selectedTask, filters, setParams, setModalOpen, assigneeOptions = []) => {
  const dispatch = useAppDispatch();
  const statusOptions = [
    { label: 'Completed', value: 'Completed' },
    { label: 'Yet To Start', value: 'Yet to Start' },
    { label: 'In Progress', value: 'In Progress' },
    // { label: 'Skipped', value: 'Skipped' },
    // { label: 'Cancelled', value: 'Cancelled' },
  ];

  const columns: ColumnsType<ITask> = [
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
          {record.linkType && <Tag color="purple">{record.linkType}</Tag>}
        </>
      ),
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
              setParams({ dueDate: '' });
            }}
          />
        </div>
      ),
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 150,
      render: dueDate => (dueDate ? new Date(dueDate).toLocaleDateString() : '—'),
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
          <Select
            value={filters.status}
            onChange={value => setParams({ status: value })}
            options={statusOptions}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      width: 120,
    },
    {
      title: (
        <div className="flex min-w-[220px] flex-col">
          <span>Assignee</span>
          <Select
            mode="multiple"
            value={filters.assignedTo ? filters.assignedTo.split(',').filter(Boolean) : []}
            onChange={values => setParams({ assignedTo: values.join(',') })}
            options={assigneeOptions}
            allowClear
            showSearch
            optionFilterProp="label"
            placeholder="Assignee"
            style={{ width: '100%' }}
            maxTagCount="responsive"
          />
        </div>
      ),
      dataIndex: 'assigneeName',
      key: 'assigneeName',
      width: 200,
      render: (_, record) => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={record?.assigneeName?.[0] ?? '?'} />
          {record.status === 'Yet to Start' && (
            <Popconfirm title="Do you want to cancel?" okText="Yes" cancelText="No">
              <TooltipButton
                type="text"
                title="Cancel Task"
                icon={<IconCalendarX size={15} />}
                onClick={e => {
                  e.stopPropagation();
                }}
              />
            </Popconfirm>
          )}
          <Link href={`job/jobStatus/${record.taskId}`}>
            <IconExternalLink
              size={22}
              className="cursor-pointer text-blue"
              onClick={e => {
                e.stopPropagation();
              }}
            />
          </Link>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 60,
      render: (_, record) => (
        <Popconfirm
          title="Delete this task?"
          okText="Yes"
          cancelText="No"
          onConfirm={async e => {
            e?.stopPropagation();
            try {
              await dispatch(deleteTask(record.taskId)).unwrap();
              message.success('Task deleted successfully');
            } catch (err) {
              message.error(err || 'Failed to delete task');
            }
          }}
        >
          {/* <TooltipButton
            type="text"
            title="Delete Task"
            icon={<IconTrash size={16} className="text-red-500" />}
            onClick={e => e.stopPropagation()}
          /> */}
        </Popconfirm>
      ),
    },
  ];

  async function handleSubmit(values) {
    try {
      if (selectedTask) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedTask);
        const formData = formDataGenerator(updatedFields);
        if (!isUpdated) {
          message.warning('No changes detected');
          return;
        }
        await dispatch(updateTask({ id: selectedTask.taskId, data: formData })).unwrap();
        message.success('Task updated successfully');
        setModalOpen(null);
      } else {
        const formData = formDataGenerator(values);
        await dispatch(createTask(formData)).unwrap();
        message.success('Task created successfully');
        setModalOpen(null);
      }
    } catch (error) {
      message.error(error || 'Failed to save');
    }
  }

  return { columns, taskSubmit: handleSubmit };
};
