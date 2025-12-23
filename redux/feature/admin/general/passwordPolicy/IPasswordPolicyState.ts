import { Status } from '@lib/constants/enum';
export interface passwordPolicy {
  passwordPolicyId?: string;
  expiresInDays: number;
  invalidAttemptLimit: number;
  alertBeforeExpiryDays: number;
  passwordHistoryCount: number;
}

export interface passwordPolicyResponse {
  passwordPolicyId: string;
  companyId: string;
  builderId: string;
  enforceStrongPassword: boolean;
  isActive: boolean;
  expiresInDays: number;
  invalidAttemptLimit: number;
  alertBeforeExpiryDays: number;
  passwordHistoryCount: number;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPasswordPolicyState {
  passwordPolicy: passwordPolicy;
  status: {
    fetch: Status;
    update: Status;
  };
}
