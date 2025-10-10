import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { Table, Input, Space, Dropdown, Switch, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { debounce } from "lodash";
import { IconFilter, IconDownload, IconShare3 } from "@tabler/icons-react";
import { exportToExcel } from "@lib/utils/exportToExcel";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";
import FilterTabs from "@/components/common/FilterTabs";
import AssigneeSelect from "@/components/common/custom-selects/AssigneeSelect";
import TooltipButton from "@/components/common/TooltipButtton";
import DynamicHorizontalChart from "@/components/common/charts/DynamicHorizontalChart";
import { JobDataType, jobDummyData } from "data/joblistData";
import CustomAvtar from "@/components/common/CustomAvtar";
import Link from "next/link";

const JobPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    refrenceId: string;
    customerName: string;
    jobAddress: string;
    estateName: string;
    created: string;
    titled: string;
    consultant: string;
  }>({
    refrenceId: searchParams.get("refrenceId") || "",
    customerName: searchParams.get("customerName") || "",
    jobAddress: searchParams.get("jobAddress") || "",
    estateName: searchParams.get("estateName") || "",
    created: searchParams.get("created") || "",
    titled: searchParams.get("titled") || "",
    consultant: searchParams.get("consultant") || "",
  });
  const [showBlocked, setShowBlocked] = useState(false);
  const [currentBar, setCurrentBar] = useState<string>();

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

  const handleExport = (data: JobDataType[]) => {
    const column = {
      refrenceId: "Refrence ID",
      CustomerName: "Customer Name",
      jobAddress: "Job Address",
      created: "Created At",
      titled: "Titled At",
      estateName: "Estate Name",
      consultant: "Consultant",
    };
    exportToExcel({
      data,
      fileName: "Jobs",
      sheetName: "Jobs",
      columnHeaders: column,
    });
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log("Selected filter:", selectedType);
    // You can call your API or set state here
  };

  const handleBarClick = (status: string) => {
    console.log("status", status);
    setCurrentBar(status);
  };

  const columns: ColumnsType<JobDataType> = [
    {
      title: (
        <div>
          <span>Refrence ID</span>
          <Input
            value={filters.refrenceId}
            onChange={(e) =>
              handleFilterChange({ ...filters, refrenceId: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "slugId",
      key: "slugId",
      width: 250,
    },
    {
      title: (
        <div>
          <span>Customer Name</span>
          <Input
            value={filters.customerName}
            onChange={(e) =>
              handleFilterChange({ ...filters, customerName: e.target.value })
            }
          />
        </div>
      ),
      dataIndex: "customerName",
      key: "customerName",
      width: 250,
    },
    {
      title: (
        <div>
          <span>Job Address</span>
          <Input
            value={filters.jobAddress}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                jobAddress: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: "jobAddress",
      key: "jobAddress",
      width: 200,
    },

    {
      title: (
        <div className="flex flex-col">
          <span>Created Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, created: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, created: "" });
            }}
          />
        </div>
      ),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Title Date</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, titled: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, titled: "" });
            }}
          />
        </div>
      ),
      dataIndex: "titledAt",
      key: "titledAt",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div>
          <span>Estate Name</span>
          <Input
            value={filters.estateName}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                estateName: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: "estateName",
      key: "estateName",
      width: 200,
    },
    {
      title: (
        <div>
          <span>Consultant</span>
          <AssigneeSelect
            value={filters.consultant}
            onChange={(value) =>
              handleFilterChange({ ...filters, consultant: value })
            }
          />
        </div>
      ),
      dataIndex: "consultant",
      key: "consultant",
      width: 200,
      render: (consultant) => (
        <div className="flex justify-between items-center">
          <CustomAvtar label={consultant?.name} />
          <Link href="#"><IconShare3 size={15} className="cursor-pointer text-blue" /></Link>
        </div>
      ),
    },
  ];
  type FilterType =
    | "inProgress"
    | "completed"
    | "onHold"
    | "cancelled"
    | "archieved";

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: "inProgress", label: "In Progress", count: jobDummyData.length },
    { type: "completed", label: "Completed", count: jobDummyData.length },
    { type: "onHold", label: "On Hold", count: jobDummyData.length },
    { type: "cancelled", label: "Cancelled", count: jobDummyData.length },
    { type: "archieved", label: "Archieved", count: jobDummyData.length },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Job List</h1>
        <div className="flex space-x-1 border-b items-center justify-center">
          <FilterTabs
            options={filterOptions}
            defaultType="all"
            onChange={handleFilterTabChange}
          />
        </div>
        <Space>
          <Button>Filtered Records: {jobDummyData.length}</Button>
          <Dropdown
            trigger={["click"]}
            menu={{
              items: [
                {
                  key: "1",
                  label: (
                    <Space>
                      <Switch
                        checked={showBlocked}
                        onChange={(val) => setShowBlocked(val)}
                      />
                      <span>Show Blocklisted Leads</span>
                    </Space>
                  ),
                },
              ],
            }}
          >
            <TooltipButton title="Filter" icon={<IconFilter />} />
          </Dropdown>
          <Space>
            <TooltipButton
              title="Export"
              icon={<IconDownload />}
              onClick={() => handleExport(jobDummyData)}
            />
          </Space>
        </Space>
      </div>
      <DynamicHorizontalChart
        title="Job Status Overview"
        categories={[
          "In Progress",
          "Completed",
          "On Hold",
          "Cancelled",
          "Archived",
        ]}
        chartType="bar"
        seriesData={[40, 7, 3, 80, 9]}
        onBarClick={handleBarClick}
      />
      <p className="my-4">{currentBar && "Job status: " + currentBar}</p>
      <Table
        columns={columns}
        dataSource={jobDummyData}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
        }}
      />
    </div>
  );
};

export default JobPage;
