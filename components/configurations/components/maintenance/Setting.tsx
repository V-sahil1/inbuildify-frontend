import React, { useState } from 'react';
import { Form, Input, Select, Button, Typography, Tooltip } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';

const { Text } = Typography;
const { Option } = Select;

export const SettingPage = () => {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);

  const initialValues = {
    area: false,
    supplier: false,
    requestDate: false,
    taskDate: false,
    repairCost: false,
    hoursSpent: false,
    maintenanceStartDate: '',
    handoverDate: '',
    maintenanceDuration: '1 days',
    maintenancePeriod: '365 days',
    rolesForSupervisor: undefined,
  };

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(initialValues).some(key => initialValues[key] !== allValues[key]);
    setIsChanged(changed);
  };

  const handleSave = () => {
    console.log('Saved Values:', form.getFieldsValue());
    setIsChanged(false);
  };

  const supplier = Form.useWatch('supplier', form);
  return (
    <div className="">
      <Form
        layout="vertical"
        form={form}
        initialValues={initialValues}
        onValuesChange={handleValuesChange}
      >
        <div className="mb-6">
          <Text strong className="block text-lg mb-1">
            Required Options
          </Text>
          <Text type="secondary" className="text-sm">
            Based on the selection of the below toggles, the options will be available on the
            maintenance screen.
          </Text>
        </div>

        <div className="">
          {/* Left column — Switches */}
          <div>
            {/* when this switch is true at that time the sidebar in one more sidebar option will be added as the maintenance area  */}
            <InputSwitch label="Area" name="area" />
            <InputSwitch label="Supplier" name="supplier" />
            {supplier && (
              <InputSwitch
                label="Allow to complete the request even the supplier is not responded"
                name="allowToCompleteRequest"
                description={
                  <div className="text-[13px]">
                    <p>
                      {' '}
                      When the toggle is ON-System will allow the user to complete the Request even
                      if the booking status is "Pending Acceptance".
                    </p>
                    <p>
                      When the toggle is OFF - System will not allow the user to complete the
                      Request if the booking status is "Pending Acceptance".{' '}
                    </p>
                    <p>
                      User has to change the status to "Manually Accepted" and then complete the
                      Request.
                    </p>
                  </div>
                }
              />
            )}
            <InputSwitch label="Request Date" name="requestDate" />
            <InputSwitch label="Task Date" name="taskDate" />
            <InputSwitch label="Repair Cost" name="repairCost" />
            <InputSwitch label="Hours Spent" name="hoursSpent" />
          </div>

          {/* Right column — Other fields */}
          <div className="">
            <Form.Item
              label={
                <span>
                  Maintenance Start Date <Tooltip title="Starting date for maintenance" />
                </span>
              }
              name="maintenanceStartDate"
            >
              <Select
                placeholder="select"
                options={[
                  { label: 'Handover Date', value: 'handoverDate' },
                  { label: 'Occupancy Permit date', value: 'occupancyPermitDate' },
                ]}
              />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Maintenance Duration
                  <Tooltip title="Default period for maintenance tasks" />
                </span>
              }
              name="maintenanceDuration"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Maintenance Period
                  <Tooltip title="Default period for maintenance tasks" />
                </span>
              }
              name="maintenancePeriod"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Roles for Supervisor <Tooltip title="Assign roles for supervisor view" />
                </span>
              }
              name="rolesForSupervisor"
            >
              <Select placeholder="Choose Roles">
                <Option value="manager">Manager</Option>
                <Option value="technician">Technician</Option>
                <Option value="inspector">Inspector</Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {isChanged && (
          <div className="flex justify-end mt-6">
            <Button type="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
