'use client';
import React, { useState } from 'react';
import { Button, Input, Radio } from 'antd';
import { IconSearch, IconDownload, IconLayoutGrid, IconTable } from '@tabler/icons-react';
import { initialData } from 'data/agentreferralData';
import { AgentReferralPartnerList } from '@lib/utils/Reports/agent-referral/AgentReferralPartnerList';

interface HeaderProps {
  total: number;
  onViewChange?: (view: 'grid' | 'table') => void;
  onCreateClick?: () => void;
  setParams?: (updatedParams: Record<string, string>) => void;
  filters?: Record<string, string>;
}

const AgentReferralHeader = ({
  total,
  onViewChange,
  onCreateClick,
  setParams,
  filters,
}: HeaderProps) => {
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
          onChange={e => setParams({ search: e.target.value })}
          style={{ maxWidth: 450 }}
        />

        <Radio.Group value={filters.status} onChange={e => setParams({ status: e.target.value })}>
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
