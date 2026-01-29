'use client';

import React, { useState, useEffect } from 'react';
import { Button, Select } from 'antd';
import DynamicHorizontalChart from '@/components/common/charts/DynamicHorizontalChart';
import { IconSettings } from '@tabler/icons-react';
import DashboardDrawer from '@/components/sales/DashboardDrawer';
import { useUsersHook } from '@hooks/useUserHook';
import DateFilterDropdown from '@/components/common/custom-selects/DateFilterDropdown';
import {
  salesData,
  leadSources,
  topPerformers,
  jobConversion,
  overallSummary,
  topFloorplans,
  topFacades,
  leadLostReason,
} from '../../data/salesData';

const SalesDashboard = () => {
  const [user, setUser] = useState('all');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { userOptions } = useUsersHook();

  const [chartVisibility, setChartVisibility] = useState({
    'Sales Overview': true,
    'Lead Sources': true,
    'Top 5 Performers': true,
    'Job Conversion': true,
    'overall summary': true,
    'Top 10 Floorplan': true,
    'Top 10 Facade': true,
    'Lead Lost Reasons': true,
  });

  return (
    <div className="h-[83%] bg-gray-50 p-6 flex flex-col">
      <div className="flex-shrink-0 mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Sales Dashboard</h1>
          <div className="flex gap-4">
            <DateFilterDropdown onFilter={() => {}} onClear={() => {}} />
            <Select
              value={user}
              onChange={setUser}
              className="w-48"
              options={userOptions}
              allowClear
            />
            <Button onClick={() => setDrawerOpen(true)}>
              <IconSettings size={20} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chartVisibility['Sales Overview'] && (
            <div>
              <DynamicHorizontalChart
                title="Sales Overview"
                categories={salesData.map(d => d.month)}
                seriesData={salesData.map(d => d.total)}
                chartType="bar"
                horizontal={false}
              />
            </div>
          )}

          {chartVisibility['Lead Sources'] && (
            <div>
              <DynamicHorizontalChart
                title="Lead Sources"
                categories={leadSources.map(s => s.source)}
                seriesData={leadSources.map(s => s.value)}
                chartType="pie"
              />
            </div>
          )}

          {chartVisibility['Top 5 Performers'] && (
            <div>
              <DynamicHorizontalChart
                title="Top 5 Performers"
                categories={topPerformers.map(p => p.name)}
                seriesData={topPerformers.map(p => p.score)}
                chartType="line"
              />
            </div>
          )}

          {chartVisibility['Job Conversion'] && (
            <div>
              <DynamicHorizontalChart
                title="Job Conversion"
                categories={jobConversion.map(j => j.status)}
                seriesData={jobConversion.map(j => j.value)}
                chartType="line"
              />
            </div>
          )}

          {chartVisibility['overall summary'] && (
            <div>
              <DynamicHorizontalChart
                title="Overall Summary"
                categories={overallSummary.map(j => j.status)}
                seriesData={overallSummary.map(j => j.value)}
                chartType="donut"
              />
            </div>
          )}

          {chartVisibility['Top 10 Floorplan'] && (
            <div>
              <DynamicHorizontalChart
                title="Top 10 Floorplan"
                categories={topFloorplans.map(f => f.name)}
                seriesData={topFloorplans.map(f => f.count)}
                chartType="pie"
              />
            </div>
          )}

          {chartVisibility['Top 10 Facade'] && (
            <div>
              <DynamicHorizontalChart
                title="Top 10 Facade"
                categories={topFacades.map(f => f.name)}
                seriesData={topFacades.map(f => f.count)}
                chartType="pie"
              />
            </div>
          )}

          {chartVisibility['Lead Lost Reasons'] && (
            <div>
              <DynamicHorizontalChart
                title="Lead Lost Reasons"
                categories={leadLostReason.map(d => d.name)}
                seriesData={leadLostReason.map(d => d.count)}
                chartType="bar"
                horizontal={true}
              />
            </div>
          )}
        </div>
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
