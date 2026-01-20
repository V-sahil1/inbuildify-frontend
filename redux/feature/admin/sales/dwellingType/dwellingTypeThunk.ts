import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { Pagination } from '../../general/surveyor/ISurveyorState';
import { dwellingType, dwellingTypeResponse } from './IDwelingTypeState';

export const createDwellingType = createAsyncThunk(
  'dwellingType/createDwellingType',
  async (payload: dwellingType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<dwellingTypeResponse>>(
        API_ENDPOINTS.DWELLING_TYPE_BASE,
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

export const fetchDwellingType = createAsyncThunk(
  'dwellingType/fetchDwellingType',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<dwellingTypeResponse[]>
      >(API_ENDPOINTS.DWELLING_TYPE_BASE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDwellingType = createAsyncThunk(
  'dwellingType/updateDwellingType',
  async (payload: { data: Partial<dwellingType>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<dwellingTypeResponse>>(
        `${API_ENDPOINTS.DWELLING_TYPE_BASE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDwellingStatus = createAsyncThunk(
  'dwellingType/updateDwellingStatus',
  async (payload: { data: { isActive: boolean }; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<dwellingTypeResponse>>(
        `${API_ENDPOINTS.UPDATE_DWELLING_TYPE}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
