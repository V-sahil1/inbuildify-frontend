import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import {
  RoleAndUserType,
  RoleAndUserMapping,
  RoleAndUserMappingCreatePayload,
} from './IRoleAndUserMappingState';
import { Pagination } from '../surveyor/ISurveyorState';

export const fetchRoleTypeById = createAsyncThunk(
  'roleAndUserMappingType/fetchAll',
  async (roleId: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ roleType: RoleAndUserType[]; pagination: Pagination }>
      >(API_ENDPOINTS.ROLE_AND_USER_MAPPING_TYPE, {
        params: {
          role: roleId,
        },
      });
      const roleTypes = response.data?.roleType || [];
      return roleTypes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchRoleAndUsersMapping = createAsyncThunk(
  'roleAndUserMapping/fetchAll',
  async (assignedBy: string | undefined, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ userRoleMapping: RoleAndUserMapping[]; pagination: Pagination }>
      >(API_ENDPOINTS.ROLE_AND_USER_MAPPING, {
        params: {
          assigned_by: assignedBy,
        },
      });
      const roleAndUsersMapping = response.data?.userRoleMapping || [];
      return roleAndUsersMapping;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRoleAndUserMapping = createAsyncThunk(
  'roleAndUserMapping/create',
  async (data: RoleAndUserMappingCreatePayload, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<RoleAndUserMapping>>(
        API_ENDPOINTS.ROLE_AND_USER_MAPPING,
        { data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRoleAndUserMapping = createAsyncThunk(
  'roleAndUserMapping/update',
  async (
    { id, data }: { id: string; data: Partial<RoleAndUserMappingCreatePayload> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put<ApiResponse<RoleAndUserMapping>>(
        `${API_ENDPOINTS.ROLE_AND_USER_MAPPING}/${id}`,
        { data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.message || error?.message || 'Failed to update role mapping'
      );
    }
  }
);
