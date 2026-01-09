import React, { useEffect } from 'react';
import { Form, Input, Select, Row, Col, Upload, Button, InputNumber, Divider, message } from 'antd';
import { ColorPicker } from 'antd';
import { IconInfoSquareFilled, IconUpload } from '@tabler/icons-react';
import InputSwitch from '@/components/common/InputSwitch';
import { useAppDispatch } from '@hooks/redux';
import { updatePdfTemplate } from '@redux/feature/admin/template/pdf/pdfTemplateThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { TemplateJson } from '@redux/feature/admin/template/pdf/IpdfTemplateState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { TextArea } = Input;
const { Option } = Select;

const processFormValues = values => {
  if (values === null || values === undefined) {
    return values;
  }

  if (typeof values === 'object') {
    if (values && typeof values.toHexString === 'function') {
      return values.toHexString();
    }

    if (Array.isArray(values)) {
      return values.map(item => processFormValues(item));
    }

    const processed: any = {};
    for (const key in values) {
      if (Object.prototype.hasOwnProperty.call(values, key)) {
        processed[key] = processFormValues(values[key]);
      }
    }
    return processed;
  }

  return values;
};

const PdfFormatForm = ({
  templateName,
  goBack,
  template,
  templatePdfId,
}: {
  templateName: string;
  goBack: () => void;
  template: TemplateJson;
  templatePdfId: string;
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  useEffect(() => {
    form.setFieldsValue(template);
  }, [template, form]);

  const onFinish = async (values: Partial<TemplateJson>) => {
    try {
      const processedValues = processFormValues(values);
      const updatedFields = getUpdatedFields(processedValues, template);

      if (Object.keys(updatedFields).length === 0) {
        message.info('No changes detected');
        return;
      }

      // Clone updatedFields to avoid mutating if it's used elsewhere (though here it's result of getUpdatedFields)
      const finalUpdatedFields = { ...updatedFields };
      let logoImage = undefined;
      let watermarkImage = undefined;

      if (finalUpdatedFields.logoSettings) {
        // Extract images
        const {
          logoImage: l,
          watermarkImage: w,
          ...restLogoSettings
        } = finalUpdatedFields.logoSettings;
        logoImage = l;
        watermarkImage = w;

        // Update logoSettings in final object to exclude images
        if (Object.keys(restLogoSettings).length > 0) {
          finalUpdatedFields.logoSettings = restLogoSettings as any;
        } else {
          // If only images were updated, remove logoSettings entirely from nested structure
          delete finalUpdatedFields.logoSettings;
        }
      }

      const payloadData = {
        formatType: templateName,
        logoImage,
        watermarkImage,
        ...finalUpdatedFields,
      };

      const formData = formDataGenerator(payloadData);

      await dispatch(
        updatePdfTemplate({
          data: formData,
          templatePdfId: templatePdfId,
        })
      ).unwrap();
      message.success('Template updated successfully');
      goBack();
    } catch (error) {
      message.error(error || 'Failed to update template');
    }
  };

  const handleFileChange = (info: any, type: 'logo' | 'watermark') => {
    const file = info.file?.originFileObj || info.file;
    if (file) {
      // Ensure file is a Blob/File before reading
      if (file instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
      }
    }
    return file;
  };

  const selectOption = [
    {
      value: 'header',
      label: 'Header',
    },
    {
      value: 'footer',
      label: 'Footer',
    },
    {
      value: 'none',
      label: 'None',
    },
  ];

  const fontSize = [8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30];

  return (
    <div className="bg-white p-6 rounded-md shadow-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Template Name - {templateName}</h3>
      </div>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Divider orientation="left">Show Details</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Account" name={['showDetails', 'account']}>
              <Input placeholder="Account" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Address" name={['showDetails', 'address']}>
              <Select placeholder="Select" options={selectOption} />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Contact" name={['showDetails', 'contact']}>
              <Select placeholder="Select" options={selectOption} />
            </Form.Item>
          </Col>

          <Col span={6}>
            {templateName !== 'Color Format' && templateName !== 'Maintenance_format' && (
              <Form.Item label="Bank Information" name={['showDetails', 'bankInformation']}>
                <Select placeholder="Select" options={selectOption} />
              </Form.Item>
            )}
            {templateName === 'Color_format' && (
              <Form.Item label="User Label Information">
                <InputSwitch name="userlabelinformation" label="" />
              </Form.Item>
            )}
          </Col>
        </Row>

        <Divider orientation="left">Page Header</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Background Color" name={['pageHeader', 'backgroundColor']}>
              <ColorPicker />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Font Color" name={['pageHeader', 'fontColor']}>
              <ColorPicker defaultValue="#000000" />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Font Size" name={['pageHeader', 'fontSize']}>
              <Select defaultValue={10}>
                {fontSize.map(s => (
                  <Option key={s}>{s}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          {templateName !== 'Variation Format' && (
            <Col span={6}>
              <Form.Item label="Title" name={['pageHeader', 'title']}>
                <Input />
              </Form.Item>
            </Col>
          )}
        </Row>
        <Divider orientation="left">Page Footer</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Background Color" name={['pageFooter', 'backgroundColor']}>
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Font Color" name={['pageFooter', 'fontColor']}>
              <ColorPicker />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Font Size" name={['pageFooter', 'fontSize']}>
              <Select defaultValue={10}>
                {fontSize.map(size => (
                  <Option key={size}>{size}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">Logo Settings</Divider>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Alignment" name={['logoSettings', 'alignment']}>
              <Select
                defaultValue="left"
                options={[
                  { value: 'left', label: 'Left' },
                  { value: 'center', label: 'Center' },
                  { value: 'right', label: 'Right' },
                ]}
              />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Height" name={['logoSettings', 'height']}>
              <InputNumber placeholder="130" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Width" name={['logoSettings', 'width']}>
              <InputNumber placeholder="150" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Padding" name={['logoSettings', 'padding']}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Logo Image"
              name={['logoSettings', 'logoImage']}
              valuePropName="file"
              getValueFromEvent={e => handleFileChange(e, 'logo')}
            >
              <Upload maxCount={1} beforeUpload={() => false} showUploadList={true} listType="text">
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Watermark Image"
              name={['logoSettings', 'watermarkImage']}
              valuePropName="file"
              getValueFromEvent={e => handleFileChange(e, 'watermark')}
            >
              <Upload maxCount={1} beforeUpload={() => false} showUploadList={true} listType="text">
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        {templateName !== 'Receipt Format' && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Divider orientation="left">List Items - Header</Divider>
              </Col>
              {templateName !== 'Maintenance Format' && (
                <Col span={12}>
                  <Divider orientation="left">List Items - Footer</Divider>
                </Col>
              )}
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Background Color"
                  name={['listItems', 'header', 'backgroundColor']}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color" name={['listItems', 'header', 'fontColor']}>
                  <ColorPicker />
                </Form.Item>
              </Col>

              {templateName !== 'Maintenance Format' && (
                <>
                  <Col span={6}>
                    <Form.Item
                      label=" Background Color"
                      name={['listItems', 'footer', 'backgroundColor']}
                    >
                      <ColorPicker />
                    </Form.Item>
                  </Col>

                  <Col span={6}>
                    <Form.Item label="Font Color" name={['listItems', 'footer', 'fontColor']}>
                      <ColorPicker />
                    </Form.Item>
                  </Col>
                </>
              )}
            </Row>
          </>
        )}
        {templateName === 'Variation Format' && (
          <>
            <Divider orientation="left">Sub Items - Header</Divider>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Background Color"
                  name={['subItems', 'header', 'backgroundColor']}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color" name={['subItems', 'header', 'fontColor']}>
                  <ColorPicker />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Show Unit Option" name={['subItems', 'showUnitOption']}>
                  <Select defaultValue="hide">
                    <Option value="hide">Don't show units</Option>
                    <Option value="show">Show units</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {templateName === 'Color Format' && (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Divider orientation="left">Cost Type - Standard</Divider>
              </Col>
              <Col span={12}>
                <Divider orientation="left">Cost Type - Upgrade</Divider>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Background Color"
                  name={['costTypeStyles', 'standard', 'backgroundColor']}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Font Color" name={['costTypeStyles', 'standard', 'fontColor']}>
                  <ColorPicker />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item
                  label=" Background Color"
                  name={['costTypeStyles', 'upgrade', 'backgroundColor']}
                >
                  <ColorPicker />
                </Form.Item>
              </Col>

              <Col span={6}>
                <Form.Item label="Font Color" name={['costTypeStyles', 'upgrade', 'fontColor']}>
                  <ColorPicker />
                </Form.Item>
              </Col>
            </Row>
          </>
        )}

        {templateName !== 'Color Format' && templateName !== 'Maintenance Format' && (
          <Form.Item label="Bank Header Text" name={['bankDetails', 'headerText']}>
            <Input placeholder="Bank Details" />
          </Form.Item>
        )}
        {templateName !== 'Maintenance Format' && (
          <Form.Item label="Custom Text" name={['customText']}>
            <TextArea rows={4} />
          </Form.Item>
        )}
        {templateName === 'Variation Format' && (
          <Form.Item label="Total Cost Custom Text" name={['totalCostCustomText']}>
            <TextArea rows={4} />
          </Form.Item>
        )}

        {templateName === 'Invoice Format' && (
          <Form.Item
            label={
              <div className="flex items-center gap-1">
                {' '}
                Initial Deposit Description <IconInfoSquareFilled size={15} />{' '}
              </div>
            }
          >
            <TextArea rows={4} />
          </Form.Item>
        )}

        {(templateName === 'Color Format' || templateName === 'Variation Format') && (
          <InputSwitch name={['enableBuilderSignature']} label="Enable Builder Signature" />
        )}

        <div className="flex gap-2 mt-4 justify-end">
          <Button type="default" onClick={goBack}>
            cancel
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default PdfFormatForm;
