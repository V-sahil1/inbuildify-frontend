// Types for contractors

// API Response Type (what comes from the backend)
export interface UserResponse extends Array<{
  userId: string
  name: string
  email: string
  phone: string
  address: string
  role: string
  builderId: string
  createdAt: any
  updatedAt: any
}> {}

// Component Data Type (what the UI components use)
export interface User {
  key: string
  fullName: string
  role: string
  email: string
  phone: string
  address: string
}

// Contractor Request Type (for create/update operations)
export interface UserRequest {
  name: string
  email: string
  phone: string
  address: string
  role : string
}

// Contractor State Interface
export interface IUserState {
  user: User[]
  loading: boolean
  error: string | null
}

// Initial State
export const initialState: IUserState = {
  user: [],
  loading: false,
  error: null
}