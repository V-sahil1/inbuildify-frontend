import { createSlice } from "@reduxjs/toolkit";
import { convertLeadToJobThunk, convertLeadToOpportunityThunk, createLeadThunk, getLeadThunk, getQuotationsByLeadIdThunk, updateLeadThunk } from "./leadThunk";
import { getLeadByIdThunk } from "./leadThunk";
import { ILead } from "./ILeadState";
import { Status } from "@lib/constants/enum";
import { QuotationResponse } from "../quotation/IQuotationState";

export const leadSlice = createSlice({
    name: "lead",
    initialState: {
        leads:[] as ILead[],
        status: Status.IDLE,
        leadDetail: {
          contact: null,
          property: null,
          createdQuotations: [] as QuotationResponse[],
        },
    },
    reducers: {
      clearLeadDetail: (state) => {
        state.leadDetail = {
          contact: null,
          property: null,
          createdQuotations: [],
        };
        },
        setLeadProperty: (state, action) => {
            const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
            state.leadDetail = state.leadDetail ?? ({} as any);
            (state.leadDetail as any).property = propertyWithoutBuilder;
        },
        updateLeadStatus: (state, action) => {
          const { leadId, status, updatedAt } = action.payload;
    
          // update leads array
          state.leads = state.leads.map((lead) =>
            lead.lead_id === leadId
              ? { ...lead, status, updated_at: updatedAt ?? lead.updated_at }
              : lead
          );
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getLeadThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getLeadThunk.fulfilled, (state, action) => {
            state.leads = action.payload;
            state.status = Status.SUCCESS;
        });
        builder.addCase(getLeadThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(getLeadByIdThunk.pending, (state) => {
            state.status = Status.PENDING;
        });
        builder.addCase(getLeadByIdThunk.fulfilled, (state, action) => {
            const payload: any = action.payload;
            const prop = payload?.property;
            let normalizedProperty = prop;
            if (prop && typeof prop === 'object') {
                normalizedProperty = {
                    propertyId: prop.propertyId ?? prop.property_id,
                    builderId: prop.builderId ?? prop.builder_id,
                    leadId: prop.leadId ?? prop.lead_id,
                    country: prop.country,
                    address1: prop.address1,
                    address2: prop.address2,
                    citySuburb: prop.citySuburb ?? prop.city_suburb,
                    stateRegion: prop.stateRegion ?? prop.state_region,
                    zipPostalCode: prop.zipPostalCode ?? prop.zip_postal_code,
                    estateName: prop.estateName ?? prop.estate_name,
                    titleStatus: prop.titleStatus ?? prop.title_status,
                    titleDate: prop.titleDate ?? prop.title_date,
                    compactionReport: prop.compactionReport ?? prop.compaction_report,
                    landType: prop.landType ?? prop.land_type,
                    widthM: prop.widthM ?? prop.width_m,
                    depthM: prop.depthM ?? prop.depth_m,
                    totalSizeM2: prop.totalSizeM2 ?? prop.total_size_m2,
                    siteFallMm: prop.siteFallMm ?? prop.site_fall_mm,
                    landFillMm: prop.landFillMm ?? prop.land_fill_mm,
                    bushFire: (prop.bushFire ?? prop.bush_fire) as any,
                    cornerBlock: (prop.cornerBlock ?? prop.corner_block) as any,
                    createdAt: prop.createdAt ?? prop.created_at,
                    updatedAt: prop.updatedAt ?? prop.updated_at,
                };
            }
            state.leadDetail = {
                ...payload,
                property: normalizedProperty ?? payload?.property,
            };
            state.status = Status.SUCCESS;
        });
        builder.addCase(getLeadByIdThunk.rejected, (state) => {
            state.status = Status.ERROR;
        });
        builder.addCase(createLeadThunk.fulfilled, (state, action) => {
            state.leads.unshift(action.payload);
        });
        builder.addCase(getQuotationsByLeadIdThunk.pending, (state) => {
          state.status = Status.PENDING;
        });
        builder.addCase(getQuotationsByLeadIdThunk.fulfilled, (state, action) => {
          state.leadDetail.createdQuotations = action.payload;
          state.status = Status.SUCCESS;
        });
        builder.addCase(getQuotationsByLeadIdThunk.rejected, (state) => {
          state.status = Status.ERROR;
        });
        builder.addCase(convertLeadToOpportunityThunk.fulfilled, (state, action) => {
          state.leads = state.leads.map((lead) => {
            if (lead.lead_id === action.payload.leadId) {
              return {
                ...lead,
                status: action.payload.status,
                updated_at: action.payload.updatedAt,
              };
            }
            return lead;
          });
        });
        builder.addCase(convertLeadToJobThunk.fulfilled, (state, action) => {
          state.leadDetail.contact.status = action.payload.payload.status;
            state.leads = state.leads.map((lead) => {
            if (lead.lead_id === action.payload.payload.leadId) {
              return {
                ...lead,
                status: action.payload.payload.status,
              };
            }
            return lead;
          });
        });
        builder.addCase(updateLeadThunk.fulfilled, (state, action) => {
          const { payload } = action;
          if (payload && payload.lead_id) {
            const { lead_id, name, phone, lead_source } = payload;
            
            // Add null check for leadDetail.contact because after the quatation route opens the contact of leads is setting the null (Akshay)
            if (state.leadDetail && state.leadDetail.contact) {
              state.leadDetail.contact.name = name || state.leadDetail.contact.name;
              state.leadDetail.contact.phone = phone || state.leadDetail.contact.phone;
              state.leadDetail.contact.lead_source = lead_source || state.leadDetail.contact.lead_source;
            }
            
            state.leads = state.leads.map((lead) => {
              if (lead.lead_id === lead_id) {
                return {
                  ...lead,
                  name: name || lead.name,
                  phone: phone || lead.phone,
                  lead_source: lead_source || lead.lead_source,
                };
              }
              return lead;
            });
          }
        });
    }
});

export const { clearLeadDetail, setLeadProperty, updateLeadStatus } = leadSlice.actions;
export const leadReducer = leadSlice.reducer;
