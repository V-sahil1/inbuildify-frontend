import { Button, DatePicker, Drawer, Form, Input, Select, Upload, message } from 'antd';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import { useEffect, useMemo, useRef } from 'react';
import { ITodo } from '@redux/feature/todo/IToDoState';
import { useAppDispatch } from '@hooks/redux';
import { createTodo, updateTodo } from '@redux/feature/todo/todoThunk';
import dayjs from 'dayjs';
import { useSupplierHook } from '@hooks/useSupplierHook';

interface TodoFormDrawerProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  initialData?: ITodo | null;
}

export const TodoFormDrawer = ({ open, onCancel, onSubmit, initialData }: TodoFormDrawerProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { supplierOptions } = useSupplierHook();
  const supplier = Form.useWatch('supplier', form);
  const booking = Form.useWatch('booking', form);
  const start = Form.useWatch('start', form);
  const finish = Form.useWatch('finish', form);
  const wasOpenRef = useRef(false);
  const supplierName =
    supplierOptions.find(option => option.value === supplier)?.label?.toString() ?? '';

  const messageContent = useMemo(
    () => `<div class='space-y-2'>
        <p>Dear ${supplierName},</p>
        <p> This is to bring to your notice that the Electrician trench and meter application including all conduits has been requested for the below site and dates:</p>
        <p>Job Address: ${initialData?.jobAddress ?? ''}</p>
        <p>Request: Electrician trench and meter application + all conduits – Construction</p>
        <p>Booking Date: ${booking ? dayjs(booking).format('DD/MM/YYYY') : ''}</p>
        <p>Date: ${start ? dayjs(start).format('DD/MM/YYYY') : ''} to ${finish ? dayjs(finish).format('DD/MM/YYYY') : ''}</p>
        <p><a href='#'>Click here</a> to accept or decline the booking, or to propose a new date.</p>
        <p><a href='#'>Sign up</a> to the Insimplify Tradies Portal to view all jobs in one place.</p>
        <p>Regards,</p>
    </div>`,
    [supplierName, booking, start, finish, initialData?.jobAddress]
  );

  useEffect(() => {
    form.setFieldValue('message', messageContent);
  }, [messageContent]);

  useEffect(() => {
    if (open && !wasOpenRef.current && initialData) {
      form.setFieldsValue({
        taskName: initialData.taskName ?? undefined,
        booking: initialData.bookingDate ? dayjs(initialData.bookingDate) : undefined,
        start: initialData.startDate ? dayjs(initialData.startDate) : undefined,
        finish: initialData.finishDate ? dayjs(initialData.finishDate) : undefined,
        supplier: initialData.supplierId ?? undefined,
        status: initialData.status ?? 'Pending',
        subject: initialData.subject ?? undefined,
        message: initialData.message ?? messageContent,
      });
    } else if (open && !wasOpenRef.current) {
      form.resetFields();
      form.setFieldsValue({
        status: 'Pending',
        message: messageContent,
      });
    } else if (open) {
      form.setFieldValue('message', messageContent);
    }
    wasOpenRef.current = open;
  }, [open, initialData, messageContent, form]);

  async function handleSubmit(values) {
    try {
      if (initialData?.todoId) {
        await dispatch(
          updateTodo({
            id: initialData.todoId,
            data: {
              task_name: values.taskName || undefined,
              booking_date: values.booking ? dayjs(values.booking).format('YYYY-MM-DD') : undefined,
              start_date: values.start ? dayjs(values.start).format('YYYY-MM-DD') : undefined,
              finish_date: values.finish ? dayjs(values.finish).format('YYYY-MM-DD') : undefined,
              supplier_id: values.supplier || undefined,
              status: values.status || undefined,
              subject: values.subject || undefined,
              message: values.message || undefined,
            },
          })
        ).unwrap();
        message.success('Booking saved successfully');
      } else {
        await dispatch(
          createTodo({
            task_name: values.taskName,
            booking_date: values.booking ? dayjs(values.booking).format('YYYY-MM-DD') : undefined,
            start_date: values.start ? dayjs(values.start).format('YYYY-MM-DD') : undefined,
            finish_date: values.finish ? dayjs(values.finish).format('YYYY-MM-DD') : undefined,
            supplier_id: values.supplier,
            status: values.status || 'Pending',
            subject: values.subject || undefined,
            message: values.message || undefined,
          })
        ).unwrap();
        message.success('Todo created successfully');
      }
    } catch (err: any) {
      message.error(err?.message || 'Failed to save todo');
      return;
    }
    onSubmit();
  }

  return (
    <Drawer title="Booking Supplier" open={open} onClose={onCancel} width={700}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Task Name"
          name="taskName"
          rules={[{ required: true, message: 'Please enter task name' }]}
        >
          <Input placeholder="Enter task name" />
        </Form.Item>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Booking Date" name="booking">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Start" name="start">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Finish" name="finish">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <Form.Item
          label="Supplier"
          name="supplier"
          rules={[{ required: true, message: 'Please select supplier' }]}
        >
          <Select options={supplierOptions} placeholder="Select Supplier" showSearch optionFilterProp="label" />
        </Form.Item>
        <Form.Item label="Subject" name="subject">
          <Input />
        </Form.Item>
        <Form.Item label="Status" name="status">
          <Select
            options={[
              { label: 'Pending', value: 'Pending' },
              { label: 'Confirmed', value: 'Confirmed' },
              { label: 'Cancelled', value: 'Cancelled' },
            ]}
          />
        </Form.Item>
        <Form.Item label="Message" name="message">
          <RichTextEditor
            value={messageContent}
            onChange={value => {
              form.setFieldValue('message', value);
            }}
          />
        </Form.Item>
        <Form.Item name="files">
          <Upload>
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <div className="flex gap-2 justify-end">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};
