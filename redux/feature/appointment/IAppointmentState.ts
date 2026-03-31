import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IAppointment {
  appointmentId: string;
  companyId: string;
  builderId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  locationId: string;
  linkTo: string | null;
  selectUsers: string[] | Entity[];
  notes: string;
  isDeleted: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  leadId?: string;
  location?: Entity[];
  sendAppointmentCustomer?: boolean;
}

export interface IAppointmentState {
  appointment: IAppointment[];
  status: {
    fetch: Status;
    create: Status;
  };
}
