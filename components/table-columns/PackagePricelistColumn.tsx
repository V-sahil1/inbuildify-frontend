import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { debouncedURL } from '@lib/utils/debounceURL';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import {
  createPackagePricelist,
  deletePackagePricelist,
} from '@redux/feature/package/packageThunk';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Input, message, Popconfirm, Select, Tag } from 'antd';
import { useEffect } from 'react';
import TooltipButton from '../common/TooltipButton';

export const PackagePricelistColumn = (packagePricelist, selectedPackage) => {
  const dispatch = useAppDispatch();
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['search', 'priceMaster'],
    initialValue: { priceMaster: 'all' },
    shouldSyncURL: false,
  });
  const { priceListItems, status, priceMaster } = useAppSelector(state => state.masterPriceList);
  useEffect(() => {
    fetchPricelistData();
    if (status.priceMaster === Status.IDLE) {
      fetchPricelistMasterData();
    }
  }, [filters, status.priceMaster]);
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  async function fetchPricelistData() {
    try {
      const params = {
        price_list_id: filters?.priceMaster !== 'all' ? filters?.priceMaster : undefined,
        search: filters?.search || undefined,
      };
      await dispatch(fetchCategoryItems(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch prieclist data');
    }
  }
  async function fetchPricelistMasterData() {
    try {
      await dispatch(fetchPricelistMaster({})).unwrap();
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
    return packagePricelist?.map(i => i.priceListItemId).includes(record?.priceListItemId);
  }

  const column = [
    {
      title: (
        <Input
          addonBefore={
            <Select
              options={[
                { label: 'All', value: 'all' },
                ...priceMaster?.map(i => ({ label: i.name, value: i.priceListId })),
              ]}
              value={instantFilters?.priceMaster}
              onChange={value => setParams({ priceMaster: value })}
              className="min-w-[100px]"
            />
          }
          placeholder="Search Items"
          value={instantFilters?.search}
          onChange={e => setParams({ search: e.target.value })}
        />
      ),
      dataIndex: 'search',
      key: 'search',
      render: (_, record) => (
        <>
          <p>{record?.shortDescription || record?.itemDescription}</p>
          <div className="flex gap-2">
            {record?.priceList && <Tag color="purple">{record?.priceList.name}</Tag>}
            {record?.costType && <Tag color="gray">{record?.costType}</Tag>}
          </div>
        </>
      ),
    },
    {
      title: '',
      render: (_, record) => {
        const item = packagePricelist?.find(i => i.priceListItemId === record?.priceListItemId);
        return isPriceListAdded(record) ? (
          <Popconfirm
            title="Are you sure you want to remove this item?"
            onConfirm={() => removeItem(selectedPackage?.packageId, item.id)}
          >
            <TooltipButton
              title="Remove"
              type="text"
              size="small"
              icon={<IconX size={16} color="red" />}
            />
          </Popconfirm>
        ) : (
          <Popconfirm
            title="Are you sure you want to add this item?"
            onConfirm={() =>
              addItem({
                packageId: selectedPackage?.packageId || '',
                priceListItemId: record?.priceListItemId,
              })
            }
          >
            <TooltipButton title="Add" type="text" size="small" icon={<IconPlus size={16} />} />
          </Popconfirm>
        );
      },
    },
  ];
  return { column, priceListItems };
};
