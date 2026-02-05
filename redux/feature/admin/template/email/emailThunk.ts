import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { IEmailTemplate } from './IemailState';

export const fetchEmailTemplate = createAsyncThunk(
  'emailTemplate/fetch',
  async (params:{type?:string}={}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{
          templates: IEmailTemplate[];
          counts: { total: number; standard: number; customized: number };
        }>
      >(API_ENDPOINTS.EMAIL_TEMPLATE,{params});
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
  async (payload: { data: Partial<IEmailTemplate>; templateId: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<IEmailTemplate>>(
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
