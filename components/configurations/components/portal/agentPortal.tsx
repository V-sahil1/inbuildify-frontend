'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';

const AgentPortal = () => {
  const [form] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  const initialValues = {
    publishToAgentPortal: true,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  const handleValuesChange = (_, allValues) => {
    const changed = Object.keys(initialValues).some(key => allValues[key] !== initialValues[key]);
    setIsChanged(changed);
  };

  const handleSave = () => {
    console.log('✅ Agent Portal Saved Settings:', form.getFieldsValue());
    setIsChanged(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>
        <InputSwitch
          name="publishToAgentPortal"
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
