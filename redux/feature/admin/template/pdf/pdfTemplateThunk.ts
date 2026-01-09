import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { PdfTemplate } from './IpdfTemplateState';

export const fetchPdfTemplate = createAsyncThunk(
  'pdfTemplate/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<PdfTemplate[]>>(API_ENDPOINTS.PDF_TEMPLATE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePdfTemplate = createAsyncThunk(
  'pdfTemplate/update',
  async (payload: { data: FormData; templatePdfId: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<PdfTemplate>>(
        `${API_ENDPOINTS.PDF_TEMPLATE}/${payload.templatePdfId}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
