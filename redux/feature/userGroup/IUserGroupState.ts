import { Status } from '@lib/constants/enum';
import { CommonPagination } from '../common/ICommonState';
export interface userGroup {
  userGroupId: string;
  name: string;
  usersId: string[];
  users?: { id: string; name: string }[];
  isActive: boolean;
}

export interface IUserGroupState {
  userGroups: userGroup[];
  pagination: CommonPagination;
  status: {
    fetch: Status;
    create: Status;
  };
}
