import { Modal } from 'antd';
interface ConfirmationContentModalProps {
  content: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  okText: string;
  onSubmit: () => void;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmationContentModal({
  content,
  open,
  onClose,
  title,
  okText,
  onSubmit,
  cancelText,
  loading,
}: ConfirmationContentModalProps) {
  return (
    <Modal
      title={title}
      okText={okText}
      open={open}
      onCancel={onClose}
      onOk={onSubmit}
      cancelText={cancelText || 'Cancel'}
      confirmLoading={loading}
      centered
    >
      {content}
    </Modal>
  );
}
