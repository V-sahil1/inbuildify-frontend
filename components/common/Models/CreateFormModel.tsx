"use client";

import { UploadFileStatus } from "antd/es/upload/interface";
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
    | "textarea"
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
  console.log("🚀 ~ initialValues:", initialValues);
  const [form] = Form.useForm();
  const [logo, setLogo] = React.useState<boolean>(true);

  useEffect(() => {
    if (open) {
      if (isEditing && initialValues) {
        const values = { ...initialValues };
        // Set initial file list if logo exists
        if (initialValues.logo) {
          values[fields.find((f) => f.type === "image")?.name || "logo"] =
            makeFileFromUrl(initialValues.logo);
        }
        form.setFieldsValue(values);
      } else if (!isEditing) {
        form.resetFields();
      }
    }
  }, [open, isEditing]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Clean up image value if it's just the preview
      if (values.image && values.image.length > 0) {
        const imageField = values.image[0];
        if (
          imageField.status === "done" &&
          imageField.url &&
          !imageField.originFileObj
        ) {
          // This is just a preview, not a new upload
          delete values.image;
        }
      }

      onSubmit(values);
    } catch (err) {
      // console.error('Validation failed:', err);
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
                {field.button && (
                  <button
                    className="bg-primary text-white rounded py-0.5 px-2 text-[12px]"
                    onClick={field.onClick}
                  >
                    {field.button}
                  </button>
                )}
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
              <Form.Item
                name={field.name}
                valuePropName="fileList"
                getValueFromEvent={({ fileList }) => fileList}
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        field.rules?.some(
                          (r) => "required" in r && r.required
                        ) &&
                        (!value || value.length === 0)
                      ) {
                        // return Promise.reject(new Error('Image is required'));
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
                noStyle
              >
                <Upload
                  name="image"
                  listType="picture"
                  multiple={false}
                  maxCount={1}
                  beforeUpload={() => false}
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </Form.Item>
            ) : field.type === "textarea" ? (
              <Input.TextArea
                placeholder={field.placeholder}
                disabled={field.disabled}
              />
            ) : (
              <Input
                placeholder={field.placeholder}
                type={field.type}
                disabled={field.disabled}
              />
            )}
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
