'use client';
import { FC } from 'react';
import { Button, DatePicker, TimePicker, Input, Select, Upload, Form, message, Tag } from 'antd';
import dayjs from 'dayjs';
import { IconUpload } from '@tabler/icons-react';
import { TaskDetails } from 'data/types';

import {
  acceptOnlyImageRule,
  descriptionRules,
  dueDateRules,
  optionalDescriptionRules,
  priorityRules,
  taskNameRules,
  timeRules,
} from '@lib/constants/formInputValidations';
import { disablePastDates } from '@lib/utils/getDisabledTimeDate';
import NoDataMessage from '../NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { useUsersHook } from '@hooks/useUserHook';
import { ITask } from '@redux/feature/task/ITaskStates';

interface CreateTaskCardProps {
  onSave: (values) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: ITask;
  isStatusShow?: boolean;
  attachment?: boolean;
}

const priorityOptions = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
];

const statusOptions = [
  { label: 'Completed', value: 'Completed' },
  { label: 'Yet To Start', value: 'Yet to Start' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Skipped', value: 'Skipped' },
  { label: 'Cancelled', value: 'Cancelled' },
];
export const contactData = [
  { id: 'BS01937', name: 'Kishor Kumar', type: 'Sales', phone: '1234567862' },
  { id: 'BS01934', name: 'Kishan Kumar', type: 'Job', phone: '1234567862' },
];
const linkToOption = contactData.map(i => ({
  value: i.id,
  label: (
    <p>
      {i.id} - {i.name} - <Tag color="purple">{i.type}</Tag>
    </p>
  ),
}));

const CreateTaskCard: FC<CreateTaskCardProps> = ({
  onSave,
  onCancel,
  loading,
  initialData,
  isStatusShow = false,
  attachment = true,
}) => {
  const [form] = Form.useForm();
  const { userOptions } = useUsersHook();

  const handleFinish = async values => {
    await form.validateFields();

    values.type = 'TASK';
    if (values.task?.assigneeId?.value) {
      values.task.assigneeId = values.task.assigneeId.value;
    }
    if (initialData) {
      values.actionId = initialData?.actionId;
      values.action_type_id = initialData?.taskId;
    }
    values.task.dueDate = values.task?.dueDate?.format('YYYY-MM-DD');
    values.task.dueTime = values.task?.dueTime?.format('HH:mm');
    values.task.attachFiles = values?.attachFiles ? values?.attachFiles?.[0]?.originFileObj : null;
    onSave(values);
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <Form.Item
        label="Task Name"
        name={['task', 'name']}
        rules={taskNameRules}
        initialValue={initialData?.name}
      >
        <Input disabled={isStatusShow} placeholder="Task Name" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item
          label="Due Date"
          name={['task', 'dueDate']}
          rules={dueDateRules}
          initialValue={initialData?.dueDate ? dayjs(initialData?.dueDate) : null}
        >
          <DatePicker
            disabled={isStatusShow}
            format="YYYY-MM-DD"
            className="w-full"
            inputReadOnly
            onChange={date => {
              // Reset the time field whenever dueDate changes or is cleared
              form.setFieldsValue({
                task: { ...form.getFieldValue('task'), dueTime: null },
              });
            }}
            disabledDate={disablePastDates}
          />
        </Form.Item>

        <Form.Item shouldUpdate={(prev, curr) => prev.task?.dueDate !== curr.task?.dueDate}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Time"
              name={['task', 'dueTime']}
              rules={timeRules}
              initialValue={initialData?.dueTime ? dayjs(initialData.dueTime, 'HH:mm') : null}
            >
              <TimePicker
                disabled={isStatusShow || !getFieldValue(['task', 'dueDate'])}
                format="HH:mm"
                className="w-full"
                hideDisabledOptions
                disabledTime={() => {
                  const selectedDate: dayjs.Dayjs = getFieldValue(['task', 'dueDate']);
                  const now = dayjs();

                  if (!selectedDate) {
                    return { disabledHours: () => [], disabledMinutes: () => [] };
                  }

                  if (selectedDate.isSame(now, 'day')) {
                    return {
                      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i), // disable past hours
                      disabledMinutes: (selectedHour: number) =>
                        selectedHour === now.hour()
                          ? Array.from({ length: now.minute() }, (_, i) => i) // disable past minutes
                          : [],
                    };
                  }

                  return { disabledHours: () => [], disabledMinutes: () => [] };
                }}
              />
            </Form.Item>
          )}
        </Form.Item>
      </div>
      <Form.Item
        label="Assignee"
        name={['task', 'assigneeId']}
        initialValue={
          initialData?.assigneeId
            ? {
              key: initialData?.assigneeId,
              label: initialData?.assigneeName,
              value: initialData?.assigneeId,
            }
            : {
              key: initialData?.assigneeId,
              value: initialData?.assigneeId,
            }
        }
        rules={[{ required: true, message: 'Please select assignee' }]}
      >
        <Select
          disabled={isStatusShow}
          options={userOptions}
          placeholder="Select Assignee"
          notFoundContent={<NoDataMessage label="User" link={SystemRoutes.USERS} />}
        />
      </Form.Item>
      <div className="grid grid-cols-2 gap-3">
        {!isStatusShow && (
          <Form.Item
            label="Priority"
            name={['task', 'priority']}
            rules={priorityRules}
            initialValue={initialData?.priority}
          >
            <Select
              disabled={isStatusShow}
              options={priorityOptions}
              placeholder="Select Priority"
            />
          </Form.Item>
        )}
        <Form.Item
          label="Status"
          name={['task', 'status']}
          rules={priorityRules}
          initialValue={initialData?.status}
        >
          <Select disabled={isStatusShow} options={statusOptions} placeholder="Select status" />
        </Form.Item>
        {/* )} */}
      </div>

      {/* <Form.Item label="Link To" name={['task', 'linkTo']}>
        <Select disabled={isStatusShow} options={linkToOption} />
      </Form.Item> */}
      <Form.Item
        label="Description"
        name={['task', 'description']}
        rules={optionalDescriptionRules}
        initialValue={initialData?.description}
      >
        <Input.TextArea
          disabled={isStatusShow}
          rows={4}
          placeholder="Task Description"
          className="!resize-none"
        />
      </Form.Item>

      <Form.Item
        name="attachFiles"
        valuePropName="attachFiles"
        getValueFromEvent={e => {
          if (e && e.fileList) {
            return e.fileList;
          }
          return [];
        }}
        className="max-w-[200px] sm:max-w-[350px]"
        initialValue={
          initialData?.attachFiles
            ? [
              {
                uid: '-1',
                name: initialData?.attachFiles?.split('/').pop() || 'attachment.jpg',
                status: 'done',
                url: initialData?.attachFiles,
              },
            ]
            : []
        }
      >
        <Upload
          listType="picture"
          beforeUpload={() => false}
          maxCount={1}
          accept={acceptOnlyImageRule}
          disabled={isStatusShow}
          defaultFileList={
            initialData?.attachFiles
              ? [
                {
                  uid: '-1',
                  name: initialData?.attachFiles?.split('/').pop() || 'attachment.jpg',
                  status: 'done',
                  url: initialData?.attachFiles,
                },
              ]
              : []
          }
        >
          {attachment && (
            <Button disabled={isStatusShow} icon={<IconUpload />}>
              Attach Files
            </Button>
          )}
        </Upload>
      </Form.Item>
      {isStatusShow && (
        <p className="text-red-500">
          This is workflow task and cant be edited.Please click on Reference id to view more details
        </p>
      )}
      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Save
        </Button>
      </div>
    </Form>
  );
};

export default CreateTaskCard;
