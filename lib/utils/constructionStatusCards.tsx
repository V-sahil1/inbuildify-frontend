import { IconBuilding, IconCheckbox, IconCircleCheck, IconHandStop, IconThumbUp } from "@tabler/icons-react";

export const getStatus = (status: string) => {
  const map: Record<
    string,
    { label: string; color: string; icon: React.ReactNode }
  > = {
    readyforconstruction: {
      label: "Ready For Construction",
      color: "#fa8c16",
      icon: <IconThumbUp size={24} color="#fa8c16" />,
    },
    underconstruction: {
      label: "Under Construction",
      color: "#1890ff",
      icon: <IconBuilding size={24} color="#1890ff" />,
    },
    completed: {
      label: "Completed",
      color: "#52c41a",
      icon: <IconCircleCheck size={24} color="#52c41a" />,
    },
    onhold: {
      label: "On Hold",
      color: "lightcoral",
      icon: <IconHandStop size={24} color="lightcoral" />,
    },
  };

  return (
    map[status.toLowerCase()] || {
      label: status,
      color: "#888888",
      icon: <IconCheckbox size={24} color="#888888" />,
    }
  );
};