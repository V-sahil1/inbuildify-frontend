import { Image, Input, message, Popconfirm, Tag } from 'antd';
import { IconPlus, IconSearch, IconX } from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useEffect } from 'react';
import {
  createFloorPlanFacade,
  deleteFloorPlanFacade,
} from '@redux/feature/floorPlan/floorPlanThunk';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import TooltipButton from '../common/TooltipButton';
import { getFacades } from '@redux/feature/facade/facadeThunk';

export const FacadeColumns = (
  floorPlanFacede,
  selectedFloorplan,
  setSelectedFloorplan,
  activeFilter
) => {
  const dispatch = useAppDispatch();
  const { facades, status } = useAppSelector(state => state.facade);
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });
  useEffect(() => {
    fetchFacades();
  }, [activeFilter]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  async function fetchFacades() {
    try {
      const params = {
        cost_type: activeFilter !== 'All' ? activeFilter.toLowerCase() : undefined,
      };
      await dispatch(getFacades(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch facades');
    }
  }
  async function addItem(data) {
    try {
      await dispatch(createFloorPlanFacade(data)).unwrap();
      message.success('Item added successfully');
    } catch (error) {
      message.error(error || 'Failed to add item');
    }
  }

  async function removeItem(floorPlanId: string, id: string) {
    try {
      await dispatch(deleteFloorPlanFacade({ floorPlanId, id })).unwrap();
      message.success('Item removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove item');
    }
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (_, record) => <Image src={record.image} width={100} />,
    },
    {
      title: (
        <Input
          addonBefore={<IconSearch size={15} />}
          placeholder="Search Name"
          value={instantFilters?.search}
          onChange={e => setParams({ search: e.target.value })}
        />
      ),
      dataIndex: 'name',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="flex gap-2">
            {record.label && <Tag color="blue">{record.label}</Tag>}
            {record.costType && <Tag color="orange">{record.costType}</Tag>}
          </div>
          <p>{record.name}</p>
        </div>
      ),
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      render: (_, record) => {
        return record.cost > 0 && <p>{record.cost}</p>;
      },
    },
    {
      title: '',
      render: (_, record) => {
        const item = floorPlanFacede?.find(i => i.facadeId === record.facadeId);
        return !!item ? (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => removeItem(item.floorPlanId, item.id)}
          >
            <TooltipButton
              type="text"
              size="small"
              title="Remove"
              icon={<IconX size={16} color="red" />}
            />
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() =>
              addItem({
                facadeId: record.facadeId,
                floorPlanId: selectedFloorplan?.floorPlanId,
              })
            }
          >
            <TooltipButton type="text" size="small" title="Add" icon={<IconPlus size={16} />} />
          </Popconfirm>
        );
      },
    },
  ];
  return { columns, facades };
};
