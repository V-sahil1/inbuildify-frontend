import { LeadDetails, PropertyDetails } from "data/types";
import { QuotationResponse } from "../quotation/IQuotationState";

export interface ILead {
    leadId: string;
    builderId: string;
    status: any; // expand as needed
    leadSource: any; // adjust to match possible sources
    notes: string | null;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
    leadsContactId: string;
    name: string;
    address1?: string;
    address2?: string;
    email: string;
    phone: string;
    secondaryPhone: string | null;
    city: string;
    zip: string;
    countryId: string;
    stateId: string;
}
  

export interface leadDetail {
    contact: LeadDetails;
    property: PropertyDetails;
    createdQuotations: QuotationResponse[];
}