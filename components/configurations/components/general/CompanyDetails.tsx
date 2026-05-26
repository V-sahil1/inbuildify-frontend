'use client';
import { Form, Input, Select, Upload, Button, message } from 'antd';
import { IconUpload } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect, useState } from 'react';
import {
  fetchCompanyInfo,
  updateCompanyDetails,
} from '@redux/feature/admin/general/company/companyThunk';
import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import {
  abnRules,
  zipCodeRules,
  accountNumberRules,
  accountBsbRules,
  addressLine1Rules,
  cityRules,
  optionalNameRule,
  builderNameRules,
  addressLine2Rules,
} from '@lib/constants/formInputValidations';

const CompanyDetails = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { company, status } = useAppSelector(state => state.general.company);
  const { timezoneOptions } = useLocationAndTimezoneHook({ type: 'timezone' });
  const { countryOptions } = useCountryHook();
  const selectedCountryId = Form.useWatch(['address', 'countryId'], form);
  const { stateOptions } = useStateHook(selectedCountryId);
  const [isChanged, setIsChanged] = useState(false);
  const [emailSignatureLogoState, setEmailSignatureLogoState] = useState([]);
  const [companyLogoState, setCompanyLogoState] = useState([]);

  const fetchCompanyInfoData = async () => {
    try {
      await dispatch(fetchCompanyInfo()).unwrap();
    } catch (error) {
      message.error(error || 'Failed fetch company detail');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchCompanyInfoData();
    }
  }, [dispatch, status.fetch]);

  useEffect(() => {
    if (!company || !form) return;

    // Set local state for images
    const emailSignatureLogoData = company.emailSignatureLogo && company.emailSignatureLogo.trim() !== '' ? [
      {
        uid: '-1',
        name: 'Email Logo',
        status: 'done',
        url: company.emailSignatureLogo,
      },
    ] : [];

    const companyLogoData = company.companyLogo && company.companyLogo.trim() !== '' ? [
      {
        uid: '-1',
        name: 'Company Logo',
        status: 'done',
        url: company.companyLogo,
      },
    ] : [];

    setEmailSignatureLogoState(emailSignatureLogoData);
    setCompanyLogoState(companyLogoData);

    try {
      // Create a safe company object by filtering out potential array fields that might cause issues
      const safeCompanyData = { ...company };

      // Remove any fields that might be arrays and cause .map() issues
      Object.keys(safeCompanyData).forEach(key => {
        if (Array.isArray(safeCompanyData[key])) {
          delete safeCompanyData[key];
        }
      });

      form.setFieldsValue({
        ...safeCompanyData,
        timezoneId: company.timezoneId,
        emailSignatureLogo: emailSignatureLogoData,
        companyLogo: companyLogoData,
      });
    } catch (error) {
      console.error('Error setting form values:', error);
      // Fallback: set only the essential fields
      try {
        form.setFieldsValue({
          name: company.name,
          emailSignatureLogo: emailSignatureLogoData,
          companyLogo: companyLogoData,
        });
      } catch (fallbackError) {
        console.error('Fallback error setting form values:', fallbackError);
      }
    }
    setIsChanged(false);
  }, [company, form]);
  const onFinish = async values => {
    if (!company) return;
    try {
      const { emailSignatureLogo, companyLogo, ...rest } = values;
      let companyLogoFile = null;
      let emailSignatureLogoFile = null;

      // Use local state to determine what to send
      if (emailSignatureLogo && emailSignatureLogo.length > 0) {
        emailSignatureLogoFile = emailSignatureLogo[0].originFileObj || null;
      } else if (company.emailSignatureLogo && emailSignatureLogoState.length === 0) {
        // Image was removed (original existed but state is empty)
        emailSignatureLogoFile = '';
      }

      if (companyLogo && companyLogo.length > 0) {
        companyLogoFile = companyLogo[0].originFileObj || null;
      } else if (company.companyLogo && companyLogoState.length === 0) {
        // Image was removed (original existed but state is empty)
        companyLogoFile = '';
      }

      const formData = formDataGenerator({
        ...rest,
        companyLogo: companyLogoFile,
        emailSignatureLogo: emailSignatureLogoFile,
      });

      await dispatch(updateCompanyDetails(formData)).unwrap();
      message.success('Company details updated successfully');
    } catch (error) {
      message.error(error || 'Failed to update company details');
    }
  };

  const handleValueChange = (_, allValues) => {
    const { isUpdated } = getUpdatedFields(allValues, company);
    setIsChanged(isUpdated);
  };

  const handleEmailSignatureChange = ({ fileList }) => {
    const safeFileList = Array.isArray(fileList) ? fileList : [];
    setEmailSignatureLogoState(safeFileList.length > 0 ? safeFileList : []);
    form.setFieldsValue({ emailSignatureLogo: safeFileList });
  };

  const handleCompanyLogoChange = ({ fileList }) => {
    const safeFileList = Array.isArray(fileList) ? fileList : [];
    setCompanyLogoState(safeFileList.length > 0 ? safeFileList : []);
    form.setFieldsValue({ companyLogo: safeFileList });
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-10"
        onValuesChange={handleValueChange}
        disabled={status.update === Status.PENDING}
      >
        {/* Basic Info */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Basic Information</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item
            label="Company Name"
            name="name"
            rules={[{ required: true, message: 'Company name is required' }, ...builderNameRules]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="ABN" name="abnNumber" rules={abnRules}>
            <Input
              onKeyPress={e => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Timezone Name"
            name="timezoneId"
            rules={[{ required: true, message: 'TimeZone is required' }]}
          >
            <Select options={timezoneOptions} placeholder="Select the Timezone" />
          </Form.Item>
        </div>

        {/* Address Details */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Address Details</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item
            label="Address 1"
            name={['address', 'addressLine1']}
            rules={[
              { required: true, message: 'Address line 1 is required' },
              ...addressLine1Rules,
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Address 2" name={['address', 'addressLine2']} rules={addressLine2Rules}>
            <Input />
          </Form.Item>
          <Form.Item label="City / Suburb" name={['address', 'city']} rules={cityRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name={['address', 'zipCode']} rules={zipCodeRules}>
            <Input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} />
          </Form.Item>
          <Form.Item
            label="Country"
            name={['address', 'countryId']}
            rules={[{ required: true, message: 'Country is required' }]}
          >
            <Select options={countryOptions} placeholder="Select Country" className="bg-gray-100 text-gray-500 capitalize" />
          </Form.Item>
          <Form.Item
            label="State / Region"
            name={['address', 'stateId']}
            rules={[{ required: true, message: 'State is required' }]}
          >
            <Select options={stateOptions} placeholder="Select State" className='capitalize' disabled={!form.getFieldValue(['address', 'countryId'])} />
          </Form.Item>
        </div>

        {/* Bank Details */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Bank Details</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item label="Bank Name" name="bankName" rules={optionalNameRule}>
            <Input />
          </Form.Item>
          <Form.Item label="Account Name" name="accountName" rules={builderNameRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Account Number" name="accountNumber" rules={accountNumberRules}>
            <Input onKeyPress={e => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }} />
          </Form.Item>
          <Form.Item label="Account BSB" name="accountBsb" rules={accountBsbRules}>
            <Input onKeyPress={e => {
              if (!/[0-9]/.test(e.key)) {
                e.preventDefault();
              }
            }} onWheel={(e) => e.currentTarget.blur()} />
          </Form.Item>
        </div>

        {/* Logo Section */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Logos</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-font-color-100">Email Signature</span>
            <Form.Item
              name="emailSignatureLogo"
              valuePropName="fileList"
            >
              <Upload
                name="emailSignatureLogo"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
                accept=".png,.jpg,.jpeg"
                onChange={handleEmailSignatureChange}
              >
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-medium text-font-color-400">Company Logo</span>
            <Form.Item
              name="companyLogo"
              valuePropName="fileList"
            >
              <Upload
                name="companyLogo"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
                accept=".png,.jpg,.jpeg"
                onChange={handleCompanyLogoChange}
              >
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        {isChanged && (
          <div className="flex justify-end pt-6">
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={status.update === Status.PENDING}
              disabled={status.update === Status.PENDING}
            >
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};

export default CompanyDetails;
