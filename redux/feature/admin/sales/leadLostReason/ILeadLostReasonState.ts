import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface LeadLostReasonType {
  leadLostReasonId?: string;
  lostReason: string;
  sortOrder: number;
  isActive?: boolean;
  isDraft?: boolean;
  isNew?:boolean;
}

export interface IleadLostReasonState {
  leadLostReason: LeadLostReasonType[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination:CommonPagination
}
