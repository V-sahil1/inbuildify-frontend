import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import { fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import {
  createPackagePricelist,
  deletePackagePricelist,
} from '@redux/feature/package/packageThunk';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Input, message, Select, Tag } from 'antd';
import { useEffect } from 'react';
import TooltipButton from '../common/TooltipButton';

export const PackagePricelistColumn = (packagePricelist, selectedPackage, setSelectedPackage) => {
  const dispatch = useAppDispatch();
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search'],
    shouldSyncURL: false,
  });
  const { priceListItems, status } = useAppSelector(state => state.masterPriceList);
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
      await dispatch(createPackagePricelist(data)).unwrap();
      message.success('Item added successfully');
    } catch (error) {
      message.error(error || 'Failed to add item');
    }
  }

  async function removeItem(packageId: string, id: string) {
    try {
      await dispatch(deletePackagePricelist({ packageId, id })).unwrap();
      message.success('Item removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove item');
    }
  }
  function isPriceListAdded(record) {
    return packagePricelist?.map(i => i.priceListItemId).includes(record.priceListItemId);
  }

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
        <>
          <p>{record.shortDescription}</p>
          <div className="flex gap-2">
            {record.priceList && <Tag color="purple">{record.priceList.name}</Tag>}
            {record.costType && <Tag color="gray">{record.costType}</Tag>}
          </div>
        </>
      ),
    },
    {
      title: '',
      render: (_, record) => {
        const item = packagePricelist?.find(i => i.priceListItemId === record.priceListItemId);
        return isPriceListAdded(record) ? (
          <TooltipButton
            title="Remove"
            type="text"
            size="small"
            icon={<IconX size={16} color="red" />}
            onClick={() => removeItem(item.packageId, item.id)}
          />
        ) : (
          <TooltipButton
            title="Add"
            type="text"
            size="small"
            icon={<IconPlus size={16} />}
            onClick={() =>
              addItem({
                packageId: selectedPackage?.packageId || '',
                priceListItemId: record.priceListItemId,
              })
            }
          />
        );
      },
    },
  ];
  return { column, priceListItems };
};
