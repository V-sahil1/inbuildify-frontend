'use client';
import React, { useEffect, useState } from 'react';
import { Form, Button, InputNumber, Typography } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { IconUpload } from '@tabler/icons-react';

const { Text } = Typography;

export const CustomerPortal = () => {
  const [form] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const initialValues = {
    sendLoginCredentials: true,
    portalActiveDays: 365,
    sendEmailOnDeactivate: false,
    showSupervisorDetails: false,
    showBalanceToPay: false,
    addNotes: false,
    allowColorSelection: false,
    showColorCost: false,
    showConstructionStages: false,
    autoShareImages: false,
    showProgressTab: false,
    showInvoiceTab: false,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, []);

  const handleValuesChange = (_, allValues) => {
  const mergedValues = { ...initialValues, ...allValues };
  const changed = JSON.stringify(mergedValues) !== JSON.stringify(initialValues);
  setIsChanged(changed);
};

const handleSave = () => {
  const values = { ...initialValues, ...form.getFieldsValue() };
  form.setFieldsValue(values);
  setIsChanged(false);
  console.log("✅ Saved:", values);
};

  const sendLoginCredentials = Form.useWatch('sendLoginCredentials', form);
  const allowColorSelection = Form.useWatch('allowColorSelection', form);
  const showConstructionStages = Form.useWatch('showConstructionStages', form);

  const handleIconClick = () => fileInputRef.current?.click();
  const handleFile = () => {
    setIsChanged(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Form form={form} layout="vertical" onValuesChange={handleValuesChange}>

        <InputSwitch
          name="sendLoginCredentials"
          label="Options To Send Login Credentials to Customer"
          description="Enables authorized users to send login details to customers from the job screen, providing them access to the customer portal."
        />

        {sendLoginCredentials && (
          <>
            <Form.Item
              label="How many Days Customer Online Portal can be Active after Handover?"
              name="portalActiveDays"
            >
              <InputNumber
                min={1}
                max={9999}
                onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
              />
              <Text type="secondary"> days</Text>
            </Form.Item>

            <Text type="secondary" className="text-xs block mb-2">
              Portal stays active for specified days after handover — then access is auto-disabled.
            </Text>

            <InputSwitch
              name="sendEmailOnDeactivate"
              label="Send Email when Deactivating Customer Portal"
              description="Automatically send an email when customer portal access is deactivated."
            />

            <InputSwitch
              name="showSupervisorDetails"
              label="Show Site Supervisor Details"
              description="Customers can view supervisor's contact details."
            />

            <InputSwitch
              name="showBalanceToPay"
              label="Show Balance to Pay"
              description="Customer can see outstanding balance on portal."
            />

            <InputSwitch
              name="addNotes"
              label="Add Notes"
              description="Customers can add or reply to notes in Communications tab."
            />

            <InputSwitch
              name="allowColorSelection"
              label="Allow Color Selection"
              description="Customers can select colors through portal."
            />

            {allowColorSelection && (
              <InputSwitch
                name="showColorCost"
                label="Show Color Cost"
                description="Customers can view total color selection cost."
              />
            )}

            <InputSwitch
              name="showConstructionStages"
              label="Show Construction Stages"
              description="Shows construction phases & their status."
            />

            {showConstructionStages && (
              <InputSwitch
                name="autoShareImages"
                label="Auto-share Site Images"
                description="All uploaded site images auto-shared to portal."
              />
            )}

            <InputSwitch
              name="showProgressTab"
              label="Show Progress Tab"
              description="Shows milestone progress for construction stages."
            />

            <InputSwitch
              name="showInvoiceTab"
              label="Show Invoice Tab"
              description="Customers can view invoices & receipts."
            />

            <h1 className="font-semibold text-lg">Default Facade</h1>
          </>
        )}

        <div className="text-right mt-6 flex justify-between items-center">
          <div className="flex justify-start mt-2">
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFile}
            />
            <button
              type="button"
              onClick={handleIconClick}
              className="p-2 rounded-md border hover:bg-gray-50 transition"
            >
              <IconUpload size={20} className="text-blue-500" />
            </button>
          </div>

          {isChanged && (
            <Button type="primary" onClick={() => setShowConfirm(true)}>
              Save Changes
            </Button>
          )}
        </div>
      </Form>

      <ConfirmationContentModal
        title="Confirm Change"
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onSubmit={() => {
          handleSave();
          setShowConfirm(false);
        }}
        okText="Yes"
        cancelText="No"
        content={<p>Are you sure you want to save these portal settings?</p>}
      />
    </div>
  );
};
