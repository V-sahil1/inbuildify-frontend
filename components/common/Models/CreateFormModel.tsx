"use client";

import { Modal, Form, Input, Select, Radio } from "antd";
import React, { useEffect } from "react";

export type CreateFormField = {
  label: string;
  name: string;
  placeholder?: string;
  rules?: any[];
  disabled?: boolean;
  invite?: boolean;
  type?: "email" | "phone" | "text" | "select" | "url" | "number" | "checkbox";
  options?: { value: string; label: string }[];
};

interface CreateFormModalProps {
  title: string;
  open: boolean;
  loading?: boolean;
  isEditing?: boolean;
  initialValues?: any;
  onCancel: () => void;
  invite?: boolean;
  onSubmit: (values: any) => void;
  fields: readonly CreateFormField[];
}

export const CreateFormModal: React.FC<CreateFormModalProps> = ({
  title,
  open,
  loading = false,
  isEditing = false,
  initialValues = {},
  onCancel,
  invite = false,
  onSubmit,
  fields,
}) => {
  const [form] = Form.useForm();


  useEffect(() => {
    if (open) {
      if (isEditing) {
        form.setFieldsValue(initialValues);
      } else {
        form.resetFields();
      }
    }
  }, [open, isEditing, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (err) {
      console.log("Validation failed:", err);
    }
  };

  return (
    <Modal
      title={isEditing ? `Edit ${title}` : `${invite ? "Invite" : "Create"} ${title}`}
      open={open}
      onOk={handleOk}
      centered
      onCancel={onCancel}
      okText={isEditing ? "Update" : invite ? "Invite" : "Create"}
      confirmLoading={loading}
      cancelButtonProps={{
        style: { color: "var(--primary)", borderColor: "var(--primary)" },
      }}
      okButtonProps={{
        style: { backgroundColor: "var(--primary)", borderColor: "var(--primary)" },
      }}
    >
      <Form form={form} layout="vertical" style={{ maxHeight: "70vh", overflowY: "auto", scrollbarWidth: "none" }}>
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={field.label}
            name={field.name}
            rules={field.rules}
          >
            {field.type === "select" ? (
              <Select
                placeholder={field.placeholder}
                options={field.options}
                disabled={field.disabled}
              />
            ) : field.type === "checkbox" ? (
              <Radio.Group defaultValue="TRUE">
                <Radio value="TRUE">Yes</Radio>
                <Radio value="FALSE">No</Radio>
              </Radio.Group>
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.type === "email" ? "email" : "text"}
                disabled={field.disabled}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
