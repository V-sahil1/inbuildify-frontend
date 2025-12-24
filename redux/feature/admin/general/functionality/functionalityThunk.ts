import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';

export const createFunctionality = createAsyncThunk(
  'functionality/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.FUNCTIONALITY_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllFunctionality = createAsyncThunk(
  'functionality/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.FUNCTIONALITY_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFunctionality = createAsyncThunk(
  'functionality/update',
  async (payload: { data: any; surveyorId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.FUNCTIONALITY_BASE}/${payload.surveyorId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFunctionality = createAsyncThunk(
  'functionality/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.FUNCTIONALITY_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
