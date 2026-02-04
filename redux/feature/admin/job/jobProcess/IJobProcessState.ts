import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface JobProcessFunctionality {
  functionalityId: string | number;
  name: string;
}

export interface JobPredecessorTask {
  taskId: string;
  name: string;
}

export interface JobProcessStage {
  stageId: string;
  name: string;
  sortOrder: number;
  dependentStage: Entity;
  functionality: JobProcessFunctionality;
  isWorkflow: boolean;
}

export interface JobProcessSubStage {
  subStageId: string;
  name: string;
  sortOrder: number;
}

export interface JobProcessSubTask {
  jobProcessSubtaskId?: string;
  subTaskId: string;
  name: string;
  sortOrder: number;
  jobProcessTask?:Entity
}

export interface JobProcessTask {
  jobProcessTaskId: string;
  name: string;
  description: string;
  sortOrder: number;
  noOfDays: number;
  assignee: Entity;
  notify: boolean;
  milestone: boolean;
  attachmentMandatory: boolean;
  dependencies: JobPredecessorTask[];
  subTasks: JobProcessSubTask[];
}

export interface IJobSettingState {
  jobProcessFunctionality: JobProcessFunctionality[] | null;
  jobPredecessorTask: JobPredecessorTask[];
  jobProcessStage: JobProcessStage[];
  jobProcessSubStage: JobProcessSubStage[];
  jobProcessTask: JobProcessTask[];
  jobProcessSubTask: JobProcessSubTask[];
  status: {
    fetchFunctionality: Status;
    fetchbPredecessorTask: Status;
    stage: {
      fetch: Status;
      update: Status;
      create: Status;
      delete: Status;
    };
    subStage: {
      fetch: Status;
      update: Status;
      create: Status;
      delete: Status;
    };
    task: {
      fetch: Status;
      update: Status;
      create: Status;
      delete: Status;
    };
    subTask: {
      update: Status;
      create: Status;
      delete: Status;
    };
  };
}
