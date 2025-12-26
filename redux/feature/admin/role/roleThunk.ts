import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '@redux/feature/auth/IAuthState';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { Role } from './IRoleState';
import { Pagination } from '../general/surveyor/ISurveyorState';

export const fetchRole = createAsyncThunk('role/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<{ role: Role[]; pagination: Pagination }>>(
      API_ENDPOINTS.ROLE_BASE
    );
    return response.data;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});
