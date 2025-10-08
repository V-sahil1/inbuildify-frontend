import { Table, Input, Select, Button, Space, Badge } from "antd";
import { IconFilter, IconDownload, IconBell } from "@tabler/icons-react";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";

interface DataType {
  key: string;
  name: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToId: number;
  assignedTo: string;
  tags: string[];
  contactName: string;
  phone: string;
}

const assignees = [
  { id: 1, label: "John Doe", value: "john@example.com" },
  { id: 2, label: "Jane Smith", value: "jane@example.com" },
  { id: 3, label: "Bob Johnson", value: "bob@example.com" },
  { id: 4, label: "Alice Williams", value: "alice@example.com" },
];

const priorityOptions = [
  { text: "High", value: "high" },
  { text: "Medium", value: "medium" },
  { text: "Low", value: "low" },
];

const statusOptions = [
  { text: "Open", value: "open" },
  { text: "In Progress", value: "inProgress" },
  { text: "Completed", value: "completed" },
];
const columns: ColumnsType<DataType> = [
  {
    title: (
      <div>
        <span>Name</span>
        <Input />
      </div>
    ),
    dataIndex: "name",
    key: "name",
  },
  {
    title: (
      <div>
        <span>Contact Name</span>
        <Input />
      </div>
    ),
    dataIndex: "contactName",
    key: "contactName",
    width: 150,
  },
  {
    title: (
      <div>
        <span>Phone</span>
        <Input />
      </div>
    ),
    dataIndex: "phone",
    key: "phone",
    width: 150,
  },
  {
    title: (
      <div className="flex flex-col">
        <span>Due Date</span>
        <DateFilterDropdown
          onFilter={(type, dates) => {
            console.log("Selected filter:", type, dates);
          }}
          onClear={() => {
            console.log("Cleared date filter");
          }}
        />
      </div>
    ),
    dataIndex: "dueDate",
    key: "dueDate",
    width: 200,
    render: (date) => new Date(date).toLocaleDateString(),
  },
  {
    title: (
      <div>
        <span>Priority</span>
        <Select options={priorityOptions} className="w-full" />
      </div>
    ),
    dataIndex: "priority",
    key: "priority",
    width: 120,
  },
  {
    title: (
      <div>
        <span>Status</span>
        <Select options={statusOptions} className="w-full" />
      </div>
    ),
    dataIndex: "status",
    key: "status",
  },
  {
    title: (
      <div>
        <span>Assignee</span>
        <Select options={assignees} className="w-full" />
      </div>
    ),
    dataIndex: "assignedTo",
    key: "assignedTo",
    width: 200,
  },
];

const TaskTable: React.FC = () => {
  // Mock data
  const data: DataType[] = [
    {
      key: "1",
      name: "Task 1",
      status: "open",
      priority: "High",
      dueDate: "2023-10-15",
      assignedTo: "John Doe",
      assignedToId: 1,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    {
      key: "2",
      name: "Task 2",
      status: "open",
      priority: "High",
      dueDate: "2023-10-14",
      assignedTo: "John Doe",
      assignedToId: 2,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    {
      key: "3",
      name: "Task 3",
      status: "open",
      priority: "High",
      dueDate: "2023-10-16",
      assignedTo: "John Doe",
      assignedToId: 3,
      contactName: "John Doe",
      phone: "123-456-7890",
      tags: ["urgent", "important"],
    },
    // Add more mock data
  ];

  const [activeFilter, setActiveFilter] = useState<{
    type:
      | "all"
      | "open"
      | "inProgress"
      | "completed"
      | "high"
      | "medium"
      | "low";
    label: string;
  }>({ type: "all", label: "All Tasks" });

  // Filter data based on active filter
  const filteredData = data.filter((item) => {
    if (activeFilter.type === "all") return true;
    if (["open", "inProgress", "completed"].includes(activeFilter.type)) {
      return item.status === activeFilter.type;
    }
    if (["high", "medium", "low"].includes(activeFilter.type)) {
      return item.priority === activeFilter.type;
    }
    return true;
  });

  const filterOptions = [
    { type: "today", label: "Today", count: data.length },
    { type: "tomorrow", label: "Tomorrow", count: data.length },
    { type: "this-week", label: "This Week", count: data.length },
    { type: "next-week", label: "Next Week", count: data.length },

    { type: "overdue", label: "Overdue", count: data.length },

    {
      type: "pending",
      label: "Pending",
      count: data.filter((d) => d.status === "pending").length,
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex space-x-1 border-b items-center justify-center">
          {filterOptions.map((filter) => (
            <button
              key={filter.type}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 text-sm font-medium ${
                activeFilter.type === filter.type
                  ? "text-blue-600 border-b-2 border-blue-600 bg-primary text-white rounded"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-2">
                <span>{filter.label}</span>
                <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                  {filter.count}
                </span>
              </div>
            </button>
          ))}
        </div>
        <Space>
          <Badge count={5}>
            <Button icon={<IconBell />} shape="circle" />
          </Badge>
          <Button icon={<IconDownload />}>Export</Button>
          <Button icon={<IconFilter />}>Filter</Button>
        </Space>
      </div>

      {/* Filter Tabs */}

      <Table
        columns={columns}
        dataSource={data}
        rowSelection={{
          type: "checkbox",
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default TaskTable;
