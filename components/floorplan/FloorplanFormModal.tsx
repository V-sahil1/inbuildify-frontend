import { Button, Form, Input, Modal, Radio, Select, Upload } from 'antd';
import DwellingTypeSelect from '../common/custom-selects/DwellingTypeSelect';
import {
  acceptOnlyImageRule,
  numberRules,
  settingNameRules,
} from '@lib/constants/formInputValidations';
import { useEffect } from 'react';
import useDwellingAndRangeHook from '@hooks/useDwellingAndRangeHook';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
const { TextArea } = Input;
const FloorPlanFormModal = ({
  title,
  open,
  onCancel,
  onSubmit,
  initialValues,
  isEditing,
  loading,
}) => {
  const [form] = Form.useForm();
  const { rangeOptions } = useDwellingAndRangeHook({ type: 'range' });
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });

  useEffect(() => {
    isEditing &&
      form.setFieldsValue({
        ...initialValues,
        status: initialValues.status ? 'true' : 'false',
        detailedImage: [
          {
            uid: '-1',
            name: 'Detailed Image',
            status: 'done',
            url: initialValues.detailedImage,
          },
        ],
        simpleImage: [
          {
            uid: '-1',
            name: 'Simple Image',
            status: 'done',
            url: initialValues.simpleImage,
          },
        ],
      });
  }, [initialValues]);

  async function handleSubmit() {
    const values = await form.validateFields();
    const { detailedImage, simpleImage, ...rest } = values;
    let detailedImageFile = null;
    let simpleImageFile = null;
    if (detailedImage && detailedImage.length > 0) {
      detailedImageFile = detailedImage[0].originFileObj || detailedImageFile;
    }
    if (simpleImage && simpleImage.length > 0) {
      simpleImageFile = simpleImage[0].originFileObj || simpleImageFile;
    }
    const formData = formDataGenerator({
      ...rest,
      detailedImage: detailedImageFile,
      simpleImage: simpleImageFile,
    });
    onSubmit(formData);
  }
  return (
    <Modal title={title} open={open} onCancel={onCancel} width={800} onOk={handleSubmit}>
      <Form form={form} layout="vertical">
        <Form.Item label="Name" name="name" rules={settingNameRules}>
          <Input className="max-w-[300px]" type="text" placeholder="Luxury Villa" />
        </Form.Item>
        <div className="grid grid-cols-6 gap-2">
          <div className="col-span-4">
            <div className="flex justify-between gap-2">
              <Form.Item label="Min Land Width(m)" name="minLandWidth" rules={numberRules}>
                <Input type="number" onWheel={(e) => e.currentTarget.blur()} />
              </Form.Item>
              <Form.Item label="Min Land Depth(m)" name="minLandDepth" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Dwelling(sq)" name="dwellingArea" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between  gap-2">
              <Form.Item label="Beds" name="beds" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Bath" name="baths" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Carpark" name="carpark" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Living" name="living" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between  gap-2">
              <Form.Item label="Garage(sq)" name="garageArea" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Porch(sq)" name="porchArea" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Alfresco(sq)" name="alfrescoArea" rules={numberRules}>
                <Input />
              </Form.Item>
              <Form.Item label="Total(sq)" name="totalArea" rules={numberRules}>
                <Input />
              </Form.Item>
            </div>
          </div>
          <div className="col-span-2">
            <Form.Item
              label="Dwelling Type"
              name="dwellingTypeId"
              rules={[{ required: true, message: 'Please select a dwelling type' }]}
            >
              <DwellingTypeSelect />
            </Form.Item>
            <Form.Item
              label="Label"
              name="rangeId"
              rules={[{ required: true, message: 'Please select a label' }]}
            >
              <Select options={rangeOptions} placeholder="Select Label" />
            </Form.Item>
            {/* {isEditing && locationOptions?.length > 0 && (
              <Form.Item label="Location" name="locationId">
                <Select options={locationOptions} placeholder="Select Location" />
              </Form.Item>
            )} */}
          </div>
        </div>
        <Form.Item
          label="Status"
          name="status"
          rules={[{ required: true, message: 'Please select a status' }]}
          initialValue="true"
        >
          <Radio.Group
            options={[
              { label: 'Active', value: 'true' },
              { label: 'InActive', value: 'false' },
            ]}
          />
        </Form.Item>
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label="Detailed Image"
            name="detailedImage"
            rules={[{ required: true, message: 'Please upload image' }]}
            getValueFromEvent={e => {
              if (e && e.fileList) {
                return e.fileList;
              }
              return [];
            }}
          >
            <Upload
              accept={acceptOnlyImageRule}
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="Simple Image"
            name="simpleImage"
            rules={[{ required: true, message: 'Please upload image' }]}
            getValueFromEvent={e => {
              if (e && e.fileList) {
                return e.fileList;
              }
              return [];
            }}
          >
            <Upload
              accept={acceptOnlyImageRule}
              multiple={false}
              maxCount={1}
              beforeUpload={() => false}
            >
              <Button>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </div>
        <Form.Item
          label="FloorPlan Description"
          name="description"
          rules={[{ required: true, message: 'Enter Description' }]}
        >
          <TextArea rows={4} className="!resize-none" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FloorPlanFormModal;
