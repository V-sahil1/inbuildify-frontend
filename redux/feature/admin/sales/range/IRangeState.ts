import { Status } from '@lib/constants/enum';

export type RangeType = {
  rangeId?: string;
  name: string;
  logoUrl: File | string | null;
  headerUrl: File | string | null;
  userId: string[];
  sortOrder: number;
  bgColor: string;
  fontColor: string;
  isActive: boolean;
  isNew?: boolean;
};

export interface IRangeState {
  range: RangeType[];
  status: {
    fetch: Status;
    create: Status;
  };
}
