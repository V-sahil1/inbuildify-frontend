import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CommonPagination } from '@redux/feature/common/ICommonState';
import { IClientType } from './IClientTypeState';

export const createClientType = createAsyncThunk(
  'clientType/create',
  async (payload: IClientType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IClientType>>(API_ENDPOINTS.CLIENT_TYPE, {
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
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ clientType: IClientType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.CLIENT_TYPE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateClientType = createAsyncThunk(
  'clientType/update',
  async (payload: { data: Partial<IClientType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IClientType>>(
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
      const response = await api.put<ApiResponse<IClientType>>(
        `${API_ENDPOINTS.UPDATE_CLIENT_TYPE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
