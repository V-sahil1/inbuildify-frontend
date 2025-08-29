"use client";

import React, { useState } from "react";
import { Form, Input, message, Modal, Tag } from "antd";
import { useAppDispatch } from "@hooks/redux";
import { convertLeadToJobThunk } from "@redux/feature/lead/leadThunk";
const { TextArea } = Input;

type Step = {
  key: string;
  label: string;
  color: string;
  textColor?: string;
  onClick?: (key: string) => void;
};

type StageProgressProps = {
  id: string;
  title: string;
  status: string;
  steps: Step[];
  activeStep?: string;
  lead?: any;
};

const StageProgress: React.FC<StageProgressProps> = ({
  id,
  title,
  status,
  steps,
  activeStep,
  lead,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"WON" | "LOST" | null>(null);
  const dispatch = useAppDispatch()
  const [form] = Form.useForm();
  const handleWinClick = () => {
    setModalType("WON");
    setIsModalOpen(true);
  };

  const handleLoseClick = () => {
    setModalType("LOST");
    setIsModalOpen(true);
  };
  console.log(lead?.contact?.status)

  const handleSubmit = async (values: any) => {
    if (modalType === "WON") {
      try {
        const response = await dispatch(convertLeadToJobThunk({ leadId: lead.contact.lead_id, message: values.message, status: "WON" })).unwrap()
        message.success(response?.response?.message)
        form.resetFields();
      } catch (err) {
        message.error(err)
      }
    } else if (modalType === "LOST") {
      try {
        const response = await dispatch(convertLeadToJobThunk({ leadId: lead.contact.lead_id, message: values.message, status: "LOST" })).unwrap()
        form.resetFields();
        message.success(response?.response?.message)
      } catch (err) {
        message.error(err)
      }
    }
    setIsModalOpen(false);
    setModalType(null);
  };
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 w-full">
      <div className="flex flex-col gap-2">
        {/* Info */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{title} -</span>
          <a href="#" className="text-blue-500 hover:underline">
            {id}
          </a>
          <Tag color="cyan" className="rounded-md">
            {status}
          </Tag>
        </div>

        {/* Step Progress */}
        <div className="flex w-full">
          {steps.map((step, index) => {
            const isActive = activeStep === step.key;
            const isLast = index === steps.length - 1;

            return (
              <div
                key={step.key}
                onClick={() => step.onClick?.(step.key)}
                className={`
                flex-1 text-center py-2 cursor-pointer select-none
                ${step.color}
                ${isActive && step.textColor ? step.textColor : "text-gray-700"}
                transition-colors
                ${index > 0 ? "-ml-3" : ""}
                relative
              `}
                style={{
                  zIndex: steps.length - index,
                  clipPath: !isLast
                    ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                    : "none",
                }}
              >
                {step.label}
              </div>
            );
          })}
        </div>
      </div>
      {lead?.contact?.status === "COMPLETED" && <div className="flex items-center gap-2">
        <button className="btn btn-success rounded-md p-1" onClick={handleWinClick}>
          Won
        </button>
        <button className="btn bg-red-500 rounded-md p-1 text-white" onClick={handleLoseClick}>
          Lost
        </button>
      </div>}
      <Modal
        title={modalType === "WON" ? "Won" : modalType === "LOST" ? "Lost" : ""}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setModalType(null);
        }}
        centered
        
        onOk={() => {
          // trigger form submit manually
          document.getElementById("reasonFormSubmit")?.click();
        }}
      >
        <Form
          id="reasonForm"
          layout="vertical"
          form={form}
          onFinish={handleSubmit}

        >
          <Form.Item
            name="message"

            label={modalType === "WON" ? "Comment" : "Lost Reason"}
            rules={[{ required: true, message: "Please provide a reason" }]}
          >
            <TextArea rows={4} showCount maxLength={500} />
          </Form.Item>

          {/* Hidden button to trigger programmatically */}
          <button id="reasonFormSubmit" type="submit" hidden />
        </Form>
      </Modal>
    </div>
  );
};

export default StageProgress;
