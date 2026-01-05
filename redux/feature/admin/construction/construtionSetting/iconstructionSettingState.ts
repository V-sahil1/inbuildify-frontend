import { Status } from '@lib/constants/enum';

export type ConstructionSetting = {
  suppliersTradiesMadatoryToCompleteChecklist: boolean;
  allowChecklistEvenSupplierTradiesNotResponded: boolean;
  showWarningWhenSupplierTradeBookedSameDayForChecklist: boolean;
  sendingEmailPrivateInspectorMandatory: boolean;
  makeInspectionChacklistMandatory: boolean;
  includeWeekendDate: boolean;
  includeHolidayDate: boolean;
  includeOnholdDate: boolean;
  allowStageDateChange: boolean;
  defaultLeadTimeForSupplierTrade: boolean;
  noOfReminderDays: number;
  allowMoveNextStageEvenChecklistNotCompleted: boolean;
  applyChangesAllExistingJobs: boolean;
  rebookConfrimedBookingsOnDateChanges: boolean;
  sendEmailWhenStageCompleted: boolean;
  moveJobsFromReadyForConstructionToUnderConstruction: boolean;
  recalculateStageDateConstructionDaysWhenDeleysCaptured: boolean;
  enableForcastDate: boolean;
  numberOfDaysSiteStartFromTitleDate: number;
  labelForPermitReceivedDate: string;
  siteSupervisorRoles: string[];
  adminCoordinatorRoles: string[];
  stageCompletionDate: 'claim' | 'move_to_next_page';
};

export interface IConstructionSettingState {
  constructionSetting: ConstructionSetting;
  status: {
    fetch: Status;
    update: Status;
  };
}
