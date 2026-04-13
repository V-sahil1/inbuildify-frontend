import { Status } from '@lib/constants/enum';
import { CommonPagination } from '../common/ICommonState';

export interface ITask {
  taskId: string;
  name: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  status?: string;
  priority?: string;
  assigneeId?: string;
  assigneeName?: string;
  linkTo?: string;
  linkType?: string;
  leadId?: string;
  attachFiles?: string;
  actionId?: string;
  createdBy?: string;
  createdbyname?: string;
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ITaskCounters {
  allCount: number;
  todayCount: number;
  tomorrowCount: number;
  thisWeekCount: number;
  nextWeekCount: number;
  overdueCount: number;
  pendingCount: number;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  priority?: string;
  assignee_id?: string;
  due_date?: string;
  lead_id?: string;
  date_filter?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface ITaskState {
  tasks: ITask[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
  counters: ITaskCounters | null;
}
