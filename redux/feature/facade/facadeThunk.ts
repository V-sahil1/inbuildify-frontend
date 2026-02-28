import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import { GetFacadesParams, IFacadeState } from './IFacadeState';
import { CommonPagination } from '../common/ICommonState';

export const getFacades = createAsyncThunk(
  'facade/getAll',
  async (params: GetFacadesParams = {}, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<{ facades: IFacadeState[], pagination: CommonPagination }>>(API_ENDPOINTS.FACADE_BASE, { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFacade = createAsyncThunk(
  'facade/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<IFacadeState>>(
        API_ENDPOINTS.FACADE_BASE,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFacade = createAsyncThunk(
  'facade/update',
  async (payload: { data: FormData; facadeId: string }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<IFacadeState>>(
        `${API_ENDPOINTS.FACADE_BASE}/${payload.facadeId}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFacade = createAsyncThunk(
  'facade/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<IFacadeState>>(
        `${API_ENDPOINTS.FACADE_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
