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
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { Text, Paragraph, Title } = Typography;

const SettingsPage = () => {
  const [form] = Form.useForm();
  const [negativeColor, setNegativeColor] = useState<string | null>(null);
  const [isChange, setIsChange] = useState(false);
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
      const { isUpdated, updatedFields } = getUpdatedFields<GeneralSetting>(values, settings);
      if (!isUpdated) {
        message.info('No changes detected');
        return;
      }
      await dispatch(updateGeneralSetting({ data: updatedFields, id: settings.id })).unwrap();
      message.success('Setting updated successfully');
      setIsChange(false);
    } catch (error) {
      message.error(error || 'Failed to update setting');
    }
  };

  const handleValueChange = (_, allValues: GeneralSetting) => {
    const { isUpdated } = getUpdatedFields(allValues, settings);
    setIsChange(isUpdated);
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    setNegativeColor(hex);
    form.setFieldsValue({ negativeValueColor: hex });
    setIsChange(hex !== settings?.negativeValueColor);
  };

  const renderDescription = (mainText: string, noteText?: string) => (
    <>
      <Paragraph className="text-font-color-100 text-[13px] mt-1">{mainText}</Paragraph>
      {noteText && (
        <Paragraph className="text-xs mt-[-6px] text-font-color-400">Note: {noteText}</Paragraph>
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
        initialValues={settings}
        onValuesChange={handleValueChange}
        disabled={status.update === Status.PENDING}
      >
        {/* 1. Referral Partner Notifications */}
        <div className="flex gap-2 items-center">
          <Form.Item name="notificationReferralPartner" valuePropName="checked" className="mb-1">
            <Switch />
          </Form.Item>
          <Text strong className="ml-2 text-font-color">
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
            <Switch />
          </Form.Item>
          <Text strong className="ml-2 text-font-color">
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
            <Input.Password placeholder="************" />
          </Form.Item>
        )}

        <div className="border-t border-gray-200 my-6" />
        <div className="flex gap-2 items-center">
          <Form.Item name="roundOfCost" valuePropName="checked" className="mb-1">
            <Switch />
          </Form.Item>
          <Text strong className="ml-2 text-font-color">
            Round off Costs
          </Text>
        </div>

        {renderDescription(
          'Enable this option to round off the costs of individual items and the total cost in Quotations, Colors, Variations, and Invoices.'
        )}

        <div className="border-t border-gray-200 my-6" />
        <div className="flex items-center gap-2">
          <Form.Item name="negativeValueShow" valuePropName="checked" className="mb-1">
            <Switch />
          </Form.Item>
          <Text strong className="ml-2 text-font-color">
            Show Negative Values as Minus or in Brackets
          </Text>
        </div>

        {renderDescription(
          'When turned ON, Negative values will be displayed with a minus sign (e.g., -$100). When turned OFF, Negative values will be displayed within brackets (e.g., ($100)).',
          'This option lets you choose how negative values are displayed across the application.'
        )}

        <div className="mt-4 mb-6">
          <Text strong className="block mb-2 text-font-color">
            Negative Values Font Color
          </Text>
          <Row gutter={16} align="middle">
            <Col>
              <Input
                type="color"
                value={form.getFieldValue('negativeValueColor')}
                onChange={handleColorChange}
                className="w-12 h-8 p-0 border border-gray-300 rounded cursor-pointer"
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
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="border-t border-gray-200 my-6" />

        <Text strong className="block mb-1 text-font-color">
          Show Reference ID in PDF
        </Text>
        <Paragraph className="text-[13px] mb-4 text-font-color-400">
          This setting will be applied for all PDF formats except custom questions. Custom questions
          will have option to add Job ID in quotation format settings.
        </Paragraph>

        <Row gutter={24}>
          <Col span={8}>
            <Form.Item name="showReferenceIdInPdf" label="Reference Type">
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
                  <Form.Item name="jobIdLabel" label="Label of Job ID" rules={[
                    {
                      validator: (_, value: string) => {
                        if (!value) return Promise.resolve();
                        if (value.trim().length > 100)
                          return Promise.reject('Reference ID must be 100 characters or less.');
                        return Promise.resolve();
                      },
                    },
                  ]}>
                    <Input placeholder="Job No." />
                  </Form.Item>
                </Col>
              );
            }}
          </Form.Item>
        </Row>

        {isChange && (
          <Row justify="end" className="mt-10">
            <Col>
              <Button
                type="primary"
                size="large"
                htmlType="submit"
                loading={status.update === Status.PENDING}
                disabled={status.update === Status.PENDING}
              >
                Save Settings
              </Button>
            </Col>
          </Row>
        )}
      </Form>
    </div>
  );
};

export default SettingsPage;
