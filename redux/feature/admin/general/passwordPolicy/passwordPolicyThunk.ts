import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { passwordPolicy, passwordPolicyResponse } from './IPasswordPolicyState';

export const fetchPasswordPolicy = createAsyncThunk(
  'passwordPolicy/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<passwordPolicyResponse>>(
        API_ENDPOINTS.GET_PASSWORD_POLICY
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePasswordPolicy = createAsyncThunk(
  'passwordPolicy/update',
  async (
    payload: { data: Partial<passwordPolicy>; passwordPolicyId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<passwordPolicyResponse>>(
        `${API_ENDPOINTS.PASSWORD_POLICY_BASE}/${payload.passwordPolicyId}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
