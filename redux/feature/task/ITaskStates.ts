import { Status } from '@lib/constants/enum';
import { CommonPagination } from '../common/ICommonState';

export interface ITask {
  taskId: string;
  name: string;
  description: string;
  dueDate: string;
  dueTime: string;
  status: string;
  priority: string;
  assigneeId: string;
  linkType: string;
  attachFiles: string;
  assigneeName?:string
  actionId?:string
}
export interface TaskQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  status?: string;
  priority?: string;
  assignedTo?: string;
  due_date?: string; 
}

export interface ITaskState {
  tasks: ITask[];
  status: {
    fetch: Status;
    create: Status;
  };
  pagination:CommonPagination
}

``