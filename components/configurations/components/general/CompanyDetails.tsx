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
    if (!company) return;

    form.setFieldsValue({
      ...company,
      timezoneId: company.timezoneId,
      emailSignatureLogo: [
        {
          uid: '-1',
          name: 'Email Logo',
          status: 'done',
          url: company.emailSignatureLogo,
        },
      ],
      companyLogo: [
        {
          uid: '-1',
          name: 'Company Logo',
          status: 'done',
          url: company.companyLogo,
        },
      ],
    });
  }, [company]);
  const onFinish = async values => {
    if (!company) return;
    try {
      const { emailSignatureLogo, companyLogo, ...rest } = values;
      let companyLogoFile = company?.companyLogo || null;
      let emailSignatureLogoFile = company?.emailSignatureLogo || null;
      if (emailSignatureLogo && emailSignatureLogo.length > 0) {
        emailSignatureLogoFile = emailSignatureLogo[0].originFileObj || companyLogoFile;
      }
      if (companyLogo && companyLogo.length > 0) {
        companyLogoFile = companyLogo[0].originFileObj || companyLogoFile;
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

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="space-y-10"
        onValuesChange={handleValueChange}
        initialValues={company}
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
            <Input />
          </Form.Item>
          <Form.Item
            label="Timezone Name"
            name="timezoneId"
            rules={[{ required: true, message: 'TimeZone is required' }]}
          >
            <Select options={timezoneOptions} />
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
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Country"
            name={['address', 'countryId']}
            rules={[{ required: true, message: 'Country is required' }]}
          >
            <Select options={countryOptions} className="bg-gray-100 text-gray-500" />
          </Form.Item>
          <Form.Item
            label="State / Region"
            name={['address', 'stateId']}
            rules={[{ required: true, message: 'State is required' }]}
          >
            <Select options={stateOptions} />
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
            <Input />
          </Form.Item>
          <Form.Item label="Account BSB" name="accountBsb" rules={accountBsbRules}>
            <Input />
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
              getValueFromEvent={e => {
                if (e && e.fileList) {
                  return e.fileList;
                }
                return [];
              }}
            >
              <Upload
                name="emailSignatureLogo"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
                accept=".png,.jpg,.jpeg"
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
              getValueFromEvent={e => {
                if (e && e.fileList) {
                  return e.fileList;
                }
                return [];
              }}
            >
              <Upload
                name="companyLogo"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
                accept=".png,.jpg,.jpeg"
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
