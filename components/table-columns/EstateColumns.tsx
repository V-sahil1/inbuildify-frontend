import React from 'react';
import { Input, Select, Tag } from 'antd';
import { IEstate } from '@redux/feature/estate/IEstateState';

const { Option } = Select;

export interface EstateColumnsParams {
  instantFilters: Record<string, string>;
  setParams: (params: Record<string, string>) => void;
}

export const getEstateColumns = ({ instantFilters, setParams }: EstateColumnsParams) => {
  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Estate Name</span>
          <Input
            value={instantFilters?.name}
            onChange={e => setParams({ name: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'name',
      render: (text: string, record: IEstate) => (
        <div className="flex items-center gap-2 justify-between">
          <span>{text}</span>
          {record.estateLogo ? (
            <img
              src={record.estateLogo}
              alt={record.name}
              className="w-32 h-14 object-contain mx-auto"
            />
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Location</span>
          <Input
            value={instantFilters?.location}
            onChange={e => setParams({ location: e.target.value ?? '' })}
          />
        </div>
      ),
      render: (_, record) => record?.streetName + ', ' + record?.city + ', ' + record?.stateName,
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Post Code</span>
          <Input
            type="number"
            value={instantFilters?.postcode}
            onChange={e => setParams({ zip: e.target.value ?? '' })}
            onWheel={(e) => e.currentTarget.blur()}
          />
        </div>
      ),
      dataIndex: 'zip',
      width: '10%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <Select
            allowClear
            value={instantFilters?.isActive}
            onChange={val => setParams({ status: val })}
          >
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </div>
      ),
      dataIndex: 'status',
      width: '10%',
      render: (_, record: IEstate) => (
        <Tag color={record.status ? 'green' : 'red'}>{record.status ? 'Active' : 'Inactive'}</Tag>
      ),
    },
  ];
  return { columns };
};
