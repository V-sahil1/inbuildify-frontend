'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Drawer, Button, Switch, Input } from 'antd';
import { IconInfoSquareFilled, IconSearch, IconX } from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';

interface DashboardDrawerProps {
  open: boolean;
  onClose: () => void;
  chartVisibility: Record<string, boolean>;
  setChartVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

const DashboardDrawer: React.FC<DashboardDrawerProps> = ({
  open,
  onClose,
  chartVisibility,
  setChartVisibility,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const chartNames = [
    'Sales Overview',
    'Lead Sources',
    'Top 5 Performers',
    'Job Conversion',
    'Overall Summary',
    'Top 10 Floorplan',
    'Top 10 Facade',
    'Lead Lost Reasons',
  ];

  const filteredChartNames = useMemo(() => {
    if (!searchTerm) return chartNames;
    return chartNames.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, chartNames]);

  const handleToggleChart = (chartName: string) => {
    setChartVisibility(prev => ({
      ...prev,
      [chartName]: !prev[chartName],
    }));
  };

  const { setParams } = debouncedURL({
    delay: 300,
    filtersKey: ['search'],
    initialValue: { search: '' },
  });

  useEffect(() => {
    const currentParams = new URLSearchParams(window.location.search);
    const searchParam = currentParams.get('search');
    if (searchParam !== searchTerm) {
      setSearchTerm(searchParam || '');
    }
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setParams({ search: value });
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Customize the Dashboard</h2>
          <Button type="text" icon={<IconX size={20} />} onClick={onClose} className="p-0 h-auto" />
        </div>
      }
      placement="right"
      onClose={onClose}
      open={open}
      width="30%"
      className="dashboard-settings-drawer"
      headerStyle={{ borderBottom: '1px solid #f0f0f0', padding: '16px 24px' }}
      bodyStyle={{ padding: '24px' }}
      closeIcon={null}
    >
      <div>
        <div className="flex items-center gap-2">
          <IconInfoSquareFilled className="text-primary" size={18} />
          <p>Customize the column dashboard by choosing columns from the list below</p>
        </div>
        <div className="pt-4 text-right">
          <Button type="primary">Reset</Button>
        </div>
        <div className="my-4">
          <Input
            placeholder="Search"
            prefix={<IconSearch size={20} />}
            onChange={e => handleSearch(e.target.value)}
          />
        </div>
        <div>
          <div className="space-y-4">
            {filteredChartNames.map(chartName => (
              <div key={chartName} className="flex items-center gap-11">
                <Switch
                  checked={chartVisibility[chartName]}
                  onChange={() => handleToggleChart(chartName)}
                  className="ml-2"
                />
                <span className="text-sm text-gray-700">{chartName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default DashboardDrawer;
