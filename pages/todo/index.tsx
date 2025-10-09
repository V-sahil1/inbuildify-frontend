import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { Table, Input, Select, Button, Space, Dropdown, Menu } from "antd";
import { IconDownload } from "@tabler/icons-react";
import { debounce } from "lodash";
import { exportToExcel } from "@lib/utils/exportToExcel";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";
import type { ColumnsType } from "antd/es/table";
import { todoDummyData, TodoDataType } from "data/tasklistData";
import { Dayjs } from "dayjs";
import FilterTabs from "@/components/common/FilterTabs";
import AssigneeSelect from "@/components/common/custom-selects/AssigneeSelect";
import CustomAvtar from "@/components/common/CustomAvtar";

const TodosPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    jobAddress: string;
    taskName: string;
    supplier: string;
    bookingDate: [Dayjs, Dayjs] | string | null;
    startDate: [Dayjs, Dayjs] | string | null;
    siteSupervisor: string;
  }>({
    jobAddress: searchParams.get("jobAddress") || "",
    taskName: searchParams.get("taskName") || "",
    supplier: searchParams.get("supplier") || "",
    bookingDate: searchParams.get("bookingDate") || "",
    startDate: searchParams.get("startDate") || "",
    siteSupervisor: searchParams.get("siteSupervisor") || "",
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
      }, 500),
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

  const handleExport = (data: TodoDataType[], type: string) => {
    const column = {
      JobAddress: "Job Address",
      taskName: "Task Name",
      supplier: "Supplier",
      bookingDate: "Booking Date",
      startDate: "start Date",
      siteSupervisor: "Site Supervisor",
    };
    exportToExcel({
      data,
      fileName: type,
      sheetName: type,
      columnHeaders: column,
    });
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log("Selected filter:", selectedType);
  };
  const columns: ColumnsType<TodoDataType> = [
    {
      title: (
        <div>
          <span>Job Address</span>
          <Input
            value={filters.jobAddress}
            onChange={(e) =>
              handleFilterChange({ ...filters, jobAddress: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "jobAddress",
      key: "jobAddress",
      width: 250,
    },
    {
      title: (
        <div>
          <span>Task Name</span>
          <Input
            value={filters.taskName}
            onChange={(e) =>
              handleFilterChange({ ...filters, taskName: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "taskName",
      key: "taskName",
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Booking Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, bookingDate: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, bookingDate: "" });
            }}
          />
        </div>
      ),
      dataIndex: "bookingDate",
      key: "bookingDate",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Start Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, startDate: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, startDate: "" });
            }}
          />
        </div>
      ),
      dataIndex: "startDate",
      key: "startDate",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Site Supervisor</span>
          <AssigneeSelect
            value={filters.siteSupervisor}
            onChange={(value) =>
              handleFilterChange({ ...filters, siteSupervisor: value })
            }
          />
        </div>
      ),
      dataIndex: "siteSupervisor",
      key: "siteSupervisor",
      width: 150,
      render:(_,record)=>(
        <CustomAvtar label={record.siteSupervisor} />
      )
    },
  ];

  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: "Export Today list",
          onClick: () => handleExport(todoDummyData, "today"),
        },
        {
          key: "2",
          label: "Export Today and overdue list",
          onClick: () => handleExport(todoDummyData, "todayAndOverdue"),
        },
        {
          key: "3",
          label: "Export All list",
          onClick: () => handleExport(todoDummyData, "all"),
        },
        {
          key: "4",
          label: (
            <span className="text-red-500">
              Export will take 2 to 3 <br /> min of time
            </span>
          ),
          disabled: true,
        },
      ]}
    />
  );

  type FilterType =
    | "today"
    | "tomorrow"
    | "this-week"
    | "next-week"
    | "overdue";

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: "today", label: "Today", count: todoDummyData.length },
    { type: "tomorrow", label: "Tomorrow", count: todoDummyData.length },
    { type: "this-week", label: "This Week", count: todoDummyData.length },
    { type: "next-week", label: "Next Week", count: todoDummyData.length },
    { type: "overdue", label: "Overdue", count: todoDummyData.length },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Todo</h1>
        <div className="flex space-x-1 border-b items-center justify-center">
          <FilterTabs
            options={filterOptions}
            defaultType="today"
            onChange={handleFilterTabChange}
          />
        </div>
        <Space>
          <Dropdown overlay={menu} className="w-[100px]" trigger={["click"]}>
            <Button icon={<IconDownload />}>Export</Button>
          </Dropdown>
        </Space>
      </div>

      {/* Filter Tabs */}

      <Table
        columns={columns}
        dataSource={todoDummyData}
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

export default TodosPage;
