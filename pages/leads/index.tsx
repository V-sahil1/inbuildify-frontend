import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { Table, Input, Button, Space, Dropdown, Switch, Tooltip } from "antd";
import { debounce } from "lodash";
import {
  IconFilter,
  IconDownload,
  IconUpload,
  IconTrash,
} from "@tabler/icons-react";
import type { ColumnsType } from "antd/es/table";
import { exportToExcel } from "@lib/utils/exportToExcel";
import DateFilterDropdown from "@/components/common/custom-selects/DateFilterDropdown";
import FilterTabs from "@/components/common/FilterTabs";
import AssigneeSelect from "@/components/common/custom-selects/AssigneeSelect";
import SourceSelect from "@/components/common/custom-selects/SourceSelect";
import RatingSelect from "@/components/common/custom-selects/RatingSelect";
import { leadDummyData, LeadDataType } from "data/LeadlistData";
import TooltipButton from "@/components/common/TooltipButtton";

const LeadPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<{
    refrenceId: string;
    name: string;
    propertyAddress: string;
    source: string;
    rating: string;
    created: string;
    updated: string;
    assignedTo: string;
  }>({
    refrenceId: searchParams.get("refrenceId") || "",
    name: searchParams.get("name") || "",
    propertyAddress: searchParams.get("propertyAddress") || "",
    source: searchParams.get("source") || "",
    rating: searchParams.get("rating") || "",
    created: searchParams.get("created") || "",
    updated: searchParams.get("updated") || "",
    assignedTo: searchParams.get("assignedTo") || "",
  });
  const [showBlocked, setShowBlocked] = useState(false);

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

  const handleExport = (data: LeadDataType[]) => {
    const column = {
      name: "Name",
      refrenceId: "Refrence ID",
      propertyAddress: "Property Address",
      source: "Source",
      rating: "Rating",
      created: "Created",
      updated: "Updated",
      assignedTo: "Assignee",
    };
    exportToExcel({
      data,
      fileName: "Leads",
      sheetName: "Leads",
      columnHeaders: column,
    });
  };

  const handleFilterTabChange = (selectedType: string) => {
    console.log("Selected filter:", selectedType);
    // You can call your API or set state here
  };

  const columns: ColumnsType<LeadDataType> = [
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
      dataIndex: "refrenceId",
      key: "refrenceId",
      width: 250,
    },
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
          <span>Property Address</span>
          <Input
            value={filters.propertyAddress}
            onChange={(e) =>
              handleFilterChange({
                ...filters,
                propertyAddress: e.target.value,
              })
            }
          />
        </div>
      ),
      dataIndex: "propertyAddress",
      key: "propertyAddress",
      width: 200,
    },
    {
      title: (
        <div>
          <span>Source</span>
          <SourceSelect
            value={filters.source}
            onChange={(value) =>
              handleFilterChange({ ...filters, source: value })
            }
          />
        </div>
      ),
      dataIndex: "source",
      key: "source",
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Rating</span>
          <RatingSelect
            value={filters.rating}
            onChange={(value) =>
              handleFilterChange({ ...filters, rating: value })
            }
          />
        </div>
      ),
      dataIndex: "rating",
      key: "rating",
      width: 150,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Created</span>
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
      dataIndex: "created",
      key: "created",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Updated</span>
          <DateFilterDropdown
            onFilter={(type, dates) => {
              const dateString = dates
                ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                : "";
              handleFilterChange({ ...filters, updated: dateString });
            }}
            onClear={() => {
              console.log("Cleared date filter");
              handleFilterChange({ ...filters, updated: "" });
            }}
          />
        </div>
      ),
      dataIndex: "updated",
      key: "updated",
      width: 150,
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: (
        <div>
          <span>Assignee</span>
          <AssigneeSelect
            value={filters.assignedTo}
            onChange={(value) =>
              handleFilterChange({ ...filters, assignedTo: value })
            }
          />
        </div>
      ),
      dataIndex: "assignedTo",
      key: "assignedTo",
      width: 200,
    },
  ];
  type FilterType =
    | "all"
    | "leads"
    | "opportunities"
    | "closedWon"
    | "closedLost"
    | "onHold";

  const filterOptions: Array<{
    type: FilterType;
    label: string;
    count: number;
  }> = [
    { type: "all", label: "All", count: leadDummyData.length },
    { type: "leads", label: "Leads", count: leadDummyData.length },
    {
      type: "opportunities",
      label: "Opportunities",
      count: leadDummyData.length,
    },
    { type: "closedWon", label: "Closed Won", count: leadDummyData.length },
    { type: "closedLost", label: "Closed Lost", count: leadDummyData.length },
    { type: "onHold", label: "On Hold", count: leadDummyData.length },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex space-x-1 border-b items-center justify-center">
          <FilterTabs
            options={filterOptions}
            defaultType="all"
            onChange={handleFilterTabChange}
          />
        </div>
        <Space>
          <Button>Total Records: {leadDummyData.length}</Button>
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
              title="Delete"
              icon={<IconTrash />}
              onClick={() => handleExport(leadDummyData)}
            />
            <TooltipButton
              title="Import"
              icon={<IconUpload />}
              onClick={() => handleExport(leadDummyData)}
            />
            <TooltipButton
              title="Export"
              icon={<IconDownload />}
              onClick={() => handleExport(leadDummyData)}
            />
          </Space>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={leadDummyData}
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

export default LeadPage;
