import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Upload, Button, message, Select } from 'antd';
// import type { UploadFile } from "antd/es/upload/interface";
import { IFloorPlanState } from '@redux/feature/floorPlan/IFloorPlanState';
// import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from '@hooks/redux';
// import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
// import { Status } from "@lib/constants/enum";
import { createFloorPlan } from '@redux/feature/floorPlan/floorPlanThunk';
import { setQuotationPlan } from '@redux/feature/quotation/quotationSlice';
import { acceptOnlyImageRule } from '@lib/constants/formInputValidations';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';

const CustomPlanTab: React.FC<{ onCancel: () => void }> = ({ onCancel }) => {
  const [form] = Form.useForm<IFloorPlanState>();
  const dispatch = useAppDispatch();
  const { selectedFilters } = useAppSelector((state: any) => state.quotation);
  const [loading, setLoading] = useState(false);
   const { rangeOptions, dwellingTypeOptions } = useDwellingAndRangeHook({type : ['range','dwellingType']});
 

  useEffect(() => {
    form.setFieldsValue({
      dwellingTypeId: selectedFilters?.dwelling_type,
      rangeId: selectedFilters?.range,
    });
  }, [selectedFilters]);

  const handleCreateFloorPlan = async (values: any) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('range', values.rangeId);
      formData.append('dwelling_type', values.dwellingTypeId);
      formData.append('beds', values.beds);
      formData.append('bath', values.bath);
      formData.append('car_park', values.car_park);
      formData.append('width_meter', values.width_meter);
      formData.append('depth_meter', values.depth_meter);
      formData.append('dwelling', values.dwelling);
      formData.append('garage', values.garage);
      formData.append('porch', values.porch);
      formData.append('alfresco', values.alfresco);
      formData.append('total_sqft', values.total_sqft);
      formData.append('image', values.image.fileList[0].originFileObj);

      const response = await dispatch(createFloorPlan(formData)).unwrap();
      dispatch(setQuotationPlan(response));
      message.success('Floor Plan successfully Created!');
      onCancel();
      form.resetFields();
      setLoading(false);
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[70vh] flex flex-col">
      <Form
        form={form}
        layout="vertical"
        onFinish={handleCreateFloorPlan}
        autoComplete="off"
        className="flex-1 flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-font-color">Basic Information</h3>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input floor plan name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Range"
              name="rangeId"
              rules={[{ required: true, message: 'Please input range ID' }]}
            >
              <Select
                placeholder="Select range"
                options={rangeOptions}
                value={selectedFilters?.range}
                disabled
                // className="white-disabled-select"
              />
            </Form.Item>

            <Form.Item
              label="Dwelling Type"
              name="dwellingTypeId"
              rules={[{ required: true, message: 'Please input dwelling type ID' }]}
            >
              <Select
                placeholder="Select dwelling type"
                options={dwellingTypeOptions}
                value={selectedFilters?.dwelling_type}
                disabled
                // className="white-disabled-select"
              />
            </Form.Item>
            <Form.Item
              key="image"
              name="image"
              label="Upload Image"
              valuePropName="file"
              rules={[{ required: true, message: 'Please upload an image' }]}
            >
              <Upload
                name="image"
                listType="picture"
                multiple={false}
                maxCount={1}
                accept={acceptOnlyImageRule}
                beforeUpload={() => false}
              >
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>

          {/* Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-font-color">Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Beds"
                name="beds"
                rules={[
                  { required: true, message: 'Please input number of beds' },
                  { pattern: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Only numbers allowed' },
                ]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Bath"
                name="bath"
                rules={[{ required: true, message: 'Please input number of baths' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Car Park"
                name="car_park"
                rules={[{ required: true, message: 'Please input number of car parks' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Garage"
                name="garage"
                rules={[{ required: true, message: 'Please input number of garages' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Width (m)"
                name="width_meter"
                rules={[{ required: true, message: 'Please input width in meters' }]}
              >
                <Input
                  type="number"
                  step="0.01"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Depth (m)"
                name="depth_meter"
                rules={[{ required: true, message: 'Please input depth in meters' }]}
              >
                <Input
                  type="number"
                  step="0.01"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Dwelling (sqm)"
                name="dwelling"
                rules={[{ required: true, message: 'Please input dwelling area' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Porch (sqm)"
                name="porch"
                rules={[{ required: true, message: 'Please input porch area' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Alfresco (sqm)"
                name="alfresco"
                rules={[{ required: true, message: 'Please input alfresco area' }]}
              >
                <Input
                  min={0}
                  className="w-full"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Total Sqft"
                name="total_sqft"
                rules={[{ required: true, message: 'Please input total square footage' }]}
              >
                <Input
                  type="number"
                  step="0.01"
                  onKeyPress={e => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                />
              </Form.Item>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end space-x-4">
          <Button onClick={() => form.resetFields()} className="mt-4">
            Reset Form
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
            loading={loading}
          >
            Save Floor Plan
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CustomPlanTab;
