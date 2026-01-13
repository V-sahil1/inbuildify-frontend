import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { IDocumentFolderMapping } from './IFolderMappingState';

export const fetchFolderMapping = createAsyncThunk(
  'folderMapping/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse< IDocumentFolderMapping >>(
        API_ENDPOINTS.DOCUMENT_FOLDER_MAPPING
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFolderMapping = createAsyncThunk(
  'folderMapping/update',
  async (payload: Partial<IDocumentFolderMapping>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IDocumentFolderMapping>>(
        API_ENDPOINTS.DOCUMENT_FOLDER_MAPPING,
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
