import { numberRules } from '@lib/constants/formInputValidations';
import { IconSend } from '@tabler/icons-react';
import { Button, DatePicker, Form, Input, Radio, Space } from 'antd';
import { useEffect } from 'react';
const { TextArea } = Input;

interface InvoiceFormProps {
  initialValues?: any;
  mode: 'create' | 'edit';
  onFinish: (values: any, mode: 'create' | 'edit') => void;
  onSend?: (values: any, mode: 'create' | 'edit') => void;
  totalAmount?: number;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialValues,
  mode,
  onFinish,
  onSend,
  totalAmount = 1000,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === 'edit' && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [mode, initialValues, form]);

  const handleFinish = (values: any) => {
    let finalAmount = values.amount;
    finalAmount = (values.amount / 100) * totalAmount;
    onFinish({ ...values, amount: finalAmount }, mode);
  };

  const handleSend = (values: any) => {
    let finalAmount = values.amount;
    finalAmount = (values.amount / 100) * totalAmount;
    if (onSend) {
      onSend({ ...values, amount: finalAmount }, mode);
    } else {
      onFinish({ ...values, amount: finalAmount }, mode);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === 'edit' ? initialValues : {}}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Description"
        name="desc"
        rules={[{ required: true, message: 'Enter description' }]}
      >
        <Input placeholder="Enter description" />
      </Form.Item>

      <Form.Item label="Notes" name="notes">
        <TextArea
          rows={4}
          showCount
          maxLength={500}
          placeholder="(This notes will not displayed in Invoice PDF)"
          style={{ resize: 'none' }}
        />
      </Form.Item>
      <div className="flex gap-2">
        <Form.Item label="Invoice Amount" required className="w-full">
          <div className="flex items-center gap-2">
            <Form.Item name="amount" noStyle rules={numberRules}>
              <Input
                style={{ width: '100%' }}
                placeholder={'Enter Amount'}
                addonBefore={'$'}
                type="number"
              />
            </Form.Item>
          </div>
        </Form.Item>
        <Form.Item label=" " className="w-full">
          <Radio.Group defaultValue="contractcost">
            <Radio value="contractcost">Contract Cost</Radio>
            <Radio value="Totalcost">Total Cost</Radio>
          </Radio.Group>
        </Form.Item>
      </div>
      <div className="flex gap-2">
        <Form.Item
          label="Due Date"
          name="due_date"
          // rules={[{ required: true, message: 'Select due date' }]}
          className="w-1/2"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="Invoice Date"
          name="invoice_date"
          // rules={[{ required: true, message: 'Select invoce date' }]}
          className="w-1/2"
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
      </div>
      <Space className="flex justify-end">
        <Button htmlType="submit">{mode === 'edit' ? 'Update' : 'Save'}</Button>
        <Button
          type="primary"
          onClick={() => {
            form.validateFields().then(values => {
              handleSend(values);
            });
          }}
          icon={<IconSend size={18} />}
        >
          {mode === 'edit' ? 'Send' : 'Send'}
        </Button>
      </Space>
    </Form>
  );
};
