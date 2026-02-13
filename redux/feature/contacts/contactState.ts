import { Status } from '@lib/constants/enum';

export interface IContact {
  usersId: string;
  name: string;
  email: string;
  phone: string | null;
  secondaryPhone: string | null;
  remark: string | null;
  isActive: boolean;
  addressLine1: string;
  addressLine2: string;
  city: string;
  zipCode: string;
  countryId: string;
  stateId: string;
  roleName: string;
}

export interface IContactState {
  contact: IContact[];
  status: {
    fetch: Status;
    create: Status;
  };
}
