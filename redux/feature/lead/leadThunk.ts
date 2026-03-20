import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@lib/constants/api';
import API_ENDPOINTS from '@lib/constants/apiEndpoints';
import { ApiResponse } from '../auth/IAuthState';
// import { PropertyDetails } from "data/types";
import {
  ILeadContact,
  LeadSourceRequest,
  LeadSource,
  Lead,
  BusinessContact,
  LeadContact,
  ILeadJob,
  InvoiceDetails,
  PropertyDetail,
} from './ILeadState';
import { leadDetails } from 'data/sampleData';
export interface createLeadPayload {
  name: string;
  email?: string;
  phone?: string;
  leadSourceId?: string;
  notes: string;
  sendLetter: boolean;
  forceCreate?: boolean;
}

export const getLeadThunk = createAsyncThunk('lead/getLead', async (_, { rejectWithValue }) => {
  try {
    const response: ApiResponse<{ leads: Lead[] }> = await api.get(API_ENDPOINTS.LEAD_BASE);
    return response.data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const createLeadThunk = createAsyncThunk(
  'lead/createLead',
  async (payload: createLeadPayload, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.post(API_ENDPOINTS.LEAD_BASE, { data: payload });
      return response.data;
    } catch (err) {
      if (err?.data?.statusCode === 409) {
        return rejectWithValue({
          isConflict: true,
          message: 'Email already exists',
          email: payload.email,
        });
      }
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const getLeadByIdThunk = createAsyncThunk(
  'lead/getLeadById',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.get(API_ENDPOINTS.GET_LEAD_BY_ID(leadId));
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateLeadContactThunk = createAsyncThunk(
  'lead/updateLeadContact',
  async (
    payload: {
      id: string;
      details: { name: string; phone: string; leadSource: string };
    },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<LeadContact> = await api.put(
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
  'lead/createLeadContact',
  async (
    payload: { id: string; details: { name: string; phone: string; leadSource: string } },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<ILeadContact> = await api.post(
        `${API_ENDPOINTS.LEAD_CONTACT}/${payload.id}`,
        { data: payload.details }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const updateLeadThunk = createAsyncThunk(
  'lead/updateLead',
  async (payload: { id: string; details: Partial<Lead> }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<Lead> = await api.put(
        `${API_ENDPOINTS.LEAD_BASE}/${payload.id}`,
        {
          data: payload.details,
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const deleteHLPackageThunk = createAsyncThunk(
  'lead/deleteHLPackage',
  async (
    payload: { leadsId: string; removeHlPackageLotQuotation?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse = await api.delete(
        API_ENDPOINTS.DELETE_LEAD_HLPACKAGE(payload.leadsId),
        {
          data: { removeHlPackageLotQuotation: payload.removeHlPackageLotQuotation },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const leadDeleteThunk = createAsyncThunk(
  'lead/leadDelete',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.delete(`${API_ENDPOINTS.LEAD_BASE}/${leadId}`);
      return { data: response.data, leadId };
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);
export const leadConvertThunk = createAsyncThunk(
  'lead/leadConvert',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.post(API_ENDPOINTS.LEAD_CONVERT(leadId));
      return { data: response.data, leadId };
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const transferLeadThunk = createAsyncThunk(
  'lead/transferLead',
  async (payload: { leadId: string; assigneeId: string; assigneeNote: string; notes?: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.put(
        API_ENDPOINTS.LEAD_ASSIGN(payload.leadId),
        {
          data: {
            assigneeId: payload.assigneeId,
            assigneeNote: payload.assigneeNote,
          },
        }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err?.message);
    }
  }
);

export const updatePropertyDetailsThunk = createAsyncThunk(
  'lead/updatePropertyDetails',
  async (payload: any, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.post(`${API_ENDPOINTS.PROPERTY_BASE}`, {
        data: payload,
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const convertLeadToOpportunityThunk = createAsyncThunk(
  'lead/convertLeadToOpportunity',
  async (payload: { leadId: string; opportunityNotes: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.post(
        API_ENDPOINTS.CONVERT_LEAD_TO_OPPORTUNITY(payload.leadId),
        { data: { opportunityNotes: payload.opportunityNotes } }
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const convertLeadToJobThunk = createAsyncThunk(
  'lead/convertLeadToJob',
  async (
    payload: { leadId: string; message: string; status: string; quotation_version_id?: string },
    { rejectWithValue }
  ) => {
    try {
      const response: ApiResponse<any> = await api.post(
        `${API_ENDPOINTS.CONVERT_LEAD_TO_JOB}/${payload.leadId}`,
        {
          data: {
            message: payload.message,
            status: payload.status,
            quotation_version_id: payload?.quotation_version_id,
          },
        }
      );
      return { response, payload };
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const getQuotationsByLeadIdThunk = createAsyncThunk(
  'lead/getQuotationsByLeadId',
  async (payload: { leadId: string; page: number; limit: number }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<any> = await api.get(
        API_ENDPOINTS.GET_QUOTATIONS_BY_LEAD_ID(payload.leadId, payload.page, payload.limit)
      );
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---- Create ----
export const createLeadSourceThunk = createAsyncThunk(
  'leadSource/create',
  async (payload: LeadSourceRequest, { rejectWithValue }) => {
    try {
      const response: ApiResponse<LeadSource> = await api.post(API_ENDPOINTS.LEAD_SOURCE, {
        data: payload,
      });
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---- Get All ----
export const getLeadSourcesThunk = createAsyncThunk(
  'leadSource/getAll',
  async (_, { rejectWithValue }) => {
    try {
      const response: ApiResponse<LeadSource[]> = await api.get(API_ENDPOINTS.LEAD_SOURCE);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// ---- Get By Id ----
export const getLeadSourceByIdThunk = createAsyncThunk(
  'leadSource/getById',
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
  'leadSource/update',
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
  'leadSource/delete',
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

// lead business contact

export const createBusinessContactThunk = createAsyncThunk(
  'businessContact/create',
  async (payload: BusinessContact, { rejectWithValue }) => {
    try {
      const response: ApiResponse<BusinessContact> = await api.post(
        API_ENDPOINTS.LEAD_BUSINESS_CONTACT,
        {
          data: payload,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getBusinessContactByIdThunk = createAsyncThunk(
  'businessContact/getById',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<BusinessContact[]> = await api.get(
        API_ENDPOINTS.LEAD_BUSINESS_CONTACT_BY_ID(leadsId)
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateBusinessContactThunk = createAsyncThunk(
  'businessContact/update',
  async ({ id, payload }: { id: string; payload: BusinessContact }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<BusinessContact> = await api.put(
        `${API_ENDPOINTS.LEAD_BUSINESS_CONTACT}/${id}`,
        { data: payload }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteBusinessContactThunk = createAsyncThunk(
  'businessContact/delete',
  async (payload: { leadsId: string; id: string; contactType: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await api.delete(
        `${API_ENDPOINTS.LEAD_BUSINESS_CONTACT}/${payload.id}`
      );
      return;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// lead business contact

export const createLeadContactMapThunk = createAsyncThunk(
  'leadContactMap/create',
  async (payload: { leadsId: string; contactId: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<LeadContact> = await api.post(API_ENDPOINTS.LEAD_CONTACT_MAP, {
        data: payload,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getLeadContactMapThunk = createAsyncThunk(
  'leadContactMap/get',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<LeadContact[]> = await api.get(
        API_ENDPOINTS.LEAD_CONTACT_MAP + '/' + leadsId
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLeadContactMapThunk = createAsyncThunk(
  'leadContactMap/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await api.delete(`${API_ENDPOINTS.LEAD_CONTACT_MAP}/${id}`);
      return;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// lead job

export const createLeadJobThunk = createAsyncThunk(
  'leadJob/create',
  async (payload: ILeadJob, { rejectWithValue }) => {
    try {
      const response: ApiResponse<ILeadJob> = await api.post(API_ENDPOINTS.LEAD_JOB, {
        data: payload,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getLeadJobThunk = createAsyncThunk(
  'leadJob/get',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<ILeadJob> = await api.get(API_ENDPOINTS.LEAD_JOB + '/' + leadsId);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateLeadJobThunk = createAsyncThunk(
  'leadJob/update',
  async (payload: { data: Partial<ILeadJob>; id: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<ILeadJob> = await api.put(
        `${API_ENDPOINTS.LEAD_JOB}/${payload.id}`,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLeadJobThunk = createAsyncThunk(
  'leadJob/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await api.delete(`${API_ENDPOINTS.LEAD_JOB}/${id}`);
      return;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// lead deposit

export const createLeadInvoiceThunk = createAsyncThunk(
  'leadInvoice/create',
  async (payload: InvoiceDetails, { rejectWithValue }) => {
    try {
      const response: ApiResponse<InvoiceDetails> = await api.post(API_ENDPOINTS.LEAD_INVOICE, {
        data: payload,
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getLeadInvoiceThunk = createAsyncThunk(
  'leadInvoice/get',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<InvoiceDetails[]> = await api.get(
        API_ENDPOINTS.LEAD_INVOICE_BY_ID + '/' + leadsId
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLeadInvoiceThunk = createAsyncThunk(
  'leadInvoice/delete',
  async (leadId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await api.delete(
        `${API_ENDPOINTS.LEAD_INVOICE_BY_ID}/${leadId}`
      );
      return;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

//lead property

export const createLeadProperty = createAsyncThunk(
  'property/create',
  async (payload: { data: PropertyDetail; leadId: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<PropertyDetail> = await api.post(
        API_ENDPOINTS.LEAD_PROPERTY + '/' + payload.leadId,
        {
          data: payload.data,
        }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const getLeadProperty = createAsyncThunk(
  'property/getById',
  async (leadsId: string, { rejectWithValue }) => {
    try {
      const response: ApiResponse<PropertyDetail> = await api.get(
        API_ENDPOINTS.LEAD_PROPERTY + '/' + leadsId
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateLeadProperty = createAsyncThunk(
  'property/update',
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const response: ApiResponse<PropertyDetail> = await api.put(
        `${API_ENDPOINTS.LEAD_PROPERTY}/${id}`,
        { data: payload }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteLeadProperty = createAsyncThunk(
  'property/delete',
  async (payload: { leadsId: string; id: string; contactType: string }, { rejectWithValue }) => {
    try {
      const response: ApiResponse = await api.delete(
        `${API_ENDPOINTS.LEAD_PROPERTY}/${payload.id}`
      );
      return;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);
