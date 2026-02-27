import { useEstateHook } from '@hooks/useEStateHook';
import { useEstateStage } from '@hooks/useEstateStageHook';
import { useStateHook } from '@hooks/useStateHook';
import { ILandLot } from '@redux/feature/land/ILandState';
import { IconX } from '@tabler/icons-react';
import { Button, DatePicker, Drawer, Form, Input, Radio, Select } from 'antd';
import { useEffect } from 'react';

type LandLotFormModelProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: ILandLot) => void;
  isCopy: boolean;
  initialValues?: ILandLot;
};
const titleStatusOptions = [
  { label: 'Available', value: 'available' },
  { label: 'Sold', value: 'sold' },
  { label: 'Reserved', value: 'reserved' },
  { label: 'Pending', value: 'pending' },
  { label: 'Under Contract', value: 'under_contract' },
  { label: 'Off Market', value: 'off_market' },
]
const LandLotFormModel: React.FC<LandLotFormModelProps> = ({
  title,
  open,
  onClose,
  isCopy,
  onSubmit,
  initialValues,
}) => {
  const [form] = Form.useForm();
  const estateId = Form.useWatch('estateId', form);
  const { estateOptions } = useEstateHook()
  const { estateStageOptions } = useEstateStage(estateId)
  const { stateOptions } = useStateHook()

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues)
    }
  }, [initialValues])

  const handleSubmit = (values: ILandLot) => {
    onSubmit(values);
    form.resetFields();
  };

  return (
    <Drawer
      title={title}
      open={open}
      onClose={onClose}
      closeIcon={false}
      size="large"
      extra={<IconX style={{ cursor: 'pointer' }} onClick={onClose} size={20} />}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Lot Number" name="lotNumber" className="!text-red-500">
            <Input />
          </Form.Item>
          <Form.Item label="Lot Price" name="price">
            <Input addonBefore={<div className="bg-gray-300">$</div>}></Input>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Estate" name="estateId">
            <Select options={estateOptions} />
          </Form.Item>
          <Form.Item label="stage" name="estateStageId">
            <Select options={estateStageOptions} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Street Name" name="street">
            <Input />
          </Form.Item>
          <Form.Item label="City" name="city">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="State/Region" name="stateId">
            <Select options={stateOptions} />
          </Form.Item>
          <Form.Item label="Zip/Postal Code" name="zipCode">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Title Status" name="titleStatus">
            <Select options={titleStatusOptions} />
          </Form.Item>
          <Form.Item
            label="Title Date"
            name="titleDate"
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Lot Type" name="lotType">
            <Radio.Group
              block
              options={[
                { label: 'Regular', value: 'regular' },
                { label: 'Irregular', value: 'irregular' },
              ]}
            />
          </Form.Item>
          <Form.Item label="Corner Block" name="cornerBlock">
            <Radio.Group
              block
              options={[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]}
            />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Site Fall (mm)" name="siteFallMm">
            <Input />
          </Form.Item>
          <Form.Item label="Land Fill (mm)" name="landFillMm">
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-3 gap-2 ">
          <Form.Item label="Width(m)" name="widthM">
            <Input />
          </Form.Item>
          <Form.Item label="Depth(m)" name="depthM">
            <Input />
          </Form.Item>
          <Form.Item label="Total Size (m2)" name="totalSizeM2">
            <Input />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-2">
          <Button>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};

export default LandLotFormModel;
