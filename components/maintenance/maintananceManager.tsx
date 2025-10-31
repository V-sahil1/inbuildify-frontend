'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import { Button, Card, Table, Tag, Dropdown, Select, DatePicker } from 'antd';
import { IconFilter } from '@tabler/icons-react';
import SystemRoutes from '@lib/constants/Routes';
import { DateRange, getStatus, PROJECT_STATUS_MAP } from '@lib/utils/maintenanceStatusCards';
import { MaintenanceDashboardData } from 'data/sampleData';
import { useMaintenanceTableLogic } from '../formFields/maintenanceField';

const { Option } = Select;
const { RangePicker } = DatePicker;

const MaintenanceManager = () => {
  const router = useRouter();

  const [maintenanceData, setMaintenanceData] = useState(MaintenanceDashboardData);
  const [activeStatus, setActiveStatus] = useState<string | 'All'>('All');
  const [filterVisible, setFilterVisible] = useState(false);

  const [filters, setFilters] = useState({
    id: '',
    customerName: '',
    jobAddress: '',
    currentStage: 'All',
    startDate: null as DateRange,
    endDate: null as DateRange,
    Supervisor: 'All',
  });

  const [pciDateFilter, setPciDateFilter] = useState('All');
  const [handoverDateFilter, setHandoverDateFilter] = useState('All');
  const [customRange, setCustomRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const handleDateFilterChange = (key: 'PCI' | 'Handover', value: string) => {
    key === 'PCI' ? setPciDateFilter(value) : setHandoverDateFilter(value);
  };

  const handleCardClick = (status: string) =>
    setActiveStatus(prev => (prev === status ? 'All' : status));

  const filteredData = useMemo(() => {
    return maintenanceData.filter(item => {
      if (activeStatus !== 'All' && item.status.toLowerCase() !== activeStatus) return false;

      const match =
        item.id.toString().includes(filters.id) &&
        item.customerName.toLowerCase().includes(filters.customerName.toLowerCase()) &&
        item.jobAddress.toLowerCase().includes(filters.jobAddress.toLowerCase()) &&
        (filters.Supervisor === 'All' || item.Supervisor === filters.Supervisor);

      if (!match) return false;

      const checkRange = (itemDate: string, range: DateRange | null) => {
        if (!range) return true;
        const [start, end] = range;
        const date = dayjs(itemDate, 'DD-MM-YYYY', true);
        return date.isValid() && date.isBetween(start, end, 'day', '[]');
      };

      return (
        checkRange(item.startDate, filters.startDate) && checkRange(item.endDate, filters.endDate)
      );
    });
  }, [maintenanceData, filters, activeStatus]);

  const finalStatusCounts = useMemo(() => {
    const counts = maintenanceData.reduce(
      (acc, { status }) => {
        const key = status.toLowerCase();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.fromEntries(Object.keys(PROJECT_STATUS_MAP).map(key => [key, counts[key] || 0]));
  }, [maintenanceData]);

  const handleSupervisorAssign = (jobId: string | number, newSupervisor: string) =>
    setMaintenanceData(prev =>
      prev.map(i =>
        i.id.toString() === jobId.toString() ? { ...i, Supervisor: newSupervisor } : i
      )
    );

  const handleStatusChange = (jobId: string | number, newStatusKey: string) => {};

  const handleRevertToConstruction = (jobId: string) => {
    console.log('Reverting maintennace to construction:', jobId);
  };

  const {
    maintenanceColumns: columns,
    StatusChangeModal,
    RevertModal,
  } = useMaintenanceTableLogic({
    handleSupervisorAssign,
    handleStatusChange,
    handleRevertToConstruction,
  });

  const filterDropdown = (
    <div className="p-3 w-64 bg-white shadow-md rounded-md">
      {['PCI', 'Handover'].map(type => {
        const value = type === 'PCI' ? pciDateFilter : handoverDateFilter;
        return (
          <div key={type} className="mb-3">
            <label className="font-medium">{type} Date</label>
            <Select
              value={value}
              onChange={val => handleDateFilterChange(type as 'PCI' | 'Handover', val)}
              className="w-full mt-1"
            >
              {['All', 'Current Month', 'Last 7 days', 'Last 15 days', 'Last Month', 'Custom'].map(
                opt => (
                  <Option key={opt} value={opt}>
                    {opt}
                  </Option>
                )
              )}
            </Select>
            {value === 'Custom' && (
              <RangePicker
                className="mt-2 w-full"
                onChange={dates => setCustomRange(dates as [dayjs.Dayjs, dayjs.Dayjs])}
              />
            )}
          </div>
        );
      })}

      <div className="flex justify-end gap-2 pt-2">
        <Button size="small" onClick={() => setFilterVisible(false)}>
          Cancel
        </Button>
        <Button
          type="primary"
          size="small"
          onClick={() => {
            console.log('Applied Filters', { pciDateFilter, handoverDateFilter, customRange });
            setFilterVisible(false);
          }}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <h1 className="text-2xl font-bold mt-4">Maintenance Dashboard</h1>
        <div className="flex items-center gap-2">
          <Tag color="orange">Total Records {filteredData.length}</Tag>
          <Dropdown
            overlay={filterDropdown}
            open={filterVisible}
            onOpenChange={setFilterVisible}
            trigger={['click']}
            placement="bottomRight"
          >
            <Button
              type="text"
              className="flex items-center text-font-color hover:text-primary"
              icon={<IconFilter size={25} />}
            />
          </Dropdown>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 justify-start p-4">
        {Object.entries(finalStatusCounts).map(([status, count]) => {
          const info = getStatus(status);
          if (!info) return null;
          const { label, color, icon } = info;
          const active = activeStatus === status;

          return (
            <Card
              key={status}
              onClick={() => handleCardClick(status)}
              className={`min-w-[250px] flex-1 border-l-4 cursor-pointer transition-all duration-200 ${
                active ? 'shadow-lg' : 'hover:shadow-md'
              }`}
              style={{ borderLeft: `4px solid ${color}` }}
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

      {/* Table */}
      <div className="p-4">
        <Table
          dataSource={filteredData}
          columns={columns}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1400 }}
          onRow={record => ({
            onClick: () => router.push(`${SystemRoutes.MAINTENANCE}/${record.id}`),
            style: { cursor: 'pointer' },
          })}
        />
      </div>
      <StatusChangeModal />
      <RevertModal />
    </div>
  );
};

export default MaintenanceManager;
