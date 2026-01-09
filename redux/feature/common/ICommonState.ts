import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
import { BuilderInfo } from '../admin/general/builder/ibuilderState';
export interface functionalityResponse {
  functionalityId: string;
  screen: Entity;
  functionalityName: string;
  createdAt: string;
  updatedAt: string;
}

export interface Timezone {
  timezoneId: string;
  countryCode: string;
  timezoneName: string;
  displayName: string;
}

export interface CommonPagination {
  currentPage: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}

export interface ICommonState {
  functionality: functionalityResponse[];
  builders: BuilderInfo[];
  timezone: Timezone[];
  status: {
    builder: Status;
    functionality: Status;
    timezoneStatus: Status;
  };
}
