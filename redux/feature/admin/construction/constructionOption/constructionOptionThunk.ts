import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { IConstructionOption } from './ICostructionOptionState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createConstructionOption = createAsyncThunk(
  'constructionOption/create',
  async (payload: IConstructionOption, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IConstructionOption>>(
        API_ENDPOINTS.CONSTRUCTION_OPTION,
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

export const fetchAllConstructionOption = createAsyncThunk(
  'constructionOption/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ constructionOptions: IConstructionOption[]; pagination: Pagination }>
      >(API_ENDPOINTS.CONSTRUCTION_OPTION);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateContructionOption = createAsyncThunk(
  'constructionOption/update',
  async (payload: { data: Partial<IConstructionOption>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IConstructionOption>>(
        `${API_ENDPOINTS.CONSTRUCTION_OPTION}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteConstructionOption = createAsyncThunk(
  'constructionOption/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.CONSTRUCTION_OPTION}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
