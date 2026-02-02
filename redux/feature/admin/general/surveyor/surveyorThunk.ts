import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { Surveyor, SurveyorResponse } from './ISurveyorState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const createSurveyor = createAsyncThunk(
  'surveyor/create',
  async (payload: Surveyor, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<SurveyorResponse>>(API_ENDPOINTS.SURVEYOR_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllServeyor = createAsyncThunk(
  'surveyor/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ surveyors: Surveyor[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.SURVEYOR_BASE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateServeyor = createAsyncThunk(
  'surveyor/update',
  async (payload: { data: Partial<Surveyor>; surveyorId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<SurveyorResponse>>(
        `${API_ENDPOINTS.SURVEYOR_BASE}/${payload.surveyorId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteServeyor = createAsyncThunk(
  'surveyor/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<null>>(
        `${API_ENDPOINTS.SURVEYOR_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
