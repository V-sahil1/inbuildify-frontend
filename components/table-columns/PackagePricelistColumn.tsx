import { debouncedURL } from '@lib/utils/debounceURL';
import { IconPlus } from '@tabler/icons-react';
import { Button, Input, Select, Tag } from 'antd';
import { useEffect } from 'react';

export const PackagePricelistColumn = () => {
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const pricelistData = [
    {
      description: 'DishWasher',
      category: 'Bathrooms',
      CostType: 'Fixed',
      status: 'Active',
      dwellingType: 'Single Storey',
      label: 'Luxury',
    },
    {
      description: 'Luxury chandelier',
      category: 'Base Price',
      CostType: 'Fixed',
      status: 'Active',
      dwellingType: 'Single Storey',
      label: 'Luxury',
    },
  ];

  const column = [
    {
      title: (
        <Input
          addonBefore={<Select options={[{ label: 'All', value: 'All' }]} defaultValue="All" />}
          placeholder="Search Items"
          onChange={e => setParams({ search: e.target.value })}
        />
      ),
      dataIndex: 'search',
      key: 'search',
      render: (_, record) => (
        <div>
          <div className="flex gap-2">
            {record.category && <Tag color="purple">{record.category}</Tag>}
            {record.costType && <Tag color="gray">{record.costType}</Tag>}
            {record.status && <Tag color="orange">{record.status}</Tag>}
            {record.label && <Tag color="blue">{record.label}</Tag>}
          </div>
          <span>{record.description}</span>
        </div>
      ),
    },
    {
      title: '',
      render: () => <Button type="primary" icon={<IconPlus size={15} />} />,
    },
  ];
  return { column, pricelistData };
};
