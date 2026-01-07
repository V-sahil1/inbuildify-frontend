import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { DocumentSubFolder, IDocumentCommonFolder } from './IDocumentAreaState';
import { Pagination } from '../../general/surveyor/ISurveyorState';

export const createDocumentArea = createAsyncThunk(
  'documentArea/create',
  async (payload: IDocumentCommonFolder, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<IDocumentCommonFolder>>(
        API_ENDPOINTS.DOCUMENT_AREA,
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

export const fetchAllDocumentArea = createAsyncThunk(
  'documentArea/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ folders: IDocumentCommonFolder[]; pagination: Pagination }>
      >(API_ENDPOINTS.DOCUMENT_AREA);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDocumentArea = createAsyncThunk(
  'documentArea/update',
  async (payload: { data: Partial<IDocumentCommonFolder>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IDocumentCommonFolder>>(
        `${API_ENDPOINTS.DOCUMENT_AREA}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDocumentArea = createAsyncThunk(
  'documentArea/delete',
  async (payload: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.DOCUMENT_AREA}/${payload}`);
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// sub folder

export const createDocumentSubFolder = createAsyncThunk(
  'documentSubFolder/create',
  async (payload: DocumentSubFolder, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<DocumentSubFolder>>(
        API_ENDPOINTS.DOCUMENT_SUB_FOLDER,
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

export const fetchAllDocumentSubFolder = createAsyncThunk(
  'documentSubFolder/fetchAll',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ records: DocumentSubFolder[]; pagination: Pagination }>
      >(API_ENDPOINTS.DOCUMENT_SUB_FOLDER + `/${id}`);
      return { data: response.data, commonFolderId: id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDocumentSubFolder = createAsyncThunk(
  'documentSubFolder/update',
  async (payload: { data: Partial<DocumentSubFolder>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<DocumentSubFolder>>(
        `${API_ENDPOINTS.DOCUMENT_SUB_FOLDER}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDocumentSubFolder = createAsyncThunk(
  'documentSubFolder/delete',
  async (payload: { commonFolderId: string; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(
        `${API_ENDPOINTS.DOCUMENT_SUB_FOLDER}/${payload.id}`
      );
      return { commonFolderId: payload.commonFolderId, id: payload.id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
