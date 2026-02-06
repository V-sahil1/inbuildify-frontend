import { Status } from '@lib/constants/enum';
import { CommonPagination } from '../common/ICommonState';
import { Entity } from 'types/common.types';

export interface IRecalculateDateSettings {
  recalculateWorkflowJobEstimatedDates: boolean;
  recalculateConstructionJobEstimatedDates: boolean;
  recalculateConfirmedBookingDates: boolean;
  captureReasonRebookingAndRebookingEmail: boolean;
  captureText: string | null;
}

export interface IHoliday {
  holidayId: string;
  holidayStartDate: string;
  holidayEndDate: string;
  holidayDescription: string;
  status: boolean;
  state: Entity[] | string[];
}

export interface IHolidayState {
  recalculateDate: IRecalculateDateSettings;
  holiday: IHoliday[];
  status: {
    recalculateDate: {
      fetch: Status;
      create: Status;
    };
    holiday: {
      fetch: Status;
      create: Status;
    };
  };
  pagination: CommonPagination;
}

export interface IHolidayFetchParams {
  page: number;
  limit: number;
  holiday_description?: string;
  holiday_start_date?: string;
  holiday_end_date?: string;
  status?: boolean;
  state?: string;
  year?: string;
}
