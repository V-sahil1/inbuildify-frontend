import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { FileNamingRule } from './IFileNamingState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createFileNaming = createAsyncThunk(
  'fileNaming/create',
  async (payload: FileNamingRule, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<FileNamingRule>>(
        API_ENDPOINTS.DOCUMENT_FILE_NAMING,
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

export const fetchAllFileNaming = createAsyncThunk(
  'fileNaming/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ records: FileNamingRule[]; pagination: Pagination }>
      >(API_ENDPOINTS.DOCUMENT_FILE_NAMING);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFileNaming = createAsyncThunk(
  'fileNaming/update',
  async (payload: { data: Partial<FileNamingRule>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<FileNamingRule>>(
        `${API_ENDPOINTS.DOCUMENT_FILE_NAMING}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFileNaming = createAsyncThunk(
  'fileNaming/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.DOCUMENT_FILE_NAMING}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFileNamingFormat = createAsyncThunk(
  'fileNamingFormat/create',
  async (payload: { namingFormat: string }, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<{ namingFormat: string }>>(
        API_ENDPOINTS.DOCUMENT_FILE_NAMING_FORMAT,
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

export const fetchAllFileNamingFormat = createAsyncThunk(
  'fileNamingFormat/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<{ namingFormat: string }>>(
        API_ENDPOINTS.DOCUMENT_FILE_NAMING_FORMAT
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
