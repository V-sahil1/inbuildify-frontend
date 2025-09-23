import { createAsyncThunk } from "@reduxjs/toolkit";
import api, { apiWithFormDataMethods } from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
// import { AppointmentDetails, NoteDetails, SmsDetails, TaskDetails } from "data/types";

export const getActionsThunk = createAsyncThunk(
  "action/getActions",
  async (payload: { leadId: string; type?: string }, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<any>>(
        `${API_ENDPOINTS.ACTION_BASE}/${payload.leadId}`,
        {
          params: {
            filter: payload.type,
          },
        }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
  
export const createActionsThunk = createAsyncThunk(
    "action/createActions",
  async (payload: { leadId: string, data: FormData }, { rejectWithValue }) => {
      try {
        const res = await apiWithFormDataMethods.post<ApiResponse<any>>(
          `${API_ENDPOINTS.ACTION_BASE}/${payload.leadId}`,
          payload.data
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const updateActionsThunk = createAsyncThunk(
    "action/updateActions",
  async (payload: { actionId: string, data: FormData }, { rejectWithValue }) => {
      try {
        const res = await apiWithFormDataMethods.put<ApiResponse<any>>(
          `${API_ENDPOINTS.ACTION_BASE}/${payload.actionId}`,
          payload.data
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );

export const getActionTags = createAsyncThunk("action/getActionTags", async (_, { rejectWithValue }) => {
    try {
      const res = await api.get<ApiResponse<any>>(
        API_ENDPOINTS.TAGS_BASE
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  })