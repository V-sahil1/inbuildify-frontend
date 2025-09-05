import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiWithFormDataMethods } from "@lib/constants/api";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { IFloorPlanState } from "./IFloorPlanState";

export const fetchFloorPlans = createAsyncThunk(
  "floorPlans/fetchAll",
  async (filters?: { range?: string; dwelling_type?: string }) => {
    try {
      let url = API_ENDPOINTS.FLOOR_PLAN_BASE;

      // Add query parameters if filters are provided
      if (filters && (filters.range || filters.dwelling_type)) {
        const queryParams = new URLSearchParams();
        if (filters.range) queryParams.append("range", filters.range);
        if (filters.dwelling_type)
          queryParams.append("dwelling_type", filters.dwelling_type);
        url = `${API_ENDPOINTS.FLOOR_PLAN_BASE}?${queryParams.toString()}`;
      }

      const res = await api.get<ApiResponse<any>>(url);
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);

// export const createFloorPlan = createAsyncThunk(
//     "floorPlans/create",
//     async (payload: IFloorPlanState, { rejectWithValue }) => {
//         try {
//             const res = await api.post<ApiResponse<any>>(API_ENDPOINTS.FLOOR_PLAN_BASE, payload);
//             return res.data;
//         } catch (error) {
//             return rejectWithValue(error.message);
//         }
//     }
// );

export const createFloorPlan = createAsyncThunk(
  "floorPlans/create",
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const res = await apiWithFormDataMethods.post<ApiResponse<any>>(
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
  "floorPlans/update",
  async (
    payload: { data: FormData; floorPlanId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await apiWithFormDataMethods.put<ApiResponse<any>>(
        `${API_ENDPOINTS.FLOOR_PLAN_BASE}/${payload.floorPlanId}`,
        payload.data
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFloorPlan = createAsyncThunk(
  "floorPlans/delete",
  async (payload: string, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<any>>(
        `${API_ENDPOINTS.FLOOR_PLAN_BASE}/${payload}`
      );
      return payload;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//filters

export const getConditions = createAsyncThunk(
    "floorPlans/conditions",
    async () => {
      try {
        const res = await api.get<
          ApiResponse<{ conditions: { name: string }[] }>
        >(API_ENDPOINTS.GET_MASTER_PRICE_LIST_CONDITIONS);
        return res.data;
      } catch (error) {
        return error.message;
      }
    }
);

export const getFloorPlanFilters = createAsyncThunk(
  "floorPlans/filters",
  async () => {
    try {
      const res = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.FLOOR_PLAN_FILTERS
      );
      return res.data;
    } catch (error) {
      return error.message;
    }
  }
);

export const createRange = createAsyncThunk(
  "floorPlans/range",
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<any>>(API_ENDPOINTS.RANGE, {
        data: payload,
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const createDwellingType = createAsyncThunk(
  "floorPlans/dwellingType",
  async (payload: { name: string }, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<any>>(
        API_ENDPOINTS.DWELLING_TYPE,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateRange = createAsyncThunk(
  "floorPlans/updateRange",
  async (payload: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<any>>(
        API_ENDPOINTS.RANGE + "/" + payload.id,
        { data: { name: payload.name } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const updateDwellingType = createAsyncThunk(
  "floorPlans/updateDwellingType",
  async (payload: { id: string; name: string }, { rejectWithValue }) => {
    try {
      const res = await api.put<ApiResponse<any>>(
        API_ENDPOINTS.DWELLING_TYPE + "/" + payload.id,
        { data: { name: payload.name } }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRange = createAsyncThunk(
  "floorPlans/deleteRange",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<any>>(
        API_ENDPOINTS.RANGE + "/" + payload.id
      );
      return payload.id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
export const deleteDwellingType = createAsyncThunk(
  "floorPlans/deleteDwellingType",
  async (payload: { id: string }, { rejectWithValue }) => {
    try {
      const res = await api.delete<ApiResponse<any>>(
        API_ENDPOINTS.DWELLING_TYPE + "/" + payload.id
      );
      return payload.id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

