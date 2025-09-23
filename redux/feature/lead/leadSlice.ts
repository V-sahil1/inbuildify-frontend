import { createSlice } from "@reduxjs/toolkit";
import {
  convertLeadToJobThunk,
  convertLeadToOpportunityThunk,
  createLeadContactThunk,
  createLeadSourceThunk,
  createLeadThunk,
  deleteLeadSourceThunk,
  getLeadSourcesThunk,
  getLeadThunk,
  getQuotationsByLeadIdThunk,
  leadConvertThunk,
  leadDeleteThunk,
  transferLeadThunk,
  updateLeadContactThunk,
  updateLeadSourceThunk,
  updateLeadThunk,
} from "./leadThunk";
import { getLeadByIdThunk } from "./leadThunk";
import { InitialState } from "./ILeadState";
import { Status } from "@lib/constants/enum";

const initialState: InitialState = {
  leads: [],
  status: {
    leads: Status.IDLE,
    leadSources: Status.IDLE,
    leadById: Status.IDLE,
    leadQuotations: Status.IDLE,
    updateLeadSource:Status.IDLE
  },
  leadSources: [],
  addInstSourceModal: false,
  leadDetail: {
    lead: null,
    contacts: null,
    property: null,
    createdQuotations: { quotations: [] },
  },
};
export const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    clearLeadDetail: (state) => {
      state.leadDetail = {
        lead: null,
        contacts: null,
        property: null,
        createdQuotations: { quotations: [] },
      };
    },
    setAddInstSourceModal: (state, action) => {
      state.addInstSourceModal = action.payload;
    },
    setLeadProperty: (state, action) => {
      const { builderId, ...propertyWithoutBuilder } = (action.payload ||
        {}) as any;
      state.leadDetail = state.leadDetail ?? ({} as any);
      (state.leadDetail as any).property = propertyWithoutBuilder;
    },
    updateLeadStatus: (state, action) => {
      const { leadId, status, updatedAt } = action.payload;

      // update leads array
      state.leads = state.leads.map((lead) =>
        lead.leadId === leadId ? { ...lead, status, updatedAt } : lead
      );
    },
    removeQuotation: (state, action) => {
      state.leadDetail.createdQuotations.quotations =
        state.leadDetail.createdQuotations.quotations.filter(
          (quotation) => quotation.quotationId !== action.payload
        );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getLeadThunk.pending, (state) => {
      state.status.leads = Status.PENDING;
    });
    builder.addCase(getLeadThunk.fulfilled, (state, action) => {
      state.leads = action.payload;
      state.status.leads = Status.SUCCESS;
    });
    builder.addCase(getLeadThunk.rejected, (state) => {
      state.status.leads = Status.ERROR;
    });
    builder.addCase(getLeadByIdThunk.pending, (state) => {
      state.status.leadById = Status.PENDING;
    });
    builder.addCase(getLeadByIdThunk.fulfilled, (state, action) => {
      const payload: any = action.payload;
      const prop = payload?.property;
      let normalizedProperty = prop;
      if (prop && typeof prop === "object") {
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
      state.status.leadById = Status.SUCCESS;
    });
    builder.addCase(getLeadByIdThunk.rejected, (state) => {
      state.status.leadById = Status.ERROR;
    });
    builder.addCase(createLeadThunk.fulfilled, (state, action) => {
      state.leads.unshift(action.payload);
    });
    builder.addCase(updateLeadThunk.pending, (state) => {
      state.status.updateLeadSource = Status.PENDING;
    });
    builder.addCase(updateLeadThunk.fulfilled, (state, action) => {
      const { leadId, notes, leadSource, updatedByName, updatedAt } =
        action.payload;
      state.leadDetail.lead = action.payload;
      if (state.leads == null) {
        state.leads = [];
      }
      if (state.leads.length === 0) {
        state.leads.push(action.payload);
      } else {
        const lead = state.leads.find((item) => item.leadId === leadId);
        lead.notes = notes;
        lead.leadSource = leadSource;
        lead.updatedByName = updatedByName;
        lead.updatedAt = updatedAt;
      }
      state.status.updateLeadSource = Status.SUCCESS;
    });
    builder.addCase(updateLeadThunk.rejected, (state) => {
      state.status.updateLeadSource = Status.ERROR;
    });

    builder.addCase(leadDeleteThunk.fulfilled, (state, action) => {
      state.leads = state.leads.filter(
        (lead) => lead.leadId !== action.payload.leadId
      );
      state.leadDetail = {
        lead: null,
        contacts: null,
        property: null,
        createdQuotations: { quotations: [] },
      };
    });
    builder.addCase(leadConvertThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.status = "NEW";
      state.leadDetail.createdQuotations.quotations = [];
      state.leads = state.leads.map((lead) => {
        if (lead.leadId === action.payload.leadId) {
          return {
            ...lead,
            status: "NEW",
          };
        }
        return lead;
      });
    });
    builder.addCase(transferLeadThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.assigneeName = action.payload.assignee.name;
    });
    builder.addCase(getQuotationsByLeadIdThunk.pending, (state) => {
      state.status.leadQuotations = Status.PENDING;
    });
    builder.addCase(getQuotationsByLeadIdThunk.fulfilled, (state, action) => {
      state.leadDetail.createdQuotations = action.payload;
      state.status.leadQuotations = Status.SUCCESS;
    });
    builder.addCase(getQuotationsByLeadIdThunk.rejected, (state) => {
      state.status.leadQuotations = Status.ERROR;
    });
    builder.addCase(
      convertLeadToOpportunityThunk.fulfilled,
      (state, action) => {
        state.leadDetail.lead.status = action.payload.status;
        state.leads = state.leads.map((lead) => {
          if (lead.leadId === action.payload.leadId) {
            return {
              ...lead,
              status: action.payload.status,
              updated_at: action.payload.updatedAt,
            };
          }
          return lead;
        });
      }
    );
    builder.addCase(convertLeadToJobThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.status = action.payload.payload.status;
      state.leads = state.leads.map((lead) => {
        if (lead.leadId === action.payload.payload.leadId) {
          return {
            ...lead,
            status:
              action.payload.payload.status === "WON" ? "JOB" : "CANCELLED",
            updatedAt: new Date().toISOString(),
          };
        }
        return lead;
      });
    });
    builder.addCase(updateLeadContactThunk.fulfilled, (state, action) => {
      const { payload } = action;
      if (!state.leadDetail.contacts) {
        state.leadDetail.contacts = [];
      }
      state.leadDetail.contacts = state.leadDetail.contacts.map((contact) => {
        if (contact.leadsContactId === payload.leadsContactId) {
          return {
            ...payload,
          };
        }
        return contact;
      });
    });

    builder.addCase(createLeadContactThunk.fulfilled, (state, action) => {
      const { payload } = action;
      if (!state.leadDetail.contacts) {
        state.leadDetail.contacts = [];
      }
      state.leadDetail.contacts.unshift(payload);
    });

    builder.addCase(getLeadSourcesThunk.pending, (state) => {
      state.status.leadSources = Status.PENDING;
    });
    builder.addCase(getLeadSourcesThunk.fulfilled, (state, action) => {
      state.leadSources = action.payload;
      state.status.leadSources = Status.SUCCESS;
    });
    builder.addCase(getLeadSourcesThunk.rejected, (state) => {
      state.status.leadSources = Status.ERROR;
    });

    builder.addCase(createLeadSourceThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.leadSources.unshift(action.payload.data);
      }
    });
    builder.addCase(updateLeadSourceThunk.fulfilled, (state, action) => {
      const index = state.leadSources.findIndex(
        (service) => service.leadSourceId === action.payload.leadSourceId
      );
      if (index !== -1) {
        state.leadSources[index] = action.payload;
      }
    });
    builder.addCase(deleteLeadSourceThunk.fulfilled, (state, action) => {
      state.leadSources = state.leadSources.filter(
        (service) => service.leadSourceId !== action.payload
      );
    });
  },
});

export const {
  clearLeadDetail,
  setLeadProperty,
  updateLeadStatus,
  setAddInstSourceModal,
  removeQuotation
} = leadSlice.actions;
export const leadReducer = leadSlice.reducer;
