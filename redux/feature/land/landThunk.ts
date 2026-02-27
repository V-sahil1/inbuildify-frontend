import api, { apiWithFormDataMethods } from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ApiResponse } from '../auth/IAuthState';
import { HLPackageCommission, HLPackagePriceItem, HouseLandPackage, ILandLot, LotPackageGroup } from './ILandState';

export const createLandLot = createAsyncThunk(
  'landLot/create',
  async (payload: ILandLot, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ILandLot>>(API_ENDPOINTS.LAND_LOT, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllLandLot = createAsyncThunk(
  'landLot/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<ILandLot[]>
      >(API_ENDPOINTS.LAND_LOT);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLandLot = createAsyncThunk(
  'landLot/update',
  async (payload: { data: Partial<ILandLot>; id: string }, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<ILandLot>>(
        `${API_ENDPOINTS.LAND_LOT}/${payload.id}`,
        { data: payload.data }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLandLot = createAsyncThunk(
  'landLot/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.LAND_LOT}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const copyLandLot = createAsyncThunk(
  'landLot/copy',
  async (payload: ILandLot, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<ILandLot>>(API_ENDPOINTS.LAND_LOT, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//land package
export const createLandPackage = createAsyncThunk(
  'landPackage/create',
  async (payload: HouseLandPackage, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<HouseLandPackage>>(API_ENDPOINTS.HL_PACKAGE, {
        data: payload,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllLandPackage = createAsyncThunk(
  'landPackage/fetchAll',
  async (payload: { lotId?: string } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ houseLandPackages: HouseLandPackage[] }>
      >(API_ENDPOINTS.HL_PACKAGE, { params: { lot_id: payload.lotId } });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAllLandPackageById = createAsyncThunk(
  'landPackage/fetchAllById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<HouseLandPackage>
      >(API_ENDPOINTS.HL_PACKAGE + '/' + id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateLandPackage = createAsyncThunk(
  'landPackage/update',
  async (payload: { data: FormData; id: string }, { rejectWithValue }) => {
    try {
      const response = await apiWithFormDataMethods.put<ApiResponse<HouseLandPackage>>(
        `${API_ENDPOINTS.HL_PACKAGE}/${payload.id}`,
        payload.data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteLandPackage = createAsyncThunk(
  'landPackage/delete',
  async (payload: { id: string, lotId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse>(`${API_ENDPOINTS.HL_PACKAGE}/${payload.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//lot package group

export const fetchAllLandPackageGroup = createAsyncThunk(
  'landPackageGroup/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ groups: LotPackageGroup[] }>
      >(API_ENDPOINTS.LAND_PACKAGE_GROUP);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//hlpackage commission mapping

export const fetchAllHLPackageCommissionById = createAsyncThunk(
  'landPackage/fetchAllHLPackageCommissionById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ mappings: HLPackageCommission[], commissionTotal: number }>
      >(API_ENDPOINTS.HL_PACKAGE_COMMISSION + '/' + id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createHLPackageCommission = createAsyncThunk(
  'landPackage/createHLPackageCommission',
  async (payload: HLPackageCommission, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<{ mapping: HLPackageCommission, commissionTotal: number }>>(
        API_ENDPOINTS.HL_PACKAGE_COMMISSION,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHLPackageCommission = createAsyncThunk(
  'landPackage/deleteHLPackageCommission',
  async (payload: { id: string, packageId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<{ houseTotal: number, commissionTotal: number }>>(`${API_ENDPOINTS.HL_PACKAGE_COMMISSION}/${payload.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//hlpackage pricelist mapping

export const fetchAllHLPackagePricelistById = createAsyncThunk(
  'landPackage/fetchAllHLPackagePricelistById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<
        ApiResponse<{ mappings: HLPackagePriceItem[], commissionTotal: number }>
      >(API_ENDPOINTS.HL_PACKAGE_PRICELIST + '/' + id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createHLPackagePricelist = createAsyncThunk(
  'landPackage/createHLPackagePricelist',
  async (payload: HLPackagePriceItem, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<{ mapping: HLPackagePriceItem, commissionTotal: number }>>(
        API_ENDPOINTS.HL_PACKAGE_PRICELIST,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateHLPackagePricelist = createAsyncThunk(
  'landPackage/updateHLPackagePricelist',
  async (payload: HLPackagePriceItem, { rejectWithValue }) => {
    try {
      const response = await api.put<ApiResponse<{ mappings: HLPackagePriceItem[], commissionTotal: number }>>(
        API_ENDPOINTS.HL_PACKAGE_PRICELIST,
        { data: payload }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteHLPackagPricelist = createAsyncThunk(
  'landPackage/deleteHLPackagPricelist',
  async (payload: { id: string, packageId: string }, { rejectWithValue }) => {
    try {
      const response = await api.delete<ApiResponse<{ houseTotal: number, commissionTotal: number }>>(`${API_ENDPOINTS.HL_PACKAGE_PRICELIST}/${payload.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);