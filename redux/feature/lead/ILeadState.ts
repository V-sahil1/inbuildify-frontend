import { LeadDetails, PropertyDetails } from 'data/types';
import { QuotationResponse } from '../quotation/IQuotationState';
import { Status } from '@lib/constants/enum';

export interface InitialState {
  leads: Lead[];
  status: {
    leads: Status;
    leadSources: Status;
    leadById: Status;
    leadQuotations: Status;
    updateLeadSource: Status;
  };
  leadSources: LeadSource[];
  addInstSourceModal: boolean;
  leadDetail: {
    lead: Lead | null;
    contacts: ILeadContact[] | null;
    property: any | null;
    createdQuotations: { quotations: QuotationResponse[] };
  };
}
export interface ILead {
  slugId?: string;
  leadId: string;
  builderId: string;
  status: string;
  leadSource: string;
  notes?: string | null;
  leadsContactId?: string;
  leadContactId?: string;
  name?: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string | null;
  city?: string;
  zip?: string;
  countryId?: string;
  stateId?: string;
  decision?: string | null;
  assigneeId?: string;
  createdById?: string;
  updatedById?: string;
  assignee: IDNamePair | null;
  createdBy: IDNamePair | null;
  updatedBy: IDNamePair | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDNamePair {
  id: string;
  name: string;
}
export interface ILeadContact {
  leadId?: string;
  leadsContactId: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone: string | null;
  address1: string;
  address2: string | null;
  city: string;
  zip: string;
  countryId: string;
  countryName: string;
  stateId: string;
  stateName: string;
  leadSource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadProperty {}

export interface leadDetail {
  contact: ILeadContact;
  property: PropertyDetails;
  createdQuotations: QuotationResponse[];
}

export interface LeadSourceRequest {
  name: string;
}

export interface LeadSource {
  leadSourceId: string;
  name: string;
  builderId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

//new
export interface Lead {
  leadsId: string;
  slugId?: string;
  refrenceNumber: string;
  companyId: string;
  builderId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  sendLetter: boolean;
  leadSourceId: string;
  status: "New" | "Contacted" | "Qualified" | "Lost" | string;
  outcome: string | null;
  rating: "Hot" | "Warm" | "Cold" | string;
  land: "Yes" | "No" | string;
  finance: "Yes" | "No" | string;
  faceToFace: "Yes" | "No" | string;
  purpose: string;
  clientTypeId: string;
  forcastClose: string; 
  buildBudget: string;
  regionId: string;
  prelimAgreement: string; 
  clientProfile: string;
  hLBudget: string;
  assigneeId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string; 
  updatedAt: string; 
  leadSourceName: string;
  clientTypeName: string;
  stateName: string;
  assigneeName: string;
  createdByName: string;
  updatedByName: string;
  leadsContactId?: string // todo add
  houseLandPackage: string;
  company: BusinessContact;
  conveyancer: BusinessContact;
  mortgageBroker: BusinessContact;
  financer: BusinessContact;
  houseLandPackageId?: string
}

export interface BusinessContact {
  businessContactId?: string;
  leadsId: string;
  contactType?: "company" | "conveyancer" | "mortgage_broker" | "financer";
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  countryId?: string | null;
  stateId?: string | null;
  abnNumber?: string;
  acnNumber?: string;
  createdAt?: string; 
  updatedAt?: string;
}