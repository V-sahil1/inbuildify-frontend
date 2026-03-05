import { Status } from '@lib/constants/enum';
export interface IAddress {
  city: string;
  stateId: string;
  zipCode: string;
  countryId: string;
  addressLine1: string;
  addressLine2: string | null;
}

export interface IContact {
  usersId: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone: string | null;
  remark: string | null;
  isActive: boolean;
  createdAt: string; // ISO date string
  address: IAddress;
}

export interface IContactState {
  contact: IContact[];
  status: {
    fetch: Status;
    create: Status;
  };
}
