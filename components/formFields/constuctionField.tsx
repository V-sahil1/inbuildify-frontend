"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Input, Select, Button, Dropdown, Popover, Switch, Modal } from "antd";
import { IconDotsVertical, IconExternalLink, IconFilter } from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import { debounce } from "lodash";
import SystemRoutes from "@lib/constants/Routes";
import { Construction } from "@redux/feature/construction/IConstructionState";
import AssignSupervisorDropdown from "../construction/assignSupervisorModal";
import AssigneeSelect from "../common/custom-selects/AssigneeSelect";
import DateFilterDropdown from "../common/custom-selects/DateFilterDropdown";
import ConfirmationModal from "../common/ConfirmationModal";
import { ActionDialogmodel } from "../common/Models/ActionDialogModel";

type DateRange = [Dayjs, Dayjs] | null;

export const FILTER_DEFINITIONS = [
  { label: "Not able to see in video", key: "notAbleToSeeInVideo" },
  { label: "Has Private Inspector", key: "hasPrivateInspector" },
  { label: "Has Options", key: "hasOptions" },
];

export const FilterPopover = ({
  toggledFilters,
  setToggledFilters,
}: {
  toggledFilters: Record<string, boolean>;
  setToggledFilters: (filters: Record<string, boolean>) => void;
}) => {
  return (
    <Popover
      content={
        <div className="flex flex-col gap-4 w-64">
          <h3 className="font-semibold text-sm">Filters</h3>
          {FILTER_DEFINITIONS.map((filter) => (
            <div key={filter.key} className="flex items-center justify-between">
              <span className="text-sm">{filter.label}</span>
              <Switch
                checked={toggledFilters[filter.key]}
                onChange={() =>
                  setToggledFilters({
                    ...toggledFilters,
                    [filter.key]: !toggledFilters[filter.key],
                  })
                }
              />
            </div>
          ))}
        </div>
      }
      placement="bottomRight"
      trigger="hover"
    >
      <Button
        type="text"
        icon={<IconFilter size={25} />}
      />
    </Popover>
  );
};

const ALL_CONSTUCTION_STATUSES = [
  { key: "readyforconstruction", label: "Ready For Construction" },
  { key: "underconstruction", label: "Under Construction" },
  { key: "completed", label: "Completed" },
  { key: "onhold", label: "On Hold" },
];

