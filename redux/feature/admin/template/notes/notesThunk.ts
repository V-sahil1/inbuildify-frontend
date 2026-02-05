import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { INotesTemplate } from './InotesState';
import { CommonPagination } from '@redux/feature/common/ICommonState';

export const fetchNotesTemplate = createAsyncThunk(
  'notesTemplate/fetch',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ templateNotes: INotesTemplate[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.NOTES_TEMPLATE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createNotesTemplate = createAsyncThunk(
  'notesTemplate/create',
  async (data: { name: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<INotesTemplate>>(API_ENDPOINTS.NOTES_TEMPLATE, {
        data,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotesTemplate = createAsyncThunk(
  'notesTemplate/update',
  async ({ id, data }: { id: string; data: Partial<INotesTemplate> }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<INotesTemplate>>(
        `${API_ENDPOINTS.NOTES_TEMPLATE}/${id}`,
        { data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const activateNotesTemplate = createAsyncThunk(
  'notesTemplate/activate',
  async ({ id }: { id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<INotesTemplate>>(
        `${API_ENDPOINTS.ACTIVATE_NOTES_TEMPLATE}/${id}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
