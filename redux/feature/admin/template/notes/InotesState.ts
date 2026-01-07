import { Status } from "@lib/constants/enum";

export interface INotesTemplate {
  templateNoteId?: string;
  name: string;
  content: string;
  isActive: boolean;
}

export interface INotesState {
  notes: INotesTemplate[];
  status: {
    fetch: Status;
    create: Status;
    update: Status;
    activate: Status;
  };
}