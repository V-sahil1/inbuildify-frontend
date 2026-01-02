import { Status } from '@lib/constants/enum';

export interface JobVariationSetting {
  allowNotesInVariation: boolean;
  allowCostAdjustment: boolean;
  showNotesInVariationByDefault: boolean;
  drawingChangesRequired: boolean;
  notifySignedVariation: boolean;
  notifySignedVariationOnlyAfterContractPrepared: boolean;
  allowedMoveJobToConstructionWithPendingVariation: boolean;
  makeRequestedByAndDelayedDaysMandatory: boolean;
  sendMailWhenVariationSelfApproved: boolean;
  contractBasedVariationHeader: boolean;
  contractBasedVariationHeaderTitle: string | null;
  preContractHeader: string | null;
  postContractHeader: string | null;
  notifySignedVariationUserIds: string[];
  notifySignedVariationGroupIds: string[];
  notifyAfterContractUserIds: string[];
  notifyAfterContractGroupIds: string[];
}

export interface jobVariationApproval {
  jobVariationApprovalId: string;
  roleId: string;
  amount: number;
}

export interface jobVariationApprovalResponse {
  jobVariationApprovalId: string;
  role: {
    id: string;
    name: string;
  };
  amount: number;
}

export interface IJobVariationState {
  jobVariationSetting: JobVariationSetting | null;
  jobVariationLimit: jobVariationApprovalResponse[];
  VariationLimitStatus: {
    fetch: Status;
    update: Status;
  };
  status: {
    fetch: Status;
    update: Status;
  };
}