export const useConstructionTableLogic = ({
  handleSupervisorAssign,
  handleStatusChange,
  handleRevertFromConstruction,
  handleExport,
}: {
  handleSupervisorAssign: (jobId: string, newSupervisor: string) => void;
  handleStatusChange: (jobId: string, newStatusKey: string) => void;
  handleRevertFromConstruction?: (jobId: string) => void;
  handleExport?: (jobId: string) => void;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isRevertModalVisible, setIsRevertModalVisible] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [isStatusChangeModalVisible, setIsStatusChangeModalVisible] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<{ jobId: string; statusKey: string; statusLabel: string } | null>(null);

  const [filters, setFilters] = useState({
    id: searchParams.get("id") || "",
    customerName: searchParams.get("customerName") || "",
    jobAddress: searchParams.get("jobAddress") || "",
    jobType: searchParams.get("jobType") || "",
    builderName: searchParams.get("builderName") || "All",
    currentStage: searchParams.get("currentStage") || "All",
    dueDate: null as DateRange,
    siteSupervisor: searchParams.get("siteSupervisor") || "All",
    status: searchParams.get("status") || "All",
  });

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((newFilters: typeof filters) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(newFilters).forEach(([key, value]) => {
          if (value && value !== "All") params.set(key, typeof value === "string" ? value : "");
          else params.delete(key);
        });
        router.replace(`${pathname}?${params.toString()}`);
      }, 400),
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


  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const handleRevert = () => {
    if (selectedJobId && handleRevertFromConstruction) {
      handleRevertFromConstruction(selectedJobId);
      setIsRevertModalVisible(false);
      setSelectedJobId(null);
    }
  };

  const handleCancelRevert = () => {
    setIsRevertModalVisible(false);
    setSelectedJobId(null);
  };

  const handleStatusChangeConfirm = () => {
    if (selectedStatus) {
      handleStatusChange(selectedStatus.jobId, selectedStatus.statusKey);
      setIsStatusChangeModalVisible(false);
      setSelectedStatus(null);

    }
  };

  const handleCancelStatusChange = () => {
    setIsStatusChangeModalVisible(false);
    setSelectedStatus(null);
  };

  const constructionColumns = useMemo(() => {
    const uniqueBuilders = ["All", "Builder1", "Builder2"];
    const uniqueStages = ["All", "Stage1", "Stage2"];

    return [
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Reference ID</span>
            <Input
              placeholder="Search ID"
              value={filters.id}
              onChange={(e) => handleFilterChange({ id: e.target.value })}
            />
          </div>
        ),
        dataIndex: "id",
        key: "id",
        width: 150,
        render: (id: number) => <span className="font-semibold">{id}</span>,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Customer Name</span>
            <Input
              placeholder="Search Customer"
              value={filters.customerName}
              onChange={(e) => handleFilterChange({ customerName: e.target.value })}
            />
          </div>
        ),
        dataIndex: "customerName",
        key: "customerName",
        width: 180,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Job Address</span>
            <Input
              placeholder="Search Address"
              value={filters.jobAddress}
              onChange={(e) => handleFilterChange({ jobAddress: e.target.value })}
            />
          </div>
        ),
        dataIndex: "jobAddress",
        key: "jobAddress",
        width: 220,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Job Type</span>
            <Input
              placeholder="Search Job Type"
              value={filters.jobType}
              onChange={(e) => handleFilterChange({ jobType: e.target.value })}
            />
          </div>
        ),
        dataIndex: "jobType",
        key: "jobType",
        width: 180,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Builder</span>
            <Select
              value={filters.builderName}
              onChange={(val) => handleFilterChange({ builderName: val })}
            >
              {uniqueBuilders.map((b) => (
                <Select.Option key={b} value={b}>
                  {b}
                </Select.Option>
              ))}
            </Select>
          </div>
        ),
        dataIndex: "builderName",
        key: "builderName",
        width: 150,
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Current Stage</span>
            <Select
              value={filters.currentStage}
              onChange={(val) => handleFilterChange({ currentStage: val })}
            >
              {uniqueStages.map((s) => (
                <Select.Option key={s} value={s}>
                  {s}
                </Select.Option>
              ))}
            </Select>
          </div>
        ),
        dataIndex: "currentStage",
        key: "currentStage",
        width: 150,
      },
      {
        title: (
          <div className="flex flex-col">
            <div className="font-semibold">End Date</div>
            <DateFilterDropdown
              onFilter={(type, dates) => {
                const dateString = dates
                  ? `${dates[0].toISOString()},${dates[1].toISOString()}`
                  : "";
                handleFilterChange({ ...filters, dueDate: dates });
              }}
              onClear={() => {
                console.log("Cleared date filter");
                handleFilterChange({ ...filters, dueDate: null });
              }}
            />
          </div>
        ),
        dataIndex: "dueDate",
        key: "dueDate",
        width: 160,
        render: (date: string) => (date ? dayjs(date).format("YYYY-MM-DD") : ""),
      },
      {
        title: (
          <div className="flex flex-col gap-1">
            <span className="font-semibold">Site Supervisor</span>
            <AssigneeSelect
              value={filters.siteSupervisor}
              onChange={(value) => handleFilterChange({ siteSupervisor: value })}
            />
          </div>
        ),
        dataIndex: "siteSupervisor",
        key: "siteSupervisor",
        width: 180,
        render: (supervisor: string, record: Construction) => {
          const currentStatusKey = record.status.toLowerCase();

          const statusChangeItems = ALL_CONSTUCTION_STATUSES
            .filter((item) => item.key !== currentStatusKey)
            .map((item) => ({
              key: item.key,
              label: item.label,
            }));

          const handleMenuClick = (e: any) => {
            console.log("Menu clicked:", e.key);

            const statusItem = ALL_CONSTUCTION_STATUSES.find(item => item.key === e.key);
            if (statusItem) {
              console.log("Status change detected:", statusItem);
              setSelectedStatus({
                jobId: record.id.toString(),
                statusKey: statusItem.key,
                statusLabel: statusItem.label
              });
              setIsStatusChangeModalVisible(true);
              return;
            }

            if (e.key === "revert") {
              console.log("Revert clicked");
              setSelectedJobId(record.id.toString());
              setIsRevertModalVisible(true);
            }
            if (e.key === "export") {
              console.log("Export clicked");
              handleExport?.(record.id.toString());
            }
          };

          const actionMenu = {
            items: [
              {
                key: "changestatusto_header",
                label: "Change status to:",
                type: 'group' as const,
                children: statusChangeItems,
              },
              { type: 'divider' as const },
              {
                key: "assign_header",
                label: "Assign:",
                type: 'group' as const,
                children: [
                  {
                    key: "Admincoordinator", label: "Admin Coordinator"
                  }
                ],
              },
              { type: 'divider' as const },
              { key: "revert", label: "Revert to Construction" },
              { key: "export", label: "Export" },
            ],
            onClick: handleMenuClick,
          };

          return (
            <div
              className="flex items-center justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              <AssignSupervisorDropdown
                assignedSupervisor={supervisor}
                onAssign={(newSupervisor) =>
                  handleSupervisorAssign(record.id.toString(), newSupervisor)
                }
              />
              <div className="flex gap-2">
                <Dropdown menu={actionMenu}>
                  <Button type="text" icon={<IconDotsVertical size={22} />} />
                </Dropdown>
                <Button
                  type="text"
                  className="hover:text-primary"
                  icon={<IconExternalLink size={22} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(`/${SystemRoutes.CONSTRUCTION}/${record.id}`, "_blank");
                  }}
                />
              </div>
            </div>
          );
        },
      },
    ];
  }, [filters, handleFilterChange, handleSupervisorAssign, handleStatusChange, handleExport, setIsStatusChangeModalVisible, setSelectedStatus, setIsRevertModalVisible, setSelectedJobId]);

  const RevertModal = () => (
    <ConfirmationModal
      open={isRevertModalVisible}
      onConfirm={handleRevert}
      onClose={handleCancelRevert}
      type="warning"
      message={
        <div className="felx felx-col">
          <p>Reverting this record will delete all information added after moved from construction. Once deleted, you can't retrieve back the details.</p>
          <p>Are you sure you want to Revert from constuction?</p>
        </div>
      }
      confirmText="Revert"
      cancelText="Cancel"
      maxWidth="md"
    />
  );

  const StatusChangeModal = () => {
    if (!selectedStatus) return null;
    return (
      <ActionDialogmodel
        open={isStatusChangeModalVisible}
        onCancel={handleCancelStatusChange}
        title={`Move to ${selectedStatus.statusLabel}`}
        isEditing={true}
        fields={[
          {
            name: "comments",
            label: "Comments",
            type: "textarea" as const,
            placeholder: "Enter comments...",
          }
        ]}
        onSubmit={handleStatusChangeConfirm}
        submitButtonText="confirm"
      />
    );
  };

  return {
    filters,
    handleFilterChange,
    constructionColumns,
    RevertModal,
    StatusChangeModal
  };
};