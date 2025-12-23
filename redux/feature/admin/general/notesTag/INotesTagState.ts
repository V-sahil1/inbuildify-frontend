import { Status } from '@lib/constants/enum';
import { Pagination } from '../surveyor/ISurveyorState';
export interface notesTag {
  notesTagId: string;
  name: string;
  backgroundColor: string;
  fontColor: string;
  isNew?: boolean;
}
export interface FetchNotesTagResponse {
  noteTag: notesTagResponse[];
  pagination: Pagination;
}
export interface notesTagResponse {
  notesTagId: string;
  companyId: string;
  builderId: string;
  name: string;
  backgroundColor: string;
  fontColor: string;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface INotesTagState {
  notesTag: notesTag[];
  status: {
    fetch: Status;
    create:Status;
  };
}
