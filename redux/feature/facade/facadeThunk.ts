import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import { IFacadeState } from './IFacadeState';

interface GetFacadesParams {
  status?: boolean;
  cost_type?: string;
  name?: string;
  dwelling_type_id?: string;
  range_id?: string;
  page?: number;
  limit?: number;
  standard?: boolean;
  upgrade?: boolean;  
}

interface FacadeResponse {
  facades: IFacadeState[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalRecords: number;
    limit: number;
  };
}

export const getFacades = createAsyncThunk(
  'facade/getAll',
  async (params: GetFacadesParams = {}, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<FacadeResponse>>(API_ENDPOINTS.FACADE_BASE, { params });
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
