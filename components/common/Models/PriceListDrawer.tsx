import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { RootState } from '@redux/feature/store';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Button, Drawer, Input, message, Popconfirm, Select, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { fetchCategoryItems, fetchPricelistMaster } from '@redux/feature/masterPriceList/masterPriceListThunk';
import TooltipButton from '../TooltipButton';
import { createContractFormatSection } from '@redux/feature/contractFormat/contractFormatThunk';

const PriceListDrawer = ({ title, open, onClose, addPricelist, removePricelist, selectedPricelist }) => {
  const { priceListItems, status } = useAppSelector((state: RootState) => state.masterPriceList);
  const { items } = useAppSelector((state: RootState) => state.quotation);
  const dispatch = useAppDispatch();
  const [itemStates, setItemStates] = useState<{ [key: string]: { quantity: string; note: string } }>({});

  useEffect(() => {
    if (status.priceListItem.fetch === Status.IDLE) {
      fetchCategoryItemData()
    }
  }, [status.priceListItem.fetch]);

  const fetchCategoryItemData = async () => {
    try {
      await dispatch(fetchCategoryItems({})).unwrap();
    } catch (error) {
      message.error(error?.message || 'Failed to fetch categories');
    }
  };

  useEffect(() => {
    if (priceListItems) {
      const initialState: { [key: string]: { quantity: string; note: string } } = {};
      priceListItems.forEach(item => {
        if (!initialState[item.priceListItemId]) {
          initialState[item.priceListItemId] = { quantity: '1', note: '' };
        }
      });
      setItemStates(prev => ({ ...prev, ...initialState }));
    }
  }, [priceListItems]);

  const updateItemState = (priceListItemId: string, field: 'quantity' | 'note', value: string) => {
    setItemStates(prev => ({
      ...prev,
      [priceListItemId]: {
        ...prev[priceListItemId],
        [field]: value
      }
    }));
  };
  const isItemSelected = (priceListItemId: string) => {
    return selectedPricelist?.some(item => item?.priceListItemId === priceListItemId);
  };

  const columns = [
    {
      title: (
        <div>
          <Input
            addonBefore={<Select defaultValue="All" options={[{ label: 'All', value: 'All' }]} />}
            placeholder="Search Items"

          />
        </div>
      ),
      render: (_, record) => {
        const isSelected = isItemSelected(record.priceListItemId);
        return (
          <div>
            <div className="flex gap-2 mb-2">
              {record.priceList && <Tag color="blue">{record.priceList.name}</Tag>}
              {record.costType && <Tag color="orange">{record.costType}</Tag>}
            </div>
            <p>{record.shortDescription}</p>
            {/* Note field below tags */}
            <Input.TextArea
              placeholder="Add note..."
              value={itemStates[record.priceListItemId]?.note || ''}
              onChange={(e) => updateItemState(record.priceListItemId, 'note', e.target.value)}
              disabled={isSelected}
              rows={2}
              className="mt-2"
            />
          </div>
        );
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_, record) => {
        const isSelected = isItemSelected(record.priceListItemId);
        return record.costType !== 'Included' ? (
          <Input
            placeholder="Enter quantity"
            type="number"
            min="1"
            value={itemStates[record.priceListItemId]?.quantity || '1'}
            onChange={(e) => updateItemState(record.priceListItemId, 'quantity', e.target.value)}
            disabled={isSelected}
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
        const item = selectedPricelist?.find(i => i?.priceListItemId === record?.priceListItemId);
        const itemState = itemStates[record?.priceListItemId];
        console.log('item', item)
        return !!item ? (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => removePricelist(item?.id)}
          >
            <TooltipButton type="text" size="small" title="Remove" icon={<IconX size={15} />} />
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() => addPricelist({
              ...record,
              quantity: itemState?.quantity || '1',
              note: itemState?.note || ''

            })}
          >
            <TooltipButton type="text" size="small" title="Add" icon={<IconPlus size={15} />} />
          </Popconfirm>
        );
      },
    },
  ];

  return (
    <Drawer title={title} open={open} onClose={onClose} size="large">
      <div className="p-4">
        <div className="flex justify-between mb-3">
          <div className="flex gap-2">
            <Button>Show All</Button>
            <Button>
              Selected Items
              <div className="rounded-full w-6 h-6 text-center"> {items?.length ?? 0}</div>
            </Button>
            <div className="flex">
              <Button className="rounded-none">
                Extra <div className="rounded-full w-6 h-6 text-center">0</div>
              </Button>
              <Button className="rounded-none">
                <IconPlus size={15} />
              </Button>
            </div>
          </div>
          <p>House Price: $35,000</p>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={priceListItems}
          />
        </div>
      </div>
    </Drawer>
  );
};

export default PriceListDrawer;
