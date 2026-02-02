import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CommonPagination } from '@redux/feature/common/ICommonState';
import { NotesTagType } from './INotesTagState';

export const createNotesTag = createAsyncThunk(
  'noteTags/create',
  async (payload: NotesTagType, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<NotesTagType>>(API_ENDPOINTS.NOTE_TAG_BASE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllNotesTag = createAsyncThunk(
  'noteTags/fetchAll',
  async (params: { page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ noteTag: NotesTagType[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.NOTE_TAG_BASE, { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotesTag = createAsyncThunk(
  'noteTags/update',
  async (payload: { data: Partial<NotesTagType>; notesTagId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<NotesTagType>>(
        `${API_ENDPOINTS.NOTE_TAG_BASE}/${payload.notesTagId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteNotesTag = createAsyncThunk(
  'noteTags/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.NOTE_TAG_BASE}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
