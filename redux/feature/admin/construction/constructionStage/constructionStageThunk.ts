import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { ConstructionStage } from './IConstructionStageState';

export const createStage = createAsyncThunk(
  'stage/create',
  async (payload: ConstructionStage, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ConstructionStage>>(
        API_ENDPOINTS.CONSTRUCTION_STAGE,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllConstructionStage = createAsyncThunk(
  'stage/fetchAll',
  async (params: { construction_type_id?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<ConstructionStage[]>>(
        API_ENDPOINTS.CONSTRUCTION_STAGE,
        { params }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStage = createAsyncThunk(
  'stage/update',
  async (payload: { data: Partial<ConstructionStage>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ConstructionStage>>(
        `${API_ENDPOINTS.CONSTRUCTION_STAGE}/${payload.id}`,
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
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_STAGE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
