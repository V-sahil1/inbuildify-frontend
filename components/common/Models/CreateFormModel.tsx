"use client";

import { UploadFileStatus } from 'antd/es/upload/interface';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  message,
  Upload,
  Button,
} from "antd";
import { UploadChangeParam } from "antd/es/upload";
import React, { useEffect } from "react";

export type CreateFormField = {
  label: string;
  name: string;
  placeholder?: string;
  rules?: any[];
  disabled?: boolean;
  invite?: boolean;
  type?:
    | "email"
    | "phone"
    | "text"
    | "select"
    | "url"
    | "number"
    | "checkbox"
    | "image";
  mode?: "tags" | "multiple";
  options?: { value: string; label: string }[];
  button?: string;
  onClick?: () => void;
  handleChange?: (info: UploadChangeParam) => void;
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
      }
      //  else {
      //   form.resetFields();
      // }
    }
  }, [open, isEditing, initialValues, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (err) {
      message.error("Please fill all the required fields");
    }
  };

  const makeFileFromUrl = (url?: string, name: string = "logo") => {
    if (!url) return [];
    return [
      {
        uid: "-1",
        name,
        status: "done" as UploadFileStatus,
        url,
      },
    ];
  };

  return (
    <Modal
      title={
        isEditing ? `Edit ${title}` : `${invite ? "Invite" : "Create"} ${title}`
      }
      open={open}
      onOk={handleOk}
      centered
      onCancel={onCancel}
      okText={isEditing ? "Update" : invite ? "Invite" : "Create"}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: "70vh", overflowY: "auto", scrollbarWidth: "none" }}
      >
        {fields.map((field) => (
          <Form.Item
            key={field.name}
            label={
              <div className="flex items-center justify-between w-full gap-1">
                <span className="flex-1">{field.label}</span>
                {field.button && <button
                  className="bg-primary text-white rounded py-0.5 px-2 text-[12px]"
                  onClick={field.onClick}
                >
                  {field.button}
                </button>}
              </div>
            }
            name={field.name}
            rules={field.rules}
          >
            {field.type === "select" ? (
              <Select
                placeholder={field.placeholder}
                options={field.options}
                disabled={field.disabled}
                {...(field.mode && { mode: field.mode })}
              />
            ) : field.type === "checkbox" ? (
              <Radio.Group defaultValue="TRUE">
                <Radio value="TRUE">Yes</Radio>
                <Radio value="FALSE">No</Radio>
              </Radio.Group>
            ) : field.type === "image" ? (
               <Upload
                name="image"
                listType="picture"
                multiple={false}
                maxCount={1}    
                defaultFileList={makeFileFromUrl(initialValues?.logo)}
              >
                <Button>
                  Click to Upload
                </Button>
              </Upload>
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.type === "email" ? "email" :field.type === "number" ? "number":  "text"}
                disabled={field.disabled}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
