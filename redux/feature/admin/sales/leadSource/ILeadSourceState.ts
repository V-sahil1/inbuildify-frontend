import { Status } from '@lib/constants/enum';
export interface leadSource {
  leadSourceId?:string,
  name: string;
  sortOrder: number;
  allowChange: boolean;
  isActive: boolean;
  isDefault?:boolean
}


export interface ILeadSourceState {
  leadSource: leadSource[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  }
}
