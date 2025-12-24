import { Status } from '@lib/constants/enum';
export interface clientType {
  clientTypeId?: string;
  clientType: string;
  sortOrder: number;
  isActive?: boolean;
  isDraft?:boolean
}

export interface fetchClientTypeResponse {
  clientType: clientTypeResponse[];
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface clientTypeResponse {
  clientTypeId: string;
  companyId: string;
  buildedrId: string;
  clientType: string;
  sortOrder: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IClientTypeState {
  clientType: clientType[];
  status: {
    fetch: Status;
  };
}
