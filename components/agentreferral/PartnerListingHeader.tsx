'use client';
import React, { useState, useEffect } from 'react';
import { Button, Input, Radio } from 'antd';
import { IconSearch, IconDownload, IconLayoutGrid, IconTable } from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { initialData } from 'data/agentreferralData';
import { AgentReferralPartnerList } from '@lib/utils/Reports/agent-referral/AgentReferralPartnerList';

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
  onCreateClick,
}: HeaderProps) => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search', 'status'],
    initialValue: {
      status: 'active',
    },
  });

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const handleSearch = (value: string) => {
    setParams({ search: value });
    onSearch?.(value);
  };

  const handleStatusChange = (value: 'active' | 'inactive') => {
    setParams({ status: value });
    onStatusChange?.(value);
  };

  const [view, setView] = useState<'grid' | 'table'>('grid');

  const handleViewToggle = () => {
    const nextView = view === 'grid' ? 'table' : 'grid';
    setView(nextView);
    onViewChange?.(nextView);
  };

  return (
    <div className="flex items-center justify-between my-4 w-full">
      <div className="flex items-center gap-4 w-full">
        <Input
          placeholder="Search partners by name, email and phone number"
          prefix={<IconSearch size={18} />}
          value={filters.search}
          onChange={e => handleSearch(e.target.value)}
          style={{ maxWidth: 450 }}
        />

        <Radio.Group value={filters.status} onChange={e => handleStatusChange(e.target.value)}>
          <Radio.Button value="active">Active</Radio.Button>
          <Radio.Button value="inactive">Inactive</Radio.Button>
        </Radio.Group>

        <div className="text-sm font-medium text-gray-600">{total} Agents/Referral Partners</div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button type="primary" onClick={onCreateClick}>
          + New
        </Button>

        <Button onClick={handleViewToggle}>
          {view === 'grid' ? <IconTable size={18} /> : <IconLayoutGrid size={18} />}
        </Button>

        <Button>
          <IconDownload
            size={18}
            onClick={() => {
              AgentReferralPartnerList(initialData);
            }}
          />
        </Button>
      </div>
    </div>
  );
};

export default AgentReferralHeader;
