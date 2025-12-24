import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';


export const createleadSource = createAsyncThunk(
  'leadSource/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.SALES_LEAD_SOURCE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllleadSource = createAsyncThunk(
  'leadSource/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.SALES_LEAD_SOURCE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateleadSource = createAsyncThunk(
  'leadSource/update',
  async (payload: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_LEAD_SOURCE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteleadSource = createAsyncThunk(
  'leadSource/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.SALES_LEAD_SOURCE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
