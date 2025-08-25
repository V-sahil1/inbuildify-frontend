// Types for contractors

// API Response Type (what comes from the backend)
export interface ContractorResponse extends Array<{
  contractorId: string
  name: string
  email: string
  phone: string
  address: string
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
}

// Contractor Request Type (for create/update operations)
export interface ContractorRequest {
  contractorId?:string
  name: string
  email: string
  phone: string
  address: string
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