'use client';

import React, { useEffect, useState } from 'react';
import { Form, Button } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';

const AgentPortal = () => {
  const [form] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);

  const initialValues = {
    publishToAgentPortal: true,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  const handleSave = () => {
    console.log("✅ Agent Portal Saved Settings:", form.getFieldsValue());
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form form={form} layout="vertical">

        <InputSwitch
          name="publishToAgentPortal"
          label="Publish Packages to Agent Portal"
          description={
            <div className="flex flex-col gap-2">
              When enabled, HL Packages can be published to the Agent Portal. Agents will see the published packages based on their distribution—either visible to all agents on the portal or shared privately with specific agents.
            </div>
          }
        />

        <div className="text-right mt-6">
          <Button type="primary" onClick={() => setShowConfirm(true)}>
            Save Changes
          </Button>
        </div>
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
        content={
          <div>
            <p>Are you sure you want to update this setting?</p>
          </div>
        }
      />
    </div>
  );
};

export default AgentPortal;
