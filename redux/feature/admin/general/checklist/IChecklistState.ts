import { Status } from '@lib/constants/enum';
export interface checklist {
  checklistId:string,
  name: string;
  screenId: string;
  functionalityId: string;
}

export interface IChecklistState {
  checklist: checklist[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  };
}
