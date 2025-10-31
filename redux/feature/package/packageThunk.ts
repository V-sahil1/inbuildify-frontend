import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { Item } from '../masterPriceList/iMasterPriceListState';
import { Package } from './IPackageState';

type createPackagePayload = {
  name: string;
  category_item_ids: string[];
  amount: number;
  range?: string;
  dwelling_type?: string;
};

type updatePackagePayload = {
  id: string;
  name?: string;
  category_item_ids?: string[];
  amount?: number;
};

export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (filters: { range?: string; dwelling_type?: string } = {}, { rejectWithValue }) => {
    try {
      let url = API_ENDPOINTS.GET_PACKAGES;

      // Add query parameters if filters are provided
      if (filters && (filters.range || filters.dwelling_type)) {
        const queryParams = new URLSearchParams();
        if (filters.range) queryParams.append('range', filters.range);
        if (filters.dwelling_type) queryParams.append('dwelling_type', filters.dwelling_type);
        url = `${API_ENDPOINTS.GET_PACKAGES}?${queryParams.toString()}`;
      }

      const res = await api.get<ApiResponse<Package[]>>(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  'packages/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Package>>(API_ENDPOINTS.GET_PACKAGE_BY_ID(id));
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageItems = createAsyncThunk(
  'packages/fetchItems',
  async (
    { range, dwellingType }: { range?: string; dwellingType?: string },
    { rejectWithValue }
  ) => {
    try {
      let url = API_ENDPOINTS.GET_PACKAGE_ITEMS;
      const params = new URLSearchParams();

      if (range) params.append('range', range);
      if (dwellingType) params.append('dwelling_type', dwellingType);

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get<ApiResponse<Item[]>>(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/create',
  async (payload: createPackagePayload, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Package>>(API_ENDPOINTS.CREATE_PACKAGE, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePackage = createAsyncThunk(
  'packages/update',
  async (payload: updatePackagePayload, { rejectWithValue }) => {
    try {
      const { id, ...rest } = payload;
      const res = await api.post<ApiResponse<Package>>(API_ENDPOINTS.PACKAGE_BASE + '/' + id, {
        data: rest,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<Package>>(API_ENDPOINTS.PACKAGE_BASE + '/' + id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
