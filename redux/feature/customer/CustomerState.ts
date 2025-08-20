// Types for contractors

// API Response Type (what comes from the backend)
export interface CustomerResponse extends Array<{
  customerId: string
  name: string
  email: string
  phone: string
  address: string
  builderId: string
  createdAt: any
  updatedAt: any
}> {}

// Component Data Type (what the UI components use)
export interface Customer {
  key: string
  fullName: string
  email: string
  phone: string
  address: string
}

// Contractor Request Type (for create/update operations)
export interface CustomerRequest {
  customer_id?: string
  name: string
  email: string
  phone: string
  address: string
}

// Contractor State Interface
export interface ICustomerState {
  contractors: Customer[]
  loading: boolean
  error: string | null
}

// Initial State
export const initialState: ICustomerState = {
  contractors: [],
  loading: false,
  error: null
}