import { createAsyncThunk } from '@reduxjs/toolkit';
import api, { apiWithFormDataMethods } from '@lib/constants/api';
import { ApiResponse } from '../auth/IAuthState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { FloorPlanGetParams, IFloorPlanState } from './IFloorPlanState';
import { CommonPagination } from '../common/ICommonState';

export const fetchFloorPlans = createAsyncThunk(
  'floorPlans/fetchAll',
  async (params: FloorPlanGetParams, { rejectWithValue }) => {
    try {
      const res = await api.get<
        ApiResponse<{ floorPlans: IFloorPlanState[]; pagination: CommonPagination }>
      >(API_ENDPOINTS.FLOOR_PLAN_BASE, { params });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFloorPlan = createAsyncThunk(
  'floorPlans/create',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<IFloorPlanState>>(
        API_ENDPOINTS.FLOOR_PLAN_BASE,
        payload
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFloorPlan = createAsyncThunk(
  'floorPlans/update',
  async (payload: { data: FormData; floorPlanId: string }, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<IFloorPlanState>>(
        `${API_ENDPOINTS.FLOOR_PLAN_BASE}/${payload.floorPlanId}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// export const deleteFloorPlan = createAsyncThunk(
//   'floorPlans/delete',
//   async (payload: string, { rejectWithValue }) => {
//     try {
//       const res = await api.delete<ApiResponse>(`${API_ENDPOINTS.FLOOR_PLAN_BASE}/${payload}`);
//       return payload;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

//filters

export const getConditions = createAsyncThunk('floorPlans/conditions', async () => {
  try {
    const res = await api.get<ApiResponse<{ conditions: { name: string }[] }>>(
      API_ENDPOINTS.GET_MASTER_PRICE_LIST_CONDITIONS
    );
    return res.data;
  } catch (error) {
    return error.message;
  }
});
