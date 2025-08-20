"use client";

import { Modal, Form, Input, Select } from "antd";
import React from "react";

type CreateFormField = {
  label: string;
  name: string;
  placeholder?: string;
  rules?: any[];
  disabled?: boolean;
  type?: "email" | "phone" | "text" | "select";
  options?: { value: string; label: string }[];
};

interface CreateFormModalProps {
  title: string;
  open: boolean;
  loading?: boolean;
  isEditing?: boolean;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  fields: CreateFormField[];
}

export const CreateFormModal: React.FC<CreateFormModalProps> = ({
  title,
  open,
  loading = false,
  isEditing = false,
  onCancel,
  onSubmit,
  fields,
}) => {
  const [form] = Form.useForm();

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
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText={isEditing ? "Update" : "Create"}
      confirmLoading={loading}
      cancelButtonProps={{
        style: { color: "#4c3575", borderColor: "#4c3575" },
      }}
      okButtonProps={{
        style: { backgroundColor: "#4c3575", borderColor: "#4c3575" },
      }}
    >
      <Form form={form} layout="vertical">
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
