'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Button, Input, Radio } from 'antd';
import { IconSearch, IconDownload, IconLayoutGrid, IconTable } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import { debouncedURL } from '@lib/utils/debounceURL';
import { exportToExcel } from '@lib/utils/exportToExcel';
import { initialData, Partners } from 'data/agentreferralData';

interface HeaderProps {
  total: number;
  onSearch?: (val: string) => void;
  onStatusChange?: (status: 'active' | 'inactive') => void;
  onViewChange?: (view: 'grid' | 'table') => void;
  onCreateClick?: () => void;
}

const AgentReferralHeader = ({
  total,
  onSearch,
  onStatusChange,
  onViewChange,
  onCreateClick
}: HeaderProps) => {

  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    status: (searchParams.get('status') as 'active' | 'inactive') || 'active'
  });

  const debouncedUpdateURL = debouncedURL();

  const handleFilterChange = useCallback(
    (updates: Partial<typeof filters>) => {
      setFilters(prev => {
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

  const handleSearch = (value: string) => {
    handleFilterChange({ search: value });
    onSearch?.(value);
  };

  const handleStatusChange = (value: 'active' | 'inactive') => {
    handleFilterChange({ status: value });
    onStatusChange?.(value);
  };

  const [view, setView] = useState<'grid' | 'table'>('grid');

  const handleViewToggle = () => {
    const nextView = view === 'grid' ? 'table' : 'grid';
    setView(nextView);
    onViewChange?.(nextView);
  };

  const handleExport = (data: Partners[]) => {
  const column = {
    name: 'Name',
    address1: 'Address',
    email: 'email',
    phone: 'Phone',
    loginId: 'LoginId',
    isActive: 'Status',
  };

  exportToExcel({
    data: data.map(d => ({
      ...d,
      isActive: d.isActive ? "Active" : "Inactive"
    })),
    fileName: 'Agent-ReferralPartnerList',
    sheetName: 'Agent-ReferralPartnerList',
    columnHeaders: column,
  });
};


  return (
    <div className="flex items-center justify-between my-4 w-full">

      <div className="flex items-center gap-4 w-full">
        <Input
          placeholder="Search partners by name, email and phone number"
          prefix={<IconSearch size={18} />}
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ maxWidth: 450 }}
        />

        <Radio.Group
          value={filters.status}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="inactive">Inactive</Radio.Button>
        </Radio.Group>

        <div className="text-sm font-medium text-gray-600">
          {total} Agents/Referral Partners
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button type="primary" onClick={onCreateClick}>+ New</Button>

        <Button onClick={handleViewToggle}>
          {view === 'grid' ? <IconTable size={18} /> : <IconLayoutGrid size={18} />}
        </Button>

        <Button>
          <IconDownload size={18}
            onClick={() => {
              handleExport(initialData);
            }} />
        </Button>
      </div>
    </div>
  );
};

export default AgentReferralHeader;
