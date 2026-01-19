import { Status } from '@lib/constants/enum';

export interface InspectionChecklistType {
  constructionInspectionChecklistId: string;
  fieldName: 'checklist' | 'section';
  description: string;
  sortOrder: number;
  constructionOptionId?: string;
  sectionId?: string;
  addAllExistingJobs:boolean;
  isExpanded?: boolean;
  checklist?: InspectionChecklistType[];
  constructionStageId?: string;
  constructionTypeId?: string;
  builder?: string;
}

export interface InspectionChecklistState {
  inspectionSection: InspectionChecklistType[];
  status: {
    checklistStatus: {
      fetch: Status;
      create: Status;
    };
    sectionStatus: {
      fetch: Status;
      create: Status;
    };
  };
}
