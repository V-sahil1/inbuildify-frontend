import { Button, DatePicker, Divider, Drawer, Form, Input, Select, Upload } from 'antd';
import { IconTruck, IconUser } from '@tabler/icons-react';
import { useState } from 'react';
import RichTextEditor from '../common/rich-text-editor/RichTextEditor';

const BookingSupplierDrawer = ({ title, open, onCancel, values, onSubmit }) => {
  const [form] = Form.useForm();
  const [bookingDone, setBookingDone] = useState(false);
  const [bookindDetails, setBookingDetails] = useState({
    to: [],
    subject: '',
    message: '',
    start: '',
    finish: '',
    file: '',
  });
  console.log(values);
  function handleBookSupplier(values) {
    console.log('book supplier', values);
    setBookingDone(true);
    setBookingDetails(values);
    onSubmit();
  }
  return (
    <Drawer title={title} open={open} onClose={onCancel} size="large">
      <div>
        {bookingDone ? (
          <div className="p-1 border border-border-color">
            <div className="flex gap-2 items-center my-2">
              <IconTruck size={20} />
              <p>Booking pending for supplier approval</p>
            </div>
            <Divider className="!my-2" />
            <div>
              <div className="flex gap-2 items-center">
                <IconUser size={20} /> <p> Kishan booked ABC Bricks on 1/10/25</p>
              </div>
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {bookindDetails.to?.map((obj, index) => (
                    <p key={index}>{obj}</p>
                  ))}
                </div>

                <Button type="primary">Queued</Button>
              </div>
              <div dangerouslySetInnerHTML={{ __html: bookindDetails.message }} />
            </div>
          </div>
        ) : (
          <Form form={form} onFinish={handleBookSupplier}>
            <h3 className="text-red-500 font-medium text-center">Book Supplier</h3>
            <div className=" border border-border-color">
              <div className="flex justify-between items-center p-2">
                <div>
                  <p>Start</p>
                  <Form.Item name="start" valuePropName="value" getValueFromEvent={val => val}>
                    <DatePicker format="YYYY-MM-DD" allowClear />
                  </Form.Item>
                </div>
                <div>
                  <p>Finish</p>
                  <Form.Item name="finish" valuePropName="value" getValueFromEvent={val => val}>
                    <DatePicker format="YYYY-MM-DD" allowClear />
                  </Form.Item>
                </div>
              </div>
              <div className="">
                <div className="bg-body-color p-2">Email</div>
                <div className="p-2">
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
                      <RichTextEditor
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
                </div>

                <div className="mt-2 text-end p-2">
                  <Button type="primary" htmlType="submit">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </div>
    </Drawer>
  );
};

export default BookingSupplierDrawer;
