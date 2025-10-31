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
  const [isPaid, setIsPaid] = useState<boolean>(false);

  // Reset form when initialValues or visibility changes
  useEffect(() => {
    if (visible) {
      const values = initialValues || { isPaid: false };
      const isPaidValue = !!values.isPaid;
      setIsPaid(isPaidValue);

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
          label="Deposit Amount"
          name="amount"
          rules={[{ required: true, message: 'Please enter deposit amount' }]}
        >
          <Input prefix={'$'} type="number" placeholder="Enter amount" />
        </Form.Item>

        <Form.Item
          label="Deposit Date"
          name="date"
          rules={[{ required: true, message: 'Please select deposit date' }]}
        >
          <DatePicker style={{ width: '100%' }} suffixIcon={<IconCalendar />} format="DD/MM/YYYY" />
        </Form.Item>

        {isPaid && (
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
        )}

        <Form.Item
          label="Reference Number"
          name="referenceNumber"
          rules={[{ required: true, message: 'Please enter reference number' }]}
        >
          <Input placeholder="Enter reference number" />
        </Form.Item>

        <Form.Item label="Description" name="description">
          <Input.TextArea rows={3} placeholder="Add any additional notes" />
        </Form.Item>

        <Form.Item name="isPaid" label="Send Invoice to Customer" valuePropName="checked">
          <Switch
            checked={isPaid}
            onChange={checked => {
              setIsPaid(checked);
              if (!checked) {
                form.setFieldsValue({ paymentMode: undefined });
              }
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepositModel;
