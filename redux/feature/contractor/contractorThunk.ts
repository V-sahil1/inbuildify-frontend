import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { ContractorRequest, ContractorResponse, Service } from "./IContractorState";

export const createContractorThunk = createAsyncThunk(
  "contractor/create",
  async (
    payload: { email: string; name: string; phone: string; address: string, service?: string },
    {rejectWithValue}
  ) => {
    try {
      const response: ApiResponse<ContractorRequest> = await api.post(
        API_ENDPOINTS.CREATE_CONTRACTOR,
        { data: payload }
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getContractorsThunk = createAsyncThunk(
  "contractor/getAll",
  async (_, {rejectWithValue}) => {
    try {
      const response: ApiResponse<ContractorResponse> = await api.get(
        API_ENDPOINTS.GET_CONTRACTORS
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getContractorByIdThunk = createAsyncThunk(
  "contractor/delete",
  async (contractorId: string, {rejectWithValue}) => {
    try {
      const response: ApiResponse<any> = await api.get(
        `${API_ENDPOINTS.CREATE_CONTRACTOR}/${contractorId}` 
      );
      console.log("API",response);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateContractorThunk = createAsyncThunk(
  "contractor/update",
  async (
    {
      contractorId,
      payload,
    }: { contractorId: string; payload: { name: string; phone: string; address: string,service?: string } },
    {rejectWithValue}
  ) => {
    try {
      console.log("abc",contractorId);
      const response: ApiResponse<ContractorRequest> = await api.put(
        `${API_ENDPOINTS.CREATE_CONTRACTOR}/${contractorId}`,
        {
          data: payload, // ✅ only send object of object
        }
      );

      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


export const deleteContractorThunk = createAsyncThunk(
  "contractor/delete",
  async (contractorId: string, {rejectWithValue}) => {
    try {
      const response: ApiResponse<ContractorRequest> = await api.delete(
        `${API_ENDPOINTS.CREATE_CONTRACTOR}/${contractorId}` 
      );
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getServicesThunk = createAsyncThunk(
  "contractor/getAll",
  async (_, {rejectWithValue}) => {
    try {
      const response: ApiResponse<Service[]> = await api.get(
        API_ENDPOINTS.SERVICE_BASE
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);