'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Modal,
  message,
  Row,
  Col,
  Switch,
  Button,
  Upload,
  UploadFile,
  Select,
  DatePicker,
  Checkbox,
  Table,
  Empty,
} from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createColourSubCategoryItem,
  updateColourSubCategoryItem,
} from '@redux/feature/color/colorThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { SubCategoryItem } from '@redux/feature/color/iColourState';
import { nameRules, optionalNotesRule, numberRules, acceptOnlyImageRule } from '@lib/constants/formInputValidations';
import dayjs from 'dayjs';
import { useUsersHook } from '@hooks/useUserData';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { ColorRange, ColorTypes, FieldTypes } from 'data/color/ColorData';
import { IconUpload } from '@tabler/icons-react';
import { Status } from '@lib/constants/enum';

interface ColorCategoryItemModalProps {
  open: boolean;
  onClose: () => void;
  categoryId?: string;
  selectedColorSubCategoryId?: string;
  categoryItem?: SubCategoryItem;
}

interface FormValues {
  name: string;
  code: string;
  units?: number;
  image: any[];
  costType: 'standard' | 'upgrade';
  upgradeOption: 'fixed' | 'startFrom' | 'tba';
  notes?: string;
  price?: number;
  supplierId?: string;
  categoryId?: string;
  isActive: boolean;
  expirationDate?: string;
}
interface SpecificationItem {
  file?: any[]; // File object
  note?: string;
}

