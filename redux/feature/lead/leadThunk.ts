import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
import { PropertyDetails } from "@/pages/leads/data/types";

export const getLeadThunk = createAsyncThunk(
    "lead/getLead",
    async (_, {rejectWithValue}) => {
        try {
            const response: ApiResponse<any> = await api.get(API_ENDPOINTS.LEAD_BASE);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const createLeadThunk = createAsyncThunk(
    "lead/createLead",
    async (payload: { name: string; email: string; phone: string; leadSource: string }, {rejectWithValue}) => {
        try {
            const response: ApiResponse<any> = await api.post(API_ENDPOINTS.LEAD_BASE, { data: payload });
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getLeadByIdThunk = createAsyncThunk(
    "lead/getLeadById",
    async (leadId: string, {rejectWithValue}) => {
        try {
            const response: ApiResponse<any> = await api.get(API_ENDPOINTS.GET_LEAD_BY_ID(leadId));
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const updatePropertyDetailsThunk = createAsyncThunk(
    "lead/updatePropertyDetails",
    async ({ leadId, propertyDetails }: { leadId: string; propertyDetails: PropertyDetails }, { rejectWithValue }) => {
        try {
            const response: ApiResponse<any> = await api.put(
                `${API_ENDPOINTS.LEAD_BASE}/${leadId}/property-details`,
                { data: propertyDetails }
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);