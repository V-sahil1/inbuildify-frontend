import { Status } from "@lib/constants/enum";

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

export interface jobVariationLimit {
  jobVariationLimitId: string;
  description: string;
  percentage: number;
  sortOrder: number;
  active?: boolean;
}

export interface IJobVariationState {
   jobVariationSetting: JobVariationSetting | null,
  jobVariationLimit: jobVariationLimit[],
  VariationLimitStatus: {
    fetch: Status;
    update: Status;
  },
  status: {
    fetch: Status;
    update: Status;
  }
}