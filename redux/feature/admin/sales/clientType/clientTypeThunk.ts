import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { clientType, clientTypeResponse, fetchClientTypeResponse } from './IClientTypeState';

export const createClientType = createAsyncThunk(
  'clientType/create',
  async (payload: clientType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<clientTypeResponse>>(API_ENDPOINTS.CLIENT_TYPE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllClientType = createAsyncThunk(
  'clientType/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<fetchClientTypeResponse>>(
        API_ENDPOINTS.CLIENT_TYPE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClientType = createAsyncThunk(
  'clientType/update',
  async (payload: { data: Partial<clientType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<clientTypeResponse>>(
        `${API_ENDPOINTS.CLIENT_TYPE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClientTypeStatus = createAsyncThunk(
  'clientType/updateStatus',
  async (payload: { data: { isActive: boolean }; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<clientTypeResponse>>(
        `${API_ENDPOINTS.UPDATE_CLIENT_TYPE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
