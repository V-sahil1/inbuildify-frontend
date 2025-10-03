import {
  IconCircleCheck,
  IconCircleX,
  IconDotsVertical,
  IconLink,
} from "@tabler/icons-react";
import { Dropdown, message, Modal } from "antd";
import { ColumnsType } from "antd/es/table";
import { JobWorkFlowChecklist } from "data/types";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import dayjs from "dayjs";
import CreateTaskCard from "../common/TimeLineComponents/CreateTaskCard";
import { useAppDispatch } from "@hooks/redux";
import {
  deleteActionsThunk,
  updateActionsThunk,
} from "@redux/feature/action/actionThunk";
import { formDataGenerator } from "@lib/utils/formDataGenerator";

const UserActions: React.FC<{
  user: string;
  record: JobWorkFlowChecklist;
  onUpdateRow: (updated: JobWorkFlowChecklist) => void;
  onDeleteRow: (deleteRecord: JobWorkFlowChecklist) => void;
}> = ({ user, record, onUpdateRow, onDeleteRow }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<JobWorkFlowChecklist | null>(null);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useAppDispatch();

  const handleEdit = (record: JobWorkFlowChecklist) => {
    setShowEditModal(true);
    setSelectedRecord(record);
  };

  const handleDelete = (record: JobWorkFlowChecklist) => {
    setShowDeleteConfirm(true);
    setSelectedRecord(record);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await dispatch(
        deleteActionsThunk({ actionId: selectedRecord?.actionId })
      ).unwrap();
      message.success("Task deleted successfully");
      onDeleteRow(selectedRecord);
      setLoading(false);
      setSelectedRecord(null);
      setShowDeleteConfirm(false);
    } catch (error) {
      message.error(error || "Failed to delete task");
      setLoading(false);
    }
  };

  const handleUpdateTask = async (values: any) => {
    const { actionId, ...rest } = values;
    setLoading(true);
    try {
      const response = await dispatch(
        updateActionsThunk({
          actionId: actionId,
          data: formDataGenerator(rest),
        })
      ).unwrap();
      setSelectedRecord(null);
      setShowEditModal(false);
      onUpdateRow(response.task);
      message.success("Task updated successfully");
    } catch (error) {
      message.error(error || "Failed to update task");
    }
    setLoading(false);
  };

  return (
    <>
      <div className="flex gap-4 justify-end items-center relative">
        {/* <button className="hover:text-blue">
          <IconMessage />
        </button>
        <button className="hover:text-blue">
          <IconRestore />
        </button> */}
        {/* <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{
            backgroundColor: "var(--body-color)",
            color: "var(--font-color)",
          }}
        >
          {user.charAt(0).toUpperCase()}
        </div> */}

        <div className="relative">
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Edit" },
                { key: "delete", label: "Delete" },
              ],
              onClick: (e) => {
                if (e.key === "edit") handleEdit(record);
                if (e.key === "delete") handleDelete(record);
              },
            }}
          >
            <span>
              <IconDotsVertical size={18} stroke={2} />
            </span>
          </Dropdown>
        </div>
      </div>

      {showEditModal && (
        <Modal
          open={showEditModal}
          title="Job Workflow Task"
          centered
          onCancel={() => {
            setShowEditModal(false);
            setSelectedRecord(null);
          }}
          confirmLoading={loading}
          footer={null}
        >
          <CreateTaskCard
            onSave={handleUpdateTask}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedRecord(null);
            }}
            loading={loading}
            initialData={selectedRecord as any}
          />
        </Modal>
      )}
      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${record.name}"?`}
        type="danger"
        loading={loading}
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

let globalCurrentStep = -1;

export const jobWorkflowChecklistFields = (
  onUpdateRow: (updated: JobWorkFlowChecklist) => void,
  onDeleteRow: (deleteRecord: JobWorkFlowChecklist) => void
): ColumnsType<JobWorkFlowChecklist> => [
  {
    title: "Task",
    dataIndex: "name",
    key: "name",
    width: "45%",
    render: (text, record, index) => {
        const estimatedDateTime = dayjs(record.dueDate)
          .hour(dayjs(record.time, "HH:mm:ss").hour())
          .minute(dayjs(record.time, "HH:mm:ss").minute())
          .second(dayjs(record.time, "HH:mm:ss").second());

        const isExpired = estimatedDateTime.isBefore(dayjs());

      return (
        <div
          className="flex gap-2 items-center relative cursor-pointer"
          onClick={() => {
            globalCurrentStep = index; // update global step
          }}
        >
          {isExpired ? (
            <IconCircleX className="text-red-500" size={18} />
          ) : (
            <IconCircleCheck className="text-green-500" size={18} />
          )}
          <span className="text-font-color font-medium">{text}</span>
        </div>
      );
    },
  },

  // {
  //   dataIndex: "tag",
  //   key: "tag",
  //   width: "25%",
  //   render: (tag) => <Tag color="blue">{tag}</Tag>,
  // },
  {
    dataIndex: "attachment",
    key: "attachment",
    render: (attachment) => (
      <div className="flex items-center justify-end relative">
        {attachment && (
          <a href={attachment} target="_blank" className="hover:text-blue">
            <IconLink size={18} />
          </a>
        )}
      </div>
    ),
  },
  {
    title: "Estimated",
    dataIndex: "dueDate",
    key: "dueDate",
    width: "10%",
    render: (date: string) => {
      if (!date) return "-";
      return (
        <span className="text-font-color font-medium">
          {dayjs(date).format("MMM D, YYYY")}
        </span>
      );
    },
  },
  {
    title: "Actual",
    dataIndex: "actualDate",
    key: "actualDate",
    width: "10%",
    render: (date: string, record) => {
      const formatted = dayjs(date || new Date()).format("MMM D, YYYY");
      return (
        <div className="font-medium">
          <span
            className={
              record.status === "active" ? "text-green-600" : "text-red-600"
            }
          >
            {formatted}
          </span>
        </div>
      );
    },
  },
  {
    dataIndex: "user",
    key: "user",
    width: "10%",
    render: (user, record) => (
      <UserActions
        user={user}
        record={record}
        onUpdateRow={onUpdateRow}
        onDeleteRow={onDeleteRow}
      />
    ),
  },
];
