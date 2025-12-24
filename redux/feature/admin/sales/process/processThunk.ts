import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const createProcess = createAsyncThunk(
  'process/createProcess',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.SALES_PROCESS, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllProcess= createAsyncThunk(
  'process/fetchAllProcess',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.SALES_PROCESS);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateProcess = createAsyncThunk(
  'process/updateProcess',
  async (payload: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_PROCESS}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteProcess = createAsyncThunk(
  'process/deleteProcess',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_PROCESS}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
