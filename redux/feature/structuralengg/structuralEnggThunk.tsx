import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { StructuralEngineer, StructuralEngineersResponse } from './IStructuralEnggState';
//new
export const createStructuralThunk = createAsyncThunk(
  'structural/createStructuralEngg',
  async (payload: StructuralEngineer, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<any>>(
        API_ENDPOINTS.STRUCTURAL_ENGG_BASE,
        {data:payload}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);  

export const updateStructuralThunk = createAsyncThunk(
  'structural/updateStructuralEngg',
  async ({id, payload} : {id:string, payload: StructuralEngineer}, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<any>>(
        API_ENDPOINTS.STRUCTURAL_ENGG_BASE + '/' + id,
        {data:payload}
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getStructuralThunk = createAsyncThunk(
  'structural/getStructuralEngg',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<StructuralEngineersResponse>>(
        API_ENDPOINTS.STRUCTURAL_ENGG_BASE
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteStructuralThunk = createAsyncThunk(
  'structural/deleteStructuralEngg',
  async (structuralEngineerId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<StructuralEngineer>>(
        API_ENDPOINTS.STRUCTURAL_ENGG_BASE + '/' + structuralEngineerId
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);