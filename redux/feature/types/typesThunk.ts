import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { DwellingType, Range } from "./ITypesState";
import { ApiResponse } from "../auth/IAuthState";

//range 


export const getRanges = createAsyncThunk(
  "floorPlans/ranges",
  async (_,{rejectWithValue}) => {
    try {
      const res = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.RANGE
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRange = createAsyncThunk(
    "floorPlans/range",
    async (payload: { name: string }, { rejectWithValue }) => {
      try {
        const res = await api.post<ApiResponse<Range>>(API_ENDPOINTS.RANGE, {
          data: payload,
        });
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

  //dwelling type

  export const getDwellingTypes = createAsyncThunk(
    "floorPlans/dwellingTypes",
    async () => {
      try {
        const res = await api.get<ApiResponse<any>>(
          API_ENDPOINTS.DWELLING_TYPE
        );
        return res.data;
      } catch (error) {
        return error.message;
      }
    }
  );

  export const createDwellingType = createAsyncThunk(
    "floorPlans/dwellingType",
    async (payload: { name: string }, { rejectWithValue }) => {
      try {
        const res = await api.post<ApiResponse<DwellingType>>(
          API_ENDPOINTS.DWELLING_TYPE,
          { data: payload }
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
  