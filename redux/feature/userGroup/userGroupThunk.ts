import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { userGroup } from './IUserGroupState';
import { Pagination } from '../admin/general/surveyor/ISurveyorState';
import { ApiResponse } from '../auth/IAuthState';

export const createUserGroup = createAsyncThunk(
  'userGroup/create',
  async (payload: userGroup, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<userGroup>>(API_ENDPOINTS.USER_GROUP, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllUserGroup = createAsyncThunk(
  'userGroup/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ userGroups: userGroup[]; pagination: Pagination }>
      >(API_ENDPOINTS.USER_GROUP);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUserGroup = createAsyncThunk(
  'userGroup/update',
  async (payload: { data: Partial<userGroup>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<userGroup>>(
        `${API_ENDPOINTS.USER_GROUP}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
