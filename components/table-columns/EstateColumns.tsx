import React from 'react';
import { Input, Select, Tag } from 'antd';
import { debouncedURL } from '@lib/utils/debounceURL';

const { Option } = Select;

export interface EstateColumnsParams {
  filters: Partial<Pick<Estate, 'name' | 'location' | 'postcode'>> & { isActive?: string };
  setParams: (
    params: Partial<Pick<Estate, 'name' | 'location' | 'postcode'>> & { isActive?: string }
  ) => void;
}

export const useEstateFilters = () => {
  return debouncedURL({
    delay: 500,
    filtersKey: ['name', 'location', 'postcode', 'isActive'],
  });
};

export const filterEstates = (
  rows: Estate[],
  filters: Partial<Pick<Estate, 'name' | 'location' | 'postcode'>> & { isActive?: string }
) =>
  rows.filter(
    row =>
      (!filters.name || row.name.toLowerCase().includes((filters.name || '').toLowerCase())) &&
      (!filters.location ||
        row.location.toLowerCase().includes((filters.location || '').toLowerCase())) &&
      (!filters.postcode || row.postcode.includes(filters.postcode || '')) &&
      (!filters.isActive || row.isActive === (filters.isActive === 'true'))
  );

export const getEstateColumns = ({ filters, setParams }: EstateColumnsParams) => {
  const columns = [
    {
      title: (
        <div className="flex flex-col">
          <span>Estate Name</span>
          <Input value={filters.name} onChange={e => setParams({ name: e.target.value ?? '' })} />
        </div>
      ),
      dataIndex: 'name',
      render: (text: string, record: Estate) => (
        <div className="flex items-center gap-2 justify-between">
          <span>{text}</span>
          {record.logo ? (
            <img src={record.logo} alt={record.name} className="w-32 h-14 object-contain mx-auto" />
          ) : null}
        </div>
      ),
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Location</span>
          <Input
            value={filters.location}
            onChange={e => setParams({ location: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'location',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Post Code</span>
          <Input
            type="number"
            value={filters.postcode}
            onChange={e => setParams({ postcode: e.target.value ?? '' })}
          />
        </div>
      ),
      dataIndex: 'postcode',
      width: '10%',
    },
    {
      title: (
        <div className="flex flex-col">
          <span>Status</span>
          <Select
            allowClear
            value={filters.isActive}
            onChange={val => setParams({ isActive: (val ?? '') as string })}
          >
            <Option value="true">Active</Option>
            <Option value="false">Inactive</Option>
          </Select>
        </div>
      ),
      dataIndex: 'isActive',
      width: '10%',
      render: (_: any, record: Estate) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
    },
  ];

  return { columns };
};

export interface Estate {
  key: string;
  name: string;
  description?: string;
  location: string;
  postcode: string;
  isActive: boolean;
  webUrl?: string;
  regions?: string[];
  logo?: string;
}

export const initialData: Estate[] = [
  {
    key: '1',
    name: 'Cobble Springs Estate',
    location: '52-78 ALFRED ROAD, COBBLEBANK, Victoria',
    postcode: '3338',
    isActive: true,
    logo: '/company-light.png',
    description:
      'Get leads directly into one place from different sources like realestate.com.au, Website, marketing templates, iBuildNew, and assign automatically to the right sales executives. Never lose a lead, setup the right follow-up strategy so every lead is followed up on time by sales executives. Record all the details about the lead not limited to their Name, Phone, email, documents, property information, etc. Manage your referral partners and track leads and conversions easily.',
  },
  {
    key: '2',
    name: 'River Gum Rise',
    location: '50 Ross Creek Road, Bonshaw, Victoria',
    postcode: '3352',
    isActive: true,
    description:
      'Get leads directly into one place from different sources like realestate.com.au, Website, marketing templates, iBuildNew, and assign automatically to the right sales executives. Never lose a lead, setup the right follow-up strategy so every lead is followed up on time by sales executives. Record all the details about the lead not limited to their Name, Phone, email, documents, property information, etc. Manage your referral partners and track leads and conversions easily.',
  },
  {
    key: '3',
    name: 'Banksia Estate',
    location: '26 - 28 BURGES LANE, Broadford, Victoria',
    postcode: '3658',
    isActive: false,
    description:
      'Get leads directly into one place from different sources like realestate.com.au, Website, marketing templates, iBuildNew, and assign automatically to the right sales executives. Never lose a lead, setup the right follow-up strategy so every lead is followed up on time by sales executives. Record all the details about the lead not limited to their Name, Phone, email, documents, property information, etc. Manage your referral partners and track leads and conversions easily.',
  },
  {
    key: '4',
    name: 'PenRose Estate',
    location: 'Hickson Road, Officer, Victoria',
    postcode: '3809',
    isActive: true,
    description:
      'Get leads directly into one place from different sources like realestate.com.au, Website, marketing templates, iBuildNew, and assign automatically to the right sales executives. Never lose a lead, setup the right follow-up strategy so every lead is followed up on time by sales executives. Record all the details about the lead not limited to their Name, Phone, email, documents, property information, etc. Manage your referral partners and track leads and conversions easily.',
  },
  {
    key: '5',
    name: 'Hargrove Estate',
    location: '65a Tesselaar Road,, Epping, Victoria',
    postcode: '3076',
    isActive: true,
    description:
      'Get leads directly into one place from different sources like realestate.com.au, Website, marketing templates, iBuildNew, and assign automatically to the right sales executives. Never lose a lead, setup the right follow-up strategy so every lead is followed up on time by sales executives. Record all the details about the lead not limited to their Name, Phone, email, documents, property information, etc. Manage your referral partners and track leads and conversions easily.',
  },
];
