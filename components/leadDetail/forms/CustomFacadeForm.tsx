import React, { useEffect } from "react";
import { Form, Input, Select, Checkbox, Upload, Button } from "antd";
import { facadeFields } from "@/components/formFields/facadeFields";

interface CustomFacadeFormProps {
  initialValues?: any;
  onFormChange: (values: any) => void;
}

const CustomFacadeForm: React.FC<CustomFacadeFormProps> = ({
  initialValues,
  onFormChange,
}) => {
  const [form] = Form.useForm();
  const fields = facadeFields({isDwellingDisable: true});

  useEffect(() => {
    form.setFieldsValue(initialValues || {});
  }, [initialValues, form]);

  useEffect(() => {
    form.setFieldsValue({
      dwelling_type: fields.find((field) => field.name === "dwelling_type")?.initialValue,
    });
  }, [fields]);

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
      {fields.map((field) => {
        if (field.type === "select") {
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules}
            >
              <Select
                options={field.options}
                placeholder={field.placeholder}
                disabled
                value={field.initialValue}
                // className="white-disabled-select"
              />
            </Form.Item>
          );
        }
        if (field.type === "image") {
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules}
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
          );
        }
        if (field.type === "checkbox") {
          return (
            <Form.Item
              key={field.name}
              name={field.name}
              valuePropName="checked"
            >
              <Checkbox>{field.label}</Checkbox>
            </Form.Item>
          );
        }
        return (
          <Form.Item
            key={field.name}
            name={field.name}
            label={field.label}
            rules={field.rules}
          >
            <Input placeholder={field.placeholder} type={field.type}/>
          </Form.Item>
        );
      })}
    </Form>
  );
};

export default CustomFacadeForm;
