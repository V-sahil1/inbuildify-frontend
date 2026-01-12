import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface JobProcessFunctionality {
  functionalityId: string | number;
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

export interface IJobSettingState {
  jobProcessFunctionality: JobProcessFunctionality[] | null;
  jobProcessStage: JobProcessStage[];
  jobProcessSubStage: JobProcessSubStage[];
  jobProcessTask: [];
  jobProcessSubTask: [];
  status: {
    fetchFunctionality: Status;
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
    };
    subTask: {
      fetch: Status;
      update: Status;
      create: Status;
    };
  };
}
