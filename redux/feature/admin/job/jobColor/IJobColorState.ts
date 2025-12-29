import { Status } from '@lib/constants/enum';

export interface JobColorSettings {
  jobColorSettingsId: string;
  companyId: string;
  builderId: string;

  hideColorItemImages: boolean;
  hideColorItemPrice: boolean;
  exitColorCode: boolean;
  pageOrientationPortrait: boolean;

  headerText: string | null;
}

export interface IJobColorState {
  jobColor: JobColorSettings | null;
  status: {
    fetch: Status;
    update: Status;
  };
}
