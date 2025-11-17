import { IconTrash } from '@tabler/icons-react';
import { Button, Input, Select, Tag } from 'antd';
import { useState } from 'react';
import ConfirmationModal from '../common/ConfirmationModal';

interface HolidayData {
  id: number;
  start: string;
  end: string;
  description: string;
  state: string;
  status: 'Active' | 'Inactive';
}

export const useHolidayMasterColumns = ({ filters, setParams }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(null);
  const data: HolidayData[] = [
    {
      id: 1,
      start: '01-01-2027',
      end: '01-01-2027',
      description: "New Year's Day",
      state: 'All',
      status: 'Active',
    },
    {
      id: 2,
      start: '26-12-2026',
      end: '28-12-2026',
      description: 'Boxing Day',
      state: 'All',
      status: 'Active',
    },
  ];

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday Start Date</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by start date"
            value={filters.startDate}
            onChange={e => setParams({ startDate: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'start',
      key: 'start',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday End Date</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by end date"
            value={filters.endDate}
            onChange={e => setParams({ endDate: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'end',
      key: 'end',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Holiday Description</span>
          <Input
            size="small"
            className="mt-1"
            placeholder="Filter by description"
            value={filters.desc}
            onChange={e => setParams({ desc: e.target.value })}
          />
        </div>
      ),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">State</span>
          <Select
            size="small"
            className="mt-1 w-full"
            value={filters.state}
            onChange={value => setParams({ state: value })}
            options={[
              { label: 'All', value: 'All' },
              { label: 'VIC', value: 'VIC' },
              { label: 'NSW', value: 'NSW' },
            ]}
          />
        </div>
      ),
      dataIndex: 'state',
      key: 'state',
    },
    {
      title: (
        <div className="flex flex-col">
          <span className="font-medium text-gray-700">Status</span>
          <Select
            size="small"
            className="mt-1 w-full"
            value={filters.status}
            onChange={value => setParams({ status: value })}
            options={[
              { label: 'All', value: 'All' },
              { label: 'Active', value: 'Active' },
              { label: 'Inactive', value: 'Inactive' },
            ]}
          />
        </div>
      ),
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'} className="px-3 py-1 text-sm">
          {status}
        </Tag>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: any, record: HolidayData) => (
        <Button
          type="text"
          icon={<IconTrash size={18} />}
          onClick={e => {
            e.stopPropagation();
            setDeleteModalOpen(record);
          }}
        />
      ),
    },
  ];

  const handleDelete = (id: number) => {
    console.log('Deleting holiday with id:', id);
    // TODO
    // the video not mentioned about inactive active but the holiday could be inactive need to verify with BE
    // Add your delete logic here
  };

  return {
    columns,
    data,
    deleteModal: !!deleteModalOpen && (
      <ConfirmationModal
        open={!!deleteModalOpen}
        onClose={() => setDeleteModalOpen(null)}
        type="danger"
        onConfirm={() => handleDelete(deleteModalOpen?.id)}
        title="Delete Holiday"
        message={`Are you sure you want to delete this holiday?`}
      />
    ),
  };
};
