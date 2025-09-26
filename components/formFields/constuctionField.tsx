"use client";

import {
  Tag,
  Input,
  Select,
  DatePicker,
  Button,
  Popover,
  Switch,
  Dropdown,
} from "antd";
import {
  IconDotsVertical,
  IconExternalLink,
  IconFilter,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import { Construction } from "@redux/feature/construction/IConstructionState";
import AssignSupervisorDropdown from "../construction/assignSupervisorModal";
import React from "react";

export const { Option } = Select;

export const FILTER_DEFINITIONS = [
  { label: "Not able to see in video", key: "notAbleToSeeInVideo" },
  { label: "Has Private Inspector", key: "hasPrivateInspector" },
  { label: "Has Options", key: "hasOptions" },
];

export const FilterPopover = ({ toggledFilters, setToggledFilters  }) => {
  const content = (
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
      <div className="flex flex-col gap-1">
        <span className="text-sm">Admin Coordinator</span>
        <Select defaultValue="All">
          {["All", "John", "Jane"].map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      </div>
    </div>
  );

  return (
    <Popover content={content} placement="bottomRight" trigger="hover">
      <Button
        type="text"
        className="flex items-center text-font-color hover:text-primary"
        icon={<IconFilter size={25} />}
      />
    </Popover>
  );
};

export const getColumns = ({
  filters,
  setFilters,
  uniqueBuilders,
  uniqueStages,
  uniqueSupervisors,
  handleSupervisorAssign,
  handleEdit,
  handleDelete
}) => {
  return [
    {
      title: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Reference ID</span>
          <Input
            placeholder="Search ID"
            value={filters.id}
            size="small"
            onChange={(e) => setFilters({ ...filters, id: e.target.value })}
          />
        </div>
      ),
      dataIndex: "id",
      key: "id",
      width: 150,
      render: (id: number, record: Construction) => {
        const overdueDays = dayjs().diff(dayjs(record.dueDate), "day");
        return (
          <div className="flex flex-col">
            <span className="font-semibold mb-1">{id}</span>
            {overdueDays >= 0 && (
              <Tag color="green">{overdueDays} days remaining</Tag>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Customer Name</span>
          <Input
            placeholder="Search Customer"
            size="small"
            value={filters.customerName}
            onChange={(e) =>
              setFilters({ ...filters, customerName: e.target.value })
            }
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
            size="small"
            onChange={(e) =>
              setFilters({ ...filters, jobAddress: e.target.value })
            }
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
          <span className="font-semibold">Builder</span>
          <Select
            value={filters.builderName}
            size="small"
            onChange={(val) => setFilters({ ...filters, builderName: val })}
            className="w-[150px]"
            options={uniqueBuilders.map((b) => ({ label: b, value: b }))}
          />
        </div>
      ),
      dataIndex: "builderName",
      key: "builderName",
      width: 200,
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Job Type</span>
          <Input
            placeholder="Search Job Type"
            value={filters.jobType}
            size="small"
            onChange={(e) =>
              setFilters({ ...filters, jobType: e.target.value })
            }
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
          <span className="font-semibold">Current Stage</span>
          <Select
            value={filters.currentStage}
            size="small"
            onChange={(val) => setFilters({ ...filters, currentStage: val })}
            className="w-[150px]"
            options={uniqueStages.map((s) => ({ label: s, value: s }))}
          />
        </div>
      ),
      dataIndex: "currentStage",
      key: "currentStage",
      width: 220,
      render: (stage: string, record: Construction) => {
        const overdueDays = dayjs().diff(dayjs(record.dueDate), "day");
        return (
          <div className="flex flex-col">
            <span className="font-semibold mb-1">{stage}</span>
            {overdueDays >= 0 && (
              <Tag color="red" className="w-fit">
                {overdueDays} days overdue
              </Tag>
            )}
          </div>
        );
      },
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Due Date</span>
          <DatePicker
            className="w-full"
            size="small"
            value={filters.dueDate ? dayjs(filters.dueDate) : null}
            onChange={(date) =>
              setFilters({
                ...filters,
                dueDate: date ? date.toISOString() : null,
              })
            }
          />
        </div>
      ),
      dataIndex: "dueDate",
      key: "dueDate",
      width: 160,
      render: (date: string) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: (
        <div className="flex flex-col gap-1">
          <span className="font-semibold">Site Supervisor</span>
          <Select
            value={filters.siteSupervisor}
            size="small"
            onChange={(val) => setFilters({ ...filters, siteSupervisor: val })}
            className="w-[150px]"
            options={uniqueSupervisors.map((s) => ({ label: s, value: s }))}
          />
        </div>
      ),
      dataIndex: "siteSupervisor",
      key: "siteSupervisor",
      width: 180,
      render: (supervisor: string, record: Construction) => (
        <div className="flex items-center justify-between">
          <AssignSupervisorDropdown
            assignedSupervisor={supervisor}
            onAssign={(newSupervisor) => handleSupervisorAssign(record.id.toString(), newSupervisor)}
          />
          <div className="flex gap-2">
            <Dropdown
              menu={{
                items: [
                  { key: "edit", label: "Edit" },
                  { key: "delete", label: "Delete" },
                ],
                onClick: (e) => {
                  if (e.key === "edit") {
                    console.log("Editing job", record);
                    handleEdit();
                  }
                  if (e.key === "delete") handleDelete();
                },
              }}
            >
              <IconDotsVertical size={22} stroke={2} />
            </Dropdown>
            <button className="hover:text-primary">
              <IconExternalLink size={22} />
            </button>
          </div>
        </div>
      ),
    },
  ];
};
