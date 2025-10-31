import { Form, Button, Tooltip, Select, Input, DatePicker } from 'antd';
import { IconDeviceFloppy, IconEdit } from '@tabler/icons-react';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { useRef, useState } from 'react';
import { useClickOutside } from '@hooks/useClickOutside';
import { Option } from '@lib/utils/rangeAndDwellingObjToOptions';
import { Rule } from 'antd/es/form';
import dayjs from 'dayjs';
const { TextArea } = Input;

type EditableFieldProps = {
  label: string;
  name: string;
  value: string;
  rules?: Rule[];
  loading?: boolean;
  type: string;
  options?: Option[];
  initialValues?: {};
  onSave?: (values: any) => void;
  isleadEditing?: boolean;
  setIsLeadEditing?: (values) => void;
};

const EditableField: React.FC<EditableFieldProps> = ({
  label,
  name,
  value,
  rules = [],
  loading = false,
  type,
  options = [],
  initialValues = {},
  onSave = () => {},
  isleadEditing = false,
  setIsLeadEditing = () => {},
}) => {
  const [form] = Form.useForm();
  const [editedValue, setEditedValue] = useState<string | string[]>(value ?? '');
  const ref = useRef(null);
  const handleSubmit = async values => {
    await form.validateFields();
    onSave(values);
  };
  useClickOutside(ref, () => {
    if (isleadEditing) {
      form.setFieldsValue({ [name]: value });
      setIsLeadEditing(prev => ({ ...prev, [name]: false }));
    }
  });
  return (
    <Form onFinish={handleSubmit} form={form} initialValues={initialValues}>
      <div className="grid grid-cols-8 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-9 mb-2 items-start">
        <div className="col-span-2 sm:col-span-1 md:col-span-2 lg:col-span-3 font-semibold text-font-color">
          {label}:
        </div>
        <div className="col-span-3 sm:col-span-2 lg:col-span-5 items-center" ref={ref}>
          {isleadEditing ? (
            <Form.Item name={name} rules={rules}>
              {type === 'Select' && (
                <Select
                  options={options}
                  defaultValue={value}
                  disabled={loading}
                  onChange={v => setEditedValue(v as string)}
                />
              )}
              {type === 'TextArea' && (
                <TextArea
                  className="!resize-none"
                  name={name}
                  disabled={loading}
                  maxLength={500}
                  rows={4}
                  onChange={e => setEditedValue(e.target.value.trim())}
                />
              )}
              {type === 'Date' && (
                <DatePicker
                  format="DD-MM-YYYY"
                  defaultValue={value ? dayjs(value) : undefined}
                  onChange={(date, dateString) => setEditedValue(dateString)}
                />
              )}
              {type === 'InputNumber' && (
                <Input
                  placeholder={`Enter ${label.toLowerCase()}`}
                  defaultValue={value}
                  onChange={e => setEditedValue(e.target.value)}
                  type="number"
                />
              )}
            </Form.Item>
          ) : (
            <div className="text-font-color">
              <Tooltip title={enumToReadable(value) || 'Not Available'}>
                <p className="truncate">{enumToReadable(value) || 'N/A'}</p>
              </Tooltip>
            </div>
          )}
        </div>
        <div className="col-span-1">
          {isleadEditing ? (
            <Form.Item>
              <Button
                type="text"
                htmlType="submit"
                disabled={value === editedValue || loading}
                loading={loading}
                icon={<IconDeviceFloppy size={20} />}
              />
            </Form.Item>
          ) : (
            <Button
              type="text"
              onClick={() => setIsLeadEditing(prev => ({ ...prev, [name]: true }))}
              icon={<IconEdit size={20} />}
            />
          )}
        </div>
      </div>
    </Form>
  );
};

export default EditableField;
