"use client";
import { FC } from "react";
import { Button, Form, Input, Select } from "antd";
import { SmsDetails } from "data/types";
import { useAppSelector } from "@hooks/redux";
import { descriptionRules } from "@lib/constants/formInputValidations";
const { TextArea } = Input;
interface SendSmsCardProps {
  onSave: (sms: SmsDetails) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: SmsDetails;
}

const SendSmsCard: FC<SendSmsCardProps> = ({
  onSave,
  onCancel,
  loading,
  initialData,
}) => {
  const [form] = Form.useForm();
  const { leadDetail } = useAppSelector((state) => state.lead);
  const recipientOptions = leadDetail.contacts.map((contact) => ({
    label: contact.name,
    value: contact.leadsContactId,
  }));

  const handleFinish = async (values: SmsDetails) => {
    values.type = "SMS";
    await form.validateFields();
    onSave(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="flex flex-col gap-3"
    >
      <Form.Item
        label="Recipient"
        name="recipient"
        rules={[{ required: true, message: "Please select recipient(s)" }]}
      >
        <Select
          mode="multiple"
          options={recipientOptions}
          placeholder="Select Recipient"
          className="w-full"
        />
      </Form.Item>

      <Form.Item
        label="Message"
        name="message"
        rules={descriptionRules}
      >
        <TextArea rows={4} placeholder="Type your SMS message" />
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
