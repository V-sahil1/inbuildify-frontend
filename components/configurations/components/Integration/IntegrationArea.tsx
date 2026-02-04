'use client';
import { useEffect, useState } from 'react';
import { Button, Form, message } from 'antd';
import { IconThumbUp } from '@tabler/icons-react';
import InputSwitch from 'components/common/InputSwitch';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchIntegrationSetting,
  updateIntegrationSetting,
} from '@redux/feature/admin/integration/optionalSetting/integrationOptionalThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const IntegrationArea = () => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [isChanged, setIsChanged] = useState(false);
  const { integrationSetting, status } = useAppSelector(state => state.integration.optionalSetting);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchIntegrationSettingData();
    }
    if (integrationSetting) {
      form.setFieldsValue(integrationSetting);
    }
  }, [status.fetch]);
  const fetchIntegrationSettingData = async () => {
    try {
      await dispatch(fetchIntegrationSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch setting data');
    }
  };

  const handleValueChange = (_, allValue) => {
    const { isUpdated } = getUpdatedFields(allValue, integrationSetting);
    setIsChanged(isUpdated);
  };

  const handleSave = async values => {
    try {
      const { isUpdated, updatedFields } = getUpdatedFields(values, integrationSetting);
      if (!isUpdated) {
        setIsChanged(false);
        return;
      }
      await dispatch(updateIntegrationSetting(updatedFields)).unwrap();
      message.success('Integration setting updated successfully');
      setIsChanged(false);
    } catch (error) {
      message.error(error || 'Failed to save integration setting');
    }
  };

  return (
    <div className="p-6 bg-card-color rounded-md w-full">
      <Form
        form={form}
        layout="vertical"
        initialValues={integrationSetting}
        onValuesChange={handleValueChange}
        onFinish={handleSave}
        disabled={status.update === Status.PENDING}
      >
        {/* Top Switch */}
        <InputSwitch
          label="Automatically Send Welcome Email"
          description="An automated email will be sent to new leads created through integrations such as REA, Website, Facebook, etc."
          name="automaticallySendWelcomeEmail"
        />

        {/* Systems Integrated header */}
        <div className="flex items-center gap-2 mb-2 mt-6">
          <span className="font-semibold text-font-color text-base">Systems Integrated</span>
          <IconThumbUp className="text-green-500" size={18} />
        </div>

        <p className="text-font-color-100 mb-3 text-sm">
          You have already integrated InBuildify with REA_HL, canibuild, Website_HL, and Google.
        </p>
        <p className="text-font-color-100 mb-4 text-sm">
          Capture property details from enquiries generated through these integrated systems.
        </p>

        {/* Integration Toggles */}
        <div className="border-t border-border-color pt-3">
          <InputSwitch label="REA_HL - Agency ID: XNWIWY" name="reaHlEnabled" />
          <InputSwitch label="canibuild - Agency ID: BS1MYH8A" name="canibuildEnabled" />
          <InputSwitch
            label="Website_HL - Agency ID: 26459581-E888-4F46-BE16-84F1C71D4E68"
            name="websiteHlEnabled"
          />
          <InputSwitch label="Google - Agency ID: Not yet set" name="googleEnabled" />
        </div>

        {isChanged && (
          <div className="mt-6 text-right">
            <Button
              type="primary"
              htmlType="submit"
              loading={status.update === Status.PENDING}
              disabled={status.update === Status.PENDING}
            >
              Save Changes
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
