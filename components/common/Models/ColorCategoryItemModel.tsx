'use client';

import React, { useState, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  message,
  Row,
  Col,
  Button,
  Upload,
  Select,
  Checkbox,
  Table,
  Empty,
  Popconfirm,
} from 'antd';
import {
  nameRules,
  optionalNotesRule,
  acceptOnlyImageRule,
} from '@lib/constants/formInputValidations';
import { IconUpload } from '@tabler/icons-react';
import { Status } from '@lib/constants/enum';
import { PackageGroupField } from '@/components/package/PackageGroupField';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createRange, updateRange } from '@redux/feature/admin/sales/range/rangeThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import {
  createColourItem,
  createColourItemCustomField,
  createColourType,
  deleteColourItemCustomField,
  updateColourItem,
  updateColourType,
} from '@redux/feature/color/colorThunk';
import { useSupplierHook } from '@hooks/useSupplierHook';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { ColorItem, ColorItemCustomField } from '@redux/feature/color/iColourState';
import { useColorTypeHook } from '@hooks/useColorTypeHook';
import { values } from 'lodash';
import NoDataMessage from '../NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';

interface ColorCategoryItemModalProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
  selectedColorCategoryId?: string;
  categoryItem?: ColorItem;
  handleAddColorItem?: (values) => void;
}

const FieldTypes = [
  { value: 'text', name: 'text' },
  { value: 'dropdown_list', name: 'dropdown_list' },
  { value: 'checkbox', name: 'checkbox' },
  { value: 'radio_button', name: 'radio_button' },
];

