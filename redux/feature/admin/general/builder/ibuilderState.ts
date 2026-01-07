import { Status } from '@lib/constants/enum';

export interface BuilderInfo {
  name: string;
  email: string;
  logo: string;
  abnNumber: string | null;
  phoneNumber: string | null;
  acnNumber: string | null;
  hiaMembershipNo: string | null;
  registrationNumber: string | null;
  registeredBuildingPractitioner: boolean;
  practitionerRegNo: string | null;
  licensedBuilderName: string | null;
  bankName: string | null;
  accountName: string | null;
  accountNumber: string | null;
  accountBsb: string | null;
  address: BuilderAddress;
  insurer: BuilderInsurer;
}
export interface BuilderAddress {
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  stateId: string | null;
  zipCode: string | null;
  countryId: string | null;
}

export interface BuilderInsurer {
  insuredName: string | null;
  insurerName: string | null;
  phoneNumber: string | null;
  stateId: string | null;
  zipCode: string | null;
  addressLine1: string | null;
  addressLine2: string | null;
}
export interface IBuilderState {
  builder: BuilderInfo;
  status: {
    fetch: Status;
    update: Status;
  };
}
