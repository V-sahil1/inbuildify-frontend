'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Typography, message } from 'antd';
import { useRouter } from 'next/router';
import { getEstateColumns } from 'components/table-columns/EstateColumns';
import EstateDetailModal from '@/components/estate/EstateDetailModal';
import EstateFeatured from '@/components/estate/EstateFeatured';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createEState, fetchAllEState } from '@redux/feature/estate/estateThunk';
import { IEstate } from '@redux/feature/estate/IEstateState';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { debouncedURL } from '@lib/utils/debounceURL';
import { Status } from '@lib/constants/enum';

export default function EstatePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { estate, status } = useAppSelector(state => state.estate);
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    delay: 500,
    filtersKey: ['name', 'location', 'zip', 'status'],
    initialValue: { status: '' },
  });

  const [newEstateOpen, setNewEstateOpen] = useState(false);
  const [featuredOpen, setFeaturedOpen] = useState(false);

  useEffect(() => {
    fetchEStateData();
  }, [filters]);

  const fetchEStateData = async () => {
    try {
      const params = {
        name: filters?.name || undefined,
        status: filters?.status !== '' ? filters.status === 'active' : undefined,
        zip_code: filters?.zip || undefined,
        location: filters?.location || undefined,
      };
      await dispatch(fetchAllEState(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch estate data');
    }
  };

  useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const { columns } = getEstateColumns({ instantFilters, setParams });

  const handleCreateEstate = async (values: IEstate) => {
    try {
      const formData = formDataGenerator(values);
      await dispatch(createEState(formData)).unwrap();
      message.success('Estate created successfully');
      setNewEstateOpen(false);
    } catch (error) {
      message.error(error || 'Failed to save estate');
    }
  };

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
        dataSource={estate}
        pagination={false}
        onRow={(record: IEstate) => ({
          onClick: () => router.push(`/estate/${record.estateId}`),
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
