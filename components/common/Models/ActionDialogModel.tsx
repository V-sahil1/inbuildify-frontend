'use client';

import { UploadFileStatus } from 'antd/es/upload/interface';
import {
  Modal,
  Form,
  Input,
  Select,
  Radio,
  Upload,
  Button,
  Switch,
  DatePicker,
  ColorPicker,
  Checkbox,
} from 'antd';
import { UploadChangeParam } from 'antd/es/upload';
import React, { useEffect, useState } from 'react';
import RichTextEditor from '../rich-text-editor/RichTextEditor';

export type FormField = {
  key?: string;
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
    | 'dynamic-select'
    | 'url'
    | 'number'
    | 'checkbox'
    | 'image'
    | 'switch'
    | 'date'
    | 'texteditor'
    | 'textEditor'
    | 'color'
    | 'radio'
    | 'custom';
  mode?: 'tags' | 'multiple';
  options?: { value: string; label: string }[];
  selectAll?: {
    enabled: boolean;
    allValue?: any; // default: 'all'
    getAllValues: () => any[];
  };
  button?: string;
  disableButton?: boolean;
  onClick?: () => void;
  handleChange?: (info: UploadChangeParam) => void;
  onChange?: (value: any) => void;
  notFoundContent?: React.ReactNode;
  acceptFileType?: string;
  extra?: string;
  normalize?: (value: any) => any;
  render?: React.ReactNode | ((form: any) => React.ReactNode);
};

