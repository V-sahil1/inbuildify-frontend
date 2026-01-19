import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IntegrationSettings {
  automaticallySendWelcomeEmail: boolean;
  reaHlEnabled: boolean;
  canibuildEnabled: boolean;
  websiteHlEnabled: boolean;
  googleEnabled: boolean;
  assignLeadsIfAssigneeNotFound: string | null;
  alwaysAssignLeadsTo: string | null;
}

export interface CustomFieldName {
  integrationCustomFieldHeaderId: string;
  headerName: string;
}

export interface CustomerFieldItemPayload {
  integrationCustomFieldItemId?: string;
  header1Id: string | null;
  header2Id?: string | null;
  value1: string | null;
  value2?: string | null;
  assigneeUserId: string;
}
export interface CustomerFieldItem {
  integrationCustomFieldItemId: string;
  header1Id: string | null;
  header2Id: string | null;
  value1: string | null;
  value2: string | null;
  assigneeUser: Entity;
}

export interface IIntegrationSettingState {
  integrationSetting: IntegrationSettings | null;
  customFields: CustomFieldName[];
  customFieldItems: CustomerFieldItem[];
  customFieldItemStatus: {
    fetch: Status;
    update: Status;
  };
  customFieldStatus: {
    fetch: Status;
    update: Status;
  };
  status: {
    fetch: Status;
    update: Status;
  };
}
