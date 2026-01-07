import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { EmailTemplate } from './IemailState';

export const fetchEmailTemplate = createAsyncThunk(
  'emailTemplate/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{
          templates: EmailTemplate[];
          counts: { total: number; standard: number; customized: number };
        }>
      >(API_ENDPOINTS.EMAIL_TEMPLATE);
      const responseData = response.data;
      return {
        templates: responseData.templates,
        count: responseData.counts || { total: 0, standard: 0, customized: 0 },
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmailTemplate = createAsyncThunk(
  'emailTemplate/update',
  async (payload: { data: Partial<EmailTemplate>; templateId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<EmailTemplate>>(
        `${API_ENDPOINTS.EMAIL_TEMPLATE}/${payload.templateId}`,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
