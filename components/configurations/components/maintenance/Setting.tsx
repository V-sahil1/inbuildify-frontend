'use client';
import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Typography, Tooltip, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchMaintenanceSetting,
  updateMaintenanceSetting,
} from '@redux/feature/admin/maintenance/maintenanceSetting/maintenanceSettingThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { useRoleHook } from '@hooks/useRoleHook';

const { Text } = Typography;
const { Option } = Select;

export const SettingPage = () => {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const { roleOptions, isLoading } = useRoleHook();
  const dispatch = useAppDispatch();
  const { maintenanceSetting, status } = useAppSelector(
    state => state.maintenance.maintenanceSetting
  );

  const fetchMaintenanceSettingData = async () => {
    try {
      await dispatch(fetchMaintenanceSetting());
    } catch (error) {
      message.error(error || 'failed to fetch maintenance setting');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchMaintenanceSettingData();
    }
  }, [dispatch, status.fetch]);

  useEffect(() => {
    if (status.fetch === Status.SUCCESS && maintenanceSetting) {
      form.setFieldsValue(maintenanceSetting);
    }
  }, [maintenanceSetting, status.fetch, form]);

  const handleValuesChange = (_, allValues) => {
    if (!maintenanceSetting) return;
    const { isUpdated } = getUpdatedFields(allValues, maintenanceSetting);
    setIsChanged(isUpdated);
  };

  const handleSave = async () => {
    try {
      if (!maintenanceSetting) return;
      const currentValues = form.getFieldsValue();
      const { isUpdated, updatedFields } = getUpdatedFields(currentValues, maintenanceSetting);

      if (!isUpdated) {
        setIsChanged(false);
        return;
      }

      await dispatch(updateMaintenanceSetting(updatedFields)).unwrap();
      setIsChanged(false);
      message.success('Maintenance settings updated successfully');
    } catch (err) {
      message.error(err || 'Failed to update settings');
    }
  };

  const supplier = Form.useWatch('supplierEnabled', form);
  return (
    <div className="">
      <Form
        layout="vertical"
        form={form}
        initialValues={maintenanceSetting}
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
            <InputSwitch label="Area" name="areaEnabled" />
            <InputSwitch label="Supplier" name="supplierEnabled" />
            {supplier && (
              <InputSwitch
                label="Allow to complete the request even the supplier is not responded"
                name="allowCompletionWithoutSupplierResponse"
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
            <InputSwitch label="Request Date" name="requestDateEnabled" />
            <InputSwitch label="Task Date" name="taskDateEnabled" />
            <InputSwitch label="Repair Cost" name="repairCostEnabled" />
            <InputSwitch label="Hours Spent" name="hoursSpentEnabled" />
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
                  { label: 'Handover Date', value: 'handover_date' },
                  { label: 'Occupancy Permit date', value: 'occupancy_permit_date' },
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
              name="maintenanceDurationDays"
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
              name="maintenancePeriodDays"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <span>
                  Roles for Supervisor <Tooltip title="Assign roles for supervisor view" />
                </span>
              }
              name="supervisorRoles"
            >
              <Select
                placeholder="Choose Roles"
                mode="multiple"
                options={roleOptions}
                loading={isLoading}
              ></Select>
            </Form.Item>
          </div>
        </div>

        {isChanged && (
          <div className="flex justify-end mt-6">
            <Button type="primary" onClick={handleSave} loading={status.update === Status.PENDING}>
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
