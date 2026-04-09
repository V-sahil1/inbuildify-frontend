import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import {
  IPriceList,
  IPriceListItem,
  PricelistFetchParams,
  PriceListItemCondition,
  PricelistItemFtechParams,
} from './iMasterPriceListState';
import { CommonPagination } from '../common/ICommonState';

export const fetchPricelistMaster = createAsyncThunk(
  'masterPriceList/fetchAll',
  async (args: PricelistFetchParams, { rejectWithValue }) => {
    try {
      const res = await api.get<
        ApiResponse<{ priceList: IPriceList[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.PRICELIST_MASTER, {
        params: args,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPricelistMaster = createAsyncThunk(
  'masterPriceList/create',
  async (data: IPriceList, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IPriceList>>(API_ENDPOINTS.PRICELIST_MASTER, {
        data,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePricelistMaster = createAsyncThunk(
  'masterPriceList/update',
  async ({ payload, id }: { payload: Partial<IPriceList>; id: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<IPriceList>>(
        API_ENDPOINTS.PRICELIST_MASTER + '/' + id,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePricelistMaster = createAsyncThunk(
  'masterPriceList/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.PRICELIST_MASTER + '/' + id);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSuggestedPricelistMaster = createAsyncThunk(
  'masterPriceList/updateSuggestedPriceMaster',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<IPriceList>>(
        API_ENDPOINTS.SUGGESTED_PRICELIST_MASTER + '/' + id
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const updateCategoryOrder = createAsyncThunk(
//   'categorie/updateOrder',
//   async (
//     payload: { categories: { categoryId: string; displayOrder: number }[] },
//     { rejectWithValue }
//   ) => {
//     try {
//       const res = await api.put<ApiResponse<Category>>(API_ENDPOINTS.MASTER_CATEGORY_ORDER, {
//         data: { orderedCategories: payload.categories },
//       });
//       return { data: res.data, categories: payload.categories };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// Fetch items of a category
export const fetchCategoryItems = createAsyncThunk(
  'masterPriceList/fetchItems',
  async (params: PricelistItemFtechParams, { rejectWithValue }) => {
    try {
      const res = await api.get<
        ApiResponse<{ priceListItem: IPriceListItem[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.PRICELIST_ITEM, {
        params,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategoryItem = createAsyncThunk(
  'masterPriceList/createItem',
  async (payload: IPriceListItem, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<IPriceListItem>>(API_ENDPOINTS.PRICELIST_ITEM, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoryItem = createAsyncThunk(
  'masterPriceList/updateItem',
  async (
    { payload, id }: { payload: Partial<IPriceListItem>; id: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<IPriceListItem>>(
        API_ENDPOINTS.PRICELIST_ITEM + '/' + id,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategoryItem = createAsyncThunk(
  'masterPriceList/deleteItem',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<IPriceListItem>>(
        API_ENDPOINTS.PRICELIST_ITEM + '/' + payload
      );
      return { id: payload, categoryId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const copyCategoryItem = createAsyncThunk(
  'masterPriceList/copyItem',
  async (
    payload: {
      id: string;
      data: { priceListId?: string; itemDescription?: string; sortOrder?: number };
      priceListId: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<IPriceListItem>>(
        API_ENDPOINTS.COPY_PRICELISTITEM(payload?.id),
        {
          data: payload.data,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//pricelist item condition

export const fetchCategoryItemCondition = createAsyncThunk(
  'masterPriceList/fetchItemCondition',
  async (params: { id: string; pricelistId: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<PriceListItemCondition[]>>(
        API_ENDPOINTS.PRICELIST_ITEM_CONDITION,
        {
          params: { price_list_item_id: params?.id },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCategoryItemCondition = createAsyncThunk(
  'masterPriceList/createItemCondition',
  async (
    payload: { id: string; pricelistId: string; data: PriceListItemCondition },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.post<ApiResponse<PriceListItemCondition>>(
        API_ENDPOINTS.PRICELIST_ITEM_CONDITION,
        {
          data: payload.data,
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCategoryItemCondition = createAsyncThunk(
  'masterPriceList/updateItemCondition',
  async (
    payload: { id: string; pricelistId: string; data: Partial<PriceListItemCondition> },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.put<ApiResponse<PriceListItemCondition>>(
        API_ENDPOINTS.PRICELIST_ITEM_CONDITION + '/' + payload.id,
        { data: payload.data }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteCategoryItemCondition = createAsyncThunk(
  'masterPriceList/deleteItemCondition',
  async (
    payload: { id: string; priceListId: string; pricelistItemId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.delete<ApiResponse>(
        API_ENDPOINTS.PRICELIST_ITEM_CONDITION + '/' + payload.id
      );
      return { id: payload, categoryId: payload };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
