import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Row,
  Col,
  Button,
  message,
  Upload,
} from 'antd';
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
import { CompactionReport, PropertyDetail } from '@redux/feature/lead/ILeadState';
import { ActionDialogmodel, FormField } from '../common/Models/ActionDialogModel';
import { usePdf } from '@hooks/usePdf';
import { CompactionReportPdf } from '@/components/common/pdf/PropertyComactionReportPdf';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { IconEdit } from '@tabler/icons-react';

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
  const [compactionOpen, setCompactionOpen] = useState(false);
  const [uploadedPdf, setUploadedPdf] = useState<File | null | string>(
    initialValues?.compactionReportUrl
  );
  const [compactionInfo, setCompactionInfo] = useState<CompactionReport | null>(
    initialValues?.compactionReportContent
  );
  const { stateOptions } = useStateHook();
  const { countryOptions } = useCountryHook();
  const { generatePdfUrl } = usePdf(CompactionReportPdf);
  const compaction = Form.useWatch('compactionReport', form);
  const titleStatus = Form.useWatch('titleStatus', form);

  useEffect(() => {
    if (compaction === 'available' && !initialValues) {
      setCompactionOpen(true);
      setUploadedPdf(null);
    } else if (initialValues?.compactionReport === 'not_available' && compaction === 'available') {
      setCompactionOpen(true);
      setUploadedPdf(null);
    }
  }, [compaction]);

  const handleSave = async () => {
    const values = await form.validateFields();
    const payload =
      values?.compactionReport === 'available'
        ? {
            ...values,
            compactionReportContent: compactionInfo,
            compactionReportUrl: uploadedPdf,
            titleDate: values.titleDate?.format('YYYY-MM-DD'),
            clearingDate: values.clearingDate?.format('YYYY-MM-DD'),
          }
        : {
            ...values,
            titleDate: values.titleDate?.format('YYYY-MM-DD'),
            clearingDate: values.clearingDate?.format('YYYY-MM-DD'),
          };

    try {
      if (leadDetail?.property) {
        await dispatch(
          updateLeadProperty({
            id: leadDetail?.property?.propertyDetailId,
            payload: formDataGenerator(payload),
          })
        ).unwrap();

        message.success('Lead Property updated successfully');
      } else {
        await dispatch(
          createLeadProperty({
            data: formDataGenerator(payload),
            leadId: leadDetail?.lead?.leadsId,
          })
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

      const clearingDateValue = initialValues.clearingDate
        ? dayjs.isDayjs(initialValues.clearingDate)
          ? initialValues.clearingDate
          : dayjs(initialValues.clearingDate)
        : null;

      // Ensure the dates are valid
      const validTitleDate = titleDateValue && titleDateValue.isValid() ? titleDateValue : null;
      const validClearingDate =
        clearingDateValue && clearingDateValue.isValid() ? clearingDateValue : null;

      form.setFieldsValue({
        ...initialValues,
        titleDate: validTitleDate,
        clearingDate: validClearingDate,
      });
      setUploadedPdf(initialValues?.compactionReportUrl);
    }
  }, [initialValues]);

  const compactionReport: FormField[] = [
    {
      label: 'Land Type',
      name: 'landType',
      type: 'radio',
      options: [
        { label: 'Rocky', value: 'Rocky' },
        { label: 'Sloping', value: 'Sloping' },
        { label: 'Plain', value: 'Plain' },
        { label: 'Uneven', value: 'Uneven' },
        { label: 'Filled Land', value: 'Filled Land' },
      ],
      rules: [{ required: true, message: 'Please select land type' }],
    },
    {
      label: 'Ground Level',
      name: 'groundLevel',
      type: 'radio',
      options: [
        { label: 'Above Road Level', value: 'Above Road Level' },
        { label: 'At Road Level', value: 'At Road Level' },
        { label: 'Below Road Level', value: 'Below Road Level' },
      ],
      rules: [{ required: true, message: 'Please select ground level' }],
    },
    {
      label: 'Slope Condition',
      name: 'slopeCondition',
      type: 'radio',
      options: [
        { label: 'Flat', value: 'Flat' },
        { label: 'Gentle Slope', value: 'Gentle Slope' },
        { label: 'Steep Slope', value: 'Steep Slope' },
      ],
      rules: [{ required: true, message: 'Please select Slope Condition' }],
    },
    {
      label: 'Soil Type',
      name: 'soilType',
      type: 'radio',
      options: [
        { label: 'Clay', value: 'Clay' },
        { label: 'Sand', value: 'Sand' },
        { label: 'Silt', value: 'Silt' },
        { label: 'Gravel', value: 'Gravel' },
        { label: 'Mixed', value: 'Mixed' },
      ],
      rules: [{ required: true, message: 'Please select Soil Type' }],
    },
    {
      label: 'Soil Classification (AS 2870)',
      name: 'soilClass',
      type: 'radio',
      options: [
        { label: 'A', value: 'A' },
        { label: 'S', value: 'S' },
        { label: 'M', value: 'M' },
        { label: 'H1', value: 'H1' },
        { label: 'H2', value: 'H2' },
        { label: 'E', value: 'E' },
        { label: 'P', value: 'P' },
      ],
      rules: [{ required: true, message: 'Please select Soil Classification' }],
    },
    {
      label: 'Moisture Content (%)',
      name: 'moistureContent',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter moisture content' },
        {
          validator: (_: any, value: number) => {
            if (value === undefined || value === null) return Promise.resolve();
            if (value <= 0) {
              return Promise.reject('Value must be greater than 0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: 'Dry Density (kg/m³)',
      name: 'dryDensity',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter dry density' },
        {
          validator: (_: any, value: number) => {
            if (value === undefined || value === null) return Promise.resolve();
            if (value <= 0) {
              return Promise.reject('Value must be greater than 0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: 'Max Dry Density (kg/m³)',
      name: 'maxDryDensity',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter max dry density' },
        {
          validator: (_: any, value: number) => {
            if (value === undefined || value === null) return Promise.resolve();
            if (value <= 0) {
              return Promise.reject('Value must be greater than 0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: '% Compaction',
      name: 'compaction',
      type: 'number',
      rules: [
        { required: true, message: 'Please enter compaction percentage' },
        {
          validator: (_: any, value: number) => {
            if (value === undefined || value === null) return Promise.resolve();
            if (value <= 0) {
              return Promise.reject('Value must be greater than 0');
            }
            return Promise.resolve();
          },
        },
      ],
    },
    {
      label: 'Result',
      name: 'result',
      type: 'select',
      options: [
        { label: 'PASS', value: 'pass' },
        { label: 'FAIL', value: 'fail' },
      ],
      placeholder: 'Please Select Result',
      rules: [{ required: true, message: 'Please select Result' }],
    },
    {
      label: 'Engineer Name',
      name: 'engineerName',
      type: 'text',
      rules: [{ required: true, message: 'Please Enter Engineer Name' }],
    },
    {
      label: 'Remarks',
      name: 'remarks',
      type: 'textarea',
      rules: [{ required: true, message: 'Please Enter remark' }],
    },
  ];

  const handleCompactionReport = async values => {
    setCompactionInfo(values);
    try {
      let pdfUrl = null;
      // Generate PDF from form data
      pdfUrl = await generatePdfUrl(values);
      setUploadedPdf(pdfUrl as any);
      setCompactionOpen(false);
    } catch (error) {
      message.error('Error processing compaction report');
    }
  };

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
        onValuesChange={(_, values) => {
          const width = values.widthM;
          const depth = values.depthM;
          form.setFieldValue('totalSizeM2', width * depth);
        }}
      >
        {/* Address Section */}
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item label="Lot No" name="lotNumber" rules={leadAddressRules}>
              <Input placeholder="Lot 234" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Street Name" name="street">
              <Input placeholder="Lot 234" maxLength={255} />
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
          <Col span={titleStatus === 'pending' ? 6 : 8}>
            <Form.Item label="Estate Name" name="estateName" rules={optionalNameRules}>
              <Input placeholder="Enter estate name" />
            </Form.Item>
          </Col>
          <Col span={titleStatus === 'pending' ? 6 : 8}>
            <Form.Item
              label="Title Status"
              name="titleStatus"
              rules={[{ required: true, message: 'Please select title status' }]}
            >
              <Select placeholder="Select status" options={titleStatusOptions} />
            </Form.Item>
          </Col>
          {titleStatus === 'pending' && (
            <Col span={6}>
              <Form.Item
                label="Clearing Date"
                name="clearingDate"
                rules={[{ required: true, message: 'Please select clearing date' }]}
              >
                <DatePicker
                  className="w-full"
                  format="DD-MM-YYYY"
                  placeholder="13-07-2023"
                  disabledDate={disablePastDates}
                />
              </Form.Item>
            </Col>
          )}

          <Col span={titleStatus === 'pending' ? 6 : 8}>
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
                disabled={titleStatus == 'pending'}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={18}>
            <Row gutter={16} className="items-center">
              <Col span={22}>
                <Form.Item
                  label="Compaction Report"
                  name="compactionReport"
                  rules={[{ required: true, message: 'Please select Compaction Report' }]}
                >
                  <Select
                    placeholder="Select availability"
                    options={compactionReportOptions}
                    className="w-full"
                    onSelect={value => {
                      if (value === 'available') {
                        setCompactionOpen(true);
                      }
                    }}
                  />
                </Form.Item>
              </Col>

              {compaction === 'available' && compactionInfo && (
                <Col span={2}>
                  <IconEdit
                    className="text-primary cursor-pointer"
                    onClick={() => setCompactionOpen(true)}
                  />
                </Col>
              )}
            </Row>
          </Col>

          <Col span={6}>
            {compaction === 'available' && uploadedPdf && (
              <Upload
                accept=".pdf"
                maxCount={1}
                beforeUpload={() => false}
                onChange={info => {
                  if (info.fileList.length > 0) {
                    const file = info.fileList[0].originFileObj;
                    setUploadedPdf(file);
                    console.log('PDF file uploaded:', file);
                  } else {
                    setUploadedPdf(null);
                  }
                }}
                showUploadList={{
                  showRemoveIcon: true,
                  showPreviewIcon: true,
                }}
                onPreview={file => {
                  if (uploadedPdf instanceof File) {
                    const url = URL.createObjectURL(uploadedPdf);
                    window.open(url, '_blank');
                  } else if (typeof uploadedPdf === 'string') {
                    window.open(uploadedPdf, '_blank');
                  }
                }}
                fileList={
                  uploadedPdf
                    ? [
                        {
                          uid: '-1',
                          name: 'Compaction Report',
                          status: 'done',
                          originFileObj: uploadedPdf as any,
                        },
                      ]
                    : []
                }
                disabled
              >
                <Button>Upload PDF</Button>
              </Upload>
            )}
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
            <Form.Item
              label="Total Size (m²)"
              name="totalSizeM2"
              rules={OptionalNumberRules}
              initialValue={0}
            >
              <Input
                type="number"
                min={0}
                onKeyPress={e => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                disabled
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
      {compactionOpen && (
        <ActionDialogmodel
          title="Compaction Report Info"
          open={compactionOpen}
          onCancel={() => setCompactionOpen(false)}
          onSubmit={handleCompactionReport}
          fields={compactionReport}
          isEditing={!!initialValues?.compactionReportContent || !!compactionInfo}
          initialValues={initialValues?.compactionReportContent || compactionInfo}
        />
      )}
    </Modal>
  );
};

export default PropertyDetailsModal;
