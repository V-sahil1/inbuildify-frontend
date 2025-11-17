import { useAppDispatch } from '@hooks/redux';
import { debouncedURL } from '@lib/utils/debounceURL';
import {
  removeFloorplanItem,
  setSelectedFloorplans,
} from '@redux/feature/floorPlan/floorPlanSlice';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { Button, Input, Popconfirm, Select, Switch, Tag } from 'antd';
import { useEffect, useState } from 'react';

export interface FloorplanPricelistRecord {
  id: string;
  description: string;
  category: string;
  costType: string;
  quantity: number;
  price: number;
  incuded: boolean;
  modify: boolean;
}

export const FloorplanPricelistColumns = () => {
  const dispatch = useAppDispatch();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [pricelistData, setPriceListData] = useState<FloorplanPricelistRecord[]>([
    {
      id: '1',
      description: 'Base Price Single Storey with Standard Inclusions',
      quantity: 1,
      price: 6939,
      category: 'Base Price',
      costType: 'Variable',
      incuded: false,
      modify: false,
    },
    {
      id: '2',
      description: 'CUSTOM PLAN UP TO [units] IN SIZE (180.1 to 180.9)',
      quantity: 1,
      price: 2600,
      category: 'Base Price',
      costType: 'Variable',
      incuded: false,
      modify: false,
    },
    {
      id: '3',
      description: 'Cabinets',
      quantity: 1,
      price: 45,
      category: 'Joinery',
      costType: 'Variable',
      incuded: false,
      modify: false,
    },
    {
      id: '4',
      description: 'Provide 3 x drawers to vanity',
      quantity: 1,
      price: 200,
      category: 'Bathrooms',
      costType: 'Fixed',
      incuded: false,
      modify: false,
    },
    {
      id: '5',
      description: 'Double vanities to Bathroom',
      quantity: 1,
      price: 500,
      category: 'Bathrooms',
      costType: 'Fixed',
      incuded: false,
      modify: false,
    },
    {
      id: '6',
      description: '1200 x 900 Tiled Shower base ILO Std',
      quantity: 1,
      price: 250,
      category: 'Bathrooms',
      costType: 'Fixed',
      incuded: false,
      modify: false,
    },
    {
      id: '7',
      description: 'Rain head shower',
      quantity: 1,
      price: 600,
      category: 'Bathrooms',
      costType: 'Fixed',
      incuded: false,
      modify: false,
    },
  ]);
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  function handleToggle(data) {
    const isSelected = selectedIds.includes(data.id);

    if (isSelected) {
      dispatch(removeFloorplanItem({ id: data.id }));
      setSelectedIds(prev => prev.filter(id => id !== data.id));
    } else {
      dispatch(setSelectedFloorplans(data));
      setSelectedIds(prev => [...prev, data.id]);
    }
  }
  const columns = [
    {
      title: (
        <div>
          <Input
            addonBefore={<Select defaultValue="All" options={[{ label: 'All', value: 'All' }]} />}
            placeholder="Search Items"
            onChange={e => setParams({ search: e.target.value })}
          />
        </div>
      ),
      render: (_, record) => (
        <div>
          <div className="flex gap-2">
            {record.category && <Tag color="blue">{record.category}</Tag>}
            {record.costType && <Tag color="orange">{record.costType}</Tag>}
          </div>
          <p>{record.description}</p>
        </div>
      ),
    },
    {
      title: 'Include Default',
      dataIndex: 'included',
      key: 'included',
      render: (_, record) => (
        <Switch
          value={record.included}
          onChange={checked => {
            setPriceListData(prev => {
              return prev.map(item =>
                item.id === record.id ? { ...item, modify: checked } : item
              );
            });
          }}
        />
      ),
    },
    {
      title: 'Modify',
      dataIndex: 'modify',
      key: 'modify',
      render: (_, record) => (
        <Switch
          value={record.modify}
          defaultChecked={record.modify}
          onChange={checked => {
            setPriceListData(prev => {
              return prev.map(item =>
                item.id === record.id ? { ...item, modify: checked } : item
              );
            });
          }}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => {
        const isSelected = selectedIds.includes(record.id);
        return record.costType === 'Variable' && <Input disabled={isSelected} />;
      },
    },
    {
      title: 'Price ($)',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: '',
      dataIndex: '',
      key: '',
      render: (_, record) => {
        const isSelected = selectedIds.includes(record.id);
        return (
          <Button
            type={isSelected ? 'default' : 'primary'}
            size="small"
            onClick={() => handleToggle(record)}
            icon={isSelected ? <IconX size={15} /> : <IconPlus size={15} />}
          />
        );
      },
    },
  ];

  return { columns, pricelistData };
};
