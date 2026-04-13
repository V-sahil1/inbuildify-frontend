import { Status } from '@lib/constants/enum';
import { CommonPagination } from '../common/ICommonState';

export interface ITodo {
  todoId: string;
  taskName: string;
  jobId?: string;
  jobAddress?: string;
  bookingDate?: string;
  startDate?: string;
  finishDate?: string;
  siteSupervisorId?: string;
  siteSupervisor?: string;
  supplierId?: string;
  supplierName?: string;
  subject?: string;
  message?: string;
  status?: string;
  builderId?: string;
  companyId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITodoCounters {
  allCount: number;
  todayCount: number;
  tomorrowCount: number;
  thisWeekCount: number;
  nextWeekCount: number;
  overdueCount: number;
}

export interface TodoQueryParams {
  page?: number;
  limit?: number;
  task_name?: string;
  job_address?: string;
  site_supervisor_id?: string;
  supplier_id?: string;
  booking_date_from?: string;
  booking_date_to?: string;
  start_date_from?: string;
  start_date_to?: string;
  status?: string;
  date_filter?: string;
}

export interface ITodoState {
  todos: ITodo[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
  counters: ITodoCounters | null;
}
