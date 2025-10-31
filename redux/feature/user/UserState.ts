// Types for contractors
import { Status } from '@lib/constants/enum';

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
  inviteId?: string;
  builderId?: string;
  email: string;
  role: string;
  invitedAt?: string;
};
interface Pagination {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}
export interface invitedUserResponse {
  users: invitedUser[];
  pagination: Pagination;
}
export type UserInitialState = {
  users: user[];
  invitedUsers: invitedUser[];
  status: { users: Status; invitedUsers: Status };
};
