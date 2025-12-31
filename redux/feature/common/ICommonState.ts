import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
export interface functionalityResponse {
  functionalityId:string,
  screen: Entity;
  functionalityName: string;
  createdAt:string;
  updatedAt:string;
}

export interface ICommonState {
  functionality: functionalityResponse[];
  status: {
    functionality:Status
  }
}
