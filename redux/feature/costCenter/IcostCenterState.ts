import { Status } from '@lib/constants/enum';
export interface ICostCenter {
  costCenterId: string;
  name: string;
  code: string;
  description: string | null;
  sortOrder: number;
  status: boolean;
}

export interface ICostCenterState {
  costCenter: ICostCenter[];
  status: {
    fetch: Status;
  };
}
