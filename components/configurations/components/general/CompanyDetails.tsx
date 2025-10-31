'use client';
import { Form, Input, Select, Upload, Button } from 'antd';
import { IconUpload } from '@tabler/icons-react';
import { stateRegionOptions, timezoneOptions } from 'data/options';

const CompanyDetails = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log('Form values:', values);
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          companyName: 'My Home',
          abn: '82 156 644 478',
          timezoneName: 'GMT+10',
          address1: '9 Broadmeadows Cres',
          citySuburb: 'Bohle Plains',
          stateRegion: 'Victoria',
          zipPostalCode: '4817',
          country: 'Australia',
          accountName: 'My Home Pty Ltd',
          accountNumber: '034 567',
          accountBSB: '12345678',
        }}
        className="space-y-10"
      >
        {/* Basic Info */}
        <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item label="Company Name" name="companyName">
            <Input />
          </Form.Item>
          <Form.Item label="ABN" name="abn">
            <Input />
          </Form.Item>
          <Form.Item label="Timezone Name" name="timezoneName">
            <Select options={timezoneOptions} />
          </Form.Item>
        </div>

        {/* Address Details */}
        <h2 className="text-xl font-semibold border-b pb-2">Address Details</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item label="Address 1" name="address1">
            <Input />
          </Form.Item>
          <Form.Item label="Address 2" name="address2">
            <Input />
          </Form.Item>
          <Form.Item label="City / Suburb" name="citySuburb">
            <Input />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name="zipPostalCode">
            <Input />
          </Form.Item>
          <Form.Item label="State / Region" name="stateRegion">
            <Select options={stateRegionOptions} />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input readOnly className="bg-gray-100 text-gray-500" />
          </Form.Item>
        </div>

        {/* Bank Details */}
        <h2 className="text-xl font-semibold border-b pb-2">Bank Details</h2>
        <div className="grid grid-cols-2 gap-8">
          <Form.Item label="Bank Name" name="bankName">
            <Input />
          </Form.Item>
          <Form.Item label="Account Name" name="accountName">
            <Input />
          </Form.Item>
          <Form.Item label="Account Number" name="accountNumber">
            <Input />
          </Form.Item>
          <Form.Item label="Account BSB" name="accountBSB">
            <Input />
          </Form.Item>
        </div>

        {/* Logo Section */}
        <h2 className="text-xl font-semibold border-b pb-2">Logos</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-3">
            <span className="font-medium">Email Signature</span>
            <Upload
              name="image"
              listType="picture"
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<IconUpload />}>Upload</Button>
            </Upload>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-medium">Company Logo</span>
            <Upload
              name="image"
              listType="picture"
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<IconUpload />}>Upload</Button>
            </Upload>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <Button type="primary" size="large" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CompanyDetails;
