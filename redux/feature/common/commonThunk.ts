import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { functionalityResponse, Timezone } from './ICommonState';
import { Pagination } from '../admin/general/surveyor/ISurveyorState';
import { BuilderInfo } from '../admin/general/builder/ibuilderState';

export const fetchAllFunctionality = createAsyncThunk(
  'common/fetchAllFunctionality',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ functionalities: functionalityResponse[]; pagination: Pagination }>
      >(API_ENDPOINTS.FUNCTIONALITY_BASE);
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
