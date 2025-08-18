import { IconEdit } from "@tabler/icons-react";
import { useState } from "react";
import Address from "./modal/Address";

export function SidebarBox({
  title,
  children,
  modelKey,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  modelKey: string;
  icon?: React.ReactNode;
}) {
  const [newTaskModal, setNewTaskModal] = useState<boolean>(false);
  const openNewTaskModal = () => {
    setNewTaskModal(!newTaskModal);
  };
  return (
    <div className="bg-card-color rounded-xl border border-dashed border-border-color px-2 pt-2 pb-1 ">
      <div className="bg-card-color font-medium  text-sm px-2 py-1 border-b border-border-color flex justify-between">
        <div className="font-medium  text-sm cursor-pointer flex items-center gap-1">
          {icon}
          {title}
        </div>
        <div
          className="font-medium  text-sm cursor-pointer flex items-center gap-1"
          onClick={openNewTaskModal}
        >
          <IconEdit size={16} />
          Edit
        </div>
      </div>
      <div className="p-2 space-y-1">{children}</div>
      {newTaskModal && (
        <Address
          isOpen={newTaskModal}
          onClose={openNewTaskModal}
          modelKey={modelKey}
        />
      )}
    </div>
  );
}