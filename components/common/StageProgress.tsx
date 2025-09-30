"use client";

import React, { useState } from "react";
import { Dropdown, Form, Input, message, Modal, Tag } from "antd";
import { IconDots } from "@tabler/icons-react";
import { useAppDispatch } from "@hooks/redux";
import { leadConvertThunk,leadDeleteThunk,transferLeadThunk,} from "@redux/feature/lead/leadThunk";
import { useRouter } from "next/navigation"; 
import { CreateFormModal } from "./Models/CreateFormModel";
import ConfirmationModal from "./ConfirmationModal";
import transferLeadFields from "../formFields/transferLeadFields";
import CloseLeadModal from "../leadDetail/LeadQuotations/CloseLeadModal";
import { QuotationResponse } from "@redux/feature/quotation/IQuotationState";
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
  status?: string;
  steps: Step[];
  activeStep?: string;
  lead?: any;
  idClassName?: string;
  quotations?: QuotationResponse[];
};

const actions = [
  {
    key: "transfer",
    label: "Transfer",
  },
  {
    key: "delete",
    label: "Delete",
  },
  // {
  //   key: "onhold",
  //   label: "On Hold",
  // },
  // {
  //   key: "blocklist",
  //   label: "Blocklist",
  // },
  // {
  //   key: "referanceid",
  //   label: "Referance ID",
  // },
  {
    key: "converttolead",
    label: "Convert to Lead",
  },
  // {
  //   key: "sendwelcomelatter",
  //   label: "Send Welcome Letter",
  // },
  // {
  //   key: "sendwelcomeemail",
  //   label: "Send Welcome Email",
  // },
];

const StageProgress: React.FC<StageProgressProps> = ({
  id,
  title,
  status,
  steps,
  activeStep,
  lead,
  idClassName,
  quotations,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"WON" | "LOST" | null>(null);
  const [loading, setLoading] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const leadTransferFields = transferLeadFields();
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const router = useRouter();
  const handleWinClick = () => {
    setModalType("WON");
    setIsModalOpen(true);
  };

  const handleLoseClick = () => {
    setModalType("LOST");
    setIsModalOpen(true);
  };

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    switch (action) {
      case "transfer":
        setIsTransferModalOpen(true);

        break;
      case "delete":
        setConfirmModalVisible(true);
        break;
      case "onhold":
        break;
      case "blocklist":
        break;
      case "referanceid":
        break;
      case "converttolead":
        setConfirmModalVisible(true);
        break;
      case "sendwelcomelatter":
        break;
      case "sendwelcomeemail":
        break;
      default:
        break;
    }
  };

  const handleTransferSubmit = async (values: any) => {
    try {
      setLoading(true);
      const response = await dispatch(
        transferLeadThunk({
          leadId: lead.lead.leadId,
          ...values,
        })
      ).unwrap();
      message.success("Lead transferred successfully");
    } catch (err) {
      message.error(err || "Failed to transfer lead");
    } finally {
      setLoading(false);
    }
    setIsTransferModalOpen(false);
  };

  const handleDelete = async (leadId: string) => {
    try {
      setLoading(true);
      await dispatch(leadDeleteThunk(leadId)).unwrap();
      message.success("Lead deleted successfully");
      router.push(`/leads`);
    } catch (err) {
      setLoading(false);
      message.error(err || "Failed to delete lead");
    } finally {
      setLoading(false);
    }
  };

  const handleConvertToLead = async (leadId: string) => {
    try {
      setLoading(true);
      await dispatch(leadConvertThunk(leadId)).unwrap();
      message.success("Lead converted successfully");
      setConfirmModalVisible(false);
    } catch (err) {
      setLoading(false);
      message.error(err || "Failed to convert lead");
    }
  };
  
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 w-full">
      <div className="flex flex-col gap-2">
        {/* Info */}
        <div className="flex items-center gap-2">
          <span className="font-medium">{title} <span className="text-secondary">{id && `- ${id}`}</span></span>
          {
            status && (
              <Tag color="cyan" className="rounded-md">
                {status}
              </Tag>
            )
          }
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
                flex-1 text-center py-2 cursor-pointer select-none text-font-color
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
                <span className="whitespace-nowrap px-4">{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-2">
      {lead?.lead?.status === "COMPLETED" && (
        <>
          <button
            className="btn btn-success rounded-md p-1"
            onClick={handleWinClick}
          >
            Won
          </button>
          <button
            className="btn bg-red-500 rounded-md p-1 text-white"
            onClick={handleLoseClick}
          >
          Lost
        </button>
          </>
        )}
        <Dropdown
          open={dropdownVisible}
          onOpenChange={(open) => setDropdownVisible(open)}
          placement="bottomRight"
          trigger={["click"]}
          dropdownRender={() => (
            <div className="bg-white shadow-lg rounded-md border border-gray-200 w-56">
              <div className="py-1">
                {actions.map((action) => (
                  <button 
                    key={action.key}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center justify-between"
                    onClick={() => {
                      // Handle move to previous stage
                      handleActionSelect(action.key);
                      setDropdownVisible(false);
                  }}
                >
                  <span>{action.label}</span>
                </button>
                ))}
              </div>
            </div>
          )}
        >
          <button 
            className={`btn border ${dropdownVisible ? 'border-red-500 bg-red-50' : 'border-red-500'} rounded-md p-1`}
            onClick={() => setDropdownVisible(!dropdownVisible)}
          >
            <IconDots stroke={2} className="text-red-500"/>
          </button>
        </Dropdown>
      </div>
      {/* <Modal
        title={modalType === "WON" ? "Won" : modalType === "LOST" ? "Lost" : ""}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setModalType(null);
        }}
        centered
        okButtonProps={{ loading }}
        onOk={() => {
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

          <button id="reasonFormSubmit" type="submit" hidden />
        </Form>
      </Modal> */}

      {isTransferModalOpen && (
        <CreateFormModal 
          title="Transfer Lead"
          open={isTransferModalOpen}
          loading={loading}
          onCancel={() => {
            setSelectedAction(null);
            setIsTransferModalOpen(false);
          }}
          submitButtonText="Transfer"
          onSubmit={handleTransferSubmit}
          fields={leadTransferFields}
        />
      )}

      {isModalOpen && (
        <CloseLeadModal
          isModalOpen={isModalOpen}
          setIsModalOpen={() => setIsModalOpen(false)}
          active={modalType}
          leadData={lead?.lead}
          quotations={quotations}
        />
      )}

      {confirmModalVisible && (
        <ConfirmationModal
          open={confirmModalVisible}
          type={selectedAction === "delete" ? "danger" : "warning"}
          loading={loading}
          onClose={() => {
            setConfirmModalVisible(false);
          }}
          onConfirm={() => {
            if (selectedAction === "delete") {
              handleDelete(lead?.lead?.leadId);
            } else if (selectedAction === "converttolead") {
              handleConvertToLead(lead?.lead?.leadId);
            }
          }}
          message={
            selectedAction === "delete"
              ? "Are you sure you want to delete this lead?"
              : "Are you sure you want to convert this to a lead?"
          }
        />
      )}
    </div>
  );
};

export default StageProgress;