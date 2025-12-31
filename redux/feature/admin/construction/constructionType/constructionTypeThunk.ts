import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { ConstructionTypeResponse, Type } from './IConstructionTypeState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createType = createAsyncThunk(
  'type/create',
  async (payload: Type, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ConstructionTypeResponse>>(
        API_ENDPOINTS.CONSTRUCTION_TYPE,
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

export const fetchAllType = createAsyncThunk('type/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<
      ApiResponse<{ constructionTypes: ConstructionTypeResponse[]; pagination: Pagination }>
    >(API_ENDPOINTS.CONSTRUCTION_TYPE);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateType = createAsyncThunk(
  'type/update',
  async (payload: { data: Partial<Type>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ConstructionTypeResponse>>(
        `${API_ENDPOINTS.CONSTRUCTION_TYPE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteType = createAsyncThunk(
  'typr/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_TYPE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
