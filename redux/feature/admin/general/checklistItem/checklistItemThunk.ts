import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';

export const createChecklistItem = createAsyncThunk(
  'checklistItem/create',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<any>>(API_ENDPOINTS.CHECKLIST_ITEM, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllChecklistItem = createAsyncThunk(
  'checklistItem/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<any>>(API_ENDPOINTS.CHECKLIST_ITEM);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateChecklistItem = createAsyncThunk(
  'checklistItem/update',
  async (payload: { data: any; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<any>>(
        `${API_ENDPOINTS.CHECKLIST_ITEM}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteChecklistItem = createAsyncThunk(
  'checklistItem/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.CHECKLIST_ITEM}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
