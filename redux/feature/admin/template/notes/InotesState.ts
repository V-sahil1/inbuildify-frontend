import { Status } from "@lib/constants/enum";
import { CommonPagination } from "@redux/feature/common/ICommonState";

export interface INotesTemplate {
  templateNoteId?: string;
  name: string;
  content: string;
  isActive: boolean;
  newRow?:boolean;
}

export interface INotesState {
  notes: INotesTemplate[];
  status: {
    fetch: Status;
    create: Status;
    update: Status;
    activate: Status;
  };
  pagination:CommonPagination
}