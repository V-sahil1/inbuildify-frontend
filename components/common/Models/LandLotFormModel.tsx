import { IconX } from "@tabler/icons-react";
import { Button, DatePicker, Drawer, Form, Input, Radio, Select } from "antd"

type LandLotFormField ={
  lotNumber:string;
  lotPrice:string;
  estate:string;
  stage:string;
  street:string;
  city:string;
  state:string;
  zipcode:string;
  titleStatus:string;
  date:string;
  lotType:string;
  cornerBlock:string;
  siteFall:string;
  landFill:string;
  width:number;
  depth:number;
  totalSize:number;
}

type LandLotFormModelProps = {
title:string;
open:boolean;
onClose:()=>void;
onSubmit:(values)=>void;
isCopy:boolean;
initialValues?:LandLotFormField[];
}

const LandLotFormModel:React.FC<LandLotFormModelProps> = ({ title, open, onClose, isCopy, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log(values);
    onSubmit(values)
    form.resetFields()
  }

  return (
    <Drawer title={title} open={open} onClose={onClose} closeIcon={false} size="large"
      extra={
        <IconX
          style={{ cursor: "pointer" }}
          onClick={onClose}
          size={20}
        />
      }>
      <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={initialValues}>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Lot Number" name='lotNumber' className="!text-red-500">
            <Input />
          </Form.Item>
          <Form.Item label="Lot Price" name='lotPrice'>
            <Input addonBefore={<div className="bg-gray-300">$</div>}></Input>
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Estate" name='estate'>
            <Select />
          </Form.Item>
          <Form.Item label="stage" name='stage'>
            <Select />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Street Name" name='street'>
            <Input />
          </Form.Item>
          <Form.Item label="City" name='city'>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="State/Region" name='state'>
            <Select />
          </Form.Item>
          <Form.Item label="Zip/Postal Code" name='zipcode'>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Title Status" name='titleStatus'>
            <Select />
          </Form.Item>
          <Form.Item label="Title Date" name='date'>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Lot Type" name='lotType'>
            <Radio.Group block options={[
              { label: 'Regular', value: 'regular' }, { label: 'Irregular', value: 'irregular' }
            ]} />
          </Form.Item>
          <Form.Item label="Corner Block" name='cornerBlock'>
            <Radio.Group block options={[
              { label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }
            ]} />
          </Form.Item>
        </div>
        <div className="grid grid-cols-2 gap-2 ">
          <Form.Item label="Site Fall (mm)" name='sitefall'>
            <Input />
          </Form.Item>
          <Form.Item label="Land Fill (mm)" name='landFill'>
            <Input />
          </Form.Item>
        </div>
        <div className="grid grid-cols-3 gap-2 ">
          <Form.Item label="Width(m)" name='width'>
            <Input />
          </Form.Item>
          <Form.Item label="Depth(m)" name='depth'>
            <Input />
          </Form.Item>
          <Form.Item label="Total Size (m2)" name='totalsize'>
            <Input />
          </Form.Item>
        </div>
        <div className="flex justify-end gap-2">
          <Button>Cancel</Button>
          <Button htmlType="submit">Save</Button>
        </div>
      </Form>
    </Drawer>
  )
}

export default LandLotFormModel