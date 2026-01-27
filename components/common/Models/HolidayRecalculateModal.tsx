import React, { useEffect } from 'react';
import { Modal, Form, Switch, Typography, Button, Input, message } from 'antd';
import { fetchHolidayRealculateDate } from '@redux/feature/holiday/holidayThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';

const { Text } = Typography;
const { TextArea } = Input;
export const HolidayRecalculateModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSubmit: (values) => void;
}> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { status, recalculateDate } = useAppSelector(state => state.holiday);
  const captureReason = Form.useWatch('captureReasonRebookingAndRebookingEmail', form);
  const workflowJobs = Form.useWatch('recalculateWorkflowJobEstimatedDates', form);
  const constructionJobs = Form.useWatch('recalculateConstructionJobEstimatedDates', form);

  const fetchRecalculateDateSetting = async () => {
    try {
      await dispatch(fetchHolidayRealculateDate()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch recalculate date setting');
    }
  };

  useEffect(() => {
    if (status.recalculateDate.fetch === Status.IDLE) {
      fetchRecalculateDateSetting();
    }
    if (recalculateDate) {
      form.setFieldsValue(recalculateDate);
    }
  }, [status.recalculateDate.fetch]);

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
      confirmLoading={status.recalculateDate.create === Status.PENDING}
    >
      <Form
        layout="vertical"
        form={form}
        initialValues={recalculateDate}
        disabled={status.recalculateDate.create === Status.PENDING}
      >
        <div className="flex items-center gap-8">
          <Form.Item
            name="recalculateWorkflowJobEstimatedDates"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>
          <Text strong>Recalculate the estimated dates for existing workflow jobs</Text>
        </div>
        <div className="flex items-center gap-8">
          <Form.Item
            name="recalculateConstructionJobEstimatedDates"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          <Text strong>Recalculate the estimated dates for existing construction jobs</Text>
        </div>

        {constructionJobs && (
          <>
            <div>
              <div className="flex items-center gap-8">
                <Form.Item
                  name="captureReasonRebookingAndRebookingEmail"
                  valuePropName="checked"
                  initialValue={false}
                >
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
                  <Form.Item name="captureText">
                    <TextArea rows={4} showCount maxLength={500} style={{ resize: 'none' }} />
                  </Form.Item>
                )}
              </div>
            </div>
            <div className="flex items-center gap-8">
              <Form.Item
                name="recalculateConfirmedBookingDates"
                valuePropName="checked"
                initialValue={true}
              >
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
