import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
import { Entity } from 'types/common.types';
export interface ChecklistType {
  checklistId?: string;
  name: string;
  screenId: string;
  functionalityId: string;
  functionality?: Entity;
  screen?:Entity
}
export interface ChecklistItemType {
  checklistItemId?: string;
  checklistId: string;
  constructionTypeId: string;
  constructionStageId: string;
  description: string;
  notes: boolean;
  isRequired: boolean;
  type: 'dropdown' | 'checkbox';
  sort: number;
}
export interface IChecklistState {
  checklist: ChecklistType[];
  checklistItem: ChecklistItemType[];
  checklistItemStatus: {
    fetch: Status;
    create: Status;
  };
  status: {
    fetch: Status;
    create: Status;
  };
  pagination: CommonPagination;
}
