import { Status } from '@lib/constants/enum';
export interface leadSource {
  leadSourceId?: string;
  name: string;
  sortOrder: number;
  allowChange: boolean;
  isActive: boolean;
  isDefault?: boolean;
}

export type LeadSourceResponse = {
  leadSourceId: string;
  companyId: string;
  builderId: string;
  name: string;
  sortOrder: number;
  allowChange: boolean;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export interface ILeadSourceState {
  leadSource: leadSource[];
  status: {
    fetch: Status;
    create: Status;
  };
}
