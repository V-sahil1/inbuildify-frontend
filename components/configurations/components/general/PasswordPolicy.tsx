import React from 'react';
import { Form, InputNumber, Button } from 'antd';

export const PasswordPolicy: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Saved Password Policy:', values);
  };

  return (
    <div className="p-6 md:p-10 w-full min-h-screen">
      <div className=" mx-auto">
        <Form
          form={form}
          layout="horizontal"
          onFinish={onFinish}
          initialValues={{
            expiresInDays: 365,
            invalidAttempts: 10,
            alertDays: 10,
            passwordHistory: 5,
          }}
          labelCol={{ xs: 24, md: 10 }}
          wrapperCol={{ xs: 24, md: 14 }}
          labelAlign="left"
          className="space-y-4"
        >
          <Form.Item
            label="Expires (in days)"
            name="expiresInDays"
            rules={[{ required: true, message: 'Please enter number of days' }]}
          >
            <InputNumber min={1} addonAfter="days" className="w-full rounded-lg shadow-sm" />
          </Form.Item>

          <Form.Item
            label="Number of invalid attempts"
            name="invalidAttempts"
            rules={[{ required: true, message: 'Please enter number of attempts' }]}
          >
            <InputNumber min={1} className="w-full rounded-lg shadow-sm" />
          </Form.Item>

          <Form.Item
            label="Display alert from number of days"
            name="alertDays"
            rules={[{ required: true, message: 'Please enter number of days' }]}
          >
            <InputNumber min={1} addonAfter="days" className="w-full rounded-lg shadow-sm" />
          </Form.Item>

          <Form.Item
            label="Number of passwords stored in history"
            name="passwordHistory"
            rules={[{ required: true, message: 'Please enter a number' }]}
          >
            <InputNumber min={1} className="w-full rounded-lg shadow-sm" />
          </Form.Item>

          <Form.Item
            wrapperCol={{ xs: 24, md: { offset: 10, span: 14 } }}
            className="pt-4 w-full flex justify-end  items-center pr-40 "
          >
            <Button type="primary" htmlType="submit" className="rounded-lg font-semibold">
              Save Policy
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
