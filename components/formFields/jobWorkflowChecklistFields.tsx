import {
  IconCircleCheck,
  IconDotsVertical,
  IconLink,
  IconMessage,
  IconRestore,
} from "@tabler/icons-react";
import { Dropdown, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import { JobWorkFlowChecklist } from "data/types";
import { useState } from "react";
import ConfirmationModal from "@/components/common/ConfirmationModal";

const UserActions: React.FC<{ user: string; record: JobWorkFlowChecklist }> = ({
  user,
  record,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    console.log("Editing:", record);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    console.log("Deleting:", record.id);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="flex gap-4 justify-end items-center relative">
        <button className="hover:text-blue">
          <IconMessage />
        </button>
        <button className="hover:text-blue">
          <IconRestore />
        </button>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{
            backgroundColor: "var(--body-color)",
            color: "var(--font-color)",
          }}
        >
          {user.charAt(0).toUpperCase()}
        </div>

        <div className="relative">
          <Dropdown
            menu={{
              items: [
                { key: "edit", label: "Edit" },
                { key: "delete", label: "Delete" },
              ],
              onClick: (e) => {
                if (e.key === "edit") handleEdit();
                if (e.key === "delete") handleDelete();
              },
            }}
          >
            <span>
              <IconDotsVertical size={18} stroke={2} />
            </span>
          </Dropdown>
        </div>
      </div>

      <ConfirmationModal
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        message={`Are you sure you want to delete "${record.task}"?`}
        type="danger"
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
};

let globalCurrentStep = -1;

export const jobWorkflowChecklistFields: ColumnsType<JobWorkFlowChecklist> = [
  {
    title: "Task",
    dataIndex: "task",
    key: "task",
    width: "45%",
    render: (text, record, index) => {
      // Mark as finished if this step is <= the last clicked step
      const isFinished = index <= globalCurrentStep;

      return (
        <div
          className="flex gap-2 items-center relative cursor-pointer"
          onClick={() => {
            globalCurrentStep = index; // update global step
          }}
        >
          <IconCircleCheck
            className={isFinished ? "text-green-500" : "text-green-200"}
            size={18}
          />
          <span className="text-font-color font-medium">{text}</span>
        </div>
      );
    },
  },
  {
    dataIndex: "tag",
    key: "tag",
    width: "25%",
    render: (tag) => <Tag color="blue">{tag}</Tag>,
  },
  {
    dataIndex: "link",
    key: "link",
    render: (link) => (
      <div className="flex items-center justify-end relative">
        {link && (
          <a href={link} target="_blank" className="hover:text-blue">
            <IconLink size={18} />
          </a>
        )}
      </div>
    ),
  },
  {
    title: "Estimated",
    dataIndex: "estimatedDate",
    key: "estimatedDate",
    width: "10%",
    render: (date) => (
      <span className="text-font-color font-medium">{date}</span>
    ),
  },
  {
    title: "Actual",
    dataIndex: "actualDate",
    key: "actualDate",
    width: "10%",
    render: (date, record) => (
      <div className="font-medium">
        <span
          className={
            record.status === "active" ? "text-green-600" : "text-red-600"
          }
        >
          {date}
        </span>
      </div>
    ),
  },
  {
    dataIndex: "user",
    key: "user",
    width: "10%",
    render: (user, record) => <UserActions user={user} record={record} />,
  },
];
