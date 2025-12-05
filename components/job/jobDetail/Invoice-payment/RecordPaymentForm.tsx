import React, { useState } from 'react';
import { Button, Card, Form, Input, DatePicker, Select } from 'antd';
import { IconX, IconCalendar } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface RecordPaymentFormProps {
  invoiceId: string;
  invoiceAmount: number;
  onCancel: () => void;
  onRecord: (paymentData: any) => void;
}

export const RecordPaymentForm: React.FC<RecordPaymentFormProps> = ({
  invoiceId,
  invoiceAmount,
  onCancel,
  onRecord,
}) => {
  const [form] = Form.useForm();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank', label: 'Bank Transfer' },
    { value: 'check', label: 'Check' },
    { value: 'card', label: 'Credit Card' },
  ];

  const handleRecord = () => {
    form.validateFields().then(values => {
      const paymentData = {
        invoiceId,
        amount: values.amount,
        paymentDate: values.paymentDate,
        paymentMethod: values.paymentMethod,
        reference: values.reference,
        notes: values.notes,
      };
      onRecord(paymentData);
    });
  };

  return (
    <Card
      title={`Record Payment - ${invoiceId}`}
      className="shadow-sm border border-gray-100"
      extra={
        <Button type="text" onClick={onCancel}>
          <IconX size={18} />
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          amount: invoiceAmount,
          paymentDate: dayjs(),
          paymentMethod: 'cash',
        }}
      >
        <Form.Item
          label="Payment Date"
          name="paymentDate"
          rules={[{ required: true, message: 'Select payment date' }]}
        >
          <DatePicker
            style={{ width: '100%' }}
            suffixIcon={<IconCalendar size={16} />}
            placeholder="Select date"
          />
        </Form.Item>
        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Select payment method' }]}
        >
          <Select
            value={paymentMethod}
            onChange={setPaymentMethod}
            placeholder="Select payment method"
            options={paymentMethods.map(method => ({
              label: method.label,
              value: method.value,
            }))}
          />
        </Form.Item>

        <Form.Item
          label="transaction Number"
          name="transactionNumber"
          rules={[{ required: true, message: 'Enter transaction number' }]}
        >
          <Input type="number" placeholder="Enter transaction or check number" />
        </Form.Item>

        <Form.Item
          label="Payment Amount"
          name="amount"
          rules={[{ required: true, message: 'Enter payment amount' }]}
        >
          <Input type="number" prefix="$" placeholder="0.00" min={0} max={invoiceAmount} />
        </Form.Item>

        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} placeholder="Add any payment notes..." />
        </Form.Item>

        <div className="flex justify-end gap-2">
          <Button onClick={onCancel}>Save</Button>
          <Button type="primary" onClick={handleRecord}>
            Send Receipt
          </Button>
        </div>
      </Form>
    </Card>
  );
};
