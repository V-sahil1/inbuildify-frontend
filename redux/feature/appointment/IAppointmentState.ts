import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IAppointment {
  appointmentId: string;
  companyId: string;
  builderId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  /** Free-text address or place (optional). */
  locationText?: string | null;
  linkTo: string | null;
  selectUsers: string[] | Entity[];
  notes: string;
  isDeleted: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  leadId?: string;
  sendAppointmentCustomer?: boolean;
}

export interface IAppointmentPagination {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasMore: boolean;
}

export interface IAppointmentTabCounts {
  /** Total matching contextual filters, no date bucket. */
  all: number;
  today: number;
  tomorrow: number;
  thisWeek: number;
  nextWeek: number;
  pending: number;
}

export interface IAppointmentState {
  appointment: IAppointment[];
  pagination: IAppointmentPagination;
  tabCounts: IAppointmentTabCounts;
  status: {
    fetch: Status;
    create: Status;
    loadMore: Status;
    tabCounts: Status;
  };
}
