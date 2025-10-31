'use client';

import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  message,
  Switch,
  DatePicker,
  InputNumber,
} from 'antd';
import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import {
  getCountriesThunk,
  getStatesByCountryIdThunk,
} from '@redux/feature/location/locationThunk';
import { DefaultOptionType } from 'antd/es/select';
import { getLeadSourcesThunk } from '@redux/feature/lead/leadThunk';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { getDwellingTypes } from '@redux/feature/types/typesThunk';
import { useUsersHook } from '@hooks/useUserData';

interface LeadFormData {
  contactName: string;
  email: string;
  primaryPhone: string;
  leadSource: string;
  salesPerson: string | undefined;
  jobStatus: string;
  lotNo?: string;
  streetNo?: string;
  address1: string;
  address2?: string;
  citySuburb: string;
  zipPostalCode: string;
  country: string;
  stateRegion: string;

  estateName?: string;
  titleStatus: string | undefined;
  dwellingType: string | undefined;
  titleDate?: dayjs.Dayjs | null;
  contactAddressSameAsProperty: boolean;

  quotationTotalCost?: number;
  initialDeposit?: number;
  quotationApprovedDate?: dayjs.Dayjs | null;
  quotationSignedDate?: dayjs.Dayjs | null;
  priceDescription?: string;
  notes?: string;
}

interface LeadCreationModalProps {
  open: boolean;
  isEditing: boolean;
  initialValues?: Partial<LeadFormData>;
  onClose: () => void;
  onSubmit: () => void;
}

const jobStatusOptions = [
  { value: 'Preconstruction', label: 'Preconstruction' },
  { value: 'Color', label: 'Color' },
  { value: 'Construction', label: 'Construction' },
  { value: 'Maintenance', label: 'Maintenance' },
];

