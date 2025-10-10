import { LeadDetails, PropertyDetails } from "data/types";
import { QuotationResponse } from "../quotation/IQuotationState";
import { Status } from "@lib/constants/enum";

export interface InitialState {
  leads: ILead[];
  status: {leads: Status , leadSources: Status, leadById: Status, leadQuotations: Status, updateLeadSource:Status};
  leadSources: LeadSource[];
  addInstSourceModal: boolean;
  leadDetail: {
    lead: ILead | null;
    contacts: ILeadContact[] | null;
    property: any | null;
    createdQuotations:{quotations:QuotationResponse[]};
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