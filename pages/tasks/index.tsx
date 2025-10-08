import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Table, Input, Select, Button, Space, Badge } from "antd";
import { IconFilter, IconDownload, IconBell } from "@tabler/icons-react";
import { debounce } from "lodash";
import { exportToExcel } from "@lib/utils/exportToExcel";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";
import PrioritySelect from "@/components/common/custom-selects/PrioritySelect";
import StatusSelect from "@/components/common/custom-selects/StatusSelect";
import type { ColumnsType } from "antd/es/table";
import { data, DataType } from "data/tasklistDara";
import { Dayjs } from "dayjs";

const assignees = [
  { id: 1, label: "John Doe", value: "john@example.com" },
  { id: 2, label: "Jane Smith", value: "jane@example.com" },
  { id: 3, label: "Bob Johnson", value: "bob@example.com" },
  { id: 4, label: "Alice Williams", value: "alice@example.com" },
];

const TaskTable: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    name: string;
    contactName: string;
    phone: string;
    dueDate: [Dayjs, Dayjs] | string | null;
    priority: string;
    status: string;
  }>({
    name: searchParams.get("name") || "",
    contactName: searchParams.get("contactName") || "",
    phone: searchParams.get("phone") || "",
    dueDate: searchParams.get("dueDate") || "",
    priority: searchParams.get("priority") || "",
    status: searchParams.get("status") || "",
  });

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value) {
            params.set(key, value.toString());
          } else {
            params.delete(key);
          }
        });

        router.replace(`${pathname}?${params.toString()}`);
      }, 500), // 500ms debounce delay
    [pathname, router, searchParams]
  );

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters((prev) => {
        const newFilters = { ...prev, ...updates };
        debouncedUpdateURL(newFilters);
        return newFilters;
      });
    },
    [debouncedUpdateURL]
  );

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleExport = (data: DataType[]) => {
    const column = {
      name: "Name",
      contactName: "Contact Name",
      phone: "Phone",
      dueDate: "Due Date",
      priority: "Priority",
      status: "Status",
      assignedTo: "Assignee",
    };
    exportToExcel({
      data,
      fileName: "TaskList",
      sheetName: "TaskList",
      columnHeaders: column,
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: (
        <div>
          <span>Name</span>
          <Input
            value={filters.name}
            onChange={(e) =>
              handleFilterChange({ ...filters, name: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "name",
      key: "name",
      width: 250,
    },
    {
      title: (
        <div>
          <span>Contact Name</span>
          <Input
            value={filters.contactName}
            onChange={(e) =>
              handleFilterChange({ ...filters, contactName: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "contactName",
      key: "contactName",
      width: 200,
    },
    {
      title: (
        <div>
          <span>Phone</span>
          <Input
            value={filters.phone}
            onChange={(e) =>
              handleFilterChange({ ...filters, phone: e.target.value })
            }
          />
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
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, dueDate: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, dueDate: "" });
            }}
          />
        </div>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div>
          <span>Priority</span>
          <PrioritySelect
            value={filters.priority}
            onChange={(value) =>
              handleFilterChange({ ...filters, priority: value })
            }
          />
        </div>
      ),
      dataIndex: "priority",
      key: "priority",
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <StatusSelect
            value={filters.status}
            onChange={(value) =>
              handleFilterChange({ ...filters, status: value })
            }
          />
        </div>
      ),
      dataIndex: "status",
      key: "status",
      width: 120,
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
  type FilterType =
    | "today"
    | "tomorrow"
    | "this-week"
    | "next-week"
    | "overdue"
    | "pending";
  const [activeFilter, setActiveFilter] = useState<{
    type: FilterType;
    label: string;
    count?: number;
  }>({ type: "today", label: "Today" });

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
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
              onClick={() => {
                const { type, label } = filter;
                setActiveFilter({ type, label });
              }}
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
          <Button
            icon={<IconDownload />}
            onClick={() => {
              handleExport(data);
            }}
          >
            Export
          </Button>
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
