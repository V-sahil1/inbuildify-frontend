import { Button, Drawer, Form, Input, Modal, Select, Upload } from 'antd';
import RichTextEditorFormField from '../common/rich-text-editor/RichTextEditorFormField';

const EmailContent = ({ title, open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();
  function handleSubmit(values) {
    onSubmit(values);
  }
  // console.log("initial values",initialValues)
  return (
    <Drawer title={title} open={open} onClose={onCancel} size="large">
      <Form form={form} onFinish={handleSubmit} initialValues={initialValues}>
        <div>
          <div>
            <p>To</p>
            <Form.Item name="to">
              <Select
                options={[
                  { label: 'abc@gmail.com', value: 'abc@gmail.com' },
                  { label: 'xyz@gmail.com' },
                ]}
                mode="tags"
              />
            </Form.Item>
          </div>
          <div>
            <p>Subject</p>
            <Form.Item name="subject">
              <Input />
            </Form.Item>
          </div>
          <div>
            <p>Message</p>
            <Form.Item name="message">
              <RichTextEditorFormField
                value={form.getFieldValue('message') || ''}
                onChange={val => form.setFieldValue('message', val)}
                maxHeight="400px"
              />
            </Form.Item>
          </div>
          <div>
            <Form.Item
              name="file"
              valuePropName="fileList"
              getValueFromEvent={({ fileList }) => fileList}
              noStyle
            >
              <Upload multiple={false} maxCount={1} beforeUpload={() => false}>
                <Button>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </div>
          <div className="flex gap-2 justify-end">
            <Button>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </div>
      </Form>
    </Drawer>
  );
};

export default EmailContent;
