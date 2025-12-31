import { Status } from '@lib/constants/enum';
export interface screenTypeResponse {
  screenId:string,
  name: string;
  createdBy:string;
  updatedBy:string;
  createdAt: string;
  updatedAt: string;
}

export interface IScreenState {
  screen: screenTypeResponse[];
  status: Status
}
