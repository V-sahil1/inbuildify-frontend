import { createSlice } from '@reduxjs/toolkit';
import {
  createCategoryItem,
  createPricelistMaster,
  deleteCategoryItem,
  deletePricelistMaster,
  fetchCategoryItems,
  fetchPricelistMaster,
  updateCategoryItem,
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
        const { priceListId, items } = action.payload;
        if (!!priceListId) {
          const category = state.priceMaster.find(c => c.priceListId === priceListId);
          if (category) {
            category.items = items.priceListItem;
          }
        } else {
          state.priceListItems = items.priceListItem;
        }
        state.pagination = items.pagination;

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
            item.priceListItemId === action.payload.priceListItemId ? action.payload : item
          );
        }
        state.status.priceListItem.create = Status.SUCCESS;
      });
  },
});

export const { toggleExpand, setSelectedFilters, clearFilters, resetAllCategoriesIsExpanded } =
  masterPriceListSlice.actions;
export default masterPriceListSlice.reducer;
