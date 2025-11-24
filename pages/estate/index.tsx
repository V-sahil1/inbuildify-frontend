'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography } from 'antd';
import { useRouter } from 'next/router';
import {
  Estate,
  filterEstates,
  getEstateColumns,
  useEstateFilters,
  initialData,
} from 'components/table-columns/EstateColumns';
import EstateDetailModal from '@/components/estate/EstateDetailModal';
import EstateFeatured from '@/components/estate/EstateFeatured';

export default function EstatePage() {
  const router = useRouter();
  const [data, setData] = useState<Estate[]>(initialData);
  const { debouncedUpdateURL, setParams, filters } = useEstateFilters();

  const [newEstateOpen, setNewEstateOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);

  const handleCreateEstate = (values: any) => {
    const newItem: Estate = {
      key: `${Date.now()}`,
      name: values.name || '',
      location: [values.streetName, values.city, values.state].filter(Boolean).join(', '),
      postcode: values.postcode || '',
      isActive: true,
      logo:
        Array.isArray(values.logo) && values.logo.length > 0
          ? values.logo[0].url ||
            (values.logo[0].originFileObj
              ? URL.createObjectURL(values.logo[0].originFileObj)
              : undefined)
          : undefined,
      description: values.description || '',
      regions: values.region || [],
    };
    setData(prev => [...prev, newItem]);
    setNewEstateOpen(false);
  };

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const filteredData = filterEstates(data, filters);

  const { columns } = getEstateColumns({ filters, setParams });

  return (
    <div style={{ padding: 20 }}>
      <div className="flex justify-between mb-4">
        <Typography.Title level={4}>Estate</Typography.Title>

        <Space>
          <Button onClick={() => setFeaturedOpen(true)}>Featured Estate</Button>
          <Button type="primary" onClick={() => setNewEstateOpen(true)}>
            New Estate
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={false}
        onRow={(record: Estate) => ({
          onClick: () => router.push(`/estate/${record.key}`),
          style: { cursor: 'pointer' },
        })}
      />

      {newEstateOpen && (
        <EstateDetailModal
          open={newEstateOpen}
          onCancel={() => setNewEstateOpen(false)}
          onSubmit={handleCreateEstate}
        />
      )}

      {featuredOpen && (
        <EstateFeatured open={featuredOpen} onClose={() => setFeaturedOpen(false)} />
      )}
    </div>
  );
}