interface ActionDialogProps {
  title: React.ReactNode;
  open: boolean;
  loading?: boolean;
  isEditing?: boolean;
  initialValues?: any;
  headerMessage?: React.ReactNode;
  footerMessage?: React.ReactNode;
  onCancel: () => void;
  invite?: boolean;
  submitButtonText?: string;
  onSubmit: (values: any) => void;
  fields: readonly FormField[];
  onValuesChange?: (values: any, form: any) => void;
  form?: any;
  variant?: 'default' | 'danger' | 'success';
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
  form: passedForm,
  variant = 'default',
}) => {
  const [internalForm] = Form.useForm();
  const form = passedForm ?? internalForm;
  const prevValuesRef = React.useRef<Record<string, any[]>>({});
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
    if (!open) return;

    // Initialize switch values from initial values
    const initialSwitchValues: Record<string, boolean> = {};
    fields.forEach(field => {
      if (
        (field.type === 'switch' || (field.type === 'checkbox' && !field?.options)) &&
        !!initialValues &&
        initialValues[field.name] !== undefined
      ) {
        initialSwitchValues[field.name] = initialValues[field.name];
      }
    });
    setSwitchValues(initialSwitchValues);

    if (isEditing && initialValues) {
      const values = { ...initialValues };
      if (initialValues.logo) {
        values[fields.find(f => f.type === 'image')?.name || 'logo'] = makeFileFromUrl(
          initialValues.logo
        );
      }
      form.setFieldsValue({
        ...values,
      });
    } else if (!isEditing) {
      form.resetFields();
    }
  }, [open]);

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
      okButtonProps={(() => {
        const className =
          variant === 'danger'
            ? '!bg-red-600 !border-0 hover:!bg-red-700 !text-white hover:shadow-lg transition-all duration-200'
            : variant === 'success'
              ? '!bg-green-600 !border-0 hover:!bg-green-700 !text-white hover:shadow-lg transition-all duration-200'
              : undefined;
        return className ? { className } : undefined;
      })()}
      cancelButtonProps={(() => {
        const className =
          variant === 'danger'
            ? '!text-red-600 !border-red-600 !bg-transparent hover:!text-red-700 hover:!border-red-700 hover:!bg-transparent'
            : variant === 'success'
              ? '!text-green-600 !border-green-600 !bg-transparent hover:!text-green-700 hover:!border-green-700 hover:!bg-transparent'
              : undefined;
        return className ? { className } : undefined;
      })()}
    >
      {headerMessage &&
        (typeof headerMessage === 'string' ? (
          <p className="text-sm my-4 font-semibold">{headerMessage}</p>
        ) : (
          <>{headerMessage}</>
        ))}
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '70vh', overflowY: 'auto', scrollbarWidth: 'none' }}
        // onValuesChange={(changedValues, allValues) => {

        //   Object.keys(changedValues).forEach(name => {
        //     const field = fields.find(f => f.name === name);
        //     if (field && field.type !== 'custom') {
        //       const normalizedValue = field.normalize ? field.normalize(allValues[name]) : allValues[name];
        //       form.setFieldValue(name, normalizedValue);
        //     }
        //   });

        //   // 🔑 store previous values (only for non-custom fields) - avoid circular reference
        //   const nonCustomValues = Object.fromEntries(
        //     Object.entries(allValues).filter(([name]) => {
        //       const field = fields.find(f => f.name === name);
        //       return field && field.type !== 'custom';
        //     })
        //   );

        //   // Only update prevValuesRef if there are actual changes to avoid circular references
        //   const arrayValues = Object.fromEntries(
        //     Object.entries(nonCustomValues).filter(([, v]) => Array.isArray(v))
        //   );

        //   if (Object.keys(arrayValues).length > 0) {
        //     prevValuesRef.current = {
        //       ...prevValuesRef.current,
        //       ...arrayValues as Record<string, any[]>,
        //     };
        //   }

        //   onValuesChange?.(allValues, form);
        // }}
        onValuesChange={(_, allValues) => onValuesChange?.(allValues, form)}
        disabled={loading}
      >
        {fields.map(field => {
          // Check if field is a checkbox without options
          const isCheckboxWithoutOptions = field.type === 'checkbox' && !field.options;

          return (
            <Form.Item
              key={field.key || field.name}
              label={
                // Hide label for checkbox fields without options
                isCheckboxWithoutOptions ? null : (
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
                )
              }
              name={field.name}
              rules={field.type === 'custom' ? undefined : field.rules}
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
              ) : field.type === 'dynamic-select' ? (
                // dynamic-select behaves like select but can also get options updated by parent (via props re-render)
                <Select
                  showSearch
                  placeholder={field?.placeholder}
                  options={field?.options}
                  disabled={field?.disabled}
                  notFoundContent={field?.notFoundContent}
                  {...(field?.mode && { mode: field?.mode })}
                  onChange={val => field.onChange?.(val)}
                  // onChange={(val) => field.onChange?.(val, form)}
                />
              ) : field.type === 'radio' ? (
                <Radio.Group onChange={field.onChange}>
                  {field.options ? (
                    field.options.map(option => (
                      <Radio key={option.value} value={option.value}>
                        {option.label}
                      </Radio>
                    ))
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
                  getValueFromEvent={({ fileList }) => {
                    if (fileList && fileList.length > 0) {
                      return fileList[0].originFileObj;
                    }
                    return null;
                  }}
                  rules={[
                    {
                      validator: (_, value) => {
                        if (field.rules?.some(r => 'required' in r && r.required) && !value) {
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
                  onChange={checked => {
                    handleSwitchChange(field.name, checked);
                  }}
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
                <RichTextEditor
                  value={form.getFieldValue(field.name) || ''}
                  onChange={val => form.setFieldValue(field.name, val)}
                  maxHeight="400px"
                />
              ) : field.type === 'color' ? (
                <ColorPicker
                  defaultValue="#d59d35"
                  onChange={color => {
                    form.setFieldValue(field.name, color.toHexString());
                  }}
                />
              ) : field.type === 'custom' ? (
                typeof field.render === 'function' ? (
                  (field.render as (form: any) => React.ReactNode)(form)
                ) : (
                  field.render
                )
              ) : field.type === 'checkbox' ? (
                isCheckboxWithoutOptions ? (
                  // Manual layout for checkbox without options: checkbox on left, label on right
                  <div className="flex items-center gap-2 text-font-color-100">
                    <Checkbox
                      checked={form.getFieldValue(field.name) === true}
                      onChange={e => {
                        const isChecked = e.target.checked;
                        form.setFieldValue(field.name, isChecked);
                        handleSwitchChange(field.name, isChecked);
                      }}
                    />
                    <span>{field.label}</span>
                  </div>
                ) : (
                  // Default layout for checkbox groups
                  <Checkbox.Group>
                    {field.options.map(option => (
                      <Checkbox key={option.value} value={option.value}>
                        {option.label}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                )
              ) : (
                <Input
                  placeholder={field.placeholder}
                  type={field.type}
                  disabled={field.disabled}
                />
              )}
            </Form.Item>
          );
        })}

        {typeof footerMessage === 'string' ? (
          <p className="text-sm my-4 font-semibold">{footerMessage}</p>
        ) : (
          <>{footerMessage}</>
        )}
      </Form>
    </Modal>
  );
};
