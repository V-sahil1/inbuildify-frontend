import React, { useEffect, useState } from 'react';
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
  const [costType, setCostType] = useState<'standard' | 'upgrade'>('standard');
  const fields = facadeFields({ isDwellingDisable: true, type: costType });
  const { selectedFilters } = useAppSelector(state => state.quotation);
  
  useEffect(() => {
    form.setFieldsValue({
      ...initialValues,
      rangeId: selectedFilters?.range,
      dwellingTypeId: selectedFilters?.dwellingType,
      // locationId: selectedFilters?.location || undefined,
    });
    // Set initial cost type from initialValues
    if (initialValues?.costType) {
      setCostType(initialValues.costType);
    }
  }, [initialValues, form]);

  const handleValuesChange = (changedValues: any) => {
    // Handle cost type change
    if (changedValues.costType) {
      setCostType(changedValues.costType);
      // Clear cost and builder cost when switching to standard
      if (changedValues.costType === 'standard') {
        form.setFieldsValue({
          cost: undefined,
          builderCost: undefined,
        });
      }
    }
    onFormChange(form.getFieldsValue());
  };

  const handleCostTypeChange = (e: any) => {
    const value = e?.target?.value || e;
    setCostType(value);
    // Clear cost and builder cost when switching to standard
    if (value === 'standard') {
      form.setFieldsValue({
        cost: undefined,
        builderCost: undefined,
      });
    }
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
            <Form.Item key={field.name} name={field.name} label={field?.label} rules={field.rules}>
              <Radio.Group 
                options={field?.options} 
                onChange={field.name === 'costType' ? handleCostTypeChange : undefined}
              />
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
              disabled={field.disabled}
              onWheel={(e) => e.currentTarget.blur()}
              min={field?.min || 0}
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
