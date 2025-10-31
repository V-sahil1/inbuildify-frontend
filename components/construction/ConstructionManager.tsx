'use client';
import { Card, Table, Tag } from 'antd';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import SystemRoutes from '@lib/constants/Routes';
import { getStatus } from '@lib/utils/constructionStatusCards';
import { ConstructionDashboardData } from 'data/sampleData';
import {
  FILTER_DEFINITIONS,
  FilterPopover,
  useConstructionTableLogic,
} from '../formFields/constuctionField';

const ConstructionManager = () => {
  const router = useRouter();
  const [constructionData, setConstructionData] = useState(ConstructionDashboardData);

  const [toggledFilters, setToggledFilters] = useState({
    notAbleToSeeInVideo: false,
    hasPrivateInspector: false,
    hasOptions: false,
  });

  const handleSupervisorAssign = (jobId: string | number, newSupervisor: string) => {
    setConstructionData(prev =>
      prev.map(item =>
        item.id.toString() === jobId.toString() ? { ...item, siteSupervisor: newSupervisor } : item
      )
    );
  };

  const handleStatusChange = (jobId: string | number, newStatusKey: string) => {};

  const handleRevertFromConstruction = (jobId: string) => {
    console.log('Reverting job from construction:', jobId);
  };

  const handleExport = (jobId: string) => {
    console.log('Exporting job:', jobId);
  };

  const {
    filters,
    handleFilterChange,
    constructionColumns: columns,
    RevertModal,
    StatusChangeModal,
  } = useConstructionTableLogic({
    handleSupervisorAssign,
    handleStatusChange,
    handleRevertFromConstruction,
    handleExport,
  });

  const statusCounts = useMemo(() => {
    return constructionData.reduce(
      (acc, item) => {
        acc[item.status] = (acc[item.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [constructionData]);

  const filteredData = useMemo(() => {
    return constructionData.filter(item => {
      return (
        item.id.toString().toLowerCase().includes(filters.id.toLowerCase()) &&
        item.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
        item.jobAddress.toLowerCase().includes(filters.jobAddress.toLowerCase()) &&
        item.jobType.toLowerCase().includes(filters.jobType.toLowerCase()) &&
        (filters.builderName === 'All' || item.builderName === filters.builderName) &&
        (filters.currentStage === 'All' || item.currentStage === filters.currentStage) &&
        (filters.siteSupervisor === 'All' || item.siteSupervisor === filters.siteSupervisor) &&
        (filters.status === 'All' || item.status === filters.status)
      );
    });
  }, [constructionData, filters]);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold mt-4">Construction Dashboard</h1>
        <FilterPopover
          toggledFilters={toggledFilters}
          setToggledFilters={updated => setToggledFilters(prev => ({ ...prev, ...updated }))}
        />
      </div>

      {/* Status Cards */}
      <div className="flex flex-wrap gap-4 justify-start p-4">
        {Object.entries(statusCounts).map(([status, count]) => {
          const { label, color, icon } = getStatus(status);
          const isActive = filters.status === status;
          return (
            <Card
              key={status}
              className={`min-w-[250px] flex-1 cursor-pointer transition-shadow ${isActive ? 'shadow-md' : 'shadow-sm'}`}
              style={{ borderLeft: `4px solid ${color}` }}
              onClick={() => handleFilterChange({ status })}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{icon}</div>
                <div className="flex-1 font-medium">{label}</div>
                <div className="text-xl font-bold">{count}</div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Active filter tags */}
      <div className="pl-4 pr-4 flex items-center gap-2">
        {FILTER_DEFINITIONS.map(
          filter =>
            toggledFilters[filter.key] && (
              <Tag
                key={filter.key}
                closable
                color="orange"
                onClose={() => setToggledFilters(prev => ({ ...prev, [filter.key]: false }))}
                className="text-base"
              >
                {filter.label}
              </Tag>
            )
        )}
        {filters.status !== 'All' && (
          <Tag
            closable
            color="blue"
            onClose={() => handleFilterChange({ status: 'All' })}
            className="text-base"
          >
            {filters.status}
          </Tag>
        )}
      </div>

      {/* Table */}
      <div className="p-4">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          onRow={record => ({
            onClick: () => router.push(`/${SystemRoutes.CONSTRUCTION}/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      <StatusChangeModal />
      <RevertModal />
    </>
  );
};

export default ConstructionManager;
