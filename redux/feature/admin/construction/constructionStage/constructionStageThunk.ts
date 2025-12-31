import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { ConstructionStageResponse, Stage } from './IConstructionStageState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createStage = createAsyncThunk(
  'stage/create',
  async (payload: Stage, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ConstructionStageResponse>>(
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

export const fetchAllStage = createAsyncThunk('stage/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<
      ApiResponse<{ constructionStages: ConstructionStageResponse[]; pagination: Pagination }>
    >(API_ENDPOINTS.CONSTRUCTION_STAGE);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

export const updateStage = createAsyncThunk(
  'stage/update',
  async (payload: { data: Stage; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ConstructionStageResponse>>(
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
