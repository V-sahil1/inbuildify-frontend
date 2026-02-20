import { Status } from '@lib/constants/enum';

export interface IAgentReferralPartner {
  agentReferralPartnerId: string;
  companyId: string;
  builderId: string;
  accountName: string;
  accountBsb: string;
  accountNumber: string;
  abn: string;
  companyName: string;
  referredUserId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateId: string;
  countryId: string;
  zipCode: string;
  referredUserName: string;
  referredUserEmail: string;
  createdByName: string;
  user: User;
  address: Address;
  isLocked?: boolean;
  reserved?: number;
  packages: number;
}

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  createLogin: boolean;
  loginId: string | null;
  passwordOption: string | null;
  manualPassword: string | null;
  nextLoginPasswordChange: boolean;
  emailLoginCredentials: boolean;
  isActive: boolean;
  isLocked: boolean;
}

export interface Address {
  addressId: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  stateId: string;
  countryId: string;
  zipCode: string;
}

export interface IAgentReferralPartnerState {
  agentReferralPartner: IAgentReferralPartner[];
  status: {
    fetch: Status;
    create: Status;
  };
}
