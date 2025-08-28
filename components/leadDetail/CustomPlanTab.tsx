import React, { useEffect, useState } from "react";
import { Form, Input, InputNumber, Upload, Button, message, Select } from "antd";
import type { UploadFile } from "antd/es/upload/interface";
import { IFloorPlanState } from "@redux/feature/floorPlan/IFloorPlanState";
import dayjs from "dayjs";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { enumArrayToOptions } from "@lib/utils/enumArrayToOptionsConvert";
import { Status } from "@lib/constants/enum";
import { createFloorPlan, getFloorPlanFilters } from "@redux/feature/floorPlan/floorPlanThunk";
import MyProfile from "@/pages/my-profile";
import { getExpectedRequestStore } from "next/dist/client/components/request-async-storage.external";



const CustomPlanTab: React.FC = () => {
  const [form] = Form.useForm<IFloorPlanState>();
  const dispatch = useAppDispatch();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { filters, status } = useAppSelector((state: any) => state.floorPlan);

  useEffect(() => {
    if (status.filters === Status.IDLE) {
      dispatch(getFloorPlanFilters()).unwrap()
    }
  }, [dispatch, status, filters])

  const onFinish = async (values: IFloorPlanState) => {
     await dispatch(createFloorPlan(values)).unwrap();
    message.success('Floor Plan successfully Created!');
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
    message.error('Please fill in all required fields');
  };

  const uploadProps = {
    onRemove: (file: UploadFile) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
      form.setFieldValue('image', '');
    },
    beforeUpload: (file: File) => {
      // setFileList([...fileList, file]);
      form.setFieldValue('image', file.name);
      return false;
    },
    fileList,
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-[70vh] flex flex-col">
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        className="flex-1 flex flex-col"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input floor plan name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Range"
              name="range"
              rules={[{ required: true, message: 'Please input range ID' }]}
            >
              <Select
                placeholder="Select range"
                options={enumArrayToOptions(filters?.ranges)}
              />
            </Form.Item>

            <Form.Item
              label="Dwelling Type"
              name="dwelling_type"
              rules={[{ required: true, message: 'Please input dwelling type ID' }]}
            >
              <Select
                placeholder="Select dwelling type"
                options={enumArrayToOptions(filters?.dwellingTypes)}
              />
            </Form.Item>
            <Form.Item
              label="Floor Plan Image"
              name="image"
              rules={[
                { required: true, message: "Please enter an image URL" },
                { type: "url", message: "Please enter a valid URL" },
              ]}
            >
              <Input placeholder="https://example.com/floorplan.jpg" />
            </Form.Item>
          </div>

          {/* Measurements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Measurements</h3>
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label="Beds"
                name="beds"
                rules={[{ required: true, message: 'Please input number of beds' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Bath"
                name="bath"
                rules={[{ required: true, message: 'Please input number of baths' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Car Park"
                name="car_park"
                rules={[{ required: true, message: 'Please input number of car parks' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Garage"
                name="garage"
                rules={[{ required: true, message: 'Please input number of garages' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Width (m)"
                name="width_meter"
                rules={[{ required: true, message: 'Please input width in meters' }]}
              >
                <Input type="number" step="0.01" />
              </Form.Item>

              <Form.Item
                label="Depth (m)"
                name="depth_meter"
                rules={[{ required: true, message: 'Please input depth in meters' }]}
              >
                <Input type="number" step="0.01" />
              </Form.Item>

              <Form.Item
                label="Dwelling (sqm)"
                name="dwelling"
                rules={[{ required: true, message: 'Please input dwelling area' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Porch (sqm)"
                name="porch"
                rules={[{ required: true, message: 'Please input porch area' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Alfresco (sqm)"
                name="alfresco"
                rules={[{ required: true, message: 'Please input alfresco area' }]}
              >
                <InputNumber min={0} className="w-full" />
              </Form.Item>

              <Form.Item
                label="Total Sqft"
                name="total_sqft"
                rules={[{ required: true, message: 'Please input total square footage' }]}
              >
                <Input type="number" step="0.01" />
              </Form.Item>
            </div>
          </div>
          </div>

        <div className="mt-4 flex justify-end space-x-4">
          <Button onClick={() => form.resetFields()} className="mt-4">
            Reset Form
          </Button>
          <Button type="primary" htmlType="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
            Save Floor Plan
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CustomPlanTab;


// My

// {
//   "name": "asdasd",
//   "image": "http://localhost:3000/quotation/create",
//   "range": "PREMIUM",
//   "dwelling_type": "DOUBLE_STOREY",
//   "beds": 12,
//   "bath": 2,
//   "car_park": 33,
//   "width_meter": "3",
//   "depth_meter": "3",
//   "dwelling": 2,
//   "garage": 2,
//   "porch": 2,
//   "alfresco": 2,
//   "totalSqft": "2",
//   "floorPlanId": "20250828141511"
// }

// getExpectedRequestStore
// {
//   "name": "The Haven 24",
//   "image": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
//   "range": "PREMIUM",
//   "dwelling_type": "DOUBLE_STOREY",
//   "beds": "4",
//   "bath": "3",
//   "car_park": "2",
//   "width_meter": "15",
//   "depth_meter": "20",
//   "dwelling": "1",
//   "garage": "1",
//   "porch": "1",
//   "alfresco": "1",
//   "total_sqft": "3200"
// }