const ColorCategoryItemModel = ({
  open,
  onClose,
  selectedColorSubCategoryId,
  categoryItem,
}: ColorCategoryItemModalProps) => {
  const [form] = Form.useForm();
  const [colorTypes, setColorTypes] = useState<{id: string; name: string}[]>(ColorTypes);
  const [range, setRange] = useState<{id: string; name: string}[]>(ColorRange);
  const [selectedColorTypes, setSelectedColorTypes] = useState<{id: string; name: string}[]>([]);
  const [selectedRange, setSelectedRange] = useState<{id: string; name: string}[]>([]);
  const [colorImages, setColorImages] = useState<any[]>([]);
  const [specificationItems, setSpecificationItems] = useState<SpecificationItem>();
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [isStandard, setIsStandard] = useState<boolean>(true);
  const [isTBA, setIsTBA] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const [customFields, setCustomFields] = useState<Array<{
  fieldType: number;
  fieldName: string;
  isRequired: boolean;
  sortOrder: number;
}>>([]);
  const {users,  isLoading: usersLoading} = useUsersHook();


  useEffect(() => {
  // Set form loading to false once users are loaded
  if (!usersLoading) {
    setFormLoading(false);
  }
}, [usersLoading]);

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

const handleAddCustomField = (e?: React.MouseEvent) => {
  e?.preventDefault();
  
  try {
    const values = form.getFieldsValue(['customFieldType', 'customFieldName', 'requiredField', 'sortOrder']);
    
    if (!values.customFieldType || !values.customFieldName) {
      message.error('Please fill in all required fields');
      return;
    }
    
    setCustomFields(prev => [
      ...prev,
      {
      fieldType: values.customFieldType,
      fieldName: values.customFieldName,
      isRequired: values.requiredField || false,
      sortOrder: Number(values.sortOrder) || 0
    }
  ]);
  // Reset the form fields
  form.setFieldsValue({
    customFieldType: undefined,
    customFieldName: '',
    requiredField: false,
    sortOrder: ''
  });
}
catch (error) {
  console.error('Error adding custom field:', error);
}
}

  const handleAddNewColorType = useCallback(async (name: string) => {
    // In a real app, you would save this to your backend first
    const newColorType = {
      id: Date.now().toString(),
      name,
    };
    
    setColorTypes(prev => [...prev, newColorType]);
    return newColorType;
  }, []);

  const handleAddNewRange = useCallback(async (name: string) => {
    // In a real app, you would save this to your backend first
    const newRange = {
      id: Date.now().toString(),
      name,
    };
    
    setRange(prev => [...prev, newRange]);
    return newRange;
  }, []);

  const onFinish = async (values: FormValues) => {
    try {
      await form.validateFields();
      setLoading(true);
      
      const { ...restValues } = values;
  
      // Prepare form data
      const formData = {
        ...restValues,
        colorTypes: selectedColorTypes,
        colorRange: selectedRange,
        customData: customFields,
        colorImage : colorImages,
        specification: specificationItems,
        colorSubCategoryId: selectedColorSubCategoryId,
        image: values?.image?.[0]?.originFileObj,
      };

      // const formDataToSubmit = formDataGenerator(formData);
      console.log('Form Data to Submit:', formData);

      // if (categoryItem) {
      //   await dispatch(
      //     updateColourSubCategoryItem({
      //       id: categoryItem.colorItemId,
      //       data: formDataToSubmit,
      //     })
      //   ).unwrap();
      //   message.success('Sub-category item updated successfully');
      // } else {
      //   await dispatch(createColourSubCategoryItem(formDataToSubmit)).unwrap();
      //   message.success('Sub-category item created successfully');
      // }
      
      handleCancel();
    } catch (error: any) {
      console.error('Form submission error:', error);
      message.error(error?.message || 'Failed to save sub-category item');
    } finally {
      setLoading(false);
    }
  };

   const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const initialValues = categoryItem
    ? {
        ...categoryItem,
        costType: categoryItem.standard ? 'standard' : 'upgrade',
        image: categoryItem.image
          ? [
              {
                uid: '-1',
                name: 'current-image',
                status: 'done',
                url: categoryItem.image,
                thumbUrl: categoryItem.image,
              } as UploadFile,
            ]
          : undefined,
        expirationDate: categoryItem.expirationDate ? dayjs(categoryItem.expirationDate) : undefined,
        isActive: categoryItem.isActive ?? true,
      }
    : {
        isActive: true,
        highlightNotesOnPdf: false,
      };

  const columns = [
    {
      title: 'Field Type',
      dataIndex: 'fieldType',
      key: 'fieldType',
      render: (fieldType) => {
        const field = FieldTypes.find(ft => ft.value === fieldType);
        return field ? field.name : fieldType;
      }
    },
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: 'Required',
      dataIndex: 'isRequired',
      key: 'isRequired',
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
      render: (_: any, index) => (
        <div className="flex gap-2">
          <Button
            type="link"
            danger
            onClick={() => {
              const newFields = [...customFields];
              newFields.splice(index, 1);
              setCustomFields(newFields);
            }}
          >
            Delete
          </Button>
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
      <Form<FormValues>
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
        disabled={formLoading}
      >
        {formLoading ? (
          <div className="text-center p-4">Loading form data...</div>
        ) : (
          <>
          <Row gutter={16}>
          <Col xs={20} md={10}>
            <Row gutter={16}>
              <Col xs={24} md={24}>
                <Form.Item
                  name="name"
                  label="Item Name"
                  rules={nameRules}
                >
                  <Input placeholder="Enter item name" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={12} md={12}>
                <Form.Item
                  name="code"
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
                  <Radio.Group>
                    <Radio value="standard" onChange={() => setIsStandard(true)}>Standard</Radio>
                    <Radio value="upgrade" onChange={() => setIsStandard(false)}>Upgrade</Radio>
                  </Radio.Group>
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
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={users.map(user => ({
                      value: user?.usersId,
                      label: user.name,
                    }))}
                    loading={formLoading}
                  />
                </Form.Item>
              </Col>
              <Col xs={12} md={12}>
                <Form.Item
                  name="upgradeOption"
                  label="Upgrade Option"
                  initialValue="fixed"
                  rules={[{ required: false, message: 'Please select upgrade option' }]}
                >
                  <Radio.Group disabled={isStandard}>
                    <Radio value="fixed" onChange={() => setIsTBA(false)}>Fixed</Radio>
                    <Radio value="startFrom" onChange={() => setIsTBA(false)}>Start From</Radio>
                    <Radio value="tba" onChange={() => setIsTBA(true)}>TBA</Radio>
                  </Radio.Group>
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
                  <Radio.Group>
                    <Radio value="active">Active</Radio>
                    <Radio value="inactive">Inactive</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xs={12} md={12}>
                <Form.Item
                  name="price"
                  label="Price"
                  rules={[
                    {
                      required: false,
                      message: 'Please enter price',
                    },
                  ]}
                >
                  <InputNumber
                  disabled={isStandard || isTBA }
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
                  initialValue="nonMandatory"
                  rules={[{ required: true, message: 'Please select units' }]}
                >
                  <Radio.Group>
                    <Radio value="mandatory">Mandatory</Radio>
                    <Radio value="nonMandatory">Non Mandatory</Radio>
                    <Radio value="notRequired">Not Required</Radio>
                  </Radio.Group>
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
              <Form.Item name="colorTypes" label="Color Types" rules={optionalNotesRule}>
                <MultiSelectDropdown
                  items={colorTypes}
                  selectedItems={selectedColorTypes}
                  onSelectionChange={setSelectedColorTypes}
                  onAddNewItem={handleAddNewColorType}
                  placeholder="+ Color Type"
                />
              </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} md={24}>
              <Form.Item name="colorRange" label="Range" rules={optionalNotesRule}>
                  <MultiSelectDropdown
                  items={range}
                  selectedItems={selectedRange}
                  onSelectionChange={setSelectedRange}
                  onAddNewItem={handleAddNewRange}
                  placeholder="+ Range"
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
                        name="customFieldType"
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
                        name="customFieldName"
                        label="Field name"
                        rules={[{ required: false, message: 'Please enter field name' }]}
                      >
                        <Input placeholder="Enter field name" />
                      </Form.Item>
                    </Col>
                    <Col xs={8} md={4}>
                      <Form.Item name="requiredField" valuePropName="checked" label="Required Field" className='text-center'>
                        <Checkbox />
                      </Form.Item>
                    </Col>
                    <Col xs={10} md={5}>
                      <Form.Item name="sortOrder" label="Sort Order">
                        <Input type="number" placeholder="Enter sort order" />
                      </Form.Item>
                    </Col>
                    <Col xs={8} md={4} className='flex justify-end items-center'>
                      <Button 
                        type="primary" 
                        onClick={handleAddCustomField}
                        loading={formLoading}
                      >
                        Add
                      </Button>
                    </Col>
                  </Row>

                  {/* Add the table below the form */}
                  <div className="mt-4">
                    {customFields.length > 0 ? (
                           <Table
                            columns={columns}
                            dataSource={customFields}
                            pagination={false}
                            loading={status === Status.PENDING}
                            rowKey="id"
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
                <p className='mt-4'>Color Image</p>
                  <Form.Item name="colorImage">
                        <Button icon={<IconUpload />} className='ml-auto flex self-end'  onClick={handleImageUploadClick}></Button>
                        <Upload ref={imageUploadRef} beforeUpload={() => false} maxCount={10} listType="picture" accept={acceptOnlyImageRule} onChange={(info) => {
                          const files = info.fileList;
                          const imageFiles = files.filter(file => file.type.startsWith('image/'));
                          setColorImages(imageFiles);
                        }}>
                          {/* <Button icon={<IconUpload />} className='ml-auto flex self-end'></Button> */}
                        </Upload>
                                     <div>
                      {colorImages?.length > 0 ? null : (
                        <div className="w-full">
                          <div className="text-center py-2">
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description={
                                <span className="text-gray-500">
                                  No image uploaded
                                </span>
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
                  <Form.Item name="specification">
                        <Button 
                        icon={<IconUpload />} 
                        className='ml-auto flex self-end'
                          onClick={handleUploadClick}
                          ></Button>
                        <Upload
                          ref={uploadRef}
                          beforeUpload={() => false}
                          maxCount={10}
                          listType="picture"
                          className='text-center'
                          accept="image/*,.pdf"
                          onChange={(info) => {
                            const files = info.fileList;
                            const validFiles = files.filter(file =>
                              file.type.startsWith('image/') || file.type === 'application/pdf'
                            );
                            setSpecificationItems({ file: validFiles });
                          }}
                        >
                          {/* <Button icon={<IconUpload />}></Button> */}
                        </Upload>
                  </Form.Item>
                  <Form.Item name="specificationText">
                        <Input placeholder="Enter specification text" onChange={(e) => setSpecificationItems({note: e.target.value})}/>
                  </Form.Item>
                               <div>
                      {(specificationItems?.file?.length > 0 || specificationItems?.note )? null : (
                        <div className="w-full">
                          <div className="text-center py-2">
                            <Empty
                              image={Empty.PRESENTED_IMAGE_SIMPLE}
                              description={
                                <span className="text-gray-500">
                                  No Document uploaded
                                </span>
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

        {/* <Col span={12}>
    <Form.Item name="supplier" label="Supplier">
      <Select placeholder="Enter supplier name" options={assigneeOptions}/>
    </Form.Item>
  </Col> */}

            {/* Submit Button */}
            <Row gutter={16} justify="end">
              <Col className='pb-2'>
                <Button onClick={handleCancel} style={{ marginRight: 8 }} disabled={loading}>
                  Cancel
                </Button>
                <Button type="primary" htmlType="submit" loading={loading}>
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
