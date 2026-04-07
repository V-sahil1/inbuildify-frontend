import { useState, useEffect } from 'react';
import { Button, Form, Input, Select, Switch, Modal, DatePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { IconCalendar } from '@tabler/icons-react';
import { paymentOptions } from 'data/options';

const { Option } = Select;

interface Deposit {
  id?: string;
  amount?: number;
  date?: string | Dayjs;
  paymentMethod?: string;
  referenceNumber?: string;
  notes?: string;
  isPaid?: boolean;
  paymentMode?: string;
}

interface DepositModelProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Deposit) => void;
  loading?: boolean;
  initialValues?: Deposit;
  title?: string;
}

const DepositModel = ({
  visible,
  onCancel,
  onSubmit,
  loading = false,
  initialValues,
  title = 'Capture Deposit',
}: DepositModelProps) => {
  const [form] = Form.useForm();
  const isInvoice = Form.useWatch('generateInvoice', form);

  // Reset form when initialValues or visibility changes
  useEffect(() => {
    if (visible) {
      const values = initialValues || { isPaid: false };
      const isPaidValue = !!values.isPaid;

      // Ensure date is properly converted to Dayjs
      const formattedValues: any = {
        ...values,
        isPaid: isPaidValue,
        date: values.date ? dayjs(values.date) : undefined,
      };

      form.setFieldsValue(formattedValues);
    }
  }, [visible, initialValues, form]);

  const onFormFinish = (values: any) => {
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
    };
    onSubmit(formattedValues);
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={handleCancel}
      centered
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {initialValues?.id ? 'Update' : 'Save'} Deposit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={onFormFinish} initialValues={{ isPaid: false }}>
        <Form.Item
          label={isInvoice ? 'Invoice Amount' : 'Deposit Amount'}
          name={isInvoice ? 'invoiceAmount' : 'depositeAmount'}
          rules={[{ required: true, message: 'Please enter deposit amount' }]}
        >
          <Input prefix={'$'} type="number" placeholder="Enter amount" onWheel={(e) => e.currentTarget.blur()} />
        </Form.Item>

        <Form.Item
          label={isInvoice ? 'Invoice Date' : 'Deposit Date'}
          name={isInvoice ? 'invoiceDate' : 'depositeDate'}
          rules={[{ required: true, message: 'Please select deposit date' }]}
        >
          <DatePicker style={{ width: '100%' }} suffixIcon={<IconCalendar />} format="DD/MM/YYYY" />
        </Form.Item>

        {isInvoice && (
          <>
            <Form.Item
              label="Due Date"
              name="dueDate"
              rules={[{ required: true, message: 'Please select deposit date' }]}
            >
              <DatePicker
                style={{ width: '100%' }}
                suffixIcon={<IconCalendar />}
                format="DD/MM/YYYY"
              />
            </Form.Item>
          </>
        )}
        <Form.Item
          label="Payment Method"
          name="paymentMethod"
          rules={[{ required: true, message: 'Please select payment method' }]}
        >
          <Select placeholder="Select payment method">
            {paymentOptions.map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Reference Number"
          name="transactionNo"
          rules={[{ required: true, message: 'Please enter reference number' }]}
        >
          <Input placeholder="Enter reference number" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Add any additional notes" />
        </Form.Item>

        <Form.Item name="generateInvoice" label="Send Invoice to Customer" valuePropName="checked">
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepositModel;
