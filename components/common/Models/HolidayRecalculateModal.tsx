import React from 'react';
import { Modal, Form, Switch, Typography, Button, Input } from 'antd';

const { Text } = Typography;
const { TextArea } = Input;
export const HolidayRecalculateModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSubmit: (values) => void;
}> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const captureReason = Form.useWatch('captureReason', form);
  const workflowJobs = Form.useWatch('workflowJobs', form);
  const constructionJobs = Form.useWatch('constructionJobs', form);
  const handleSubmit = () => {
    form.validateFields().then(values => onSubmit(values));
  };

  return (
    <Modal
      title="Recalculate Dates"
      open={open}
      onCancel={onCancel}
      centered
      destroyOnHidden
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Recalculate
        </Button>,
      ]}
      styles={{
        body: {
          maxHeight: '70vh',
          overflowY: 'auto',
          padding: '12px 24px',
          scrollbarWidth: 'none',
        },
      }}
    >
      <Form layout="vertical" form={form}>
        <div className="flex items-center gap-8">
          <Form.Item name="workflowJobs" valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
          <Text strong>Recalculate the estimated dates for existing workflow jobs</Text>
        </div>
        <div className="flex items-center gap-8">
          <Form.Item name="constructionJobs" valuePropName="checked" initialValue={false}>
            <Switch />
          </Form.Item>
          <Text strong>Recalculate the estimated dates for existing construction jobs</Text>
        </div>

        {constructionJobs && (
          <>
            <div>
              <div className="flex items-center gap-8">
                <Form.Item name="captureReason" valuePropName="checked" initialValue={false}>
                  <Switch />
                </Form.Item>
                <Text strong>Capture reason for rebooking and include in rebooking email</Text>
              </div>
              <div className="ml-[76px]">
                {!captureReason && (
                  <Text type="secondary">
                    The reason captured will be included in all the rebooking emails and sent to the
                    respective suppliers.
                  </Text>
                )}
                {captureReason && (
                  <Form.Item name="message">
                    <TextArea rows={4} showCount maxLength={500} style={{ resize: 'none' }} />
                  </Form.Item>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Form.Item name="confirmedBooking" valuePropName="checked" initialValue={true}>
                <Switch className="mt-4" />
              </Form.Item>
              <Text strong>Recalculate the dates for confirmed booking</Text>
            </div>
          </>
        )}

        {/* Alerts shown below based on toggle state */}

        {(workflowJobs || constructionJobs) && (
          <div style={{ marginTop: 16 }}>
            <div className="bg-yellow-100 border-l-4 border-red-500 text-red-600 p-4 rounded-md">
              <ul className="list-disc ml-5 space-y-2 text-sm leading-relaxed">
                {workflowJobs && (
                  <>
                    <li>
                      Kindly do this activity during{' '}
                      <span className="font-semibold">non-business hours</span> from{' '}
                      <strong>7pm to 6am</strong>.
                    </li>
                    <li>
                      It's a system process, it will take time to update the existing jobs, so
                      please wait for <strong>2 hours</strong> to complete the action.
                    </li>
                  </>
                )}

                {constructionJobs && (
                  <li>
                    Based on the new holiday(s) added, the dates will be recalculated and suppliers
                    will be rebooked for all the booked jobs.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </Form>
    </Modal>
  );
};
