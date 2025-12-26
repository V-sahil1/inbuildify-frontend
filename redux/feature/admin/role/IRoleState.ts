import { Status } from '@lib/constants/enum';
export interface Role {
  roleId: string;
  companyId: string;
  builderId: string;
  name: string;
  type: string | null;
  description: string | null;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IRoleState {
  role: Role[];
  status: Status;
}
