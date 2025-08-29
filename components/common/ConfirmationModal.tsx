import React from "react";
import { Modal, Button } from "antd";
import {
  IconCheck,
  IconInfoCircleFilled,
  IconAlertSquare,
  IconX,
} from "@tabler/icons-react";

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string | React.ReactNode;
  type?: "success" | "info" | "warning" | "danger";
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | false;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type = "info",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  maxWidth = "sm",
}) => {
  const getConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <IconCheck size={48} className="text-green-500" />,
          btnType: "primary" as const,
          btnClass:
            "btn bg-green-500 hover:!bg-green-600 !border-none !text-white",
        };
      case "warning":
        return {
          icon: <IconAlertSquare size={48} className="text-yellow-500" />,
          btnType: "primary" as const,
          btnClass:
            "btn bg-yellow-500 hover:!bg-yellow-600 !border-none !text-black",
        };
      case "danger":
        return {
          icon: <IconX size={48} className="text-red-500" />,
          btnType: "primary" as const,
          btnClass: "btn bg-red-500 hover:bg-red-600 !border-none !text-white",
        };
      case "info":
        return {
          icon: (
            <IconInfoCircleFilled
              size={48}
              className="text-blue-500 hover:!bg-blue-600 !border-none !text-black"
            />
          ),
          btnType: "primary" as const,
          btnClass:
            "btn bg-blue-500 hover:bg-blue-600 !border-none !text-white",
        };
    }
  };

  const { icon, btnType, btnClass } = getConfig();

  // Modal maxWidth mapping
  const modalWidth =
    maxWidth === "xs"
      ? 360
      : maxWidth === "sm"
      ? 480
      : maxWidth === "md"
      ? 720
      : maxWidth === "lg"
      ? 960
      : maxWidth === "xl"
      ? 1200
      : 500;

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      width={modalWidth}
      footer={[
        <div className=" flex  justify-center gap-10">
          <div>
  <Button
          key="cancel"
          onClick={onClose}
          disabled={loading}
          className="btn  text-black border !border-grey-500 hover:!bg-gray-600 hover:!text-white"
        >
          {cancelText}
        </Button>
          </div>
      <div>
  <Button
          key="confirm"
          type={btnType}
          className={btnClass}
          danger={type === "danger"}
          onClick={onConfirm}
          loading={loading}
        >
          {confirmText}
        </Button>
      </div>
      
        </div>
        
      ]}
      className="confirmation-modal"
    >
      <div className="flex flex-col items-center text-center py-6">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className=" text-sm">
          {typeof message === "string" ? <p>{message}</p> : message}
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
