import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { AppointmentDetails, NoteDetails, SmsDetails, TaskDetails } from "data/types";

export const getActionsThunk = createAsyncThunk(
  "action/getActions",
  async (leadId: string,{rejectWithValue}) => {
    try {
      const res = await api.get<ApiResponse<any>>(
        `${API_ENDPOINTS.ACTION_BASE}/${leadId}`
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
  
export const createActionsThunk = createAsyncThunk(
    "action/createActions",
    async (payload:{leadId: string, data: NoteDetails | AppointmentDetails | TaskDetails | SmsDetails},{rejectWithValue}) => {
      try {
        const res = await api.post<ApiResponse<any>>(
          `${API_ENDPOINTS.ACTION_BASE}/${payload.leadId}`,
          { data: payload.data }
        );
        return res.data;
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );