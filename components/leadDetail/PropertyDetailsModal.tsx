import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, Row, Col, Button, message } from 'antd';
import dayjs from 'dayjs';
import { createLeadProperty, updateLeadProperty } from '@redux/feature/lead/leadThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { disablePastDates } from '@lib/utils/getDisabledTimeDate';
import {
  addressLine2Rules,
  CityNameRules,
  leadAddressRules,
  optionalNameRules,
  OptionalNumberRules,
} from '@lib/constants/formInputValidations';
import { useStateHook } from '@hooks/useStateHook';
import { useCountryHook } from '@hooks/useCountryHook';
import { PropertyDetail } from '@redux/feature/lead/ILeadState';

interface PropertyDetailsModalProps {
  visible: boolean;
  onCancel: () => void;
  initialValues?: PropertyDetail;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  visible,
  onCancel,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const { stateOptions } = useStateHook();
  const { countryOptions } = useCountryHook();

  const handleSave = async () => {
    const values = await form.validateFields();
    try {
      if (leadDetail?.property) {
        await dispatch(
          updateLeadProperty({ id: leadDetail?.property?.propertyDetailId, payload: values })
        ).unwrap();

        message.success('Lead Property updated successfully');
      } else {
        await dispatch(
          createLeadProperty({ data: values, leadId: leadDetail?.lead?.leadsId })
        ).unwrap();
        message.success('Lead Property created successfully');
      }
      onCancel();
    } catch (error) {
      message.error(error || 'Failed to create property');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (!!initialValues) {
      const titleDateValue = initialValues.titleDate
        ? dayjs.isDayjs(initialValues.titleDate)
          ? initialValues.titleDate
          : dayjs(initialValues.titleDate)
        : null;

      // Ensure the date is valid
      const validTitleDate = titleDateValue && titleDateValue.isValid() ? titleDateValue : null;

      form.setFieldsValue({
        ...initialValues,
        titleDate: validTitleDate,
      });
    }
  }, []);

  const titleStatusOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Sold', value: 'sold' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Pending', value: 'pending' },
    { label: 'Under Contract', value: 'under_contract' },
    { label: 'Off Market', value: 'off_market' },
  ];

  const compactionReportOptions = [
    { label: 'Available', value: 'available' },
    { label: 'Not Available', value: 'not_available' },
  ];

  return (
    <Modal
      title="Property Details"
      open={visible}
      onCancel={handleCancel}
      width={900}
      centered
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save
        </Button>,
      ]}
      // destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="mt-4"
        style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}
      >
        {/* Address Section */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Lot No" name="lotNumber" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Street No" name="street" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Address1" name="addressLine1" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Address 2" name="addressLine2" rules={addressLine2Rules}>
              <Input placeholder="Optional" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="City / Suburb" name="city" rules={CityNameRules}>
              <Input placeholder="Tarneit" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Country"
              name="countryId"
              rules={[{ required: true, message: 'Please select country' }]}
            >
              <Select placeholder="Select country" options={countryOptions} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="State / Region"
              name="stateId"
              rules={[{ required: true, message: 'Please select state/region' }]}
            >
              <Select placeholder="Select state" options={stateOptions} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label="Zip / Postal Code"
              name="zipCode"
              rules={[
                { required: true, message: 'Please enter postal code' },
                { max: 4, message: 'Postal code must be at most 4 characters' },
              ]}
            >
              <Input
                placeholder="3029"
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Land Details Section */}
        <div className="mt-6 mb-4">
          <h3 className="text-lg font-medium text-gray-700">Land details</h3>
        </div>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Estate Name" name="estateName" rules={optionalNameRules}>
              <Input placeholder="Enter estate name" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Title Status"
              name="titleStatus"
              rules={[{ required: true, message: 'Please select title status' }]}
            >
              <Select placeholder="Select status" options={titleStatusOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="Title Date"
              name="titleDate"
              rules={[{ required: true, message: 'Please select title date' }]}
            >
              <DatePicker
                className="w-full"
                format="DD-MM-YYYY"
                placeholder="13-07-2023"
                disabledDate={disablePastDates}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              label="Compaction Report"
              name="compactionReport"
              rules={[{ required: true, message: 'Please select Compaction Report' }]}
            >
              <Select placeholder="Select availability" options={compactionReportOptions} />
            </Form.Item>
          </Col>
        </Row>

        {/* Land Type Section */}
        <Form.Item
          label="Land Type"
          name="landType"
          rules={[{ required: true, message: 'Please select land type' }]}
          initialValue="regular"
        >
          <Radio.Group
            options={[
              { label: 'Regular', value: 'regular' },
              { label: 'Irregular', value: 'irregular' },
            ]}
          />
        </Form.Item>

        {/* Dimensions Section */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Width (m)" name="widthM" rules={OptionalNumberRules}>
              <Input
                placeholder="Enter width"
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Depth (m)" name="depthM" rules={OptionalNumberRules}>
              <Input
                placeholder="Enter depth"
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Total Size (m²)" name="totalSizeM2" rules={OptionalNumberRules}>
              <Input
                placeholder="Enter total size"
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Site Details Section */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Site Fall (mm)" name="siteFallMm" rules={OptionalNumberRules}>
              <Input
                placeholder="300"
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Land Fill (mm)" name="landFillMm" rules={OptionalNumberRules}>
              <Input
                placeholder="500"
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* Additional Options */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Bush Fire" name="bushFire" initialValue={false}>
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Corner Block" name="cornerBlock" initialValue={false}>
              <Radio.Group
                options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PropertyDetailsModal;
