import { Button, Form, Input, Modal } from 'antd';

const ChecklistNotesModal = ({ open, onCancel, onSubmit }) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();
  async function handleSubmit() {
    const values = await form.validateFields();
    console.log('notes submit', values);
    onSubmit(values);
    onCancel();
  }
  return (
    <Modal title="Add Notes" open={open} onCancel={onCancel} onOk={handleSubmit}>
      <Form form={form} className="p-2">
        <Form.Item name="notes">
          <TextArea rows={3} maxLength={500} showCount placeholder="Enter Notes Here" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChecklistNotesModal;
