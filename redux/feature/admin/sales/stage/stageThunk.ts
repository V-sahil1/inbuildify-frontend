import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createStage = createAsyncThunk(
  'stage/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.SALES_STAGE_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllStage= createAsyncThunk(
  'stage/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.SALES_STAGE_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStage = createAsyncThunk(
  'stage/update',
  async (payload: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_STAGE_BASE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteStage = createAsyncThunk(
  'stage/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_STAGE_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
