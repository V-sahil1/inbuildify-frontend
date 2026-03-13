import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import {
  createFloorPlanPricelist,
  deleteFloorPlanPricelist,
} from '@redux/feature/floorPlan/floorPlanThunk';
import { fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Input, message, Popconfirm, Select, Switch, Tag } from 'antd';
import { useEffect, useState } from 'react';
import TooltipButton from '../common/TooltipButton';

export const FloorplanPricelistColumns = (
  floorPlanPricelist,
  selectedFloorplan,
  setSelectedFloorplan
) => {
  const dispatch = useAppDispatch();
  const [itemStates, setItemStates] = useState<{
    [key: string]: { quantity: number; included: boolean; modify: boolean };
  }>({});
  const { priceListItems, status } = useAppSelector(state => state.masterPriceList);

  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });

  useEffect(() => {
    floorPlanPricelist?.map(item => {
      setItemStates(prev => ({
        ...prev,
        [item.priceListItemId]: {
          quantity: item.quantity,
          included: item.includeDefault,
          modify: item.modify,
        },
      }));
    });
  }, [floorPlanPricelist]);

  useEffect(() => {
    if (status.priceListItem.fetch === Status.IDLE) {
      fetchPricelistData();
    }
  }, [status.priceListItem.fetch]);
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  async function fetchPricelistData() {
    try {
      await dispatch(fetchCategoryItems({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch prieclist data');
    }
  }
  async function addItem(data) {
    try {
      const itemState = itemStates[data.priceListItemId] || {
        quantity: null,
        included: false,
        modify: false,
      };
      const payload = {
        floorPlanId: selectedFloorplan.floorPlanId,
        priceListItemId: data.priceListItemId,
        quantity: itemState.quantity,
        includeDefault: itemState?.included,
        modify: itemState?.modify,
      };
      if (data.costType !== 'Variable') {
        delete payload.quantity;
      }
      await dispatch(createFloorPlanPricelist(payload)).unwrap();
      message.success('Item added successfully');
    } catch (error) {
      message.error(error || 'Failed to add item');
    }
  }

  async function removeItem(floorPlanId: string, id: string) {
    try {
      await dispatch(deleteFloorPlanPricelist({ floorPlanId, id })).unwrap();
      message.success('Item removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove item');
    }
  }

  const updateItemState = (
    priceListItemId: string,
    field: 'quantity' | 'included' | 'modify',
    value: string | boolean
  ) => {
    setItemStates(prev => ({
      ...prev,
      [priceListItemId]: {
        ...prev[priceListItemId],
        [field]: value,
      },
    }));
  };

  const columns = [
    {
      title: (
        <div>
          <Input
            addonBefore={<Select defaultValue="All" options={[{ label: 'All', value: 'All' }]} />}
            placeholder="Search Items"
            value={instantFilters?.search}
            onChange={e => setParams({ search: e.target.value })}
          />
        </div>
      ),
      render: (_, record) => (
        <div>
          <div className="flex gap-2">
            {record.priceList && <Tag color="blue">{record.priceList.name}</Tag>}
            {record.costType && <Tag color="orange">{record.costType}</Tag>}
          </div>
          <p>{record.shortDescription || record.itemDescription}</p>
        </div>
      ),
    },
    {
      title: 'Include Default',
      dataIndex: 'included',
      key: 'included',
      render: (_, record) => {
        return (
          <Switch
            checked={
              itemStates[record.priceListItemId]?.included !== undefined
                ? itemStates[record.priceListItemId].included
                : false
            }
            onChange={checked => updateItemState(record.priceListItemId, 'included', checked)}
            disabled={!!floorPlanPricelist?.find(i => i.priceListItemId === record.priceListItemId)}
          />
        );
      },
    },
    {
      title: 'Modify',
      dataIndex: 'modify',
      key: 'modify',
      render: (_, record) => (
        <Switch
          checked={
            itemStates[record.priceListItemId]?.modify !== undefined
              ? itemStates[record.priceListItemId].modify
              : false
          }
          onChange={checked => updateItemState(record.priceListItemId, 'modify', checked)}
          disabled={!!floorPlanPricelist?.find(i => i.priceListItemId === record.priceListItemId)}
        />
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => {
        return record.costType === 'Variable' ? (
          <Input
            value={itemStates[record.priceListItemId]?.quantity || ''}
            onChange={e => updateItemState(record.priceListItemId, 'quantity', e.target.value)}
            placeholder="Enter quantity"
            type="number"
            min="1"
            disabled={!!floorPlanPricelist?.find(i => i.priceListItemId === record.priceListItemId)}
          />
        ) : null;
      },
    },
    {
      title: 'Price ($)',
      dataIndex: 'cost',
      key: 'cost',
      render: (_, record) =>
        (Number(itemStates[record.priceListItemId]?.quantity) || 1) * record.cost,
    },
    {
      render: (_, record) => {
        const item = floorPlanPricelist?.find(i => i.priceListItemId === record.priceListItemId);
        return !!item ? (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => removeItem(item.floorPlanId, item.id)}
          >
            <TooltipButton type="text" size="small" title="Remove" icon={<IconX size={15} />} />
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() => addItem(record)}
          >
            <TooltipButton type="text" size="small" title="Add" icon={<IconPlus size={15} />} />
          </Popconfirm>
        );
      },
    },
  ];

  return { columns, priceListItems };
};
