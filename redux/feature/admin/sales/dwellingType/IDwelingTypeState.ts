import { Status } from '@lib/constants/enum';
export interface dwellingTypeResponse {
  dwellingTypeId: string;
  companyId: string;
  builderId: string;
  name: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export type dwellingType = {
  dwellingTypeId: string;
  name: string;
  isActive: boolean;
};

export interface IdwellingTypeState {
  dwellingType: dwellingType[];
  status: {
    fetch: Status;
    create: Status;
  };
}
