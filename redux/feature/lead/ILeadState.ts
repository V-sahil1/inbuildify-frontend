import { LeadDetails, PropertyDetails } from "data/types";
import { QuotationResponse } from "../quotation/IQuotationState";
import { Status } from "@lib/constants/enum";

export interface InitialState {
  leads: ILead[];
  status: Status;
  leadDetail: {
    lead: ILead | null;
    contacts: ILeadContact[] | null;
    property: any | null;
    createdQuotations: QuotationResponse[];
  };
}
export interface ILead {
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
  createdAt: string;
  updatedAt: string;
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
