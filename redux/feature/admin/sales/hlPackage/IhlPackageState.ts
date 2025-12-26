import { Status } from '@lib/constants/enum';

export interface HLPackageSettings {
  houseLandPackageSettingsId: string;
  companyId: string;
  builderId: string;
  includeFacadeCostInTotal: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface IhlPackageSettingState {
  hlPackageSetting: HLPackageSettings;
  status: {
    fetch: Status;
    update: Status;
  };
}
