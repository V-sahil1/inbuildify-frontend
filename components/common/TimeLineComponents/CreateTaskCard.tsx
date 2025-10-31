'use client';
import { FC, useEffect, useState } from 'react';
import { Button, DatePicker, TimePicker, Input, Select, Upload, Form, message } from 'antd';
import dayjs from 'dayjs';
import { IconUpload } from '@tabler/icons-react';
import { TaskDetails } from 'data/types';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import {
  acceptOnlyImageRule,
  descriptionRules,
  dueDateRules,
  priorityRules,
  taskNameRules,
  timeRules,
} from '@lib/constants/formInputValidations';
import { disablePastDates } from '@lib/utils/getDisabledTimeDate';
import NoDataMessage from '../NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';

interface CreateTaskCardProps {
  onSave: (task: any) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: TaskDetails;
}

const priorityOptions = [
  { label: 'Low', value: 'LOW' },
  { label: 'Medium', value: 'MEDIUM' },
  { label: 'High', value: 'HIGH' },
];

const CreateTaskCard: FC<CreateTaskCardProps> = ({ onSave, onCancel, loading, initialData }) => {
  const [form] = Form.useForm();
  const { users, status } = useAppSelector(state => state.user);
  const { email } = useAppSelector(state => state.auth.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status.users === Status.IDLE) {
      fetchuserData();
    }
  }, [status]);
  const fetchuserData = async () => {
    try {
      await dispatch(getUsersThunk()).unwrap();
    } catch (error) {
      message.error(error || 'failed to fetch the users');
    }
  };
  const assigneeOptions = users.reduce(
    (acc, user) => {
      if (user.email !== email) {
        acc.push({ label: user.name, value: user.usersId });
      }
      return acc;
    },
    [] as { label: string; value: string }[]
  );
  const handleFinish = async (values: any) => {
    await form.validateFields();
    values.type = 'TASK';
    if (values.task?.assignee?.value) {
      values.task.assignee = values.task.assignee.value;
    }
    if (initialData) {
      values.actionId = initialData?.actionId;
      values.action_type_id = initialData?.taskId;
    }
    values.task.due_date = values.task?.due_date?.format('YYYY-MM-DD');
    values.task.time = values.task?.time?.format('HH:mm');
    values.attachment = values?.attachment ? values?.attachment?.[0]?.originFileObj : null;
    onSave(values);
  };
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      // initialValues={{
      //   task: {
      //     priority: "MEDIUM",
      //   },
      // }}
    >
      <Form.Item
        label="Task Name"
        name={['task', 'name']}
        rules={taskNameRules}
        initialValue={initialData?.name}
      >
        <Input placeholder="Task Name" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item
          label="Due Date"
          name={['task', 'due_date']}
          rules={dueDateRules}
          initialValue={initialData?.dueDate ? dayjs(initialData?.dueDate) : null}
        >
          <DatePicker
            format="YYYY-MM-DD"
            className="w-full"
            inputReadOnly
            onChange={date => {
              // Reset the time field whenever due_date changes
              form.setFieldsValue({
                task: { ...form.getFieldValue('task'), time: null },
              });
            }}
            disabledDate={disablePastDates}
          />
        </Form.Item>

        <Form.Item
          label="Time"
          name={['task', 'time']}
          rules={timeRules}
          initialValue={initialData?.time ? dayjs(initialData.time, 'HH:mm') : null}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            hideDisabledOptions
            disabledTime={() => {
              const selectedDate: dayjs.Dayjs = form.getFieldValue(['task', 'due_date']);
              const now = dayjs();

              if (!selectedDate) {
                return { disabledHours: () => [], disabledMinutes: () => [] };
              }

              // Only restrict time if selected date is today
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
      </div>

      <Form.Item
        label="Priority"
        name={['task', 'priority']}
        rules={priorityRules}
        initialValue={initialData?.priority}
      >
        <Select options={priorityOptions} placeholder="Select Priority" />
      </Form.Item>

      <Form.Item
        label="Description"
        name={['task', 'description']}
        rules={descriptionRules}
        initialValue={initialData?.description}
      >
        <Input.TextArea rows={4} placeholder="Task Description" className="!resize-none" />
      </Form.Item>

      <Form.Item
        label="Assignee"
        name={['task', 'assignee']}
        initialValue={
          initialData?.assignee?.id
            ? {
                key: initialData?.assignee?.id,
                label: initialData?.assignee?.name,
                value: initialData?.assignee?.id,
              }
            : {
                key: initialData?.assignee,
                value: initialData?.assignee,
              }
        }
        rules={[{ required: true, message: 'Please select assignee' }]}
      >
        <Select
          options={assigneeOptions}
          placeholder="Select Assignee"
          notFoundContent={<NoDataMessage label="User" link={SystemRoutes.USERS} />}
        />
      </Form.Item>

      <div className="flex flex-col sm:flex-row  sm:justify-between sm:items-end gap-3">
        <Form.Item
          name="attachment"
          valuePropName="fileList"
          getValueFromEvent={e => e.fileList}
          className="max-w-[200px] sm:max-w-[350px]"
          initialValue={
            initialData?.attachment
              ? [
                  {
                    uid: '-1',
                    name: 'attachment.jpg',
                    status: 'done',
                    url: initialData?.attachment,
                  },
                ]
              : []
          }
        >
          <Upload beforeUpload={() => false} maxCount={1} accept={acceptOnlyImageRule}>
            <Button icon={<IconUpload />}>Attach Files</Button>
          </Upload>
        </Form.Item>

        <div className="flex gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            Save
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default CreateTaskCard;