const ColorCategoryItemModel = ({
  open,
  onClose,
  selectedColorCategoryId,
  categoryItem,
}: ColorCategoryItemModalProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(state => state.colour);
  const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
  const { colorType } = useColorTypeHook();
  const [images, setImages] = useState<{ color: File[]; specification: File[] }>({
    color: [],
    specification: [],
  });
  const isStandard = Form.useWatch('costType', form);
  const isTBA = Form.useWatch('upgradeOption', form);
  const { supplierOptions } = useSupplierHook();
  const uploadRef = useRef(null);
  const imageUploadRef = useRef(null);

  const handleUploadClick = () => {
    // Trigger the hidden upload input
    const input = uploadRef.current?.upload?.uploader?.fileInput;
    if (input) input.click();
  };
  const handleImageUploadClick = () => {
    // Trigger the hidden upload input
    const input = imageUploadRef.current?.upload?.uploader?.fileInput;
    if (input) input.click();
  };

  const handleRangeSubmit = async (values, selectedRange) => {
    try {
      if (!!selectedRange) {
        await dispatch(updateRange({ data: values, id: selectedRange.rangeId })).unwrap();
        message.success('Range updated successfully');
      } else {
        await dispatch(createRange(values)).unwrap();
        message.success('Range saved successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save range');
    }
  };

  const handleColorTypeSubmit = async (values, selectedColorType) => {
    try {
      if (!!selectedColorType) {
        await dispatch(
          updateColourType({ data: values, id: selectedColorType.colorTypeId })
        ).unwrap();
        message.success('Color type updated successfully');
      } else {
        await dispatch(createColourType(values)).unwrap();
        message.success('Color type saved successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save color type');
    }
  };

  const handleAddCustomField = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    try {
      const values = form.getFieldsValue(['fieldType', 'fieldName', 'requiredField']);
      const sortOrder = form.getFieldValue('customFieldSortOrder');

      if (!values.fieldType || !values.fieldName) {
        message.error('Please fill in all required fields');
        return;
      }
      await dispatch(
        createColourItemCustomField({ ...values, sortOrder, colorItem: categoryItem?.colorItemId })
      ).unwrap();
      message.success('Custom field added successfully');
      form.setFieldsValue({
        fieldType: undefined,
        fieldName: '',
        requiredField: false,
        customFieldSortOrder: '',
      });
    } catch (error) {
      const errorMessage = error?.message || error?.toString() || 'Failed to add custom field';
      message.error(errorMessage);
    }
  };

  const onFinish = async values => {
    try {
      await form.validateFields();
      const { ...restValues } = values;
      const payload = {
        ...restValues,
        colorImage: images?.color,
        specification: images?.specification,
      };
      if (categoryItem) {
        const { isUpdated, updatedFields } = getUpdatedFields(payload, categoryItem);
        if (!isUpdated) {
          message.info('No changes detected');
          return;
        }
        const formData = formDataGenerator(updatedFields);
        await dispatch(updateColourItem({ data: formData, id: categoryItem.colorItemId })).unwrap();
        message.success('Sub-category item updated successfully');
      } else {
        const formData = formDataGenerator({
          ...payload,
          colorCategoryId: selectedColorCategoryId,
        });
        await dispatch(createColourItem(formData)).unwrap();
        message.success('Sub-category item created successfully');
      }
      handleCancel();
    } catch (error) {
      message.error(error || 'Failed to save category item');
    }
  };

  const handleDeleteCustomField = async (id: string) => {
    try {
      await dispatch(
        deleteColourItemCustomField({ id, colorItemId: categoryItem.colorItemId })
      ).unwrap();
      message.success('Custom field deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete custom field');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const initialValues = categoryItem
    ? categoryItem
    : {
        isActive: true,
        highlightNotesOnPdf: false,
      };

  const columns = [
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
      render: fieldType => {
        const field = FieldTypes.find(ft => ft.value === fieldType);
        return field ? field.name : fieldType;
      },
    },
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: 'Required',
      dataIndex: 'requiredField',
      key: 'requiredField',
      render: value => (value ? 'Yes' : 'No'),
    },
    {
      title: 'Sort Order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (record: ColorItemCustomField) => (
        <div className="flex gap-2">
          <Popconfirm
            title="Are you sure you want to delete custom field"
            onConfirm={() => handleDeleteCustomField(record.colorItemCustomFieldId)}
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <Modal
      title={categoryItem ? 'Update Sub category Item' : 'Add Sub category Item'}
      open={open}
      onCancel={handleCancel}
      footer={null}
      width="90%"
      centered
      style={{ maxWidth: 1400 }}
      className="responsive-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        style={{
          maxWidth: '100%',
          maxHeight: '70vh',
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollbarWidth: 'none',
        }}
        className="responsive-form"
        initialValues={initialValues}
        disabled={status.colorItem.create === Status.PENDING}
      >
        {false ? (
          <div className="text-center p-4">Loading form data...</div>
        ) : (
          <>
            <Row gutter={16}>
              <Col xs={20} md={10}>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item name="itemName" label="Item Name" rules={nameRules}>
                      <Input placeholder="Enter item name" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="itemCode"
                      label="Item Code"
                      rules={[{ required: true, message: 'Please enter item code' }]}
                    >
                      <Input maxLength={100} minLength={1} placeholder="Enter item code" />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="costType"
                      label="Cost Type"
                      initialValue="standard"
                      rules={[{ required: true, message: 'Please select cost type' }]}
                    >
                      <Radio.Group
                        options={[
                          { label: 'Standard', value: 'standard' },
                          { label: 'Upgrade', value: 'upgrade' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="supplierId"
                      label="Supplier"
                      rules={[{ required: true, message: 'Please select a supplier' }]}
                    >
                      <Select
                        showSearch
                        placeholder="Select supplier"
                        options={supplierOptions}
                        notFoundContent={
                          <NoDataMessage label="Supplier" link={SystemRoutes.SUPPLIER} />
                        }
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="upgradeOption"
                      label="Upgrade Option"
                      rules={[{ required: false, message: 'Please select upgrade option' }]}
                    >
                      <Radio.Group
                        disabled={isStandard === 'standard'}
                        options={[
                          { label: 'Fixed', value: 'fixed' },
                          { label: 'Start From', value: 'start_from' },
                          { label: 'TBA', value: 'tba' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="status"
                      label=" Status"
                      initialValue="active"
                      rules={[{ required: true, message: 'Please select status' }]}
                    >
                      <Radio.Group
                        options={[
                          { label: 'Active', value: true },
                          { label: 'Inactive', value: false },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="cost"
                      label="Price"
                      rules={[
                        {
                          required: false,
                          message: 'Please enter price',
                        },
                      ]}
                    >
                      <InputNumber
                        disabled={isStandard === 'standard' || isTBA === 'tba'}
                        style={{ width: '100%' }}
                        min={0}
                        step={0.01}
                        formatter={value => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        placeholder="Enter price"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={12} md={12}>
                    <Form.Item
                      name="sortOrder"
                      label=" Sort Order"
                      rules={[{ required: false, message: 'Please select sort order' }]}
                    >
                      <InputNumber
                        style={{ width: '100%' }}
                        min={0}
                        step={1}
                        type="number"
                        placeholder="Enter sort order"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Row 2: Item Code + Cost Type */}
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item
                      name="units"
                      label="Units"
                      initialValue="non_mandatory"
                      rules={[{ required: true, message: 'Please select units' }]}
                    >
                      <Radio.Group
                        options={[
                          { label: 'Mandatory', value: 'mandatory' },
                          { label: 'Non Mandatory', value: 'non_mandatory' },
                          { label: 'Not Required', value: 'not_required' },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item name="features" label="Features" rules={optionalNotesRule}>
                      <Input.TextArea rows={3} maxLength={500} placeholder="Enter features" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item name="description" label="Description" rules={optionalNotesRule}>
                      <Input.TextArea rows={3} maxLength={500} placeholder="Enter description" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item name="colorTypeId" label="Color Types">
                      <PackageGroupField
                        form={form}
                        formName="colorTypeId"
                        label="Color Types"
                        fields={[{ label: 'Name', name: 'colorTypeName', type: 'text' }]}
                        onSubmit={handleColorTypeSubmit}
                        data={colorType?.map(i => ({
                          ...i,
                          name: i.colorTypeName,
                          id: i.colorTypeId,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <Form.Item name="rangeId" label="Range">
                      <PackageGroupField
                        form={form}
                        formName="rangeId"
                        label="Range"
                        fields={[{ label: 'Range Name', name: 'name', type: 'text' }]}
                        onSubmit={handleRangeSubmit}
                        data={rangeOptions?.map(item => ({
                          ...item,
                          name: item.label,
                          id: item.value,
                        }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col xs={28} md={14}>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <p>Color Item Custom Field</p>
                    <Row gutter={16}>
                      <Col xs={12} md={6}>
                        <Form.Item
                          name="fieldType"
                          label="Field Type"
                          rules={[{ required: false, message: 'Please select a field type' }]}
                        >
                          <Select
                            showSearch
                            placeholder="Select field type"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            options={FieldTypes.map(type => ({
                              value: type.value,
                              label: type.name,
                            }))}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={10} md={5}>
                        <Form.Item
                          name="fieldName"
                          label="Field name"
                          rules={[{ required: false, message: 'Please enter field name' }]}
                        >
                          <Input placeholder="Enter field name" />
                        </Form.Item>
                      </Col>
                      <Col xs={8} md={4}>
                        <Form.Item
                          name="requiredField"
                          valuePropName="checked"
                          label="Required Field"
                          className="text-center"
                        >
                          <Checkbox />
                        </Form.Item>
                      </Col>
                      <Col xs={10} md={5}>
                        <Form.Item name="customFieldSortOrder" label="Sort Order">
                          <Input type="number" placeholder="Enter sort order" />
                        </Form.Item>
                      </Col>
                      <Col xs={8} md={4} className="flex justify-end items-center">
                        <Button type="primary" onClick={handleAddCustomField}>
                          Add
                        </Button>
                      </Col>
                    </Row>

                    {/* Add the table below the form */}
                    <div className="mt-4">
                      {categoryItem?.customFields?.length > 0 ? (
                        <Table
                          columns={columns}
                          dataSource={categoryItem?.customFields}
                          pagination={false}
                          loading={status.colorItemCustomField.fetch === Status.PENDING}
                          rowKey="colorItemCustomFieldId"
                        />
                      ) : (
                        <div className="text-center py-2">
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                              <span className="text-gray-500">
                                {/* <InfoCircleOutlined className="mr-2" /> */}
                                No Custom Color found
                              </span>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <p className="mt-4">Color Image</p>
                    <Form.Item name="colorImage">
                      <Button
                        icon={<IconUpload />}
                        className="ml-auto flex self-end"
                        onClick={handleImageUploadClick}
                      />
                      <Upload
                        ref={imageUploadRef}
                        beforeUpload={() => false}
                        maxCount={10}
                        listType="picture"
                        accept={acceptOnlyImageRule}
                        onChange={info => {
                          const files = info.fileList
                            .map(file => file.originFileObj)
                            .filter(Boolean);
                          setImages({
                            ...images,
                            color: files,
                          });
                        }}
                      />

                      <div>
                        {images?.color?.length > 0 ? null : (
                          <div className="w-full">
                            <div className="text-center py-2">
                              <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={
                                  <span className="text-gray-500">No image uploaded</span>
                                }
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={24} md={24}>
                    <p>Specification</p>
                    <Form.Item name="specificationName">
                      <Button
                        icon={<IconUpload />}
                        className="ml-auto flex self-end"
                        onClick={handleUploadClick}
                      />
                      <Upload
                        ref={uploadRef}
                        beforeUpload={() => false}
                        maxCount={10}
                        listType="picture"
                        className="text-center"
                        accept="image/*,.pdf"
                        onChange={info => {
                          const files = info.fileList
                            .map(file => file.originFileObj)
                            .filter(Boolean);
                          setImages({
                            ...images,
                            specification: files,
                          });
                        }}
                      />
                    </Form.Item>
                    <Form.Item name="specificationName">
                      <Input placeholder="Enter specification text" />
                    </Form.Item>
                    <div>
                      {images.specification?.length > 0 ? null : (
                        <div className="w-full">
                          <div className="text-center py-2">
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description={
                                <span className="text-gray-500">No Document uploaded</span>
                              }
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            {/* Submit Button */}
            <Row gutter={16} justify="end">
              <Col className="pb-2">
                <Button
                  onClick={handleCancel}
                  style={{ marginRight: 8 }}
                  disabled={status.colorItem.create === Status.PENDING}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={status.colorItem.create === Status.PENDING}
                  disabled={status.colorItem.create === Status.PENDING}
                >
                  {categoryItem ? 'Update' : 'Create'}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ColorCategoryItemModel;
