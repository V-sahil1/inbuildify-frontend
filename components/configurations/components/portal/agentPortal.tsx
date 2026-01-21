'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button, message } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchCustomerPortalInfo,
  updateCustomerPortalDetails,
} from '@redux/feature/admin/portal/customerPortal/customerPortalThunk';
import { Status } from '@lib/constants/enum';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { CustomerPortalInfo } from '@redux/feature/admin/portal/customerPortal/icustomerPortalState';

const AgentPortal = () => {
  const [form] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const dispatch = useAppDispatch();
  const { customer, status } = useAppSelector(state => state.portal.customerPortal);
  const fetchCustomerPortal = async () => {
    try {
      await dispatch(fetchCustomerPortalInfo()).unwrap();
    } catch (error) {
      message.error(error || 'failde to get customer portal details');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchCustomerPortal();
    }
    if (customer) {
      form.resetFields();
      form.setFieldsValue(customer);
    }
  }, [status.fetch, customer]);

  const handleValuesChange = (_, allValues: CustomerPortalInfo) => {
    const changed = Object.keys(allValues).some(key => allValues[key] !== customer?.[key]);
    setIsChanged(changed);
  };

  const handleSave = async () => {
    try {
      const formValues = form.getFieldsValue();
      const { isUpdated, updatedFields } = getUpdatedFields(formValues, customer || {});
      if (!isUpdated) {
        setIsChanged(false);
        return;
      }
      const formData = formDataGenerator(updatedFields);
      await dispatch(updateCustomerPortalDetails(formData)).unwrap();
      setIsChanged(false);
      message.success('Agent portal settings updated successfully');
    } catch (error) {
      message.error(error || 'failde to update agent portal details');
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <InputSwitch
          name="publishPackagesToAgentPortal"
          label="Publish Packages to Agent Portal"
          description={
            <div className="flex flex-col gap-2">
              When enabled, HL Packages can be published to the Agent Portal. Agents will see the
              packages based on their distribution—either visible to all agents or shared privately
              with specific agents.
            </div>
          }
        />

        {isChanged && (
          <div className="text-right mt-6">
            <Button type="primary" onClick={() => setShowConfirm(true)}>
              Save Changes
            </Button>
          </div>
        )}
      </Form>

      <ConfirmationContentModal
        title="Confirm Update"
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onSubmit={() => {
          handleSave();
          setShowConfirm(false);
        }}
        okText="Yes"
        cancelText="No"
        content={<p>Are you sure you want to update this setting?</p>}
      />
    </div>
  );
};

export default AgentPortal;