const titleStatusOptions = [
  { value: 'Estimated', label: 'Estimated' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Titled', label: 'Titled' },
];

export const JobCreationModal: React.FC<LeadCreationModalProps> = ({
  open,
  isEditing,
  initialValues,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm<LeadFormData>();
  const [loading, setLoading] = React.useState(false);
  const { countries, status, states } = useAppSelector(state => state.location);
  const { leadSources, status: leadStatus } = useAppSelector(state => state.lead);
  const { dwellingType, status: dwellingTypeStatus } = useAppSelector(state => state.types);
  const { users, isLoading, isError } = useUsersHook();
  if (isError) {
    // message.error(isError || "Failed to fetch users");
  }
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        await dispatch(getCountriesThunk()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch countries:');
      }
    };
    const fetchLeadSources = async () => {
      try {
        await dispatch(getLeadSourcesThunk()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch users');
      }
    };
    const fetchDwellingTypes = async () => {
      try {
        await dispatch(getDwellingTypes()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch users');
      }
    };

    if (status === Status.IDLE) {
      fetchCountries();
    }
    if (leadStatus.leadSources === Status.IDLE) {
      fetchLeadSources();
    }
    if (dwellingTypeStatus.dwellingType === Status.IDLE) {
      fetchDwellingTypes();
    }
  }, []);

  useEffect(() => {
    if (open) {
      if (isEditing && initialValues) {
        const valuesToSet: any = { ...initialValues };

        // Convert string dates to dayjs objects for DatePicker components
        if (valuesToSet.titleDate) valuesToSet.titleDate = dayjs(valuesToSet.titleDate);
        if (valuesToSet.quotationApprovedDate)
          valuesToSet.quotationApprovedDate = dayjs(valuesToSet.quotationApprovedDate);
        if (valuesToSet.quotationSignedDate)
          valuesToSet.quotationSignedDate = dayjs(valuesToSet.quotationSignedDate);

        form.setFieldsValue(valuesToSet);
      }
    } else {
      form.resetFields();
      setLoading(false);
    }
  }, [open, isEditing, initialValues, form]);

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    try {
      setLoading(true);
      // Validate fields
      const values = await form.validateFields();

      const submissionValues: any = {
        ...values,
        titleDate: values.titleDate?.toISOString(),
        quotationApprovedDate: values.quotationApprovedDate?.toISOString(),
        quotationSignedDate: values.quotationSignedDate?.toISOString(),
      };

      onSubmit();

      message.success(`Job ${isEditing ? 'updated' : 'created'} successfully!`);
    } catch (error) {
      message.error('Please check the form for errors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Job' : 'Create New Job'}
      open={open}
      onCancel={handleCancel}
      confirmLoading={loading}
      centered
      width={750}
      className=""
      footer={[
        <Button key="back" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          {isEditing ? 'Update Job' : 'Create Job'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '12px' }}
        className="custom-scrollbar"
      >
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Contact Name"
              name="contactName"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Required' },
                { type: 'email', message: 'Invalid email' },
              ]}
            >
              <Input type="email" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Primary Phone"
              name="primaryPhone"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Lead Source"
              name="leadSource"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select Lead Source"
                options={leadSources.map(source => ({
                  label: enumToReadable(source.name),
                  value: source.leadSourceId,
                }))}
              />
            </Form.Item>
            <div style={{ marginTop: '-16px', marginBottom: '8px' }}>
              {/* <Button type="link" icon={<PlusCircleOutlined />} size="small">Referral Partner</Button> */}
            </div>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Sales Person"
              name="salesPerson"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Please Select"
                loading={isLoading}
                options={users?.map(user => ({
                  label: user.name,
                  value: user.usersId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Job Status"
              name="jobStatus"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select options={jobStatusOptions} />
            </Form.Item>
          </Col>
        </Row>

        <h3
          style={{
            marginTop: '16px',
            borderBottom: '1px solid #f0f0f0',
            paddingBottom: '8px',
          }}
        >
          Property Details:
        </h3>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Lot No" name="lotNo">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Street No" name="streetNo">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Address 1"
              name="address1"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Address 2" name="address2">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="City / Suburb"
              name="citySuburb"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Zip / Postal Code"
              name="zipPostalCode"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Country"
              name="country"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select
                placeholder="Select country"
                onChange={(value, option) => {
                  const opt = option as DefaultOptionType;
                  form.setFieldsValue({ country: opt?.label as string });
                  dispatch(getStatesByCountryIdThunk(value as string));
                }}
              >
                {(countries || [])?.map(country => (
                  <Select.Option
                    key={country?.countryId}
                    value={country?.countryId}
                    label={country?.name}
                  >
                    {country?.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="State / Region"
              name="stateRegion"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Select placeholder="Select state">
                {states?.length &&
                  states?.map(state => (
                    <Select.Option key={state?.stateId} value={state?.name} label={state?.name}>
                      {state?.name}
                    </Select.Option>
                  ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Estate Name" name="estateName">
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Title Status" name="titleStatus">
              <Select placeholder="Please select" options={titleStatusOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Dwelling Type" name="dwellingType">
              <Select
                placeholder="Please Select"
                options={dwellingType?.map(type => ({
                  label: type?.name,
                  value: type?.dwellingTypeId,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Title Date" name="titleDate">
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="contactAddressSameAsProperty" valuePropName="checked">
          <Switch />
          <label htmlFor="">Contact address same as Property address</label>
        </Form.Item>

        <h3 className="text-font-color font-medium">Quotation Details:</h3>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Quotation Total Cost" name="quotationTotalCost">
              <InputNumber
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Initial Deposit"
              name="initialDeposit"
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                style={{ width: '100%' }}
                min={0}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item
              label="Quotation Approved Date"
              name="quotationApprovedDate"
              rules={[{ required: true, message: 'Required' }]}
            >
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Quotation Signed Date" name="quotationSignedDate">
              <DatePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Form.Item label="Price Description" name="priceDescription">
              <Input.TextArea rows={4} maxLength={250} placeholder="Total Job Cost" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Notes" name="notes">
              <Input.TextArea rows={4} maxLength={1000} />
              <div
                style={{
                  textAlign: 'right',
                  fontSize: '12px',
                  color: '#8c8c8c',
                }}
              >
                {form.getFieldValue('notes')?.length || 0} / 1000 characters
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
