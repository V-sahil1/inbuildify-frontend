'use client';
import { useState } from 'react';
import { Button, Form } from 'antd';
import { IconThumbUp } from '@tabler/icons-react';
import InputSwitch from 'components/common/InputSwitch';

export const IntegrationArea = () => {
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);

  const initialValues = {
    autoWelcome: true,
    integrations: {
      REA_HL: false,
      canibuild: false,
      Website_HL: false,
      Google: false,
    },
  };

  const handleSave = (values: any) => {
    console.log('Saved values:', values);
    setIsChanged(false);
  };

  return (
    <div className="p-6 bg-white rounded-md w-full">
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onValuesChange={() => setIsChanged(true)}
        onFinish={handleSave}
      >
        {/* Top Switch */}
        <InputSwitch
          label="Automatically Send Welcome Email"
          description="An automated email will be sent to new leads created through integrations such as REA, Website, Facebook, etc."
          name="autoWelcome"
        />

        {/* Systems Integrated header */}
        <div className="flex items-center gap-2 mb-2 mt-6">
          <span className="font-semibold text-gray-800 text-base">Systems Integrated</span>
          <IconThumbUp className="text-green-500" size={18} />
        </div>

        <p className="text-gray-600 mb-3 text-sm">
          You have already integrated InBuildify with REA_HL, canibuild, Website_HL, and Google.
        </p>
        <p className="text-gray-600 mb-4 text-sm">
          Capture property details from enquiries generated through these integrated systems.
        </p>

        {/* Integration Toggles */}
        <div className="border-t border-gray-100 pt-3">
          <InputSwitch label="REA_HL - Agency ID: XNWIWY" name="integrations.REA_HL" />
          <InputSwitch label="canibuild - Agency ID: BS1MYH8A" name="integrations.canibuild" />
          <InputSwitch
            label="Website_HL - Agency ID: 26459581-E888-4F46-BE16-84F1C71D4E68"
            name="integrations.Website_HL"
          />
          <InputSwitch label="Google - Agency ID: Not yet set" name="integrations.Google" />
        </div>

        {isChanged && (
          <div className="mt-6 text-right">
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
