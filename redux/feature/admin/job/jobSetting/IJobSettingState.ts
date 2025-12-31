import { Status } from "@lib/constants/enum";

export interface JobSettings {
  autoMoveToMaintenance: boolean;
  autoMarkCompleted: boolean;
  autoArchiveAfterCompletion: boolean;
  autoArchiveAfterDays: number | null;
  milestoneStatusCheckDays: number | null;
  reportCustomDays: number | null;
  reportStatusFilter: "all" | "active" | "completed";
  reportIncludeDate: boolean;
}

export interface IJobSettingState {
  jobSetting: JobSettings | null;
  status: {
    fetch: Status;
    update: Status;
  }
}