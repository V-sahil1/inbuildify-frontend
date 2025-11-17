import { Button, Form, Input, Modal, Radio, Select, Upload } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import RangeSelect from '../common/custom-selects/RangeSelect';
import {
  acceptOnlyImageRule,
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { useEffect } from 'react';
const { TextArea } = Input;
const FloorPlanFormModal = ({ title, open, onCancel, onSubmit, initialValues, isEditing }) => {
  const [form] = Form.useForm();
  async function handleSubmit() {
    const values = await form.validateFields();
    console.log('floorplan submit', values);
    onSubmit(values);
  }
  useEffect(() => {
    isEditing && form.setFieldsValue(initialValues);
  }, []);
  return (
    <Modal title={title} open={open} onCancel={onCancel} width={800} onOk={handleSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name" rules={settingNameRules}>
          <Input className="max-w-[300px]" type="text" placeholder="Luxury Villa" />
        </Form.Item>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <div className="flex justify-between gap-2">
              <Form.Item label="Min Land Width(m)" name="widthMeter" rules={numberRules}>
                <Input type="number" />
              </Form.Item>
              <Form.Item label="Min Land Depth(m)" name="depthMeter" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Dwelling(sq)" name="dwelling" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between  gap-2">
              <Form.Item label="Beds" name="beds" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Bath" name="bath" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Carpark" name="carPark" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Living" name="living" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between  gap-2">
              <Form.Item label="Garage(sq)" name="garage" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Porch(sq)" name="porch" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Alfresco(sq)" name="alfresco" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Total(sq)" name="totalSqft" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-2">
            <Form.Item
              label="Dwelling Type"
              name="dwellingTypeName"
              rules={[{ required: true, message: 'Please select a dwelling type' }]}
            >
              <DwellingTypeSelect />
            </Form.Item>
            <Form.Item
              label="Label"
              name="label"
              rules={[{ required: true, message: 'Please select a label' }]}
            >
              <Select options={[{ label: 'All', value: 'all' }]} />
            </Form.Item>
            {isEditing && (
              <Form.Item label="Location" name="location">
                <Select options={[{ label: 'All', value: 'all' }]} />
              </Form.Item>
            )}
          </div>
        </div>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}
        >
          <Radio.Group
            defaultValue="Active"
            options={[
              { label: 'Active', value: 'Active' },
              { label: 'InActive', value: 'InActive' },
            ]}
          />
        </Form.Item>
        <div className="flex gap-[50%]">
          <Form.Item
            label="Detailed Image"
            name="detailed_image"
            rules={[{ required: true, message: 'Please upload image' }]}
          >
            <Upload accept={acceptOnlyImageRule}>
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Simple Image"
            name="simple_image"
            rules={[{ required: true, message: 'Please upload image' }]}
          >
            <Upload accept={acceptOnlyImageRule}>
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <Form.Item
          label="FloorPlan Description"
          name="descrition"
          rules={[{ required: true, message: 'Enter Description' }]}
        >
          <TextArea rows={4} className="!resize-none" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FloorPlanFormModal;
