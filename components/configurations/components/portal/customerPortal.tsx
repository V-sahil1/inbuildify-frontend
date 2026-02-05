'use client';
import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Typography, message, Upload } from 'antd';
import InputSwitch from '@/components/common/InputSwitch';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { IconPlus } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchCustomerPortalInfo,
  updateCustomerPortalDetails,
} from '@redux/feature/admin/portal/customerPortal/customerPortalThunk';
import { Status } from '@lib/constants/enum';
import { CustomerPortalInfo } from '@redux/feature/admin/portal/customerPortal/icustomerPortalState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { Text } = Typography;

export const CustomerPortal = () => {
  const [form] = Form.useForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [portalDaysValue, setPortalDaysValue] = useState<string | number | null | undefined>(null);
  const [fileList, setFileList] = useState<any[]>([]);
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
    if (customer && Object.keys(customer).length > 0) {
      form.resetFields();
      form.setFieldsValue(customer);
      if (
        customer.portalActiveDaysAfterHandover !== undefined &&
        customer.portalActiveDaysAfterHandover !== null
      ) {
        setPortalDaysValue(customer.portalActiveDaysAfterHandover);
        setTimeout(() => {
          form.setFieldValue(
            'portalActiveDaysAfterHandover',
            customer.portalActiveDaysAfterHandover
          );
        }, 0);
      }
      if (customer.defaultFacadeImage) {
        setFileList([
          {
            uid: '-1',
            name: 'Default Facade',
            status: 'done',
            url: customer.defaultFacadeImage,
          },
        ]);
      }
    }
  }, [status.fetch, customer]);

  const handleValuesChange = (_, allValues: CustomerPortalInfo) => {
    const { isUpdated } = getUpdatedFields(allValues, customer || {});
    setIsChanged(isUpdated);
  };

  const handleSave = async () => {
    try {
      const formValues = form.getFieldsValue();
      const { isUpdated, updatedFields } = getUpdatedFields(formValues, customer || {});
      if (!isUpdated && fileList.length === 0) {
        setIsChanged(false);
        return;
      }
      if (
        formValues.portalActiveDaysAfterHandover !== null &&
        formValues.portalActiveDaysAfterHandover !== undefined &&
        (customer?.portalActiveDaysAfterHandover === null ||
          customer?.portalActiveDaysAfterHandover === undefined)
      ) {
        updatedFields.portalActiveDaysAfterHandover = formValues.portalActiveDaysAfterHandover;
      } else if (
        formValues.portalActiveDaysAfterHandover !== null &&
        formValues.portalActiveDaysAfterHandover !== undefined &&
        customer?.portalActiveDaysAfterHandover !== null &&
        customer?.portalActiveDaysAfterHandover !== undefined &&
        formValues.portalActiveDaysAfterHandover !== customer.portalActiveDaysAfterHandover
      ) {
        updatedFields.portalActiveDaysAfterHandover = formValues.portalActiveDaysAfterHandover;
      }

      const formData = formDataGenerator(updatedFields);

      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('defaultFacadeImage', fileList[0].originFileObj);
      }

      await dispatch(updateCustomerPortalDetails(formData)).unwrap();

      setIsChanged(false);
      message.success('Customer portal settings updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update customer portal settings');
    }
  };

  const sendLoginCredentials = Form.useWatch('sendLoginCredentialsToCustomer', form);
  const allowColorSelection = Form.useWatch('allowColorSelection', form);
  const showConstructionStages = Form.useWatch('showConstructionStages', form);
  const portalActiveDays = Form.useWatch('portalActiveDaysAfterHandover', form);

  useEffect(() => {
    if (
      portalActiveDays !== undefined &&
      customer?.portalActiveDaysAfterHandover !== portalActiveDays
    ) {
      setIsChanged(true);
    }
  }, [portalActiveDays, customer]);

  const handleFileChange = (info: any) => {
    const { fileList: newFileList } = info;

    const latestFileList = newFileList.slice(-1);

    if (latestFileList.length > 0 && latestFileList[0].originFileObj) {
      const file = latestFileList[0].originFileObj;
      if (!file.type.startsWith('image/')) {
        message.error('Please select an image file');
        return;
      }
      if (file.size / 1024 / 1024 > 10) {
        message.error('Image must be smaller than 10MB!');
        return;
      }
    }

    setFileList(latestFileList);
    setIsChanged(true);
  };

  return (
    <div className="p-6 bg-card-color rounded-lg shadow-sm">
      <Form
        form={form}
        layout="vertical"
        onValuesChange={handleValuesChange}
        disabled={status.update === Status.PENDING}
      >
        <InputSwitch
          name="sendLoginCredentialsToCustomer"
          label="Options To Send Login Credentials to Customer"
          description="Enables authorized users to send login details to customers from the job screen, providing them access to the customer portal."
        />

        {sendLoginCredentials && (
          <>
            <Form.Item
              label="How many Days Customer Online Portal can be Active after Handover?"
              name="portalActiveDaysAfterHandover"
            >
              <Input
                type="number"
                min={1}
                max={9999}
                placeholder="Enter days"
                value={portalDaysValue || ''}
                onKeyPress={e => !/[0-9]/.test(e.key) && e.preventDefault()}
                onChange={e => {
                  const value = e.target.value ? Number(e.target.value) : null;
                  setPortalDaysValue(value);
                  form.setFieldValue('portalActiveDaysAfterHandover', value);
                  if (
                    value !== null &&
                    value !== Number(customer?.portalActiveDaysAfterHandover || 0)
                  ) {
                    setIsChanged(true);
                  }
                }}
              />
              <Text className="text-font-color-100"> days</Text>
            </Form.Item>

            <Text className="text-xs text-font-color-100 block mb-2">
              Portal stays active for specified days after handover — then access is auto-disabled.
            </Text>

            <InputSwitch
              name="sendMailWhenPortalInactive"
              label="Send Email when Deactivating Customer Portal"
              description="Automatically send an email when customer portal access is deactivated."
            />

            <InputSwitch
              name="showSiteSupervisorDetails"
              label="Show Site Supervisor Details"
              description="Customers can view supervisor's contact details."
            />

            <InputSwitch
              name="showBalanceToPay"
              label="Show Balance to Pay"
              description="Customer can see outstanding balance on portal."
            />

            <InputSwitch
              name="addNotesEnabled"
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
                name="autoShareSiteImages"
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
              name="publishPackagesToAgentPortal"
              label="Show Invoice Tab"
              description="Customers can view invoices & receipts."
            />

            <h1 className="font-semibold text-lg text-font-color">Default Facade</h1>

            <div className="mt-4">
              <Upload
                name="defaultFacadeImage"
                listType="picture-card"
                className="avatar-uploader"
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={file => {
                  if (!file.type.startsWith('image/')) {
                    message.error('You can only upload image files!');
                    return false;
                  }
                  if (file.size / 1024 / 1024 > 5) {
                    message.error('Image must be smaller than 5MB!');
                    return false;
                  }
                  return false;
                }}
              >
                {fileList.length === 0 && (
                  <div className="flex flex-col items-center">
                    <IconPlus size={20} />
                    <div className="mt-1 text-sm text-gray-500">Upload</div>
                  </div>
                )}
              </Upload>
            </div>
          </>
        )}

        <div className="text-right mt-6 flex justify-between items-center">
          <div className="flex justify-start mt-2" />

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
        onSubmit={async () => {
          await handleSave();
          setShowConfirm(false);
        }}
        okText="Yes"
        cancelText="No"
        content={<p>Are you sure you want to save these portal settings?</p>}
        loading={status.update === Status.PENDING}
      />
    </div>
  );
};
