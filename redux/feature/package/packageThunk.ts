import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { GroupType, Package, PackageFetchParams, PackagePricelist } from './IPackageState';
import { CommonPagination } from '../common/ICommonState';
import { IPriceListItem } from '../masterPriceList/iMasterPriceListState';

export const fetchPackages = createAsyncThunk(
  'packages/fetchAll',
  async (params: PackageFetchParams = {}, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ package: Package[]; pagination: CommonPagination }>>(
        API_ENDPOINTS.PACKAGE_BASE,
        { params }
      );
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

      const res = await api.get<ApiResponse<IPriceListItem[]>>(url);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackage = createAsyncThunk(
  'packages/create',
  async (payload: Package, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Package>>(API_ENDPOINTS.PACKAGE_BASE, {
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
  async (payload: { id: string; data: Partial<Package> }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Package>>(
        API_ENDPOINTS.PACKAGE_BASE + '/' + payload.id,
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

export const deletePackage = createAsyncThunk(
  'packages/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.PACKAGE_BASE + '/' + id);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageGroup = createAsyncThunk(
  'packages/fetchGroup',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<
        ApiResponse<{ packageGroups: GroupType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.PACKAGE_GROUP);
      return res.data.packageGroups;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackageGroup = createAsyncThunk(
  'packages/createGroup',
  async (payload: GroupType, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<GroupType>>(API_ENDPOINTS.PACKAGE_GROUP, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePackageGroup = createAsyncThunk(
  'packages/updateGroup',
  async (payload: { id: string; data: Partial<GroupType> }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<GroupType>>(
        API_ENDPOINTS.PACKAGE_GROUP + '/' + payload.id,
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

export const deletePackageGroup = createAsyncThunk(
  'packages/deleteGroup',
  async (payload: { id: string; packageId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.PACKAGE_GROUP + '/' + payload.id);
      return { id: payload.id, packageId: payload.packageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackagePricelist = createAsyncThunk(
  'packages/fetchPricelist',
  async (packageId: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ packagePricelistItemMaps: PackagePricelist[] }>>(
        API_ENDPOINTS.PACKAGE_PRICELIST + '/' + packageId
      );
      return res.data.packagePricelistItemMaps;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackagePricelist = createAsyncThunk(
  'packages/createPricelist',
  async (payload: PackagePricelist, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<PackagePricelist>>(API_ENDPOINTS.PACKAGE_PRICELIST, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deletePackagePricelist = createAsyncThunk(
  'packages/deletePricelist',
  async (payload: { id: string; packageId: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse>(API_ENDPOINTS.PACKAGE_PRICELIST + '/' + payload.id);
      return { id: payload.id, packageId: payload.packageId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
