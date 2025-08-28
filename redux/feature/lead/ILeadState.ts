import { LeadDetails, PropertyDetails } from "@/pages/leads/data/types";

export interface ILead {
    lead_id: string;
    name: string;
    email: string;
    phone: string;
    lead_source: string;
    created_at: string;
    updated_at: string;
    status: string;
}

export interface leadDetail {
    contact: LeadDetails;
    property: PropertyDetails;
}