import { Modal } from 'antd';
import CreateTaskCard from '../TimeLineComponents/CreateTaskCard';

export const CreateTaskModal = ({
  open,
  onClose,
  title,
  loading,
  status=false,
  attachment=true,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
  status?:boolean;
  attachment?:boolean;
  onSubmit: () => void;
  initialData?: any;
}) => {
  return (
    <Modal
      open={open}
      title={title}
      centered
      onCancel={() => {
        onClose();
      }}
      confirmLoading={loading}
      footer={null}
    >
      <CreateTaskCard
        onSave={onSubmit}
        isStatusShow={status}
        onCancel={() => {
          onClose();
        }}
        loading={loading}
        attachment={attachment}
        initialData={initialData}
      />
    </Modal>
  );
};
