'use client';
import React, { useState } from 'react';
import { Switch, Input, Select, Row, Col, Typography, Form, Button } from 'antd';
import { configurationSettingsOptions } from 'data/configuration/ConfigrationData';

const { Text, Paragraph, Title } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [isPasswordProtected, setIsPasswordProtected] = useState(true);
  const [negativeColor, setNegativeColor] = useState('#f00000');

  const onFinish = (values: any) => {
    console.log('Updated settings:', {
      ...values,
      negativeValuesColor: negativeColor,
    });
  };

  const handleColorChange = (e: any) => {
    const hex = e.target.value.toUpperCase();
    setNegativeColor(hex);
    form.setFieldsValue({ negativeValuesColorText: hex });
  };

  const renderDescription = (mainText: string, noteText?: string) => (
    <>
      <Paragraph className="text-gray-600 text-[13px] mt-1">{mainText}</Paragraph>
      {noteText && (
        <Paragraph type="secondary" className="text-xs mt-[-6px] text-gray-500">
          Note: {noteText}
        </Paragraph>
      )}
    </>
  );

  return (
    <div>
      <Title level={2} className="mb-8">
        Document & Workflow Settings
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          referralNotifications: false,
          restrictPDFs: true,
          roundOffCosts: true,
          showNegativeValues: true,
          negativeValuesColorText: '#F00000',
          referenceIdType: 'doc_id_job_id',
          labelOfJobId: '',
        }}
      >
        {/* 1. Referral Partner Notifications */}
        <Form.Item name="referralNotifications" valuePropName="checked" className="mb-1">
          <Switch />
          <Text strong className="ml-2">
            Send All Email/SMS Notifications to Referral Partner Instead of Customer
          </Text>
        </Form.Item>

        {renderDescription(
          'When turned ON, All mails will be send to Referral Partner.',
          'Toggle button will not impact on following mails - Send/Resend login credential to customer, Reset Password, Inactive/Active customer portal, Scheduler mails.'
        )}

        <div className="border-t border-gray-200 my-6" />

        <Form.Item name="restrictPDFs" valuePropName="checked" className="mb-1">
          <Switch onChange={setIsPasswordProtected} />
          <Text strong className="ml-2">
            Restrict PDFs with Password Protection
          </Text>
        </Form.Item>

        {renderDescription(
          'When turned ON and a password is provided, All PDFs will be password-protected, and access will require the password.',
          'When turned ON and no password is provided, All PDFs will be secured, preventing copying and editing.'
        )}

        {isPasswordProtected && (
          <Form.Item
            name="pdfPassword"
            label="Password"
            className="max-w-[300px] mt-4"
            rules={[{ required: true, message: 'Please set a password' }]}
          >
            <Input.Password placeholder="************" />
          </Form.Item>
        )}

        <div className="border-t border-gray-200 my-6" />

        <Form.Item name="roundOffCosts" valuePropName="checked" className="mb-1">
          <Switch />
          <Text strong className="ml-2">
            Round off Costs
          </Text>
        </Form.Item>

        {renderDescription(
          'Enable this option to round off the costs of individual items and the total cost in Quotations, Colors, Variations, and Invoices.'
        )}

        <div className="border-t border-gray-200 my-6" />

        <Form.Item name="showNegativeValues" valuePropName="checked" className="mb-1">
          <Switch />
          <Text strong className="ml-2">
            Show Negative Values as Minus or in Brackets
          </Text>
        </Form.Item>

        {renderDescription(
          'When turned ON, Negative values will be displayed with a minus sign (e.g., -$100). When turned OFF, Negative values will be displayed within brackets (e.g., ($100)).',
          'This option lets you choose how negative values are displayed across the application.'
        )}

        <div className="mt-4 mb-6">
          <Text strong className="block mb-2">
            Negative Values Font Color
          </Text>
          <Row gutter={16} align="middle">
            <Col>
              <Input
                type="color"
                value={negativeColor}
                onChange={handleColorChange}
                className="w-12 h-8 p-0 border border-gray-300 rounded cursor-pointer"
              />
            </Col>
            <Col>
              <Form.Item
                name="negativeValuesColorText"
                noStyle
                rules={[
                  {
                    pattern: /^#([0-9A-F]{3}){1,2}$/i,
                    message: 'Invalid hex code',
                  },
                ]}
              >
                <Input
                  value={negativeColor}
                  onChange={handleColorChange}
                  className="w-[100px] uppercase"
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="border-t border-gray-200 my-6" />

        <Text strong className="block mb-1">
          Show Reference ID in PDF
        </Text>
        <Paragraph type="secondary" className="text-[13px] mb-4">
          This setting will be applied for all PDF formats except custom questions. Custom questions
          will have option to add Job ID in quotation format settings.
        </Paragraph>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="referenceIdType" label="Reference Type">
              <Select options={configurationSettingsOptions} />
            </Form.Item>
          </Col>

          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) => prev.referenceIdType !== curr.referenceIdType}
          >
            {({ getFieldValue }) => {
              const type = getFieldValue('referenceIdType');
              return type === 'none' || type === 'doc_id' ? null : (
                <Col span={8}>
                  <Form.Item name="labelOfJobId" label="Label of Job ID">
                    <Input placeholder="Job No." />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>
        </Row>

        <Row justify="end" className="mt-10">
          <Col>
            <Button type="primary" size="large" htmlType="submit">
              Save Settings
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SettingsPage;
