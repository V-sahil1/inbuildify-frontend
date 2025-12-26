import { Status } from '@lib/constants/enum';
export type RangeResponse = {
  rangeId: string;
  companyId: string;
  builderId: string;
  name: string;
  logoUrl: string | null;
  headerUrl: string | null;
  userId: string[];
  sortOrder: number;
  bgColor: string;
  fontColor: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export type range = {
  rangeId?: string;
  name: string;
  logoUrl: string | null;
  headerUrl: string | null;
  userId: string[];
  sortOrder: number;
  bgColor: string;
  fontColor: string;
  isActive: boolean;
};

export interface IRangeState {
  range: range[];
  status: {
    fetch: Status;
    create: Status;
  };
}
