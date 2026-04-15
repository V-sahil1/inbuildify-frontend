import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { useEffect } from 'react';
import { IPriceList } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { message } from 'antd';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
import { MasterPricelist } from '../common/MasterPricelist';

export const MasterPricelistCollection = ({ filters }) => {
  const dispatch = useAppDispatch();

  const [localCategories, setLocalCategories] = useState<IPriceList[]>([]);
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const { priceMaster } = useAppSelector(state => state.masterPriceList);

  useEffect(() => {
    if (priceMaster) {
      setLocalCategories(priceMaster);
    }
  }, [priceMaster]);

  const handleExpand = async (categoryId: string, isExpanded: boolean) => {
    // Get the actual current state from dropdowns
    const isCurrentlyExpanded = dropDowns[categoryId] || false;
    
    // Only call API when expanding (not collapsing)
    if (!isCurrentlyExpanded) {
      // Open dropdown immediately to show loading
      setDropDowns(prev => ({
        ...prev,
        [categoryId]: true,
      }));
      
      try {
        setLoadingItems(prev => ({ ...prev, [categoryId]: true }));
        dispatch(toggleExpand(categoryId));
        await dispatch(
          fetchCategoryItems({
            price_list_id: categoryId,
            range_id: filters?.range || undefined,
            dwelling_type_id: filters?.dwellingType || undefined,
            search: filters?.search || undefined,
            status: filters?.status !== '' ? (filters.status as 'active' | 'inactive') : undefined,
          })
        ).unwrap();
        // Data is now loaded, dropdown stays open
      } catch (error: any) {
        message.error(error || 'Failed to fetch category items');
        // Close dropdown on error
        setDropDowns(prev => ({
          ...prev,
          [categoryId]: false,
        }));
      } finally {
        setLoadingItems(prev => ({ ...prev, [categoryId]: false }));
      }
    } else {
      // Just collapse without API call
      setDropDowns(prev => ({
        ...prev,
        [categoryId]: !prev[categoryId],
      }));
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
