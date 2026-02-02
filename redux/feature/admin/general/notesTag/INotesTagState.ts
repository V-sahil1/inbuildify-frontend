import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface NotesTagType {
  notesTagId: string;
  name: string;
  backgroundColor: string;
  fontColor: string;
  isNew?: boolean;
}

export interface INotesTagState {
  notesTag: NotesTagType[];
  status: {
    fetch: Status;
    create:Status;
  };
  pagination:CommonPagination;
}
