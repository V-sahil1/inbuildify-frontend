import { Status } from '@lib/constants/enum';
export interface checklistItem {
  checklistItemId?:string,
  checklistId: string;
  constructionTypeId: string;
  constructionStageId: string;
  description:string;
  notes:boolean;
  isRequired:boolean;
  type:string;
  sort:number
}

export interface IChecklistItemState {
  checklistItem: checklistItem[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  };
}
