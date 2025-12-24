import { Status } from '@lib/constants/enum';
import { Pagination } from '../../general/surveyor/ISurveyorState';
export interface leadLostReason {
  leadLostReasonId?: string;
  lostReason: string;
  sortOrder: number;
  isActive?: boolean;
  isDraft?: boolean;
}

export interface fetchLeadLostReasonResponse {
  leadLostReason: leadLostReasonResponse[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface leadLostReasonResponse {
  leadLostReasonId: string;
  companyId: string;
  builderId: string;
  lostReason: string;
  sortOrder: number;
  isActive: boolean;
  isDraft?: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IleadLostReasonState {
  leadLostReason: leadLostReason[];
  status: {
    fetch: Status;
    create: Status;
  };
}
