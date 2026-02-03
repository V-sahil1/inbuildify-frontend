import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface IClientType {
  clientTypeId?: string;
  clientType: string;
  sortOrder: number;
  isActive?: boolean;
  isNew?: boolean;
}

export interface IClientTypeState {
  clientType: IClientType[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
}
