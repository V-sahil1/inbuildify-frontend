// Types for contractors

import { Status } from "@lib/constants/enum"

// API Response Type (what comes from the backend)
export interface ContractorResponse extends Array<{
  contractorId: string
  name: string
  email: string
  phone: string
  address: string
  service?: string
  builderId: string
  createdAt: any
  updatedAt: any
}> {}

// Component Data Type (what the UI components use)
export interface Contractor {
  key: string
  fullName: string
  email: string
  phone: string
  address: string
  service?: string
}

// Contractor Request Type (for create/update operations)
export interface ContractorRequest {
  contractorId?:string
  name: string
  email: string
  phone: string
  address: string
  service?: string
}

// Contractor State Interface
export interface IContractorState {
  contractors: Contractor[]
  loading: boolean
  error: string | null
}

// Initial State
export const initialState: IContractorState = {
  contractors: [],
  loading: false,
  error: null
}

export interface Service {
  serviceId: string,
  service: string,
  builderId: string,
  createdAt: string,
  updatedAt: string
}

export interface ServiceRequest {
  serviceId?: string;
  service: string;
}


export interface ServiceResponse {
  serviceId: string;
  service: string;
}

export interface InitialContractorState {
  services: Service[]
  status: Status
}
  