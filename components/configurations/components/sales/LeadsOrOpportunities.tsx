'use client';
import React, { useEffect, useState } from 'react';
import {
  Form,
  Switch,
  Input,
  Select,
  Radio,
  Button,
  Row,
  Col,
  Typography,
  Tooltip,
  message,
} from 'antd';
import { IconInfoCircle } from '@tabler/icons-react';
import { leadMandatoryOption } from 'data/configuration/salesData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { RootState } from '@redux/feature/store';
import { fetchSetting, updateSetting } from '@redux/feature/admin/sales/setting/settingThunk';
import { setting } from '@redux/feature/admin/sales/setting/ISettingState';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { useRoleHook } from '@hooks/useRoleHook';

const { Title, Text } = Typography;

export const LeadsOrOpportunities: React.FC = () => {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const dispatch = useAppDispatch();
  const { setting, status } = useAppSelector((state: RootState) => state.sales.setting);
  const { roleOptions } = useRoleHook();

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
    if (setting) {
      form.setFieldsValue(setting);
    }
  }, [status.fetch]);

  async function fetchData() {
    try {
      await dispatch(fetchSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch roles');
    }
  }

  const onFinish = async (values: setting) => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields<setting>(values, setting);
      if (!isUpdated) {
        message.info('No changes detected');
        return;
      }
      await dispatch(updateSetting(updatedFields)).unwrap();
      message.success('Setting updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to update Setting');
    }
  };

  const handleChange = (_, allValue) => {
    const { isUpdated } = getUpdatedFields(allValue, setting);
    setIsChanged(isUpdated);
  };

  return (
    <div className="p-6 rounded-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={setting}
        onValuesChange={handleChange}
        disabled={status.update === Status.PENDING}
      >
        <div className="mb-6 space-y-4">
          <Form.Item
            label={
              <div>
                <Text strong className="text-font-color">
                  Allow create Duplicate Lead
                </Text>
                <div className=" text-xs text-font-color-100">
                  System will allow to create duplicate leads from REA
                </div>
              </div>
            }
            name="allowDuplicateLeads"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label={
              <div>
                <Text strong className="text-font-color">
                  Send Email when new Lead is created
                </Text>
              </div>
            }
            name="sendEmailOnNewLead"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label={
              <div>
                <Text strong className="text-font-color">
                  Show Common Folders
                </Text>
                <div className="text-font-color-100 text-xs">
                  When turned On, shows the common folders under the documents section of the Lead /
                  Opportunity page
                </div>
              </div>
            }
            name="showCommonFolders"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
        </div>

        <hr className="my-6" />

        <Title level={5} className="text-font-color">
          Optional Settings
        </Title>

        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              label={
                <div className="flex gap-2">
                  Mandatory Option for Lead{' '}
                  <Tooltip title="Lead fields that must be filled">
                    <IconInfoCircle style={{ color: '#1890ff' }} />
                  </Tooltip>
                </div>
              }
              name="leadMandatoryOption"
              rules={[{ required: true, message: 'Please select mandatory option' }]}
            >
              <Select placeholder="Choose Mandatory Option" options={leadMandatoryOption} />
            </Form.Item>

            <Form.Item
              label="Sales Won Button Text"
              name="salesWonButtonText"
              rules={[
                {
                  validator: (_: any, value: string) => {
                    if (!value) {
                      return Promise.resolve();
                    }
                    if (value.startsWith(' ') || value.endsWith(' ')) {
                      return Promise.reject('Sales won button text cannot start or end with spaces');
                    }
                    return Promise.resolve();
                  },
                },
                { required: true, message: 'Please enter sales won button text' },
                { min: 5, message: 'Sales won button text must be at least 5 characters long' },
                { max: 100, message: 'Sales won button text cannot exceed 100 characters.' },
              ]}
            >
              <Input placeholder="Won" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label={
                <div className="flex gap-2">
                  Roles for Sales Person{' '}
                  <Tooltip title="Choose which roles apply for salesperson">
                    <IconInfoCircle style={{ color: '#1890ff' }} />
                  </Tooltip>
                </div>
              }
              name="roleId"
              rules={[{ required: true, message: 'Please select roles' }]}
            >
              <Select placeholder="Choose Roles" mode="multiple" showSearch options={roleOptions} />
            </Form.Item>

            <Form.Item
              label={
                <div className="flex gap-2">
                  Unit for House Size{' '}
                  <Tooltip title="Select measurement unit">
                    <IconInfoCircle style={{ color: '#1890ff' }} />
                  </Tooltip>
                </div>
              }
              name="houseSizeUnit"
              rules={[{ required: true, message: 'Please select measurement unit' }]}
            >
              <Radio.Group
                options={[
                  { label: 'sq ft', value: 'sq_ft' },
                  { label: 'sq m2', value: 'sq_m2' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>

        {isChanged && (
          <Form.Item className="text-right mt-4">
            <Button type="primary" htmlType="submit" loading={status.update === Status.PENDING}>
              Save
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
