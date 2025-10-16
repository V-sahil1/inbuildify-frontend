import { ActionDialogmodel } from "@/components/common/Models/ActionDialogModel";
import { IconFileTypeXml, IconPlus, IconTrash } from "@tabler/icons-react";
import { Avatar, Button, Drawer, Space, Table, Tag, Typography } from "antd";
import { TemplateData, templateDummyData } from "data/delayExtentionDummyData";
import { JobCustomerFeedbackOptions } from "data/options";
const { Text } = Typography;
import { useState } from "react";

const getStatusColor = (status: TemplateData["status"]) => {
  switch (status) {
    case "Requested":
      return "cyan";
    case "Completed":
      return "green";
    case "Pending":
      return "gold";
    default:
      return "default";
  }
};

export default function CustomerFeedback({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleCustomerFeedback = () => {
    console.log("Customer Feedback");
  };

  // 3. Define the Table Columns
  const columns = [
    {
      title: "Template",
      dataIndex: "template",
      key: "template",
      // Custom rendering to include the icon
      render: (text: string) => (
        <Space>
          <IconFileTypeXml size={20} className="text-gray-500" />
          <Text strong>{text}</Text>
        </Space>
      ),
      width: "25%",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: TemplateData["status"]) => (
        <Tag color={getStatusColor(status)} className="font-medium">
          {status.toUpperCase()}
        </Tag>
      ),
      width: "15%",
    },
    {
      title: "Requested By",
      dataIndex: "requestedByInitials",
      key: "requestedByInitials",
      render: (text: string, record: TemplateData) => (
        <div className="flex flex-col items-center gap-2">
          <Avatar
            size="small"
            style={{ backgroundColor: "#ccc", color: "#666" }}
          >
            {text}
          </Avatar>
          <Text className="text-sm">{record.requestedByDate}</Text>
        </div>
      ),
      width: "20%",
    },
    {
      title: "Submitted By",
      dataIndex: "submittedBy",
      key: "submittedBy",
      render: (text: string) => <Text className="text-sm">{text || "-"}</Text>,
      width: "20%",
    },
    {
      title: "Comments",
      dataIndex: "comments",
      key: "comments",
      render: (text: string) => <Text className="text-sm">{text || "-"}</Text>,
      width: "15%",
    },
    {
      title: "",
      key: "action",
      width: "5%",
      render: (text: string, record: TemplateData) => (
        <IconTrash
          className="text-gray-400 hover:text-red-500 cursor-pointer"
          size={18}
          onClick={() => console.log("Remove item:", record.key)}
        />
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          <div className=" flex items-center justify-between">
            <p className="text-lg font-semibold">Customer Feedback History</p>
            <Button
              type="primary"
              icon={<IconPlus />}
              onClick={() => setAddModalOpen(true)}
            >
              Add
            </Button>
          </div>
        }
        width={800}
        open={open}
        style={{ padding: "0px" }}
        onClose={onCancel}
      >
        <Table
          columns={columns}
          dataSource={templateDummyData}
          pagination={false}
          rowKey="key"
          size="middle"
          className="w-full"
        />
      </Drawer>

      <ActionDialogmodel
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        title="Customer Feedback"
        fields={[
          {
            label: "Template",
            name: "template",
            type: "select",
            placeholder: "Select Template",
            options: JobCustomerFeedbackOptions,
            extra: "1. Rate quality from 1 to 5 stars?",
          },
        ]}
        onSubmit={handleCustomerFeedback}
        submitButtonText="confirm"
      />
    </>
  );
}
