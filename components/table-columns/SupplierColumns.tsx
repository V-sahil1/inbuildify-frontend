import { Input, Select, Button, Tag } from 'antd';
import { IconTrash } from '@tabler/icons-react';
import React, { useMemo, useState } from 'react';
import { debouncedURL } from '@lib/utils/debounceURL';

const { Option } = Select;

export interface Supplier {
  key: string;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  type: string[];
  induction: boolean;
  isActive: boolean;
  description?: string;
  contactName?: string;
  workCoverExpiryDate?: string;
  plInsuranceExpiryDate?: string;
  tradeLicenseExpiryDate?: string;
  whiteCardExpiryDate?: string;
  forkLiftLicenseExpiryDate?: string;
}

export const useSupplierColumns = () => {
  const initialSuppliers: Supplier[] = [
    {
      key: '1',
      name: '5AB Painting Services',
      email: 'yash@insimplify.com.au',
      phone: '',
      website: '',
      type: ['Painter'],
      induction: false,
      isActive: true,
    },
    {
      key: '2',
      name: 'ABC Bricks',
      email: 'yash@insimplify.com.au',
      phone: '',
      website: '',
      type: ['Brick Layer'],
      induction: false,
      isActive: true,
    },
    {
      key: '3',
      name: 'CDE Bricks',
      email: 'yash@insimplify.com.au',
      phone: '',
      website: '',
      type: ['Brick cleaner'],
      induction: false,
      isActive: false,
    },
  ];

  const [data, setData] = useState<Supplier[]>(initialSuppliers);

  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    delay: 500,
    filtersKey: ['name', 'email', 'phone', 'website', 'type', 'induction', 'isActive'],
  });

  React.useEffect(() => () => debouncedUpdateURL.cancel(), [debouncedUpdateURL]);

  const filteredData = useMemo(() => {
    return data.filter(row => {
      const nameFilter =
        !filters.name || row.name.toLowerCase().includes(String(filters.name).toLowerCase());
      const emailFilter =
        !filters.email || row.email.toLowerCase().includes(String(filters.email).toLowerCase());
      const phoneFilter = !filters.phone || (row.phone || '').includes(String(filters.phone));
      const websiteFilter =
        !filters.website ||
        (row.website || '').toLowerCase().includes(String(filters.website).toLowerCase());
      const typeFilter = !filters.type || row.type?.includes(filters.type as string);

      const inductionValue = String(filters.induction ?? '');
      const inductionFilter =
        !inductionValue ||
        (inductionValue === 'yes' && row.induction) ||
        (inductionValue === 'no' && !row.induction);

      const isActiveValue = String(filters.isActive ?? '');
      const isActiveFilter =
        !isActiveValue ||
        (isActiveValue === 'active' && row.isActive) ||
        (isActiveValue === 'inactive' && !row.isActive);

      return (
        nameFilter &&
        emailFilter &&
        phoneFilter &&
        websiteFilter &&
        typeFilter &&
        inductionFilter &&
        isActiveFilter
      );
    });
  }, [data, filters]);

  const uniqueTypes = useMemo(
    () => Array.from(new Set(data.flatMap(d => d.type || []))).filter(Boolean),
    [data]
  );

  const handleDelete = (key: string) => {
    setData(prev => prev.filter(row => row.key !== key));
  };

  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Supplier Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'name',
      width: '20%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Email</span>
          <Input value={filters.email} onChange={e => setParams({ email: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'email',
      width: '20%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Phone</span>
          <Input value={filters.phone} onChange={e => setParams({ phone: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'phone',
      width: '10%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Website</span>
          <Input
            value={filters.website}
            onChange={e => setParams({ website: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'website',
      width: '15%',
      render: (value: string | undefined) =>
        value ? (
          <a href={value} target="_blank" rel="noreferrer" className="text-blue-500">
            {value}
          </a>
        ) : (
          ''
        ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Type</span>
          <Select allowClear value={filters.type} onChange={val => setParams({ type: val ?? '' })}>
            {uniqueTypes.map(type => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </div>
      ),
      dataIndex: 'type',
      width: '10%',
      render: (value: string[] | undefined) => (value && value.length ? value.join(', ') : ''),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Induction</span>
          <Select
            allowClear
            value={filters.induction}
            onChange={val => setParams({ induction: val ?? '' })}
          >
            <Option value="yes">Yes</Option>
            <Option value="no">No</Option>
          </Select>
        </div>
      ),
      dataIndex: 'induction',
      width: '10%',
      render: (value: boolean) => (value ? 'Yes' : 'No'),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <Select
            allowClear
            value={filters.isActive}
            onChange={val => setParams({ isActive: val ?? '' })}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      ),
      dataIndex: 'isActive',
      width: '10%',
      render: (value: boolean) => (
        <Tag color={value ? 'green' : 'red'}>{value ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: '',
      dataIndex: 'actions',
      width: '5%',
      render: (_: any, record: Supplier) => (
        <Button danger type="text" onClick={() => handleDelete(record.key)}>
          <IconTrash size={20} />
        </Button>
      ),
    },
  ];

  return {
    columns,
    data,
    filteredData,
    setData,
  };
};
