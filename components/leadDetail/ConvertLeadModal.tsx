import React, { useState } from "react";
import { Modal, Button, Input, Form, Typography, message } from "antd";
import { useRouter } from "next/router";
import { useAppDispatch } from "@hooks/redux";
import { convertLeadToOpportunityThunk } from "@redux/feature/lead/leadThunk";

const { TextArea } = Input;
const { Text } = Typography;

interface ConvertLeadModalProps {
  visible: boolean;
  onCancel: () => void;
  leadId: string;
}

const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({
  visible,
  onCancel,
  leadId,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const handleConvert = async () => {
    try {
      setLoading(true);
      const res = await dispatch(convertLeadToOpportunityThunk(leadId)).unwrap();
      if (res.leadId) {
        message.success("Lead converted to opportunity successfully");
      }
      const currentQuery = { ...router.query };
      currentQuery.type = "opportunity";
      await router.replace(
        { pathname: router.pathname, query: currentQuery },
        undefined,
        { shallow: true }
      );
      onCancel();
    } catch (error) {
      message.error(`Failed to convert lead to opportunity ${error}`);
      console.error("Error converting lead:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Convert to Opportunity"
      open={visible}
      centered
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>,
        <Button
          key="convert"
          type="primary"
          onClick={handleConvert}
          loading={loading}
        >
          Yes, Convert
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="notes"
          label="Conversion Notes"
          rules={[
            {
              max: 1000,
              message: "Notes cannot exceed 1000 characters",
            },
          ]}
        >
          <TextArea
            rows={4}
            placeholder="Add any notes about this conversion (max 1000 characters)"
            maxLength={1000}
            showCount
          />
        </Form.Item>
        <Text type="secondary">
          This action will convert the lead to an opportunity and cannot be
          undone.
        </Text>
      </Form>
    </Modal>
  );
};

export default ConvertLeadModal;
