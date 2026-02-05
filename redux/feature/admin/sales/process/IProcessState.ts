import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
import { Entity } from 'types/common.types';

export interface ProcessType {
  salesProcessId?: string;
  name: string;
  isDefault: boolean;
  isExpanded?: boolean;
  Stages?: StageType[];
}

export interface StageType {
  salesStageId?: string;
  salesProcessId: string;
  stageName: string;
  functionality: Entity[];
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface StageTypePayload {
  salesProcessId?: string;
  stageName: string;
  functionalityId: string[];
  category: string;
  sortOrder: number;
}

export interface IProcessState {
  process: ProcessType[];
  functionality: { functionalityId: string; name: string }[];
  functionalityStatus: Status;
  stageStatus: {
    create: Status;
    fetch: Status;
  };
  status: {
    create: Status;
    fetch: Status;
  };
}
