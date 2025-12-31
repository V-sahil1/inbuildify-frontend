import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { RangeResponse } from './IRangeState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createRange = createAsyncThunk(
  'range/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.post<ApiResponse<RangeResponse>>(
        API_ENDPOINTS.RANGE_BASE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRange = createAsyncThunk('range/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<
      ApiResponse<{ ranges: RangeResponse[]; pagination: Pagination }>
    >(API_ENDPOINTS.RANGE_BASE);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateRange = createAsyncThunk(
  'range/update',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<RangeResponse>>(
        `${API_ENDPOINTS.RANGE_BASE}/${payload.id}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRangeStatus = createAsyncThunk(
  'range/updateStatus',
  async (payload: { data: { isActive: boolean }; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<RangeResponse>>(
        `${API_ENDPOINTS.UPDATE_RANGE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
