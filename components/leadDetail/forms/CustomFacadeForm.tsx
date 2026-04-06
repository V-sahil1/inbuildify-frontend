import React, { useEffect } from 'react';
import { Form, Input, Select, Checkbox, Upload, Button, FormInstance, Radio } from 'antd';
import { facadeFields } from '@/components/formFields/facadeFields';
import { acceptOnlyImageRule } from '@lib/constants/formInputValidations';
import { useAppSelector } from '@hooks/redux';

interface CustomFacadeFormProps {
  initialValues?: any;
  onFormChange: (values: any) => void;
  form: FormInstance;
}

const CustomFacadeForm: React.FC<CustomFacadeFormProps> = ({
  initialValues,
  onFormChange,
  form,
}) => {
  const fields = facadeFields({ isDwellingDisable: true });
  const { selectedFilters } = useAppSelector(state => state.quotation);
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      rangeId: selectedFilters?.range,
      dwellingTypeId: selectedFilters?.dwellingType,
      // locationId: selectedFilters?.location || undefined,
    });
  }, [initialValues, form]);

  const handleValuesChange = () => {
    onFormChange(form.getFieldsValue());
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={initialValues}
      onValuesChange={handleValuesChange}
    >
      {fields.map(field => {
        if (field.type === 'select') {
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules as any}
            >
              <Select
                options={field.options}
                placeholder={field.placeholder}
                value={field.initialValue}
              />
            </Form.Item>
          );
        }
        if (field.type === 'image') {
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules as any}
              getValueFromEvent={e => {
                if (e && e.fileList) {
                  return e.fileList;
                }
                return [];
              }}
            >
              <Upload
                name="image"
                listType="picture"
                multiple={false}
                maxCount={1}
                accept={acceptOnlyImageRule}
                beforeUpload={() => false}
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
          );
        }
        if (field.type === 'radio') {
          return (
            <Form.Item key={field.name} name={field.name} label={field?.label}>
              <Radio.Group options={field?.options} />
            </Form.Item>
          );
        }
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules as any}
          >
            <Input
              placeholder={field.placeholder}
              type={field.type}
              onKeyPress={
                field.type === 'number'
                  ? e => {
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }
                  : undefined
              }
            />
          </Form.Item>
        );
      })}
    </Form>
  );
};

export default CustomFacadeForm;
