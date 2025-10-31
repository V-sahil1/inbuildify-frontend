'use client';

import { UploadFileStatus } from 'antd/es/upload/interface';
import { Modal, Form, Input, Select, Radio, Upload, Button, Switch, DatePicker } from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import RichTextEditorFormField from '../rich-text-editor/RichTextEditorFormField';

export type FormField = {
  label: string;
  name: string;
  placeholder?: string;
  rules?: any[];
  disabled?: boolean;
  invite?: boolean;
  initialValue?: any;
  type?:
    | 'email'
    | 'phone'
    | 'text'
    | 'textarea'
    | 'select'
    | 'url'
    | 'number'
    | 'checkbox'
    | 'image'
    | 'switch'
    | 'date'
    | 'texteditor';
  mode?: 'tags' | 'multiple';
  options?: { value: string; label: string }[];
  button?: string;
  disableButton?: boolean;
  onClick?: () => void;
  handleChange?: (info: UploadChangeParam) => void;
  onChange?: (value: any) => void;
  notFoundContent?: React.ReactNode;
  acceptFileType?: string;
  extra?: string;
};

interface ActionDialogProps {
  title: React.ReactNode;
  open: boolean;
  loading?: boolean;
  isEditing?: boolean;
  initialValues?: any;
  headerMessage?: string;
  footerMessage?: string;
  onCancel: () => void;
  invite?: boolean;
  submitButtonText?: string;
  onSubmit: (values: any) => void;
  fields?: readonly FormField[];
  onValuesChange?: (values: any, form: any) => void;
}

export const ActionDialogmodel: React.FC<ActionDialogProps> = ({
  title,
  open,
  loading = false,
  isEditing = false,
  initialValues = {},
  headerMessage,
  footerMessage,
  onCancel,
  onSubmit,
  submitButtonText,
  fields,
  onValuesChange,
}) => {
  const [form] = Form.useForm();
  const [switchValues, setSwitchValues] = useState({});

  const handleSwitchChange = (fieldName: string, checked: boolean) => {
    setSwitchValues(prev => ({
      ...prev,
      [fieldName]: checked,
    }));
    // Call the field's onChange if provided
    const field = fields.find(f => f.name === fieldName);
    if (field?.onChange) {
      field.onChange(checked);
    }
  };

  useEffect(() => {
    if (open) {
      if (isEditing && initialValues) {
        const values = { ...initialValues };
        if (initialValues.logo) {
          values[fields.find(f => f.type === 'image')?.name || 'logo'] = makeFileFromUrl(
            initialValues.logo
          );
        }
        form.setFieldsValue(values);
      } else if (!isEditing) {
        form.resetFields();
      }
    }
  }, [open, isEditing, initialValues, fields, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Clean up image value if it's just the preview
      if (values.image && values.image.length > 0) {
        const imageField = values.image[0];
        if (imageField.status === 'done' && imageField.url && !imageField.originFileObj) {
          // This is just a preview, not a new upload
          delete values.image;
        }
      }

      onSubmit(values);
    } catch (err) {
      // console.error('Validation failed:', err);
    }
  };

  const makeFileFromUrl = (url?: string, name: string = 'image') => {
    if (!url) return [];
    return [
      {
        uid: '-1',
        name,
        status: 'done' as UploadFileStatus,
        url,
      },
    ];
  };

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      centered
      onCancel={onCancel}
      okText={submitButtonText}
      confirmLoading={loading}
    >
      {headerMessage && <p className="text-sm my-4 font-semibold">{headerMessage}</p>}
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '70vh', overflowY: 'auto', scrollbarWidth: 'none' }}
        onValuesChange={(_, allValues) => onValuesChange?.(allValues, form)}
      >
        {fields.map(field => (
          <Form.Item
            key={field.name}
            label={
              <div className="flex items-center justify-between w-full gap-1">
                <span className="flex-1">{field.label}</span>
                {field.button && (
                  <Button
                    size="small"
                    type="primary"
                    disabled={field?.disableButton || false}
                    onClick={e => {
                      e.stopPropagation();
                      field.onClick?.();
                    }}
                  >
                    {field.button}
                  </Button>
                )}
              </div>
            }
            name={field.name}
            rules={field.rules}
            initialValue={field.initialValue}
            extra={field.extra}
          >
            {field.type === 'select' ? (
              <Select
                showSearch
                placeholder={field?.placeholder}
                options={field?.options}
                disabled={field?.disabled}
                notFoundContent={field?.notFoundContent}
                {...(field?.mode && { mode: field?.mode })}
              />
            ) : field.type === 'checkbox' ? (
              <Radio.Group>
                {field.options ? (
                  field.options.map(option => <Radio value={option.value}>{option.label}</Radio>)
                ) : (
                  <>
                    <Radio value="TRUE">Yes</Radio>
                    <Radio value="FALSE">No</Radio>
                  </>
                )}
              </Radio.Group>
            ) : field.type === 'image' ? (
              <Form.Item
                name={field.name}
                valuePropName="fileList"
                getValueFromEvent={({ fileList }) => fileList}
                rules={[
                  {
                    validator: (_, value) => {
                      if (
                        field.rules?.some(r => 'required' in r && r.required) &&
                        (!value || value.length === 0)
                      ) {
                        return Promise.reject(new Error('Image is required'));
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
                  accept={field?.acceptFileType || ''}
                >
                  <Button>Click to Upload</Button>
                </Upload>
              </Form.Item>
            ) : field.type === 'textarea' ? (
              <Input.TextArea
                placeholder={field.placeholder}
                disabled={field.disabled}
                className="!resize-none"
                rows={4}
              />
            ) : field.type === 'phone' ? (
              <Input
                placeholder={field.placeholder || 'Enter phone number'}
                disabled={field.disabled}
                minLength={10}
                maxLength={15}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            ) : field.type === 'number' ? (
              <Input
                placeholder={field.placeholder}
                type={field.type}
                disabled={field.disabled}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            ) : field.type === 'switch' ? (
              <Switch
                checked={switchValues[field.name] || false}
                onChange={checked => handleSwitchChange(field.name, checked)}
                onClick={field.onClick}
              />
            ) : field.type === 'date' ? (
              <DatePicker
                className="w-full"
                placeholder={field.placeholder || 'Select date'}
                disabled={field.disabled}
                format="YYYY-MM-DD"
              />
            ) : field.type === 'texteditor' ? (
              <RichTextEditorFormField
                value={form.getFieldValue(field.name) || ''}
                onChange={val => form.setFieldValue(field.name, val)}
                maxHeight="400px"
              />
            ) : (
              <Input placeholder={field.placeholder} type={field.type} disabled={field.disabled} />
            )}
          </Form.Item>
        ))}
        {footerMessage && <p className="text-sm my-4 font-semibold">{footerMessage}</p>}
      </Form>
    </Modal>
  );
};
