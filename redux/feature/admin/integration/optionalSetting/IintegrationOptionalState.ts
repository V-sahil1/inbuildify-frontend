import { Status } from '@lib/constants/enum';

export interface IntegrationSettings {
  automaticallySendWelcomeEmail: boolean;
  reaHlEnabled: boolean;
  canibuildEnabled: boolean;
  websiteHlEnabled: boolean;
  googleEnabled: boolean;
  assignLeadsIfAssigneeNotFound: string | null;
  alwaysAssignLeadsTo: string | null;
}

export interface IIntegrationSettingState {
  integrationSetting: IntegrationSettings | null;
  status: {
    fetch: Status;
    update: Status;
  };
}