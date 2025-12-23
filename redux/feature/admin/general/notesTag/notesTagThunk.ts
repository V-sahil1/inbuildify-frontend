import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { FetchNotesTagResponse, notesTag, notesTagResponse } from './INotesTagState';

export const createNotesTag = createAsyncThunk(
  'noteTags/create',
  async (payload: notesTag, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<notesTagResponse>>(API_ENDPOINTS.NOTE_TAG_BASE, {
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<FetchNotesTagResponse>>(
        API_ENDPOINTS.NOTE_TAG_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateNotesTag = createAsyncThunk(
  'noteTags/update',
  async (payload: { data: Partial<notesTag>; notesTagId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<notesTagResponse>>(
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
      const response = await api.delete<ApiResponse<null>>(
        `${API_ENDPOINTS.NOTE_TAG_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
