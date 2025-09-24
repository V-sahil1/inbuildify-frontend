// Types for contractors
import { Status } from "@lib/constants/enum";

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

export type user = {
  usersId?: string;
  builderId?: string;
  name?: string;
  email: string;
  isVerified?: boolean;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type invitedUser = {
  inviteId?:string,
  inviteToken?:string,
  builderId?:string,
  email:string,
  role:string,
  expiresAt?:string,
  invitedAt?:string
}
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}


export interface invitedUserResponse  {
  users:invitedUser[];
  pagination :Pagination
}



export type UserInitialState = {
  users: user[],
  invitedUsers:invitedUser[]
  status:{users:Status,invitedUsers:Status}
};
