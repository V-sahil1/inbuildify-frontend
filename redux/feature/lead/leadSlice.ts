import { createSlice } from '@reduxjs/toolkit';
import {
  convertLeadToJobThunk,
  convertLeadToOpportunityThunk,
  createBusinessContactThunk,
  createLeadContactMapThunk,
  createLeadContactThunk,
  createLeadInvoiceThunk,
  createLeadJobThunk,
  createLeadProperty,
  createLeadSourceThunk,
  createLeadThunk,
  deleteBusinessContactThunk,
  deleteHLPackageThunk,
  deleteLeadContactMapThunk,
  deleteLeadInvoiceThunk,
  deleteLeadJobThunk,
  deleteLeadProperty,
  deleteLeadSourceThunk,
  getBusinessContactByIdThunk,
  getLeadContactMapThunk,
  getLeadInvoiceThunk,
  getLeadJobThunk,
  getLeadProperty,
  getLeadSourcesThunk,
  getLeadThunk,
  getQuotationsByLeadIdThunk,
  leadConvertThunk,
  leadDeleteThunk,
  transferLeadThunk,
  updateBusinessContactThunk,
  updateLeadContactThunk,
  updateLeadJobThunk,
  updateLeadProperty,
  updateLeadSourceThunk,
  updateLeadThunk,
} from './leadThunk';
import { getLeadByIdThunk } from './leadThunk';
import { InitialState } from './ILeadState';
import { Status } from '@lib/constants/enum';
import { updateContact } from '../contacts/contactThunk';
import { getQuotationThunk } from '../quotation/quotationThunk';
import { actionAsyncStorage } from 'next/dist/client/components/action-async-storage-instance';

