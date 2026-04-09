import { createSlice } from '@reduxjs/toolkit';
import {
  copyCategoryItem,
  createCategoryItem,
  createCategoryItemCondition,
  createPricelistMaster,
  deleteCategoryItem,
  deleteCategoryItemCondition,
  deletePricelistMaster,
  fetchCategoryItemCondition,
  fetchCategoryItems,
  fetchPricelistMaster,
  updateCategoryItem,
  updateCategoryItemCondition,
  updatePricelistMaster,
  updateSuggestedPricelistMaster,
} from './masterPriceListThunk';
import { Status } from '@lib/constants/enum';
import { IPriceList, IPriceListItem } from './iMasterPriceListState';
import { CommonPagination } from '../common/ICommonState';

const masterPriceListSlice = createSlice({
  name: 'masterPriceList',
  initialState: {
    status: {
      priceMaster: Status.IDLE,
      priceListItem: { fetch: Status.IDLE, create: Status.IDLE },
    },
    priceMaster: [] as IPriceList[],
    suggestedPriceMaster: [] as IPriceList[],
    priceListItems: [] as IPriceListItem[],
    loading: false,
    selectedFilters: { range: '', dwelling_type: '' },
    pagination: <CommonPagination>{},
  },
  reducers: {
    toggleExpand(state, action) {
      const category = state.priceMaster.find(c => c.priceListId === action.payload);
      if (category) {
        category.isExpanded = true;
      }
    },
    resetAllCategoriesIsExpanded(state) {
      state.priceMaster.forEach(category => {
        category.isExpanded = false;
      });
    },
    setSelectedFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters(state) {
      state.selectedFilters = { range: '', dwelling_type: '' };
    },
    setPriceMaster(state, action) {
      state.priceMaster = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // categories
      .addCase(fetchPricelistMaster.pending, state => {
        state.status.priceMaster = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchPricelistMaster.fulfilled, (state, action) => {
        state.status.priceMaster = Status.SUCCESS;
        state.loading = false;
        if (action.meta.arg?.is_suggested) {
          state.suggestedPriceMaster = action.payload?.priceList.map(c => ({
            ...c,
            items: null,
            isExpanded: false,
          }));
        } else {
          state.priceMaster = action.payload?.priceList.map(c => ({
            ...c,
            items: null,
            isExpanded: false,
          }));
        }
      })
      .addCase(createPricelistMaster.fulfilled, (state, action) => {
        state.priceMaster.push({
          ...action.payload,
          items: null,
          isExpanded: false,
        });
      })
      .addCase(updatePricelistMaster.fulfilled, (state, action) => {
        state.priceMaster = state.priceMaster.map(c =>
          c.priceListId === action.payload.priceListId ? action.payload : c
        );
      })

      .addCase(updateSuggestedPricelistMaster.fulfilled, (state, action) => {
        state.suggestedPriceMaster = state.suggestedPriceMaster.filter(
          c => c.priceListId !== action.payload.priceListId
        );
        state.priceMaster.push({
          ...action.payload,
          items: null,
          isExpanded: false,
        });
      })

      .addCase(deletePricelistMaster.fulfilled, (state, action) => {
        state.priceMaster = state.priceMaster.filter(c => c.priceListId !== action.payload);
      })

      // .addCase(updateCategoryOrder.fulfilled, (state, action) => {
      //   const updatedOrders = action.payload?.categories;

      //   state.categories = state.categories.map(cat => {
      //     const found = updatedOrders?.find(u => u?.categoryId === cat?.categoryId);
      //     return found ? { ...cat, displayOrder: found?.displayOrder } : cat;
      //   });

      //   state.categories.sort((a, b) => a?.displayOrder - b?.displayOrder);
      // })

      // fetch items
      .addCase(fetchCategoryItems.pending, (state, action) => {
        state.status.priceListItem.fetch = Status.PENDING;
      })
      .addCase(fetchCategoryItems.fulfilled, (state, action) => {
        if (!!action.meta.arg?.price_list_id) {
          const category = state.priceMaster.find(
            c => c.priceListId === action.meta.arg?.price_list_id
          );
          if (category) {
            category.items = action.payload.priceListItem;
          }
        }
        state.priceListItems = action.payload.priceListItem;
        state.pagination = action.payload.pagination;
        state.status.priceListItem.fetch = Status.SUCCESS;
      })

      // create item
      .addCase(createCategoryItem.pending, state => {
        state.status.priceListItem.create = Status.PENDING;
      })
      .addCase(createCategoryItem.fulfilled, (state, action) => {
        const category = state.priceMaster.find(c => c.priceListId === action.payload.priceList.id);
        if (category) {
          if (!category.items) {
            category.items = [];
          }
          category.items = [action.payload, ...(category.items || [])];
        }
        state.status.priceListItem.create = Status.SUCCESS;
      })
      .addCase(createCategoryItem.rejected, state => {
        state.status.priceListItem.create = Status.ERROR;
      })

      //delete item
      .addCase(deleteCategoryItem.fulfilled, (state, action) => {
        const category = state.priceMaster.find(c => c.priceListId === action.payload.categoryId);
        if (category) {
          category.items = category.items?.filter(
            item => item.priceListItemId !== action.payload.id
          );
        }
        state.status.priceListItem.create = Status.SUCCESS;
      })

      //update item
      .addCase(updateCategoryItem.fulfilled, (state, action) => {
        const category = state.priceMaster.find(c => c.priceListId === action.payload.priceList.id);
        if (category) {
          category.items = category.items?.map(item =>
            item.priceListItemId === action.payload.priceListItemId
              ? { ...item, ...action.payload }
              : item
          );
        }
        state.status.priceListItem.create = Status.SUCCESS;
      })

      //copy item
      .addCase(copyCategoryItem.fulfilled, (state, action) => {
        const { priceListId, priceListItemId, itemDescription, sortOrder } = action.payload;
        const category = state.priceMaster.find(c => c.priceListId === action.meta.arg.priceListId);
        if (category) {
          const item = category.items?.find(item => item.priceListItemId === action.meta.arg.id);
          const newCategory = state.priceMaster.find(c => c.priceListId === priceListId);
          newCategory.items.push({
            ...item,
            priceListItemId,
            itemDescription,
            sortOrder,
            priceListId,
          });
        }
        state.status.priceListItem.create = Status.SUCCESS;
      })

      //item condition
      .addCase(fetchCategoryItemCondition.fulfilled, (state, action) => {
        const category = state.priceMaster.find(i => i.priceListId === action.meta.arg.pricelistId);
        if (category) {
          console.log('category', action.meta.arg);
          const item = category?.items?.find(i => i.priceListItemId === action.meta.arg.id);
          if (item) {
            item.conditions = action.payload;
          }
        }
      })

      .addCase(createCategoryItemCondition.fulfilled, (state, action) => {
        const category = state.priceMaster.find(i => i.priceListId === action.meta.arg.pricelistId);
        if (category) {
          const item = category?.items?.find(i => i.priceListItemId === action.meta.arg.id);
          if (item) {
            item.conditions.unshift(action.payload);
          }
        }
      })

      .addCase(deleteCategoryItemCondition.fulfilled, (state, action) => {
        const category = state.priceMaster.find(i => i.priceListId === action.meta.arg.priceListId);
        if (category) {
          const item = category?.items?.find(
            i => i.priceListItemId === action.meta.arg.pricelistItemId
          );
          if (item) {
            item.conditions = item.conditions.filter(
              i => i.priceListItemConditionId !== action.meta.arg.id
            );
          }
        }
      })

      .addCase(updateCategoryItemCondition.fulfilled, (state, action) => {
        const category = state.priceMaster.find(i => i.priceListId === action.meta.arg.pricelistId);
        if (category) {
          const item = category?.items?.find(
            i => i.priceListItemId === action.payload?.priceListItemId
          );
          if (item) {
            item.conditions = item.conditions.map(i =>
              i.priceListItemConditionId === action.payload.priceListItemConditionId
                ? action.payload
                : i
            );
          }
        }
      });
  },
});

export const {
  toggleExpand,
  setSelectedFilters,
  clearFilters,
  resetAllCategoriesIsExpanded,
  setPriceMaster,
} = masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
