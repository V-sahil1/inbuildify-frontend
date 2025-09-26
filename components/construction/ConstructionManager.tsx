"use client";
import {
  Card,
  Table,
  Tag,
} from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import dayjs from "dayjs";
import { Construction } from "@redux/feature/construction/IConstructionState";
import { ConstructionDashboardData } from "data/sampleData";
import {
  getColumns,
  FILTER_DEFINITIONS,
  FilterPopover,
} from "../formFields/constuctionField";
import { getStatus } from "@lib/utils/constructionStatusCards";
import React from "react";

const ConstructionManager = () => {
  const router = useRouter();
  const [constructionData, setConstructionData] = useState(ConstructionDashboardData);
  const [filters, setFilters] = useState({
    id: "",
    customerName: "",
    jobAddress: "",
    builderName: "All",
    jobType: "",
    currentStage: "All",
    dueDate: null as string | null,
    siteSupervisor: "All",
  });

  const [toggledFilters, setToggledFilters] = useState({
    notAbleToSeeInVideo: false,
    hasPrivateInspector: false,
    hasOptions: false,
  });

  const statusCounts = constructionData.reduce((acc, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const makeUnique = (key: keyof Construction | "adminCoordinator") => {
    const adminCoordinators = ["All", "John", "Jane"];
    if (key === "adminCoordinator") return adminCoordinators;
    return ["All", ...new Set(constructionData.map((d) => d[key as keyof Construction]))];
  };

  const uniqueBuilders = makeUnique("builderName");
  const uniqueStages = makeUnique("currentStage");
  const uniqueSupervisors = makeUnique("siteSupervisor");

  const handleSupervisorAssign = (jobId: string | number, newSupervisor: string) => {
    setConstructionData(prevData =>
      prevData.map(item =>
        item.id.toString() === jobId.toString()
          ? { ...item, siteSupervisor: newSupervisor }
          : item
      )
    );
    console.log(`Assigned ${newSupervisor} to job ${jobId}`);
  };

  const handleEdit = () => console.log("Editing");
  const handleDelete = () => console.log("Deleting");

  const filteredData = constructionData.filter((item) => {
    return (
      item.id.toString().toLowerCase().includes(filters.id.toLowerCase()) &&
      item.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
      item.jobAddress.toLowerCase().includes(filters.jobAddress.toLowerCase()) &&
      item.jobType.toLowerCase().includes(filters.jobType.toLowerCase()) &&
      (filters.builderName === "All" || item.builderName === filters.builderName) &&
      (filters.currentStage === "All" || item.currentStage === filters.currentStage) &&
      (!filters.dueDate || dayjs(item.dueDate).isSame(filters.dueDate, "day")) &&
      (filters.siteSupervisor === "All" || item.siteSupervisor === filters.siteSupervisor)
    );
  });

  const columns = getColumns({ filters, setFilters, uniqueBuilders, uniqueStages, uniqueSupervisors, handleSupervisorAssign, handleEdit, handleDelete });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold text-left mt-4">
          Construction Dashboard
        </h1>
        <FilterPopover
          toggledFilters={toggledFilters}
          setToggledFilters={setToggledFilters}
        />
      </div>

      {/* Status Cards */}
      <div className="flex flex-wrap gap-4 justify-start p-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const { label, color, icon } = getStatus(status);
          return (
            <Card
              key={status}
              className="min-w-[250px] flex-1"
              style={{ borderLeft: `4px solid ${color}` }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{icon}</div>
                <div className="flex-1">
                  <h3 className="m-0 font-medium">{label}</h3>
                </div>
                <div className="text-xl font-bold">{count}</div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="pl-4 pr-4 flex items-center">
        {FILTER_DEFINITIONS.map(
          (filter) =>
            toggledFilters[filter.key] && (
              <Tag
                key={filter.key}
                closable color="orange"
                onClose={() =>
                  setToggledFilters({ ...toggledFilters, [filter.key]: false })
                }
                className="text-base"
              >
                {filter.label}
              </Tag>
            )
        )}
      </div>

      <div className="p-4">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          onRow={(record) => ({
            onClick: () => router.push(`/construction/#${record.id}`),
          })}
        />
      </div>
    </>
  );
};

export default ConstructionManager;
