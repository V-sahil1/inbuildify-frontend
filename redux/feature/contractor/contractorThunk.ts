import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { ContractorRequest, ContractorResponse } from "./IContractorState";

export const createContractorThunk = createAsyncThunk(
  "contractor/create",
  async (
    payload: { email: string; name: string; phone: string; address: string },
    thunkAPI
  ) => {
    try {
      const response: ApiResponse<ContractorRequest> = await api.post(
        API_ENDPOINTS.CREATE_CONTRACTOR,
        { data: payload }
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getContractorsThunk = createAsyncThunk(
  "contractor/getAll",
  async (_, thunkAPI) => {
    try {
      const response: ApiResponse<ContractorResponse> = await api.get(
        API_ENDPOINTS.GET_CONTRACTORS
      );
      return response.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);
