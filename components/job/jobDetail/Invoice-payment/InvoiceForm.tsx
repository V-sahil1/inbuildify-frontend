import { numberRules } from "@lib/constants/formInputValidations";
import { IconSend } from "@tabler/icons-react";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Space,
} from "antd";
import { useEffect } from "react";
const { TextArea } = Input;

interface InvoiceFormProps {
  initialValues?: any;
  mode: "create" | "edit";
  onFinish: (values: any, mode: "create" | "edit") => void;
  totalAmount?: number;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialValues,
  mode,
  onFinish,
  totalAmount = 1000,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (mode === "edit" && initialValues) {
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

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={mode === "edit" ? initialValues : {}}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Description"
        name="desc"
        rules={[{ required: true, message: "Enter description" }]}
      >
        <Input placeholder="Enter description" />
      </Form.Item>

      <Form.Item label="Notes" name="notes">
        <TextArea
          rows={3}
          showCount
          maxLength={500}
          placeholder="(This notes will not displayed in Invoice PDF)"
        />
      </Form.Item>
      <Form.Item label="Invoice Amount" required className="w-full">
        <div className="flex items-center gap-2">
          <Form.Item
            name="amount"
            noStyle
            rules={numberRules}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder={"Enter Amount"}
              addonBefore={"$"}
            />
          </Form.Item>
        </div>
      </Form.Item>

      <Form.Item
        label="Due Date"
        name="due_date"
        rules={[{ required: true, message: "Select due date" }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Space className="flex justify-end">
        <Button htmlType="submit">
          {mode === "edit" ? "Update" : "Save"}
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          icon={<IconSend size={18} />}
        >
          {mode === "edit" ? "Send" : "Send"}
        </Button>
      </Space>
    </Form>
  );
};
