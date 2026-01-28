import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface ICostCenter {
  costCenterId: string;
  name: string;
  code: string;
  description: string | null;
  sortOrder: number;
  status: boolean;
  checklist?: CostCenterChecklist[];
}

export interface CostCenterChecklist {
  id?: string;
  costCenterId: string;
  constructionChecklistId: string;
  costCenter?: Entity;
  constructionChecklist?: Entity;
}

export interface CostCennterGetParams {
  code?: string;
  name?: string;
  description?: string;
  sort_order?: number;
  status?: boolean;
}

export interface ICostCenterState {
  costCenter: ICostCenter[];
  status: {
    fetch: Status;
    create: Status;
  };
  checklistStatus: {
    fetch: Status;
    create: Status;
  };
}
