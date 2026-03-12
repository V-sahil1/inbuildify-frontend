import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio, Row, Col, Button, message } from 'antd';
import dayjs from 'dayjs';
import { PropertyDetails } from 'data/types';
import {
  createLeadProperty,
  updateLeadProperty,
  updatePropertyDetailsThunk,
} from '@redux/feature/lead/leadThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { useParams, usePathname } from 'next/navigation';
import { setQuotationPropertyFromResponse } from '@redux/feature/quotation/quotationSlice';
import { setLeadProperty } from '@redux/feature/lead/leadSlice';
import { enumToReadable } from '@lib/utils/enumToRedable';
import {
  getCountriesThunk,
  getStatesByCountryIdThunk,
} from '@redux/feature/location/locationThunk';
import { Status } from '@lib/constants/enum';
import { DefaultOptionType } from 'antd/es/select';
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
  onSave: (values: PropertyDetails) => void;
  initialValues?: PropertyDetail;
}

const PropertyDetailsModal: React.FC<PropertyDetailsModalProps> = ({
  visible,
  onCancel,
  onSave,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const leadid = useParams();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const isQuotationRoute = (pathname || '').toLowerCase().includes('quotation');
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

    //   const leadId = isQuotationRoute ? leadid?.id : ((leadDetail as any)?.lead?.leadId ?? '');
    //   const titleStatusUpper = String(values?.titleStatus || '').toUpperCase();
    //   const mappedTitleStatus =
    //     titleStatusUpper === 'ACTUAL' || titleStatusUpper === 'CONFIRMED' ? 'ACTUAL' : 'ESTIMATED';

    //   const compactionUpper = String(values?.compactionReport || '')
    //     .toUpperCase()
    //     .replace(/\s+/g, '_');
    //   const mappedCompaction = compactionUpper === 'AVAILABLE' ? 'AVAILABLE' : 'NOT_AVAILABLE';

    //   const mappedBushFire = values?.bushFire === true || values?.bushFire === 'Yes';
    //   const mappedCornerBlock = values?.cornerBlock === true || values?.cornerBlock === 'Yes';
    //   const payload = {
    //     lead_id: leadId,
    //     country: values?.country,
    //     address1: values?.address1,
    //     address2: values?.address2,
    //     city_suburb: values?.citySuburb,
    //     state_region: values?.stateRegion,
    //     zip_postal_code: values?.zipPostalCode,
    //     estate_name: values?.estateName,
    //     title_status: mappedTitleStatus,
    //     title_date: values?.titleDate ? dayjs(values?.titleDate).format('YYYY-MM-DD') : '',
    //     compaction_report: mappedCompaction,
    //     land_type: values?.landType?.toUpperCase?.() || 'REGULAR',
    //     width_m: values?.width ? Number(values?.width) : 0,
    //     depth_m: values?.depth ? Number(values?.depth) : 0,
    //     total_size_m2: values?.totalSize ? Number(values?.totalSize) : 0,
    //     site_fall_mm: values?.siteFall ? Number(values?.siteFall) : 0,
    //     land_fill_mm: values?.landFill ? Number(values?.landFill) : 0,
    //     bush_fire: mappedBushFire,
    //     corner_block: mappedCornerBlock,
    //   };

    //   // const response = await dispatch(updatePropertyDetailsThunk(payload)).unwrap();
    //   message.success('Property updated successfully');

    //   // if (isQuotationRoute) {
    //   // dispatch(setQuotationPropertyFromResponse(response));
    //   // // } else {
    //   // dispatch(setLeadProperty(response));
    //   // }

    //   const formattedValues: PropertyDetails = {
    //     lot: values?.address1 || '',
    //     location: `${values?.citySuburb}, ${values?.stateRegion}, ${values?.zipPostalCode}`,
    //     titleDate: values?.titleDate
    //       ? dayjs(values?.titleDate).format('DD-MM-YYYY') + ' (Estimated)'
    //       : '',
    //     type: values?.landType || 'Regular',
    //     width: values?.width?.toString() || '',
    //     depth: values?.depth?.toString() || '',
    //     total: values?.totalSize?.toString() || '',
    //   } as any;

    //   onSave(formattedValues);
    //   onCancel();
    // } catch (error) {
    //   message.error(error || 'Failed to update property');
    // }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  useEffect(() => {
    if (initialValues) {
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
  }, [initialValues]);
  // // Set initial values when modal opens
  // useEffect(() => {
  //   const src = isQuotationRoute ? ((quotation as any)?.property ?? initialValues) : initialValues;
  //   // if (visible && src) {
  //   //   form.setFieldsValue({
  //   //     country: src?.country || '',
  //   //     address1: src?.address1 || '',
  //   //     address2: src?.address2 || '',
  //   //     citySuburb: src?.citySuburb || '',
  //   //     stateRegion: src?.stateRegion || '',
  //   //     zipPostalCode: src?.zipPostalCode || '',
  //   //     estateName: src?.estateName || '',
  //   //     titleStatus: src?.titleStatus || '',
  //   //     titleDate: src?.titleDate ? dayjs(src.titleDate) : null,
  //   //     compactionReport: src?.compactionReport || '',
  //   //     landType: enumToReadable(src?.landType) || 'Regular',
  //   //     width: src?.widthM || '',
  //   //     depth: src?.depthM || '',
  //   //     totalSize: src?.totalSizeM2 || '',
  //   //     siteFall: src?.siteFallMm || '',
  //   //     landFill: src?.landFillMm || '',
  //   //     bushFire: src?.bushFire ? 'Yes' : 'No',
  //   //     cornerBlock: src?.cornerBlock ? 'Yes' : 'No',
  //   //   });
  //   // }
  // }, [visible, initialValues, form, isQuotationRoute, quotation]);

  const titleStatusOptions = [
    { label: 'Estimated', value: 'ESTIMATED' },
    { label: 'Actual', value: 'ACTUAL' },
  ];

  const compactionReportOptions = [
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Not Available', value: 'NOT_AVAILABLE' },
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
        initialValues={initialValues}
      >
        {/* Address Section */}
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item label="Lot No" name="lotNumber" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Street No" name="street" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="Address1" name="addressLine1" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          {/* <Col span={6}>
            <Form.Item label="Address 2" name="address2" rules={addressLine2Rules}>
              <Input placeholder="Optional" />
            </Form.Item>
          </Col> */}
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
        >
          <Radio.Group>
            <Radio value="REGULAR">Regular</Radio>
            <Radio value="IRREGULAR">Irregular</Radio>
          </Radio.Group>
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
            <Form.Item label="Bush Fire" name="bushFire">
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Corner Block" name="cornerBlock">
              <Radio.Group>
                <Radio value={true}>Yes</Radio>
                <Radio value={false}>No</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PropertyDetailsModal;
