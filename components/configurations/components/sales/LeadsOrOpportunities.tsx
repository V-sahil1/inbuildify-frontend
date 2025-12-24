'use client';
import React, { useEffect } from 'react';
import { Form, Switch, Input, Select, Radio, Button, Row, Col, Typography, Tooltip, message } from 'antd';
import { IconInfoCircle } from '@tabler/icons-react';
import { leadMandatoryOption } from 'data/configuration/salesData';
import { rolesOfRoleMapping } from 'data/configuration/ConfigrationData';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { RootState } from '@redux/feature/store';
import { fetchSetting, updateSetting } from '@redux/feature/admin/sales/setting/settingThunk';

const { Title, Text } = Typography;

export const LeadsOrOpportunities: React.FC = () => {
  const [form] = Form.useForm();
  const dispatch=useAppDispatch();
  const {setting,status} = useAppSelector((state: RootState) => state.sales.setting)

  useEffect(() => {
    async function fetchData() {
      if (status.fetch === Status.IDLE) {
        await dispatch(fetchSetting()).unwrap();
      }
    }
    fetchData();
  }, []);

  console.log('setting',setting)
  const onFinish = async(values) => {
    console.log('Saved:', values);
    try{
      await dispatch(updateSetting({data:values,id:setting.salesModuleSettingsId})).unwrap()
      message.success('Setting updated successfully')
    }
    catch(error){
      message.error(error || 'Failed to update Setting')
    }
  };

  return (
    <div className="p-6 rounded-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={setting}
      >
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
            initialValue={false}
          >
            <Switch />
          </Form.Item>

          <Form.Item
            label={
              <div>
                <Text strong>Send Email when new Lead is created</Text>
              </div>
            }
            name="sendEmailOnNewLead"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
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
            initialValue={false}
          >
            <Switch />
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
            >
              <Select placeholder="Choose Mandatory Option" options={leadMandatoryOption} />
            </Form.Item>

            <Form.Item label="Sales Won Button Text" name="salesWonButtonText">
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
            >
              <Select placeholder="Choose Roles" mode="multiple" showSearch>
                {rolesOfRoleMapping.map(role => (
                  <Select.Option key={role} value={role}>
                    {role}
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
            >
              <Radio.Group>
                <Radio value="sq">sq</Radio>
                <Radio value="m²">m²</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item className="text-right mt-4">
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
