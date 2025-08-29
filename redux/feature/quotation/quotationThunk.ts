import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "../auth/IAuthState";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import api from "@lib/constants/api";

type QuotationItemPayload = {
  range: string; // can be a union of possible values
  dwellingType: string; // extend with more if needed
  leadId: string;
  propertyId: string;
  floorPlanId: string;
  facadeId: string;
  packageId: string;
  items: {
    itemId: string;
    quantity: number;
    price: number;
    total: number;
  }[];
};

type QuotationResponse = {
    quotationId: string;
    createdAt: string; // ISO Date string
    updatedAt: string; // ISO Date string
    items: {
      itemId: string;
      quantity: number;
      price: number;
      total: number;
    }[];
    builder: {
      builderId: string;
      name: string;
    };
    lead: {
      leadId: string;
      status:  string; // extend with real statuses
    };
    property: {
      propertyId: string;
      address: string;
    };
    floorPlan: {
      floorPlanId: string;
      name: string;
    };
    facade: {
      facadeId: string;
      name: string;
    };
    package: {
      packageId: string;
      name: string;
    };
    range: {
      rangeId: string;
      name: string;
    };
    dwellingType: {
      dwellingTypeId: string;
      name: string;
    };
  };
  

export const createQuotation = createAsyncThunk(
  "quotation/create",
  async (payload: QuotationItemPayload, { rejectWithValue }) => {
    try {
      const res = await api.post<ApiResponse<QuotationResponse>>(
        API_ENDPOINTS.QUOTATION_BASE,
        { data: payload }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
