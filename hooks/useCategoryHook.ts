import { useEffect, useCallback, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Status } from '@lib/constants/enum';
import { message } from 'antd';
import { fetchColourCategory } from '@redux/feature/color/colorThunk';

export const useCategoryHook = () => {
  const dispatch = useAppDispatch();
  const { color, status } = useAppSelector((state: RootState) => state.colour);
  const [fetchedCategories, setFetchedCategories] = useState<Set<string>>(new Set());

  const fetchCategoryData = useCallback(async (colorId: string) => {
    // Prevent duplicate calls
    if (fetchedCategories.has(colorId)) {
      return;
    }
    
    try {
      await dispatch(fetchColourCategory(colorId)).unwrap();
      setFetchedCategories(prev => new Set(prev).add(colorId));
    } catch (error) {
      message.error(error || 'Failed to fetch category data');
    }
  }, [fetchedCategories, dispatch]);

  const getCategoryOptions = useCallback((colorId: string) => {
    const selectedColor = color?.find(c => c.colorId === colorId);
    return selectedColor?.colorCategories?.map(cat => ({
      label: cat.categoryName,
      value: cat.colorCategoryId,
    })) || [];
  }, [color]);

  const resetFetchedCategories = useCallback(() => {
    setFetchedCategories(new Set());
  }, []);

  return {
    fetchCategoryData,
    getCategoryOptions,
    resetFetchedCategories,
    isLoading: status.category.fetch === Status.PENDING,
  };
};
