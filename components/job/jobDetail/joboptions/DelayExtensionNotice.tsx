import { ActionDialogmodel } from "@/components/common/Models/ActionDialogModel";
import { delayExtensionNoticeFields } from "@/components/formFields/delayExtensionNoticeFields";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { Avatar, Button, Drawer, Space, Table, Tag, Typography } from "antd";
import { dummyData, NoticeData } from "data/delayExtentionDummyData";
const { Text } = Typography;

import { useState } from "react";

export default function DelayExtensionNotice({
  open,
  onCancel,
}: {
  open: boolean;
  onCancel: () => void;
}) {
  const [addModalOpen, setAddModalOpen] = useState(false);
  const handleDelayExtensionNotice = () => {
    console.log("Delay Extension Notice");
  };
  
  // 3. Define the Table Columns
  const columns = [
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (text: string, record: NoticeData) => (
        <div className="flex flex-col">
          <Text strong>{text}</Text>
          <Space size={[0, 8]} wrap>
            {record.tags.map((tag) => (
              <Tag color="blue" key={tag} className="rounded-md cursor-pointer">
                {tag}
              </Tag>
            ))}
          </Space>
        </div>
      ),
    },
    {
      title: "Days",
      dataIndex: "days",
      key: "days",
      width: 70,
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      width: 100,
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      width: 100,
    },
    {
      title: "Created",
      dataIndex: "created",
      key: "created",
      width: 150,
      render: (text: string) => (
        <div className="flex flex-col items-center gap-2">
          {/* Avatar 'K' from the image */}
          <Avatar
            size="small"
            style={{ backgroundColor: "#ccc", color: "#666" }}
          >
            K
          </Avatar>
          <Text className="text-sm">{text}</Text>
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string[]) => (
        <Space direction="vertical" size={2}>
          {status.map((tag) => {
            let color = tag.includes("Not") ? "orange" : "green";
            return (
              <Tag color={color} key={tag} className="font-medium">
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Space>
      ),
    },
    {
      title: "",
      key: "action",
      width: 40,
      render: (text: string, record: NoticeData) => (
        <IconTrash
          className="text-gray-400 hover:text-red-500 cursor-pointer"
          size={18}
          onClick={() => console.log("Remove item:", record.key)} // Replace with actual remove logic
        />
      ),
    },
  ];

  return (
    <>
      <Drawer
        title={
          <div className=" flex items-center justify-between">
            <p className="text-lg font-semibold">Delay Extension Notice</p>
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
          dataSource={dummyData}
          pagination={false} 
          rowKey="key"
          size="middle"
          className="w-full"
        />
      </Drawer>

      <ActionDialogmodel
        open={addModalOpen}
        onCancel={() => setAddModalOpen(false)}
        title="Delay / Extension Notice"
        fields={delayExtensionNoticeFields()}
        onSubmit={handleDelayExtensionNotice}
        submitButtonText="confirm"
      />
    </>
  );
}
