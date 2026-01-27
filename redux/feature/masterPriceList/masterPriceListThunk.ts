import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { IPriceList, IPriceListItem } from './iMasterPriceListState';
import { CommonPagination } from '../common/ICommonState';

export const fetchPricelistMaster = createAsyncThunk(
  'masterPriceList/fetchAll',
  async (
    args: { is_active?: boolean; search?: string; is_suggested?: boolean },
    { rejectWithValue }
  ) => {
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
  async (
    args: { price_list_id?: string; range_id?: string; dwelling_type_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<
        ApiResponse<{ priceListItem: IPriceListItem[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.PRICELIST_ITEM, {
        params: args,
      });
      return { priceListId: args?.price_list_id || null, items: res.data };
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
