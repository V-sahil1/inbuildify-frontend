import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@lib/constants/api";
import API_ENDPOINTS from "@lib/constants/apiEndpoints";
import { ApiResponse } from "../auth/IAuthState";
// import { PropertyDetails } from "data/types";
import { ILeadContact, LeadSourceRequest, LeadSource } from "./ILeadState";

export interface createLeadPayload {
    lead_source: string;
    notes: string;
    contact: {
        name: string;
        email?: string;
        phone?: string;
    };
}

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
    async (payload: createLeadPayload, {rejectWithValue}) => {
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

export const updateLeadContactThunk = createAsyncThunk(
  "lead/updateLeadContact",
  async (
    payload: {
      id: string;
      details: { name: string; phone: string; leadSource: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<ILeadContact> = await api.put(
        `${API_ENDPOINTS.LEAD_CONTACT}/${payload.id}`,
        { data: payload.details }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const createLeadContactThunk = createAsyncThunk(
    "lead/createLeadContact",
    async (payload: {id:string, details:{name:string, phone:string, leadSource:string}}, { rejectWithValue }) => {
        try {
            const response: ApiResponse<ILeadContact> = await api.post(
                `${API_ENDPOINTS.LEAD_CONTACT}/${payload.id}`,
                {data: payload.details}
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err?.message);
        }
    }
);
// export const updateLeadThunk = createAsyncThunk(
//     "lead/updateLead",
//     async (payload: {id:string, details:{name:string, phone:string, leadSource:string}}, { rejectWithValue }) => {
//         try {
//             const response: ApiResponse<any> = await api.post(
//                 `${API_ENDPOINTS.LEAD_BASE}/${payload.id}`,
//                 {data: payload.details}
//             );
//             return response.data;
//         } catch (err: any) {
//             return rejectWithValue(err?.message);
//         }
//     }
// );

export const updatePropertyDetailsThunk = createAsyncThunk(
    "lead/updatePropertyDetails",
    async (payload: any, { rejectWithValue }) => {
        try {
            const response: ApiResponse<any> = await api.post(
                `${API_ENDPOINTS.PROPERTY_BASE}`,
                {data: payload}
            );
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const convertLeadToOpportunityThunk = createAsyncThunk(
    "lead/convertLeadToOpportunity",
    async (leadId: string, {rejectWithValue}) => {
        try {
            const response: ApiResponse<any> = await api.post(`${API_ENDPOINTS.CONVERT_LEAD_TO_OPPORTUNITY}/${leadId}`);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const convertLeadToJobThunk = createAsyncThunk(
    "lead/convertLeadToJob",
    async (payload: { leadId: string, message: string, status: string }, { rejectWithValue }) => {
        try {
            const response: ApiResponse<any> = await api.post(`${API_ENDPOINTS.CONVERT_LEAD_TO_JOB}/${payload.leadId}`, {
                data: {
                    message: payload.message,
                    status: payload.status
                }
            });
            return {response , payload};
        } catch (err: any) {
            return rejectWithValue(err.message);
        }
    }
);

export const getQuotationsByLeadIdThunk = createAsyncThunk(
  "lead/getQuotationsByLeadId",
  async (
    payload: { leadId: string; page: number; limit: number },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<any> = await api.get(
        API_ENDPOINTS.GET_QUOTATIONS_BY_LEAD_ID(payload.leadId,payload.page,payload.limit)
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---- Create ----
export const createLeadSourceThunk = createAsyncThunk(
    "leadSource/create",
    async (payload: LeadSourceRequest, { rejectWithValue }) => {
      try {
        const response: ApiResponse<LeadSource> = await api.post(
          API_ENDPOINTS.LEAD_SOURCE,
          { data: payload }
        );
        return response;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  // ---- Get All ----
  export const getLeadSourcesThunk = createAsyncThunk(
    "leadSource/getAll",
    async (_, { rejectWithValue }) => {
      try {
        const response: ApiResponse<LeadSource[]> = await api.get(
          API_ENDPOINTS.LEAD_SOURCE
        );
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  // ---- Get By Id ----
  export const getLeadSourceByIdThunk = createAsyncThunk(
    "leadSource/getById",
    async (leadSourceId: string, { rejectWithValue }) => {
      try {
        const response: ApiResponse<LeadSource> = await api.get(
          `${API_ENDPOINTS.LEAD_SOURCE}/${leadSourceId}`
        );
        return response;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  // ---- Update ----
  export const updateLeadSourceThunk = createAsyncThunk(
    "leadSource/update",
    async (
      { leadSourceId, payload }: { leadSourceId: string; payload: LeadSourceRequest },
      { rejectWithValue }
    ) => {
      try {
        const response: ApiResponse<LeadSource> = await api.put(
          `${API_ENDPOINTS.LEAD_SOURCE}/${leadSourceId}`,
          { data: payload }
        );
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  // ---- Delete ----
  export const deleteLeadSourceThunk = createAsyncThunk(
    "leadSource/delete",
    async (leadSourceId: string, { rejectWithValue }) => {
      try {
        const response: ApiResponse<any> = await api.delete(
          `${API_ENDPOINTS.LEAD_SOURCE}/${leadSourceId}`
        );
        return leadSourceId;
      } catch (err: any) {
        return rejectWithValue(err.message);
      }
    }
  );