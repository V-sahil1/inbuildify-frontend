'use client';
import { FC } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { SmsDetails } from 'data/types';
import { descriptionRules } from '@lib/constants/formInputValidations';
import { useUsersHook } from '@hooks/useUserHook';
const { TextArea } = Input;
interface SendSmsCardProps {
  onSave: (sms: SmsDetails) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: SmsDetails;
}

const SendSmsCard: FC<SendSmsCardProps> = ({ onSave, onCancel, loading, initialData }) => {
  const [form] = Form.useForm();
  const { userOptions } = useUsersHook(true);

  const handleFinish = async values => {
    await form.validateFields();
    onSave(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className="flex flex-col gap-3">
      <Form.Item
        label="Recipient"
        name="recipientId"
        rules={[{ required: true, message: 'Please select recipient(s)' }]}
        initialValue={initialData?.recipientId}
      >
        <Select options={userOptions} placeholder="Select Recipient" className="w-full" />
      </Form.Item>

      <Form.Item
        label="Message"
        name="message"
        rules={descriptionRules}
        initialValue={initialData?.message}
      >
        <TextArea rows={4} placeholder="Type your SMS message" className="!resize-none" />
      </Form.Item>

      <div className="flex gap-3 justify-end">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
          Send SMS
        </Button>
      </div>
    </Form>
  );
};

export default SendSmsCard;
