import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import { ICountryResponse, IStateResponse } from './ILocationState';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';

export const getCountriesThunk = createAsyncThunk(
  'location/getCountries',
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<ICountryResponse[]> = await api.get(API_ENDPOINTS.COUNTRY_BASE);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getStatesByCountryIdThunk = createAsyncThunk(
  'location/getStatesByCountryId',
  async (countryId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<IStateResponse[]> = await api.get(
        API_ENDPOINTS.STATE_BASE + '/' + countryId
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
