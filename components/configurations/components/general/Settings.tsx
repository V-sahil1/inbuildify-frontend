'use client';
import React, { useEffect, useState } from 'react';
import { Switch, Input, Select, Row, Col, Typography, Form, Button, message } from 'antd';
import { configurationSettingsOptions } from 'data/configuration/ConfigrationData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchGeneralSetting,
  updateGeneralSetting,
} from '@redux/feature/admin/general/generalSetting/generalSettingThunk';
import { Status } from '@lib/constants/enum';
import { GeneralSetting } from '@redux/feature/admin/general/generalSetting/igeneralSettingState';
import { passwordRules } from '@lib/constants/formInputValidations';

const { Text, Paragraph, Title } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [negativeColor, setNegativeColor] = useState<string | null>(null);
  const { settings, status } = useAppSelector(state => state.general.generalSetting);
  const isPasswordProtected = Form.useWatch('pdfPasswordProtected', form);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchSetting();
    }
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [status.fetch]);
  async function fetchSetting() {
    try {
      await dispatch(fetchGeneralSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch Settings');
    }
  }
  const onFinish = async (values: GeneralSetting) => {
    try {
      const updatedValues = Object.keys(values).reduce((acc, key) => {
        if (values[key] !== settings[key]) {
          acc[key] = values[key];
        }
        return acc;
      }, {} as Partial<GeneralSetting>);
      if (Object.keys(updatedValues).length === 0) {
        message.info('No changes detected');
        return;
      }
      await dispatch(updateGeneralSetting({ data: updatedValues, id: settings.id })).unwrap();
      message.success('Setting updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update setting');
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setNegativeColor(hex);
    form.setFieldsValue({ negativeValueColor: hex });
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

      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={settings}>
        {/* 1. Referral Partner Notifications */}
        <div className="flex gap-2 items-center">
          <Form.Item name="notificationReferralPartner" valuePropName="checked" className="mb-1">
            <Switch disabled={status.update === Status.PENDING}/>
          </Form.Item>
          <Text strong className="ml-2">
            Send All Email/SMS Notifications to Referral Partner Instead of Customer
          </Text>
        </div>

        {renderDescription(
          'When turned ON, All mails will be send to Referral Partner.',
          'Toggle button will not impact on following mails - Send/Resend login credential to customer, Reset Password, Inactive/Active customer portal, Scheduler mails.'
        )}

        <div className="border-t border-gray-200 my-6" />
        <div className="flex gap-2 items-center">
          <Form.Item name="pdfPasswordProtected" valuePropName="checked" className="mb-1">
            <Switch disabled={status.update === Status.PENDING}/>
          </Form.Item>
          <Text strong className="ml-2">
            Restrict PDFs with Password Protection
          </Text>
        </div>

        {renderDescription(
          'When turned ON and a password is provided, All PDFs will be password-protected, and access will require the password.',
          'When turned ON and no password is provided, All PDFs will be secured, preventing copying and editing.'
        )}

        {isPasswordProtected && (
          <Form.Item
            name="pdfPassword"
            label="Password"
            className="max-w-[300px] mt-4"
            rules={passwordRules}
          >
            <Input.Password placeholder="************" disabled={status.update === Status.PENDING}/>
          </Form.Item>
        )}

        <div className="border-t border-gray-200 my-6" />
        <div className="flex gap-2 items-center">
          <Form.Item name="roundOfCost" valuePropName="checked" className="mb-1">
            <Switch disabled={status.update === Status.PENDING}/>
          </Form.Item>
          <Text strong className="ml-2">
            Round off Costs
          </Text>
        </div>

        {renderDescription(
          'Enable this option to round off the costs of individual items and the total cost in Quotations, Colors, Variations, and Invoices.'
        )}

        <div className="border-t border-gray-200 my-6" />
        <div className="flex items-center gap-2">
          <Form.Item name="negativeValueShow" valuePropName="checked" className="mb-1">
            <Switch disabled={status.update === Status.PENDING} />
          </Form.Item>
          <Text strong className="ml-2">
            Show Negative Values as Minus or in Brackets
          </Text>
        </div>

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
                value={form.getFieldValue('negativeValueColor')}
                onChange={handleColorChange}
                className="w-12 h-8 p-0 border border-gray-300 rounded cursor-pointer"
                disabled={status.update === Status.PENDING}
              />
            </Col>
            <Col>
              <Form.Item
                name="negativeValueColor"
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
                  disabled={status.update === Status.PENDING}
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
            <Form.Item name="showReferenceIdInPdf" label="Reference Type">
              <Select options={configurationSettingsOptions} disabled={status.update === Status.PENDING} />
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
                  <Form.Item name="jobIdLabel" label="Label of Job ID">
                    <Input placeholder="Job No." disabled={status.update === Status.PENDING} />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>
        </Row>

        <Row justify="end" className="mt-10">
          <Col>
            <Button type="primary" size="large" htmlType="submit" loading={status.update === Status.PENDING}>
              Save Settings
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SettingsPage;
