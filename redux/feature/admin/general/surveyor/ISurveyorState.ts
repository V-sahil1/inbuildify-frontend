import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface Surveyor {
  surveyorId?: string;
  name: string;
  email: string;
  phone: string;
  abnNumber?: string;
  registrationNumber?: string;
  address1: string;
  address2?: string;
  city: string;
  stateId: string;
  zipPostalCode: string;
}

export interface SurveyorResponse {
  surveyorId: string;
  companyId: string;
  builderId: string;
  name: string;
  email: string;
  phone: string;
  abnNumber?: string;
  registrationNumber?: string;
  address1: string;
  address2?: string;
  city: string;
  stateId: string;
  zipPostalCode: string;
}

export interface Pagination {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ISurveyorState {
  surveyor: Surveyor[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
}
