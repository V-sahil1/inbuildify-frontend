import { Status } from '@lib/constants/enum';
export interface userGroup {
  userGroupId: string;
  name: string;
  usersId: string[];
  isActive: boolean;
}

export interface IUserGroupState {
  userGroups: userGroup[];
  status: {
    fetch: Status;
    create:Status;
  };
}
