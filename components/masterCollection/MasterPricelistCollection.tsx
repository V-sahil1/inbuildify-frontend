import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';
import { IPriceList } from '@redux/feature/masterPriceList/iMasterPriceListState';
import {
  fetchCategoryItems,
  fetchPricelistMaster,
} from '@redux/feature/masterPriceList/masterPriceListThunk';
import { message } from 'antd';
import { Status } from '@lib/constants/enum';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import { MasterPricelist } from '../common/MasterPricelist';

export const MasterPricelistCollection = ({ filters, instantFilters, setParams }) => {
  const [localCategories, setLocalCategories] = useState<IPriceList[]>([]);
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const { priceMaster, status } = useAppSelector(state => state.masterPriceList);
  const dispatch = useAppDispatch();

  const fetchPricelistMasterData = async () => {
    try {
      await dispatch(fetchPricelistMaster({})).unwrap();
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    if (status.priceMaster === Status.IDLE) {
      fetchPricelistMasterData();
    }
  }, [status.priceMaster]);

  useEffect(() => {
    if (priceMaster) {
      setLocalCategories(priceMaster);
    }
  }, [priceMaster]);

  const handleExpand = async (categoryId: string, isExpanded: boolean) => {
    setDropDowns(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));

    if (!isExpanded) {
      try {
        setLoadingItems(prev => ({ ...prev, [categoryId]: true }));
        dispatch(toggleExpand(categoryId));
        await dispatch(
          fetchCategoryItems({
            price_list_id: categoryId,
            range_id: filters?.range || undefined,
            dwelling_type_id: filters?.dwellingType || undefined,
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch category items');
      } finally {
        setLoadingItems(prev => ({ ...prev, [categoryId]: false }));
      }
    }
  };

  return (
    <MasterPricelist
      localCategories={localCategories}
      setLocalCategories={setLocalCategories}
      dropDowns={dropDowns}
      loadingItems={loadingItems}
      handleExpand={handleExpand}
      isEditable={false}
    />
  );
};
