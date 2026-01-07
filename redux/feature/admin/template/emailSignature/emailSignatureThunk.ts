import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { EmailSignature } from './IemailSignatureState';

export const fetchEmailSignature = createAsyncThunk(
  'emailSignature/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<EmailSignature>>(API_ENDPOINTS.EMAIL_SIGNATURE);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmailSignature = createAsyncThunk(
  'emailSignature/update',
  async (payload: Partial<EmailSignature>, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<EmailSignature>>(API_ENDPOINTS.EMAIL_SIGNATURE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
