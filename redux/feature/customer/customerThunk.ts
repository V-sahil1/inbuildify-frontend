import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { CustomerRequest, CustomerResponse } from "./CustomerState";

export const createCustomerThunk = createAsyncThunk(
  "contractor/create",
  async (
    payload: { email: string; name: string; phone: string; address: string },
    thunkAPI
  ) => {
    try {
      const response: ApiResponse<CustomerRequest> = await api.post(
        API_ENDPOINTS.CREATE_CUSTOMER,
        { data: payload }
      );
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getCustomersThunk = createAsyncThunk(
  "contractor/getAll",
  async (_, thunkAPI) => {
    try {
      const response: ApiResponse<CustomerResponse> = await api.get(
        API_ENDPOINTS.GET_CUSTOMERS
      );
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const getCustomerByIdThunk = createAsyncThunk(
  "contractor/delete",
  async (customerId: string, thunkAPI) => {
    try {
      const response: ApiResponse<any> = await api.get(
        `${API_ENDPOINTS.CREATE_CUSTOMER}/${customerId}` 
      );
      console.log("API",response);
      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const updateCustomerThunk = createAsyncThunk(
  "contractor/update",
  async (
    {
      customerId,
      payload,
    }: { customerId: string; payload: { name: string; phone: string; address: string } },
    thunkAPI
  ) => {
    try {
      console.log("abc",customerId);
      const response: ApiResponse<CustomerRequest> = await api.put(
        `${API_ENDPOINTS.CREATE_CUSTOMER}/${customerId}`,
        {
          data: payload, 
        }
      );

      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const deleteCustomerThunk = createAsyncThunk(
  "contractor/delete",
  async (customerId: string, thunkAPI) => {
    try {
      const response: ApiResponse<CustomerRequest> = await api.delete(
        `${API_ENDPOINTS.CREATE_CUSTOMER}/${customerId}` // ✅ delete not put
      );

      return response;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


