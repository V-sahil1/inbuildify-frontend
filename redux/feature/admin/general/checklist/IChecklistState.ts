import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
export interface checklist {
  checklistId?: string;
  name: string;
  screenId: string;
  functionalityId: string;
}
export type ChecklistResponse = {
  checklistId: string;
  name: string;
  isActive: boolean;
  screen: Entity;
  functionality: Entity;
};

export interface checklistItem {
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

export type ChecklistItemResponse = {
  checklistItemId: string;
  checklistId: string;
  constructionTypeId: string;
  constructionStageId: string;
  description: string;
  notes: boolean;
  isRequired: boolean;
  type: 'dropdown' | 'checkbox';
  sort: number;
  createdAt: string;
  updatedAt: string;
};
export interface IChecklistState {
  checklist: ChecklistResponse[];
  checklistItem: checklistItem[];
  checklistItemStatus: {
    fetch: Status;
    create: Status;
  };
  status: {
    fetch: Status;
    create: Status;
  };
}
