import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface LeadSourceType {
  leadSourceId?: string;
  name: string;
  sortOrder: number;
  allowChange: boolean;
  isActive: boolean;
  isNew?:boolean
}

export interface ILeadSourceState {
  leadSource: LeadSourceType[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination:CommonPagination
}
