import { Modal } from 'antd';
interface ConfirmationContentModalProps {
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  okText: string;
  onSubmit: () => void;
  cancelText?: string;
}

export function ConfirmationContentModal({
  content,
  open,
  onClose,
  title,
  okText,
  onSubmit,
  cancelText,
}: ConfirmationContentModalProps) {
  return (
    <Modal
      title={title}
      okText={okText}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      cancelText={cancelText || 'Cancel'}
      centered
    >
      {content}
    </Modal>
  );
}
