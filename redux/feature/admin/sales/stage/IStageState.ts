import { Status } from '@lib/constants/enum';

export interface Stage {
  salesStageId?:string
  salesProcessId:string,
  stageName: string;
  functionalityId:string[],
  category:string,
  sortOrder:number,
  isActive:boolean
}

export interface IStageState {
  stage:Stage[];
  status: {
   create:Status,
   fetch:Status,
   update:Status
  }
}
