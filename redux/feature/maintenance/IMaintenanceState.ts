export type Status = 'readyformaintenance' | 'undermaintenance' | 'completed';

export interface Maintenance {
  id: string;
  customerName: string;
  jobAddress: string;
  startDate: string;
  endDate: string;
  Supervisor: string;
  status: Status;
}

export interface DescriptionNote {
  title: string;
}

export interface RequestItem {
  id: string;
  reference: string;
  descriptions: DescriptionNote[];
  supplier: string;
  start: string;
  finish: string;
  complete: string;
  status: string;
  amount: string;
}
