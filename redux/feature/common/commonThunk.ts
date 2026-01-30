import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { ComplianceType, functionalityResponse, LocationType, Timezone } from './ICommonState';
import { BuilderInfo } from '../admin/general/builder/ibuilderState';

export const fetchAllFunctionality = createAsyncThunk(
  'common/fetchAllFunctionality',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<functionalityResponse[]>>(
        API_ENDPOINTS.FUNCTIONALITY_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchTimeZone = createAsyncThunk(
  'common/fetchTimeZone',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ timezones: Timezone[] }>>(
        API_ENDPOINTS.TIMEZONE_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllBuiders = createAsyncThunk(
  'common/fetchAllBuiders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<BuilderInfo[]>>(API_ENDPOINTS.BUILDER_ALL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchComplianceType = createAsyncThunk(
  'common/fetchComplianceType',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ComplianceType[]>>(API_ENDPOINTS.COMPLIANCE_TYPE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchLocation = createAsyncThunk(
  'common/fetchLocation',
  async (arg: { status?: boolean } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<LocationType[]>>(API_ENDPOINTS.LOCATION_BASE, {
        params: arg,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createLocation = createAsyncThunk(
  'common/createLocation',
  async (payload: LocationType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<LocationType>>(API_ENDPOINTS.LOCATION_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLocation = createAsyncThunk(
  'common/updateLocation',
  async (payload: { data: Partial<LocationType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<LocationType>>(
        `${API_ENDPOINTS.LOCATION_BASE}/${payload.id}`,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
