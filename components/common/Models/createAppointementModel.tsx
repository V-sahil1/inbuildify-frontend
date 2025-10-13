import { Modal } from "antd";
import AddAppointmentCard from "../TimeLineComponents/AddAppointmentCard";

export const CreateAppointmentModal = ({
  open,
  onClose,
  title,
  loading,
  onSubmit,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  loading: boolean;
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
      <AddAppointmentCard
        onSave={onSubmit}
        onCancel={() => {
          onClose();
        }}
        loading={loading}
        initialData={initialData}
      />
    </Modal>
  );
};
