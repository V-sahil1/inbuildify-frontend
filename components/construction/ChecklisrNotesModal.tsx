import { Button, Form, Input, Modal } from 'antd';

const ChecklistNotesModal = ({
  open,
  onCancel,
  onSubmit,
  initialValue = '',
  isEditable = true,
}) => {
  const { TextArea } = Input;
  const [form] = Form.useForm();

  async function handleSubmit() {
    const values = await form.validateFields();
    onSubmit(values.notes);
    onCancel();
  }
  return (
    <Modal
      title="Add Notes"
      open={open}
      onCancel={onCancel}
      centered
      footer={
        isEditable ? (
          <div className="flex gap-2 justify-end">
            <Button onClick={onCancel}>Cancel</Button>
            <Button type="primary" htmlType="submit" onClick={handleSubmit}>
              Save
            </Button>
          </div>
        ) : null
      }
    >
      <Form form={form} className="p-2">
        <Form.Item name="notes" initialValue={initialValue}>
          <TextArea
            rows={3}
            maxLength={500}
            showCount
            placeholder="Enter Notes Here"
            disabled={!isEditable}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChecklistNotesModal;