const initialState: InitialState = {
  leads: [],
  status: {
    leads: Status.IDLE,
    leadSources: Status.IDLE,
    leadById: Status.IDLE,
    leadQuotations: Status.IDLE,
    updateLeadSource: Status.IDLE,
    leadContact: Status.IDLE,
    leadJob: Status.IDLE,
    leadDeposit: Status.IDLE,
  },
  leadSources: [],
  addInstSourceModal: false,
  leadDetail: {
    lead: null,
    contacts: null,
    property: null,
    createdQuotations: { quotations: [] },
    job: null,
    invoice: [],
  },
};
export const leadSlice = createSlice({
  name: 'lead',
  initialState,
  reducers: {
    clearLeadDetail: state => {
      state.leadDetail = {
        lead: null,
        contacts: null,
        property: null,
        createdQuotations: { quotations: [] },
        job: null,
        invoice: [],
      };
    },
    setAddInstSourceModal: (state, action) => {
      state.addInstSourceModal = action.payload;
    },
    setLeadProperty: (state, action) => {
      const { builderId, ...propertyWithoutBuilder } = (action.payload || {}) as any;
      state.leadDetail = state.leadDetail ?? ({} as any);
      (state.leadDetail as any).property = propertyWithoutBuilder;
    },
    updateLeadStatus: (state, action) => {
      const { leadId, status, updatedAt } = action.payload;

      // update leads array
      state.leads = state.leads.map(lead =>
        lead.leadsId === leadId ? { ...lead, status, updatedAt } : lead
      );
    },
    removeQuotation: (state, action) => {
      state.leadDetail.createdQuotations.quotations =
        state.leadDetail.createdQuotations.quotations.filter(
          quotation => quotation.quotationId !== action.payload
        );
    },
  },
  extraReducers: builder => {
    builder.addCase(getLeadThunk.pending, state => {
      state.status.leads = Status.PENDING;
    });
    builder.addCase(getLeadThunk.fulfilled, (state, action) => {
      state.leads = action.payload.leads;
      state.status.leads = Status.SUCCESS;
    });
    builder.addCase(getLeadThunk.rejected, state => {
      state.status.leads = Status.ERROR;
    });
    builder.addCase(getLeadByIdThunk.pending, state => {
      state.status.leadById = Status.PENDING;
    });
    builder.addCase(getLeadByIdThunk.fulfilled, (state, action) => {
      const payload: any = action.payload;
      // const prop = payload?.property;
      // let normalizedProperty = prop;
      // if (prop && typeof prop === 'object') {
      //   normalizedProperty = {
      //     propertyId: prop.propertyId ?? prop.property_id,
      //     builderId: prop.builderId ?? prop.builder_id,
      //     leadId: prop.leadId ?? prop.lead_id,
      //     country: prop.country,
      //     address1: prop.address1,
      //     address2: prop.address2,
      //     citySuburb: prop.citySuburb ?? prop.city_suburb,
      //     stateRegion: prop.stateRegion ?? prop.state_region,
      //     zipPostalCode: prop.zipPostalCode ?? prop.zip_postal_code,
      //     estateName: prop.estateName ?? prop.estate_name,
      //     titleStatus: prop.titleStatus ?? prop.title_status,
      //     titleDate: prop.titleDate ?? prop.title_date,
      //     compactionReport: prop.compactionReport ?? prop.compaction_report,
      //     landType: prop.landType ?? prop.land_type,
      //     widthM: prop.widthM ?? prop.width_m,
      //     depthM: prop.depthM ?? prop.depth_m,
      //     totalSizeM2: prop.totalSizeM2 ?? prop.total_size_m2,
      //     siteFallMm: prop.siteFallMm ?? prop.site_fall_mm,
      //     landFillMm: prop.landFillMm ?? prop.land_fill_mm,
      //     bushFire: (prop.bushFire ?? prop.bush_fire) as any,
      //     cornerBlock: (prop.cornerBlock ?? prop.corner_block) as any,
      //     createdAt: prop.createdAt ?? prop.created_at,
      //     updatedAt: prop.updatedAt ?? prop.updated_at,
      //   };
      // }
      state.leadDetail = {
        // ...payload,
        lead: payload,
        contacts: null,
        property: null,
        job: null,
        invoice: [],
        createdQuotations: { quotations: [] },
      };
      state.status.leadById = Status.SUCCESS;
    });
    builder.addCase(getLeadByIdThunk.rejected, state => {
      state.status.leadById = Status.ERROR;
    });
    builder.addCase(createLeadThunk.fulfilled, (state, action) => {
      state.leads.unshift(action.payload);
    });
    builder.addCase(updateLeadThunk.pending, state => {
      state.status.updateLeadSource = Status.PENDING;
    });
    builder.addCase(updateLeadThunk.fulfilled, (state, action) => {
      state.leadDetail.lead = { ...state.leadDetail.lead, ...action.payload };
      const lotDetails = action.payload.lotDetails;
      if (!!lotDetails && !!action.payload?.houseLandPackageDetails) {
        state.leadDetail.property = {
          ...lotDetails,
          landType: lotDetails.lotType,
          propertyDetailId: lotDetails?.lotId,
        };
      }
      if (state.leads == null) {
        state.leads = [];
      }
      if (state.leads.length === 0) {
        state.leads.push(action.payload);
      } else {
        state.leads = state.leads.map(item =>
          item.leadsId === action.payload.leadsId ? { ...item, ...action.payload } : item
        );
      }
      state.status.updateLeadSource = Status.SUCCESS;
    });
    builder.addCase(updateLeadThunk.rejected, state => {
      state.status.updateLeadSource = Status.ERROR;
    });

    builder.addCase(deleteHLPackageThunk.pending, state => {
      state.status.updateLeadSource = Status.ERROR;
    });
    builder.addCase(deleteHLPackageThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.houseLandPackageDetails = null;
      if (action.meta.arg.removeHlPackageLotQuotation && state.leadDetail.lead?.lotDetails) {
        state.leadDetail.property = null;
      }
      state.status.updateLeadSource = Status.SUCCESS;
    });
    builder.addCase(deleteHLPackageThunk.rejected, state => {
      state.status.updateLeadSource = Status.ERROR;
    });

    builder.addCase(leadDeleteThunk.fulfilled, (state, action) => {
      state.leads = state.leads.filter(lead => lead.leadsId !== action.payload.leadId);
      state.leadDetail = {
        lead: null,
        contacts: null,
        property: null,
        job: null,
        invoice: [],
        createdQuotations: { quotations: [] },
      };
    });
    builder.addCase(leadConvertThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.status = 'NEW';
      state.leadDetail.createdQuotations.quotations = [];
      state.leads = state.leads.map(lead => {
        if (lead.leadsId === action.payload.leadId) {
          return {
            ...lead,
            status: 'NEW',
          };
        }
        return lead;
      });
    });
    builder.addCase(transferLeadThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.assigneeId = action.payload?.assigneeId;
    });
    builder.addCase(getQuotationsByLeadIdThunk.pending, state => {
      state.status.leadQuotations = Status.PENDING;
    });
    builder.addCase(getQuotationsByLeadIdThunk.fulfilled, (state, action) => {
      state.leadDetail.createdQuotations = action.payload;
      state.status.leadQuotations = Status.SUCCESS;
    });
    builder.addCase(getQuotationsByLeadIdThunk.rejected, state => {
      state.status.leadQuotations = Status.ERROR;
    });
    builder.addCase(convertLeadToOpportunityThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.status = action.payload.status;
      state.leads = state.leads.map(lead => {
        if (lead.leadsId === action.payload.leadsId) {
          return {
            ...lead,
            status: action.payload.status,
            updatedAt: action.payload.updatedAt,
          };
        }
        return lead;
      });
    });
    builder.addCase(convertLeadToJobThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.status = action.payload.payload.status;
      state.leads = state.leads.map(lead => {
        if (lead.leadsId === action.payload.payload.leadId) {
          return {
            ...lead,
            status: action.payload.payload.status === 'WON' ? 'JOB' : 'CANCELLED',
            updatedAt: new Date().toISOString(),
          };
        }
        return lead;
      });
    });
    builder.addCase(updateLeadContactThunk.fulfilled, (state, action) => {
      const { payload } = action;
      if (!state.leadDetail.contacts) {
        // state.leadDetail.contacts = [];
      }
      // state.leadDetail.contacts = state.leadDetail.contacts.map(contact => {
      //   if (contact.leadsContactId === payload.leadsContactId) {
      //     return {
      //       ...payload,
      //     };
      //   }
      //   return contact;
      // });
    });

    builder.addCase(createLeadContactThunk.fulfilled, (state, action) => {
      const { payload } = action;
      if (!state.leadDetail.contacts) {
        // state.leadDetail.contacts = [];
      }
      // state.leadDetail.contacts.unshift(payload);
    });

    builder.addCase(getLeadSourcesThunk.pending, state => {
      state.status.leadSources = Status.PENDING;
    });
    builder.addCase(getLeadSourcesThunk.fulfilled, (state, action) => {
      state.leadSources = action.payload;
      state.status.leadSources = Status.SUCCESS;
    });
    builder.addCase(getLeadSourcesThunk.rejected, state => {
      state.status.leadSources = Status.ERROR;
    });

    builder.addCase(createLeadSourceThunk.fulfilled, (state, action) => {
      if (action.payload) {
        state.leadSources.unshift(action.payload.data);
      }
    });
    builder.addCase(updateLeadSourceThunk.fulfilled, (state, action) => {
      const index = state.leadSources.findIndex(
        service => service.leadSourceId === action.payload.leadSourceId
      );
      if (index !== -1) {
        state.leadSources[index] = action.payload;
      }
    });
    builder.addCase(deleteLeadSourceThunk.fulfilled, (state, action) => {
      state.leadSources = state.leadSources.filter(
        service => service.leadSourceId !== action.payload
      );
    });

    //lead business contact
    builder.addCase(createBusinessContactThunk.fulfilled, (state, action) => {
      const lead = state.leads.find(lead => lead.leadsId === action.payload.leadsId);
      if (lead) {
        action.payload.contactType === 'company'
          ? (lead.company = action.payload)
          : action.payload.contactType === 'conveyancer'
            ? (lead.conveyancer = action.payload)
            : action.payload.contactType === 'mortgage_broker'
              ? (lead.mortgageBroker = action.payload)
              : action.payload.contactType === 'financer'
                ? (lead.financer = action.payload)
                : null;
      }
      state.leadDetail.lead.conveyancer =
        action.payload.contactType === 'conveyancer'
          ? action.payload
          : state.leadDetail.lead.conveyancer;
      state.leadDetail.lead.mortgageBroker =
        action.payload.contactType === 'mortgage_broker'
          ? action.payload
          : state.leadDetail.lead.mortgageBroker;
      state.leadDetail.lead.financer =
        action.payload.contactType === 'financer' ? action.payload : state.leadDetail.lead.financer;
      state.leadDetail.lead.company =
        action.payload.contactType === 'company' ? action.payload : state.leadDetail.lead.company;
    });

    builder.addCase(getBusinessContactByIdThunk.fulfilled, (state, action) => {
      action.payload?.map(i => {
        switch (i.contactType) {
          case 'conveyancer':
            state.leadDetail.lead.conveyancer = i;
            break;
          case 'mortgage_broker':
            state.leadDetail.lead.mortgageBroker = i;
            break;
          case 'financer':
            state.leadDetail.lead.financer = i;
            break;
          case 'company':
            state.leadDetail.lead.company = i;
            break;
        }
      });
    });
    builder.addCase(updateBusinessContactThunk.fulfilled, (state, action) => {
      switch (action.payload.contactType) {
        case 'conveyancer':
          state.leadDetail.lead.conveyancer = action.payload;
          break;
        case 'mortgage_broker':
          state.leadDetail.lead.mortgageBroker = action.payload;
          break;
        case 'financer':
          state.leadDetail.lead.financer = action.payload;
          break;
        case 'company':
          state.leadDetail.lead.company = action.payload;
          break;
      }
    });
    builder.addCase(deleteBusinessContactThunk.fulfilled, (state, action) => {
      state.leadDetail.lead.conveyancer =
        action.meta.arg.contactType === 'conveyancer' ? null : state.leadDetail.lead.conveyancer;
      state.leadDetail.lead.mortgageBroker =
        action.meta.arg.contactType === 'mortgage_broker'
          ? null
          : state.leadDetail.lead.mortgageBroker;
      state.leadDetail.lead.financer =
        action.meta.arg.contactType === 'financer' ? null : state.leadDetail.lead.financer;
      state.leadDetail.lead.company =
        action.meta.arg.contactType === 'company' ? null : state.leadDetail.lead.company;
    });

    //lead contact map
    builder.addCase(createLeadContactMapThunk.pending, state => {
      state.status.leadContact = Status.PENDING;
    });
    builder.addCase(createLeadContactMapThunk.fulfilled, (state, action) => {
      state.leadDetail.contacts = action.payload || null;
      state.status.leadContact = Status.SUCCESS;
    });
    builder.addCase(createLeadContactMapThunk.rejected, state => {
      state.status.leadContact = Status.ERROR;
    });
    builder.addCase(getLeadContactMapThunk.pending, state => {
      state.status.leadContact = Status.PENDING;
    });
    builder.addCase(getLeadContactMapThunk.fulfilled, (state, action) => {
      state.leadDetail.contacts = action.payload || null;
      state.status.leadContact = Status.SUCCESS;
    });
    builder.addCase(getLeadContactMapThunk.rejected, state => {
      state.status.leadContact = Status.ERROR;
    });
    builder.addCase(updateContact.pending, state => {
      state.status.leadContact = Status.PENDING;
    });
    builder.addCase(updateContact.fulfilled, (state, action) => {
      state.leadDetail.contacts = { ...state.leadDetail.contacts, ...action.payload };
      state.status.leadContact = Status.SUCCESS;
    });
    builder.addCase(updateContact.rejected, state => {
      state.status.leadContact = Status.ERROR;
    });
    builder.addCase(deleteLeadContactMapThunk.pending, state => {
      state.status.leadContact = Status.PENDING;
    });
    builder.addCase(deleteLeadContactMapThunk.fulfilled, state => {
      state.leadDetail.contacts = null;
      state.status.leadContact = Status.SUCCESS;
    });
    builder.addCase(deleteLeadContactMapThunk.rejected, state => {
      state.status.leadContact = Status.ERROR;
    });

    //lead job
    builder.addCase(createLeadJobThunk.pending, state => {
      state.status.leadJob = Status.PENDING;
    });
    builder.addCase(createLeadJobThunk.fulfilled, (state, action) => {
      state.leadDetail.job = action.payload;
      state.status.leadJob = Status.SUCCESS;
    });
    builder.addCase(createLeadJobThunk.rejected, state => {
      state.status.leadJob = Status.ERROR;
    });
    builder.addCase(getLeadJobThunk.pending, state => {
      state.status.leadJob = Status.PENDING;
    });
    builder.addCase(getLeadJobThunk.fulfilled, (state, action) => {
      state.leadDetail.job = action.payload;
      state.status.leadJob = Status.SUCCESS;
    });
    builder.addCase(getLeadJobThunk.rejected, state => {
      state.status.leadJob = Status.ERROR;
    });
    builder.addCase(updateLeadJobThunk.pending, state => {
      state.status.leadJob = Status.PENDING;
    });
    builder.addCase(updateLeadJobThunk.fulfilled, (state, action) => {
      state.leadDetail.job = action.payload;
      state.status.leadJob = Status.SUCCESS;
    });
    builder.addCase(updateLeadJobThunk.rejected, state => {
      state.status.leadJob = Status.ERROR;
    });
    builder.addCase(deleteLeadJobThunk.pending, (state, action) => {
      state.status.leadJob = Status.PENDING;
    });

    builder.addCase(deleteLeadJobThunk.fulfilled, (state, action) => {
      state.leadDetail.job = null;
      state.status.leadJob = Status.SUCCESS;
    });
    builder.addCase(deleteLeadJobThunk.rejected, (state, action) => {
      state.status.leadJob = Status.ERROR;
    });

    //lead invoice
    builder.addCase(createLeadInvoiceThunk.pending, (state, action) => {
      state.status.leadDeposit = Status.PENDING;
    });
    builder.addCase(createLeadInvoiceThunk.fulfilled, (state, action) => {
      state.status.leadDeposit = Status.SUCCESS;
      state.leadDetail.invoice.push(action.payload);
    });
    builder.addCase(createLeadInvoiceThunk.rejected, (state, action) => {
      state.status.leadDeposit = Status.ERROR;
    });
    builder.addCase(getLeadInvoiceThunk.pending, (state, action) => {
      state.status.leadDeposit = Status.PENDING;
    });
    builder.addCase(getLeadInvoiceThunk.fulfilled, (state, action) => {
      state.status.leadDeposit = Status.SUCCESS;
      state.leadDetail.invoice = action.payload;
    });
    builder.addCase(getLeadInvoiceThunk.rejected, (state, action) => {
      state.status.leadDeposit = Status.ERROR;
    });
    builder.addCase(deleteLeadInvoiceThunk.pending, (state, action) => {
      state.status.leadDeposit = Status.PENDING;
    });
    builder.addCase(deleteLeadInvoiceThunk.fulfilled, (state, action) => {
      state.status.leadDeposit = Status.SUCCESS;
    });
    builder
      .addCase(deleteLeadInvoiceThunk.rejected, (state, action) => {
        state.status.leadDeposit = Status.ERROR;
      })

      //quotation
      .addCase(getQuotationThunk.fulfilled, (state, action) => {
        state.leadDetail.createdQuotations.quotations = action.payload;
      });

    //lead property
    builder.addCase(getLeadProperty.fulfilled, (state, action) => {
      state.leadDetail.property = action.payload;
    });
    builder.addCase(updateLeadProperty.fulfilled, (state, action) => {
      state.leadDetail.property = action.payload;
    });
    builder.addCase(deleteLeadProperty.fulfilled, (state, action) => {
      // state.leadDetail.property = action.payload;
    });
    builder.addCase(createLeadProperty.fulfilled, (state, action) => {
      state.leadDetail.property = action.payload;
    });
  },
});

export const {
  clearLeadDetail,
  setLeadProperty,
  updateLeadStatus,
  setAddInstSourceModal,
  removeQuotation,
} = leadSlice.actions;
export const leadReducer = leadSlice.reducer;
