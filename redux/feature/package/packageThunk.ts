import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { Item } from "../masterPriceList/iMasterPriceListState";
import { Package } from "./IPackageState";

type createPackagePayload = {
  name: string;
  items: Item[];
  amount: number;
};

export const fetchPackages = createAsyncThunk(
  "packages/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Package[]>>(
        API_ENDPOINTS.GET_PACKAGES
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageById = createAsyncThunk(
  "packages/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<Package>>(
        API_ENDPOINTS.GET_PACKAGE_BY_ID(id)
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPackageItems = createAsyncThunk(
  "packages/fetchItems",
  async (
    { range, dwellingType }: { range: string; dwellingType: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await api.get<ApiResponse<Item[]>>(
        `${API_ENDPOINTS.GET_PACKAGE_ITEMS}?range=${range}&dwellingType=${dwellingType}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createPackage = createAsyncThunk(
  "packages/create",
  async (payload: createPackagePayload, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<Package>>(
        API_ENDPOINTS.CREATE_PACKAGE,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
