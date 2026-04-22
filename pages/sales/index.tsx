'use client';

import React, { useState, useEffect } from 'react';
import { Button, Select, Skeleton, Spin, message } from 'antd';
import DynamicHorizontalChart from '@/components/common/charts/DynamicHorizontalChart';
import { IconSettings, IconUsers, IconTarget, IconTrophy, IconChartBar, IconRefresh } from '@tabler/icons-react';
import DashboardDrawer from '@/components/sales/DashboardDrawer';
import { useUsersHook } from '@hooks/useUserHook';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@redux/feature/store';
import { getSalesDashboardThunk, refreshWidgetsCacheThunk } from '@redux/feature/dashboard/dashboardThunk';
import { Status } from '@lib/constants/enum';
import type { Dayjs } from 'dayjs';

const KPICard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}) => (
  <div
    className="flex items-center gap-4 p-4 rounded-xl shadow-sm border border-opacity-20"
    style={{ backgroundColor: 'var(--card-color)', borderColor: 'var(--border-color)' }}
  >
    <div
      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
      style={{ backgroundColor: `${color}18` }}
    >
      <span style={{ color }}>{icon}</span>
    </div>
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--font-color-100)' }}>
        {title}
      </p>
      <p className="text-2xl font-bold mt-0.5" style={{ color: 'var(--font-color)' }}>
        {value ?? 0}
      </p>
    </div>
  </div>
);

