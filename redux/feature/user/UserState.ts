// Types for contractors
import { Status } from '@lib/constants/enum';

export type user = {
   usersId: string;
  name: string;
  email: string;
  loginId: string | null;
  phone: string | null;
  secondaryPhone: string | null;
  roleId: string;
  roleName: string;
  isActive: boolean;
  isLocked: boolean;
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
