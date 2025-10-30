"use client";
import React from "react";
import { Form, Input, Select, Upload, Button } from "antd";
import { IconUpload } from "@tabler/icons-react";
import { stateRegionOptions } from "data/options";



const BuilderDetails = () => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Form values:", values);
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          country: "Australia",
        }}
        className="space-y-10"
      >
        {/* Builder Section */}
        <h2 className="text-xl font-semibold border-b pb-2">Builder Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Builder Name" name="builderName">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone">
            <Input />
          </Form.Item>
          <Form.Item label="ABN" name="abn">
            <Input />
          </Form.Item>
          <Form.Item label="ACN" name="acn">
            <Input />
          </Form.Item>
          <Form.Item label="HIA Membership No" name="hiaMembershipNo">
            <Input />
          </Form.Item>
          <Form.Item label="Register Number" name="registerNumber">
            <Input />
          </Form.Item>
          <Form.Item
            label="Registered Building Practitioner"
            name="registeredBuildingPractitioner"
          >
            <Input />
          </Form.Item>
          <Form.Item label="Practitioner Reg No" name="practitionerRegNo">
            <Input />
          </Form.Item>
          <Form.Item
            label="Builders Name (Licensed)"
            name="buildersNameLicensed"
          >
            <Input />
          </Form.Item>
        </div>

        {/* Address Section */}
        <h2 className="text-xl font-semibold border-b pb-2">Address Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Address 1" name="address1">
            <Input />
          </Form.Item>
          <Form.Item label="Address 2" name="address2">
            <Input />
          </Form.Item>
          <Form.Item label="City / Suburb" name="citySuburb">
            <Input />
          </Form.Item>
          <Form.Item label="State / Region" name="stateRegion">
            <Select options={stateRegionOptions} />
          </Form.Item>
          <Form.Item label="Country" name="country">
            <Input readOnly className="bg-gray-100 text-gray-500" />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name="zipPostalCode">
            <Input />
          </Form.Item>
        </div>

        {/* Bank Details */}
        <h2 className="text-xl font-semibold border-b pb-2">Bank Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Bank Name" name="bankName">
            <Input />
          </Form.Item>
          <Form.Item label="Account Name" name="accountName">
            <Input />
          </Form.Item>
          <Form.Item label="Account Number" name="accountNo">
            <Input />
          </Form.Item>
          <Form.Item label="Account BSB" name="accountBSB">
            <Input />
          </Form.Item>
        </div>

        {/* Building Insurer */}
        <h2 className="text-xl font-semibold border-b pb-2">Building Insurer</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Insurer" name="insurer">
            <Input />
          </Form.Item>
          <Form.Item label="Insurer Address 1" name="insurerAddress1">
            <Input />
          </Form.Item>
          <Form.Item label="Insurer Address 2" name="insurerAddress2">
            <Input />
          </Form.Item>
          <Form.Item label="State / Region" name="insurerStateRegion">
            <Select options={stateRegionOptions} />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name="insurerZipPostalCode">
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="insurerPhone">
            <Input />
          </Form.Item>
          <Form.Item label="Name of Insured" name="nameOfInsured">
            <Input />
          </Form.Item>
        </div>

        {/* Logo Section */}
        <h2 className="text-xl font-semibold border-b pb-2">Logos</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-medium">Builder Logo</span>
            <Upload
              name="builderLogo"
              listType="picture"
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button icon={<IconUpload />}>Upload</Button>
            </Upload>
          </div>

          <div className="flex flex-col gap-3">
            <span className="font-medium">Practitioner License</span>
            <Upload
              name="practitionerLicense"
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

export default BuilderDetails;
