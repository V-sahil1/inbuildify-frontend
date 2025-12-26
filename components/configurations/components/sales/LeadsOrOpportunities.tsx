'use client';
import React, { useEffect } from 'react';
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
import { fetchRole } from '@redux/feature/admin/role/roleThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { Title, Text } = Typography;

export const LeadsOrOpportunities: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { setting, status } = useAppSelector((state: RootState) => state.sales.setting);
  const { role, status: roleStatus } = useAppSelector((state: RootState) => state.role);
  const roleOptions =
    role &&
    role.map(role => ({
      label: role.name,
      value: role.roleId,
    }));
  useEffect(() => {
    if (setting) {
      form.setFieldsValue(setting);
    }
    if (status.fetch === Status.IDLE) {
      fetchData();
    }
    if (roleStatus === Status.IDLE) {
      fetchRoles();
    }
  }, [status.fetch, roleStatus]);

  async function fetchData() {
    try {
      await dispatch(fetchSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch roles');
    }
  }
  async function fetchRoles() {
    try {
      await dispatch(fetchRole()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch roles');
    }
  }

  const onFinish = async (values: setting) => {
    try {
      const updatedFields = getUpdatedFields<setting>(values, setting);
      await dispatch(
        updateSetting({ data: updatedFields, id: setting.salesModuleSettingsId })
      ).unwrap();
      message.success('Setting updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update Setting');
    }
  };

  return (
    <div className="p-6 rounded-lg">
      <Form form={form} layout="vertical" onFinish={onFinish} initialValues={setting}>
        <div className="mb-6 space-y-4">
          <Form.Item
            label={
              <div>
                <Text strong>Allow create Duplicate Lead</Text>
                <div className="text-gray-500 text-xs">
                  System will allow to create duplicate leads from REA
                </div>
              </div>
            }
            name="allowDuplicateLeads"
            valuePropName="checked"
          >
            <Switch disabled={status.update === Status.PENDING} />
          </Form.Item>

          <Form.Item
            label={
              <div>
                <Text strong>Send Email when new Lead is created</Text>
              </div>
            }
            name="sendEmailOnNewLead"
            valuePropName="checked"
          >
            <Switch disabled={status.update === Status.PENDING} />
          </Form.Item>

          <Form.Item
            label={
              <div>
                <Text strong>Show Common Folders</Text>
                <div className="text-gray-500 text-xs">
                  When turned On, shows the common folders under the documents section of the Lead /
                  Opportunity page
                </div>
              </div>
            }
            name="showCommonFolders"
            valuePropName="checked"
          >
            <Switch disabled={status.update === Status.PENDING} />
          </Form.Item>
        </div>

        <hr className="my-6" />

        <Title level={5}>Optional Settings</Title>

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
              <Select
                placeholder="Choose Mandatory Option"
                options={leadMandatoryOption}
                disabled={status.update === Status.PENDING}
              />
            </Form.Item>

            <Form.Item
              label="Sales Won Button Text"
              name="salesWonButtonText"
              rules={[{ required: true, message: 'Please enter sales won button text' }]}
            >
              <Input placeholder="Won" disabled={status.update === Status.PENDING} />
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
              <Select
                placeholder="Choose Roles"
                mode="multiple"
                showSearch
                disabled={status.update === Status.PENDING}
              >
                {roleOptions.map(role => (
                  <Select.Option key={role.value} value={role.value}>
                    {role.label}
                  </Select.Option>
                ))}
              </Select>
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
              <Radio.Group disabled={status.update === Status.PENDING}>
                <Radio value="sq_ft">sq ft</Radio>
                <Radio value="sq_m2">sq m2</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-right mt-4">
          <Button type="primary" htmlType="submit" loading={status.update === Status.PENDING}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
