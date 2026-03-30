'use client';
import React, { useEffect, useState } from 'react';
import { Form, Input, Select, Upload, Button, message } from 'antd';
import { IconUpload } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchBuilderInfo,
  updateBuilderDetails,
} from '@redux/feature/admin/general/builder/builderThunk';
import { Status } from '@lib/constants/enum';
import { BuilderInfo } from '@redux/feature/admin/general/builder/ibuilderState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { useCountryHook } from '@hooks/useCountryHook';
import { useStateHook } from '@hooks/useStateHook';
import {
  abnRules,
  emailRules,
  builderPhoneRules,
  acnNumberRules,
  hiaMembershipRules,
  registrationNumberRules,
  accountNumberRules,
  accountBsbRules,
  builderNameRules,
  optionalNameRule,
  cityRules,
  zipCodeRules,
  addressLine2Rules,
  phoneRules,
} from '@lib/constants/formInputValidations';

const BuilderDetails = () => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [fileList, setfileList] = useState([]);
  const [isChanged, setIsChanged] = useState(false);
  const { builder, status } = useAppSelector(state => state.general.builder);
  const { countryOptions } = useCountryHook();
  const { stateOptions } = useStateHook();

  const fetchBuilderDetatil = async () => {
    try {
      await dispatch(fetchBuilderInfo()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch builder details');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchBuilderDetatil();
    }
    if (builder) {
      form.setFieldsValue(builder);
      if (builder.logo) {
        setfileList([
          {
            uid: '-1',
            name: 'Default Logo ',
            status: 'done',
            url: builder.logo,
          },
        ]);
      }
    }
  }, [status.fetch]);

  const onFinish = async (values: BuilderInfo) => {
    if (!builder) {
      return;
    }
    await form.validateFields();
    if (values) {
      try {
        if (fileList.length > 0) {
          values.logo = fileList[0].originFileObj;
        }
        const formData = formDataGenerator(values);
        await dispatch(updateBuilderDetails(formData)).unwrap();
        message.success('Builder details updated successfully');
      } catch (error) {
        message.error(error || 'Failed to update builder details');
      }
    }
  };

  const handleValueChange = (_, allValues: BuilderInfo) => {
    const { isUpdated } = getUpdatedFields(allValues, builder);
    setIsChanged(isUpdated);
  };

  return (
    <div className="p-6">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={builder}
        className="space-y-10"
        onValuesChange={handleValueChange}
        disabled={status.update === Status.PENDING}
      >
        {/* Builder Section */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Builder Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Builder Name" name="name" rules={builderNameRules}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={emailRules}>
            <Input type="email" />
          </Form.Item>
          <Form.Item label="Phone" name="phoneNumber" rules={builderPhoneRules}>
            <Input />
          </Form.Item>
          <Form.Item label="ABN" name="abnNumber" rules={abnRules}>
            <Input />
          </Form.Item>
          <Form.Item label="ACN" name="acnNumber" rules={acnNumberRules}>
            <Input />
          </Form.Item>
          <Form.Item label="HIA Membership No" name="hiaMembershipNo" rules={hiaMembershipRules}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Register Number"
            name="registrationNumber"
            rules={registrationNumberRules}
          >
            <Input />
          </Form.Item>
          <Form.Item label="Registered Building Practitioner" name="registeredBuildingPractitioner">
            <Input />
          </Form.Item>
          <Form.Item
            label="Practitioner Reg No"
            name="practitionerRegNo"
            rules={hiaMembershipRules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Builders Name (Licensed)"
            name="licensedBuilderName"
            rules={optionalNameRule}
          >
            <Input />
          </Form.Item>
        </div>

        {/* Address Section */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Address Details</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Address 1" name={['address', 'addressLine1']} rules={addressLine2Rules}>
            <Input />
          </Form.Item>
          <Form.Item label="Address 2" name={['address', 'addressLine2']} rules={addressLine2Rules}>
            <Input />
          </Form.Item>
          <Form.Item label="City / Suburb" name={['address', 'city']} rules={cityRules}>
            <Input />
          </Form.Item>
          <Form.Item
            label="State / Region"
            name={['address', 'stateId']}
            rules={[{ required: true, message: 'Please Select State' }]}
          >
            <Select options={stateOptions} />
          </Form.Item>
          <Form.Item
            label="Country"
            name={['address', 'countryId']}
            rules={[{ required: true, message: 'Please Select Country' }]}
          >
            <Select options={countryOptions} />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name={['address', 'zipCode']} rules={zipCodeRules}>
            <Input />
          </Form.Item>
        </div>

        {/* Bank Details */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Bank Details</h2>
        <div className="grid grid-cols-2 gap-6">
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

        {/* Building Insurer */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Building Insurer</h2>
        <div className="grid grid-cols-2 gap-6">
          <Form.Item label="Insurer" name={['insurer', 'insurerName']} rules={builderNameRules}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Insurer Address 1"
            name={['insurer', 'addressLine1']}
            rules={addressLine2Rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Insurer Address 2"
            name={['insurer', 'addressLine2']}
            rules={addressLine2Rules}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="State / Region"
            name={['insurer', 'stateId']}
            rules={[{ required: true, message: 'Please Select State' }]}
          >
            <Select options={stateOptions} />
          </Form.Item>
          <Form.Item label="Zip / Postal Code" name={['insurer', 'zipCode']} rules={zipCodeRules}>
            <Input type="number" />
          </Form.Item>
          <Form.Item label="Phone" name={['insurer', 'phoneNumber']} rules={phoneRules}>
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Name of Insured"
            name={['insurer', 'insuredName']}
            rules={[{ required: true, message: 'Please Enter Builder Name' }, ...builderNameRules]}
          >
            <Input />
          </Form.Item>
        </div>

        {/* Logo Section */}
        <h2 className="text-xl font-semibold border-b pb-2 text-font-color">Logos</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-3">
            <span className="font-medium text-font-color-400">Builder Logo</span>
            <Form.Item
              name="logo"
              getValueFromEvent={({ fileList }) => {
                if (fileList && fileList.length > 0) {
                  return fileList[0].originFileObj;
                }
                return null;
              }}
            >
              <Upload
                name="builderLogo"
                listType="picture"
                multiple={false}
                maxCount={1}
                beforeUpload={() => false}
                fileList={fileList}
                onChange={({ fileList: newFileList }) => {
                  setfileList(newFileList);
                }}
                accept='.png,.jpg,.jpeg'
              >
                <Button icon={<IconUpload />}>Upload</Button>
              </Upload>
            </Form.Item>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          {isChanged && (
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={status.update === Status.PENDING}
            >
              Save
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default BuilderDetails;
