import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
export interface RoleAndUserType {
  roleTypeId: string;
  typeName: string;
}


export interface RoleAndUserMapping {
  userRoleMappingId: string;
  user: Entity;
  role: Entity;
  roleType: Entity;
  assignedBy: Entity;
  assignedAt: string;
  isNew?: boolean;
}

export interface RoleAndUserMappingCreatePayload {
  roleId: string;
  roleTypeId: string;
  userId: string;
  assignedBy: string;
}
export interface IRoleAndUserMappingState {
  userRoleMapping: RoleAndUserMapping[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  };
}
