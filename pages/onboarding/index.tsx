"use client";
export async function getStaticProps() {
  return {
    props: {
      isAuthRoute: true,
    },
  };
}
import { Form, Input, Button, Upload, message, Select } from 'antd';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { updateCompanyDetails, updateCompanyOnboarding } from '@redux/feature/admin/general/company/companyThunk';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import { IconUpload } from '@tabler/icons-react';
import { abnRules, addressLine1Rules, addressLine2Rules, builderNameRules, cityRules, websiteRules, zipCodeRules } from '@lib/constants/formInputValidations';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { useEffect, useState } from 'react';
import { getUserThunk } from '@redux/feature/auth/authThunk';

export default function Onboarding() {
  const [form] = Form.useForm();
  const [emailSignatureLogoState, setEmailSignatureLogoState] = useState([]);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { timezoneOptions } = useLocationAndTimezoneHook({ type: 'timezone' });
  const { countryOptions } = useCountryHook();
  const selectedCountryId = Form.useWatch(['address', 'countryId'], form);
  const { stateOptions } = useStateHook(selectedCountryId);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        name: user?.company?.name,
        countryId: countryOptions.find(option => option.label.toLowerCase() === 'australia')?.value,
      });
    }
  }, [user, form]);

  const handleEmailSignatureChange = ({ fileList }: any) => {
    const safeFileList = Array.isArray(fileList) ? fileList : [];
    setEmailSignatureLogoState(safeFileList.length > 0 ? safeFileList : []);
    form.setFieldsValue({ emailSignatureLogo: safeFileList });
  };

  const onFinish = async (values: any) => {
    const formData = formDataGenerator({
      companyName: values.name,
      abnNumber: values.abn,
      timezoneId: values.timezoneId,
      address: values.address || {},
      website: values.website || '',
      companyLogo: values.logo?.[0]?.originFileObj || null,
      emailSignatureLogo: values.emailSignatureLogo?.[0]?.originFileObj || null,
    });

    try {
      await dispatch(updateCompanyOnboarding({payload:formData, id: user?.company?.companyId})).unwrap();
      message.success('Company details saved');
      await dispatch(getUserThunk()).unwrap();// Refresh user data to get updated company info
      router.push('/');
    } catch (err) {
      message.error('Failed to save company details');
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <h1 className="text-2xl font-medium mb-6 text-center">Company Onboarding</h1>
      <p className="text-center text-font-color-100 mb-6">Please enter your company basic details.</p>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item label="Company Name" name="name" required rules={[{ required: true, message: 'Company name is required' }, ...builderNameRules]}>
          <Input />
        </Form.Item>

        <Form.Item label="ABN/ACN" name="abn" rules={abnRules}>
          <Input />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Address 1"
            name={['address', 'addressLine1']}
            required
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
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="City / Suburb" name={['address', 'city']} required rules={cityRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name={['address', 'zipCode']} required rules={zipCodeRules}>
            <Input type="number" onWheel={(e) => e.currentTarget.blur()} min={0} />
          </Form.Item>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Country"
            name={['address', 'countryId']}
            required
            rules={[{ required: true, message: 'Country is required' }]}
          >
            <Select options={countryOptions} placeholder="Select Country" />
          </Form.Item>
          <Form.Item
            label="State / Region"
            name={['address', 'stateId']}
            required
            rules={[{ required: true, message: 'State is required' }]}
          >
            <Select options={stateOptions} placeholder="Select State" disabled={!selectedCountryId} />
          </Form.Item>
        </div>

        <Form.Item label="Website" name="website" rules={websiteRules}>
          <Input  type="url"/>
        </Form.Item>

        <Form.Item
          label="Timezone"
          name="timezoneId"
          rules={[]}
        >
          <Select options={timezoneOptions} placeholder="Select Timezone" />
        </Form.Item>

        <Form.Item label="Company Logo" name="logo" valuePropName="fileList" getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e && e.fileList)}>
          <Upload beforeUpload={() => false} maxCount={1} accept="image/*">
            <Button icon={<IconUpload />}>Upload Logo</Button>
          </Upload>
        </Form.Item>

        <Form.Item label="Email Signature Logo" name="emailSignatureLogo" valuePropName="fileList" getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e && e.fileList)}>
          <Upload beforeUpload={() => false} maxCount={1} accept="image/*" onChange={handleEmailSignatureChange}>
            <Button icon={<IconUpload />}>Upload Email Signature</Button>
          </Upload>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">Save and Continue</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
