import { Button, DatePicker, Drawer, Form, Input, Select, Upload } from 'antd';
import RichTextEditor from '../rich-text-editor/RichTextEditor';
import { useUsersHook } from '@hooks/useUserData';
import { useEffect, useMemo } from 'react';

export const TodoFormDrawer = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const { users } = useUsersHook();
  const userOptions = users.map(user => ({ label: user.name, value: user.usersId }));
  const supplier = Form.useWatch('supplier', form);
  const start = Form.useWatch('start', form);
  const finish = Form.useWatch('finish', form);
  // todo : supplier,start,finish value should reflect in rich text editor
  const messageContent = `<div className='space-y-2'>
        <p>Dear ${supplier},</p>
        <p> This is to bring to your notice that the Electrician trench and meter application including all conduits has been requested for the below site and dates:</p>
        <p>Job Address: Lot 28 Ballarat Street, Epping, VIC, 3039</p>
        <p>Request: Electrician trench and meter application + all conduits – Construction</p>
        <p>Date: ${start} to ${finish}</p>
        <p><Link href='#'>click here</Link> to accept or decline the booking, or to propose a new date.</p>
        <p><Link href='#'>Sign up</Link> to the Insimplify Tradies Portal to view all jobs in one place.</p>
        <p>Regards,</p>
        <p>Kishan</p>
    </div>`;
  useEffect(() => {
    form.setFieldValue('message', messageContent);
  }, [supplier, start, finish]);
  function handleSubmit(values) {
    console.log('values', values);
    onSubmit();
  }
  return (
    <Drawer title="Booking Supplier" open={open} onClose={onCancel} width={700}>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <Form.Item label="Start" name="start">
            <DatePicker className="w-full" />
          </Form.Item>
          <Form.Item label="Finish" name="finish">
            <DatePicker className="w-full" />
          </Form.Item>
        </div>
        <Form.Item label="Supplier" name="supplier">
          <Select
            options={[
              { label: 'abc', value: 'abc' },
              { label: 'pqr', value: 'pqr' },
            ]}
          />
        </Form.Item>
        <Form.Item label="To" name="to">
          <Select mode="tags" options={userOptions} />
        </Form.Item>
        <Form.Item label="Subject" name="subject">
          <Input />
        </Form.Item>
        <Form.Item label="Message" name="message">
          <RichTextEditor
            value={messageContent}
            onChange={value => {
              form.setFieldValue('message', value);
            }}
          />
        </Form.Item>
        <Form.Item name="files">
          <Upload>
            <Button>Click to Upload</Button>
          </Upload>
        </Form.Item>
        <div className="flex gap-2 justify-end">
          <Button>Cancel</Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Drawer>
  );
};