const SalesDashboard = () => {
  const [user, setUser] = useState('all');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [customDateRange, setCustomDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isRefreshingWidgets, setIsRefreshingWidgets] = useState(false);
  const { userOptions } = useUsersHook();
  const dispatch = useDispatch<AppDispatch>();

  const salesDashboard = useSelector((state: RootState) => state.dashboard.salesDashboard);
  const salesDashboardStatus = useSelector((state: RootState) => state.dashboard.salesDashboardStatus);
  const isLoading = salesDashboardStatus === Status.PENDING;

  const [chartVisibility, setChartVisibility] = useState({
    'Sales Overview': true,
    'Lead Sources': true,
    'Top 5 Performers': true,
    'Job Conversion': true,
    'Overall Summary': true,
    'Top 10 Floorplan': true,
    'Top 10 Facade': true,
    'Lead Lost Reasons': true,
  });

  useEffect(() => {
    void fetchSalesDashboardData();
  }, [dispatch, user, dateFilter, customDateRange]);

  const fetchSalesDashboardData = async () => {
    const payload: {
      user_id?: string;
      created_at?: string;
      created_at_from?: string;
      created_at_to?: string;
    } = {};

    if (user && user !== 'all') {
      payload.user_id = user;
    }

    if (dateFilter === 'custom' && customDateRange) {
      payload.created_at_from = customDateRange[0].startOf('day').toISOString();
      payload.created_at_to = customDateRange[1].endOf('day').toISOString();
    } else if (dateFilter) {
      payload.created_at = dateFilter;
    }

    await dispatch(getSalesDashboardThunk(payload));
  };

  const handleRefreshWidgets = async () => {
    setIsRefreshingWidgets(true);
    try {
      await dispatch(refreshWidgetsCacheThunk()).unwrap();
      await fetchSalesDashboardData();
      message.success('Sales widgets refreshed with latest data.');
    } catch {
      message.error('Failed to refresh sales widgets. Please try again.');
    } finally {
      setIsRefreshingWidgets(false);
    }
  };

  // --- Derived chart data from API (falls back to empty arrays) ---
  const monthlyLeads = salesDashboard?.monthlyLeads ?? [];
  const leadSources = salesDashboard?.leadSources ?? [];
  const topPerformers = salesDashboard?.topPerformers ?? [];
  const overallSummary = salesDashboard?.overallSummary;
  const topFloorplans = salesDashboard?.topFloorplans ?? [];
  const topFacades = salesDashboard?.topFacades ?? [];
  const leadLostReasons = salesDashboard?.leadLostReasons ?? [];

  const kpiCards = [
    {
      title: 'Total Leads',
      value: overallSummary?.totalLeads ?? 0,
      icon: <IconUsers size={22} />,
      color: '#3B82F6',
    },
    {
      title: 'New Leads',
      value: overallSummary?.newLeads ?? 0,
      icon: <IconTarget size={22} />,
      color: '#10B981',
    },
    {
      title: 'Working',
      value: overallSummary?.workingLeads ?? 0,
      icon: <IconChartBar size={22} />,
      color: '#F59E0B',
    },
    {
      title: 'Converted',
      value: overallSummary?.convertedLeads ?? 0,
      icon: <IconTrophy size={22} />,
      color: '#8B5CF6',
    },
  ];

  const overallSummaryCategories = ['Total Leads', 'New', 'Working', 'Converted'];
  const overallSummaryValues = [
    overallSummary?.totalLeads ?? 0,
    overallSummary?.newLeads ?? 0,
    overallSummary?.workingLeads ?? 0,
    overallSummary?.convertedLeads ?? 0,
  ];

  const jobConversionCategories = ['New Leads', 'Working', 'Converted'];
  const jobConversionValues = [
    overallSummary?.newLeads ?? 0,
    overallSummary?.workingLeads ?? 0,
    overallSummary?.convertedLeads ?? 0,
  ];

  return (
    <div
      className="min-h-[93%] bg-gray-50 px-3 pt-4 sm:px-5 sm:pt-5 lg:px-6 lg:pt-6 flex flex-col"
      style={{ backgroundColor: 'var(--bg-color)' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 mb-5">
        <div className="flex flex-wrap justify-between items-start gap-3">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--font-color)' }}>
              Sales Dashboard
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'var(--font-color-100)' }}>
              Real-time overview of your sales pipeline
            </p>
          </div>
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-nowrap overflow-x-auto pb-1 lg:pb-0">
              <div className="w-[150px] min-w-[150px]">
                <DateFilterDropdown
                  onFilter={(type, dates) => {
                    setDateFilter(type);
                    if (type === 'custom' && dates) {
                      setCustomDateRange(dates);
                    } else {
                      setCustomDateRange(null);
                    }
                  }}
                  onClear={() => {
                    setDateFilter('');
                    setCustomDateRange(null);
                  }}
                />
              </div>
              <Select
                value={user}
                onChange={setUser}
                className="w-[150px] min-w-[150px]"
                options={[{ label: 'All Users', value: 'all' }, ...userOptions]}
                allowClear
                placeholder="Select user"
              />
              <Button
                onClick={() => setDrawerOpen(true)}
                icon={<IconSettings size={18} />}
                title="Customize dashboard"
                className="min-w-[112px]"
              >
                Customize
              </Button>
              <Button
                onClick={handleRefreshWidgets}
                icon={<IconRefresh size={18} />}
                loading={isRefreshingWidgets}
                className="min-w-[112px]"
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {/* KPI Summary Cards */}
        <Spin spinning={isLoading} tip="Loading...">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
            {kpiCards.map(card => (
              <KPICard key={card.title} {...card} />
            ))}
          </div>

          {isLoading && !salesDashboard ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: 'var(--card-color)' }}
                >
                  <Skeleton active paragraph={{ rows: 5 }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {chartVisibility['Sales Overview'] && (
                <DynamicHorizontalChart
                  title="Sales Overview"
                  categories={
                    monthlyLeads.length > 0 ? monthlyLeads.map(d => d.month) : ['No Data']
                  }
                  seriesData={
                    monthlyLeads.length > 0 ? monthlyLeads.map(d => Number(d.total)) : [0]
                  }
                  chartType="bar"
                  horizontal={false}
                  height={260}
                />
              )}

              {chartVisibility['Lead Sources'] && (
                <DynamicHorizontalChart
                  title="Lead Sources"
                  categories={leadSources.length > 0 ? leadSources.map(s => s.source) : ['No Data']}
                  seriesData={leadSources.length > 0 ? leadSources.map(s => Number(s.count)) : [0]}
                  chartType="pie"
                  height={260}
                />
              )}

              {chartVisibility['Top 5 Performers'] && (
                <DynamicHorizontalChart
                  title="Top 5 Performers"
                  categories={
                    topPerformers.length > 0 ? topPerformers.map(p => p.name) : ['No Data']
                  }
                  seriesData={
                    topPerformers.length > 0 ? topPerformers.map(p => Number(p.count)) : [0]
                  }
                  chartType="bar"
                  horizontal={true}
                  height={260}
                />
              )}

              {chartVisibility['Job Conversion'] && (
                <DynamicHorizontalChart
                  title="Job Conversion"
                  categories={jobConversionCategories}
                  seriesData={jobConversionValues}
                  chartType="donut"
                  height={260}
                />
              )}

              {chartVisibility['Overall Summary'] && (
                <DynamicHorizontalChart
                  title="Overall Summary"
                  categories={overallSummaryCategories}
                  seriesData={overallSummaryValues}
                  chartType="radialBar"
                  height={260}
                />
              )}

              {chartVisibility['Top 10 Floorplan'] && (
                <DynamicHorizontalChart
                  title="Top 10 Floorplan"
                  categories={
                    topFloorplans.length > 0 ? topFloorplans.map(f => f.name) : ['No Data']
                  }
                  seriesData={
                    topFloorplans.length > 0 ? topFloorplans.map(f => Number(f.count)) : [0]
                  }
                  chartType="pie"
                  height={260}
                />
              )}

              {chartVisibility['Top 10 Facade'] && (
                <DynamicHorizontalChart
                  title="Top 10 Facade"
                  categories={topFacades.length > 0 ? topFacades.map(f => f.name) : ['No Data']}
                  seriesData={topFacades.length > 0 ? topFacades.map(f => Number(f.count)) : [0]}
                  chartType="pie"
                  height={260}
                />
              )}

              {chartVisibility['Lead Lost Reasons'] && (
                <DynamicHorizontalChart
                  title="Lead Lost Reasons"
                  categories={
                    leadLostReasons.length > 0 ? leadLostReasons.map(d => d.name) : ['No Data']
                  }
                  seriesData={
                    leadLostReasons.length > 0 ? leadLostReasons.map(d => Number(d.count)) : [0]
                  }
                  chartType="bar"
                  horizontal={true}
                  height={260}
                />
              )}
            </div>
          )}
        </Spin>
      </div>

      <DashboardDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        chartVisibility={chartVisibility}
        setChartVisibility={setChartVisibility}
      />
    </div>
  );
};

export default SalesDashboard;
