import React, { useState } from "react";
import { Modal, Form, Switch, Typography, Button, Alert } from "antd";

const { Text } = Typography;

export const HolidayRecalculateModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}> = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [showExtraOptions, setShowExtraOptions] = useState(false);

  const handleConstructionToggle = (checked: boolean) => {
    setShowExtraOptions(checked);
  };

  const handleSubmit = () => {
    form.validateFields().then(() => onSubmit());
  };

  return (
    <Modal
      title="Recalculate Dates"
      open={open}
      onCancel={onCancel}
      centered
      destroyOnClose
      maskClosable={false}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Recalculate
        </Button>,
      ]}
      bodyStyle={{
        maxHeight: "70vh",
        overflowY: "auto",
        padding: "12px 24px",
      }}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="workflowJobs"
          valuePropName="checked"
          initialValue={true}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Switch />
            <Text strong>
              Recalculate the estimated dates for existing workflow jobs
            </Text>
          </div>
        </Form.Item>

        <Form.Item
          name="constructionJobs"
          valuePropName="checked"
          initialValue={false}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Switch onChange={handleConstructionToggle} />
            <Text strong>
              Recalculate the estimated dates for existing construction jobs
            </Text>
          </div>
        </Form.Item>

        {showExtraOptions && (
          <>
            <Form.Item
              name="captureReason"
              valuePropName="checked"
              initialValue={false}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Switch />
                  <Text strong>
                    Capture reason for rebooking and include in rebooking email
                  </Text>
                </div>
                <Text type="secondary" style={{ marginLeft: 28 }}>
                  The reason captured will be included in all the rebooking
                  emails and sent to the respective suppliers.
                </Text>
              </div>
            </Form.Item>

            <Form.Item
              name="confirmedBooking"
              valuePropName="checked"
              initialValue={true}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Switch />
                <Text strong>
                  Recalculate the dates for confirmed booking
                </Text>
              </div>
            </Form.Item>
          </>
        )}

        {/* Alerts shown below based on toggle state */}
        <div style={{ marginTop: 16 }}>
          <Alert
            type="warning"
            showIcon
            message={
              <>
                <div>
                  <Text type="danger">
                    Kindly do this activity during non-business hours from 7pm
                    to 6am.
                  </Text>
                </div>
                <div>
                  <Text type="danger">
                    It's a system process, it will take time to update the
                    existing jobs, so please wait for 2 hours to complete the
                    action.
                  </Text>
                </div>
                {showExtraOptions && (
                  <div>
                    <Text type="danger">
                      Based on the new holiday(s) added, the dates will be
                      recalculated and suppliers will be rebooked for all the
                      booked jobs.
                    </Text>
                  </div>
                )}
              </>
            }
          />
        </div>
      </Form>
    </Modal>
  );
};
