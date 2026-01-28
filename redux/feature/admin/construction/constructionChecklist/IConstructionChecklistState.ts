import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface ConstructionChecklistType {
  constructionChecklistId: string;
  builder: Entity | string;
  constructionTypeId: string;
  constructionStageId: string;
  name: string;
  supplierTypeId: string;
  sortOrder: number;
  dataRequired: boolean;
  supplier: boolean;
  claim: boolean;
  dependent: boolean;
  noOfDays: number;
  notify: boolean;
  milestone: boolean;
  attachmentMandatory: boolean;
  attachmentMandatoryName: string;
  costCenterId: string[];
  constructionOptionId: string[];
  complianceTypeId: string;
  poFolderId: string | null;
  jobDocumentsFolderId: string | null;
  costCenters: Entity[] | null;
  constructionOptions: Entity[] | string[];
  isExpanded?: boolean;
  subChecklist?: IConstructionSubChecklist[];
  predecessor?: IConstructionChecklistPredecessor[];
  costCenter?: Entity[];
  constructionOption?: Entity[];
  complianceType?: Entity;
  supplierType?: Entity;
  constructionStage?: Entity;
  constructionType?: Entity;
}

export interface IConstructionSubChecklist {
  constructionSubChecklistId: string;
  name: string;
  dataRequired: boolean;
  noOfDays: number;
  constructionChecklist: Entity;
  constructionChecklistId?: string;
}

export interface IConstructionChecklistPredecessor {
  constructionChecklistPredecessorId: string;
  offset: boolean;
  duration: number;
  constructionChecklistId: string;
  predecessorChecklistId: string;
  predecessorChecklistName?: string;
}

export interface IConstructionChecklistState {
  checklist: ConstructionChecklistType[];
  status: {
    checklistStatus: {
      fetch: Status;
      create: Status;
    };
    subChecklistStatus: {
      fetch: Status;
      create: Status;
    };
    predecessorStatus: {
      fetch: Status;
      create: Status;
    };
  };
}
