import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../../../auth/IAuthState';
import { CustomerPortalInfo } from './icustomerPortalState';


export const fetchCustomerPortalInfo = createAsyncThunk(
  'customerPortal/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<CustomerPortalInfo>>(
        API_ENDPOINTS.CUSTOMER_PORTAL_BASE
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCustomerPortalDetails = createAsyncThunk(
  'customerPortal/update',
  async (payload: FormData, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<CustomerPortalInfo>>(
        API_ENDPOINTS.CUSTOMER_PORTAL_BASE,
        payload
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
