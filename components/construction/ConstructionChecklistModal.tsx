
import { Checkbox, Form, Input, Modal } from 'antd';
import { useState } from 'react';

const ConstructionChecklistModal = ({
  open,
  onCancel,
  onSubmit,
  title,
  isDefect,
  initialValues,
}) => {

  const [form] = Form.useForm();
  const [hideSetting, setHideSetting] = useState(true);

  async function handleSubmit() {
    const values = await form.validateFields();
    onSubmit(values);
    form.resetFields();
  }
  return (
    <Modal title={title} open={open} onCancel={onCancel} onOk={handleSubmit} centered>
      <Form form={form} initialValues={initialValues}>
        <div className="p-3">
          <div className="flex justify-between items-center">
            <div>
              <p>Checklist Name</p>
              <Form.Item name="checklist">
                <Input className="w-[250px]" />
              </Form.Item>
            </div>
            <div className="text-blue cursor-pointer" onClick={() => setHideSetting(!hideSetting)}>
              {hideSetting ? 'Hide Advance Settings' : 'Show Advance Settings'}
            </div>
          </div>
          <div className={hideSetting ? 'block' : 'hidden'}>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-baseline  gap-3">
                <Form.Item name="dateRequired" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
                <p>Date Required</p>
              </div>
              <div>
                <p>No of Days</p>
                <Form.Item name="noOfDays">
                  <Input className="w-[100px]" />
                </Form.Item>
              </div>
              <div>
                <p>Sort Order</p>
                <Form.Item name="sort">
                  <Input className="w-[100px]" />
                </Form.Item>
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="flex gap-2 items-baseline">
                <Form.Item name="supplier" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
                <p>Supplier</p>
              </div>
              {!isDefect && (
                <div className="flex gap-2 items-baseline">
                  <Form.Item name="notify" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <p>Notify</p>
                </div>
              )}
              {!isDefect && (
                <div className="flex gap-2 items-baseline">
                  <Form.Item name="claim" valuePropName="checked">
                    <Checkbox />
                  </Form.Item>
                  <p>Claim</p>
                </div>
              )}
              <div className="flex gap-2 items-baseline">
                <Form.Item name="milestone" valuePropName="checked">
                  <Checkbox />
                </Form.Item>
                <p>Milestone</p>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default ConstructionChecklistModal;
