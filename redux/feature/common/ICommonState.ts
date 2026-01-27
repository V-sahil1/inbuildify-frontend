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
  limit: number;
  totalRecords: number;
  totalPages: number;
}

export interface LocationType {
  locationId: string;
  name: string;
  status: boolean;
}

export interface ComplianceType {
  complianceTypeId: string;
  name: string;
}

export interface ICommonState {
  functionality: functionalityResponse[];
  builders: BuilderInfo[];
  timezone: Timezone[];
  locations: LocationType[];
  complianceType: ComplianceType[];
  status: {
    builder: Status;
    functionality: Status;
    timezoneStatus: Status;
    locationStatus: {
      fetch: Status;
      create: Status;
    };
    complianceTypeStatus: Status;
  };
}
