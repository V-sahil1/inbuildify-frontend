import { Checkbox, Form, Input, Modal } from 'antd';

export function ChecklistSubtaskModal({ open, onCancel, onSubmit }) {
  const [form] = Form.useForm();
  async function handleSubmit() {
    const values = await form.validateFields();
    console.log('subtask submit', values);
    onSubmit(values);
    onCancel();
  }
  return (
    <Modal title="Add Subtask" open={open} onCancel={onCancel} onOk={handleSubmit} centered>
      <div>
        <Form form={form}>
          <div className="p-3">
            <div>
              <p>Subchecklist Name</p>
              <Form.Item name="subchecklist">
                <Input />
              </Form.Item>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="flex items-baseline  gap-3">
                <Form.Item name="dateRequired" valuePropName="checked" initialValue={false}>
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
          </div>
        </Form>
      </div>
    </Modal>
  );
}
