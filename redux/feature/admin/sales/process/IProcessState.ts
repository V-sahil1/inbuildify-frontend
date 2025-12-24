import { Status } from '@lib/constants/enum';

export interface Process {
  salesProcessId?:string,
  name: string;
  isDefault:boolean
}

export interface IProcessState {
  process:Process[];
  status: {
   create:Status,
   fetch:Status,
   update:Status
  }
}
