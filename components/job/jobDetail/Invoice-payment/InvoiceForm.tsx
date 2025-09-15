import { IconSend, IconX } from "@tabler/icons-react";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Segmented,
  Space,
} from "antd";
import { useEffect, useState } from "react";
const { TextArea } = Input;

interface InvoiceFormProps {
  initialValues?: any;
  mode: "create" | "edit";
  onFinish: (values: any, mode: "create" | "edit") => void;
  onCancel: () => void;
  totalAmount?: number; // Pass total amount for percentage calculation
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  initialValues,
  mode,
  onFinish,
  onCancel,
  totalAmount = 1000, // Example total
}) => {
  const [form] = Form.useForm();
  const [amountMode, setAmountMode] = useState<"$" | "%">("$");

  useEffect(() => {
    if (mode === "edit" && initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [mode, initialValues, form]);

  const handleFinish = (values: any) => {
    let finalAmount = values.amount;

    if (amountMode === "%") {
      finalAmount = (values.amount / 100) * totalAmount;
    }

    onFinish({ ...values, amount: finalAmount, amountMode }, mode);
  };

  return (
    <Card
      title={mode === "edit" ? "Edit Invoice" : "New Invoice"}
      extra={<Button onClick={onCancel} icon={<IconX />} />}
    >
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
              rules={[{ required: true, message: "Enter amount" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder={
                  amountMode === "$" ? "Enter Amount" : "Enter Percentage"
                }
                addonBefore={amountMode === "$" ? "$" : "%"}
              />
            </Form.Item>

            <Segmented
              options={["$", "%"]}
              value={amountMode}
              onChange={(val) => setAmountMode(val as "$" | "%")}
              className="whitespace-nowrap"
            />
          </div>
        </Form.Item>

        <Form.Item
          label="Due Date"
          name="due_date"
          rules={[{ required: true, message: "Select due date" }]}
        >
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Space>
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
    </Card>
  );
};
