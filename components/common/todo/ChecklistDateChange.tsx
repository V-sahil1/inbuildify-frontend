import { useState } from 'react';
import { CustomFilterButtons } from '../CustomFilterButtons';
import { Checkbox, Form, Input, Modal, Switch, Tag } from 'antd';
const { TextArea } = Input;
export const ChecklistDateChange = ({ open, onCancel, onSubmit }) => {
  const [activeTab, setActiveTab] = useState('Current Booking Only');
  const [form] = Form.useForm();
  const captureReason = Form.useWatch('captureReason', form);
  const showList = Form.useWatch('showList', form);
  const listData = [
    {
      name: 'Plumbing Undergrounds',
      category: 'Base Stage',
      supplier: 'abc',
      start: '10-10-2025',
      finish: '15-10-2025',
    },
    {
      name: 'Concrete base prep',
      category: 'Base Stage',
      supplier: '',
      start: '11-10-2025',
      finish: '16-10-2025',
    },
    {
      name: 'Building inspector',
      category: 'Base Stage',
      supplier: '',
      start: '12-10-2025',
      finish: '17-10-2025',
    },
  ];
  const ListField = ({ item }) => (
    <div className="grid grid-cols-10">
      <Form.Item
        name={['checklist', item.name]}
        className="col-span-1"
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox />
      </Form.Item>
      <div className="col-span-4">
        <p>{item.name}</p>
        <Tag color="orange">{item.category}</Tag>
      </div>
      <p className="col-span-2">{item.supplier || 'No supplier'}</p>
      <p className="col-span-3">
        {item.start} - {item.finish}
      </p>
    </div>
  );
  async function handleSubmit() {
    const values = await form.validateFields();
    console.log(values);
    onSubmit(values);
  }
  return (
    <Modal
      title="Checklist Date Chnage Confirmation"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={700}
      centered
    >
      <CustomFilterButtons
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filterButtons={['Current Booking Only', 'Update all the booking']}
      />
      <p className="my-2 font-medium">
        Update all the bookings,cancel and rebooked suppliers/Trades ?{' '}
      </p>
      {activeTab === 'Update all the booking' && (
        <Form form={form}>
          <div className="space-y-2">
            <div className="flex place-items-start gap-8">
              <Form.Item name="cancelConfirmedTicket" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
              <div className="space-y-1">
                <p className="font-medium">
                  Cancel the confirmed bookings and rebook with new dates
                </p>
                <p className="text-xs">
                  Confirmed bookings will be cancelled and rebooked. Rebooking email will be sent to
                  supplier/Trades
                </p>
              </div>
            </div>
            <div className="flex place-items-start gap-8">
              <Form.Item name="captureReason" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
              <div className="space-y-1">
                <p className="font-medium">
                  Capture reason for rebooking and include in rebooking email
                </p>
                <p className="text-xs">
                  The reason captured will be included in all the rebooking eamils and sent to the
                  respective suppliers
                </p>
                {captureReason && (
                  <Form.Item name="message">
                    <TextArea rows={4} maxLength={500} showCount style={{ resize: 'none' }} />
                  </Form.Item>
                )}
              </div>
            </div>
            <div className="flex place-items-start gap-8">
              <Form.Item name="showList" valuePropName="checked" initialValue={false}>
                <Switch />
              </Form.Item>
              <div className="space-y-1">
                <p className="font-medium">Show the list</p>
                {showList && (
                  <div>
                    {listData.map((item, index) => (
                      <ListField key={index} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Modal>
  );
};
