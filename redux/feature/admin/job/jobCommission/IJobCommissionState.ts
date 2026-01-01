import { Status } from '@lib/constants/enum';

export interface jobCommissionSetting {
  defineOutgoingCommission: boolean;
  defineIncomingCommission: boolean;
}

export type JobCommission = {
  jobCommissionId: string;
  commissionType: 'outgoing' | 'incoming';
  name: string;
  recipient: 'sales_person' | 'reporting_to' | 'referral_partner' | 'customer' | 'other_user';
  recipientUserId: string | null;
  commissionUnit: 'percentage' | 'amount';
  commissionValue: string;
  sortOrder: number;
  stages: CommissionStage[];
  isExpanded: boolean;
};

export type CommissionStage = {
  jobCommissionSubStageId: string;
  jobCommissionId: string;
  name: string;
  commissionUnit: 'percentage' | 'amount';
  commissionValue: string;
  sortOrder: number;
};

export interface IJobCommissionState {
  commissionSetting: jobCommissionSetting;
  outgoingCommission: JobCommission[];
  incomingCommission: JobCommission[];
  commissionStageStatus: {
    fetch: Status;
    update: Status;
  };
  outgoingCommissionStatus: {
    fetch: Status;
    update: Status;
  };
  incomingCommissionStatus: {
    fetch: Status;
    update: Status;
  };
  status: {
    fetch: Status;
    update: Status;
  };
}
