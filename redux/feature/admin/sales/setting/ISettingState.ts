import { Status } from '@lib/constants/enum';
export interface setting {
  salesModuleSettingsId?: string;
  allowDuplicateLeads: boolean;
  sendEmailOnNewLead: boolean;
  showCommonFolders: boolean;
  leadMandatoryOption:
    | 'email_and_phone'
    | 'either_email_or_phone'
    | 'email_not_mandatory'
    | 'phone_not_mandatory'
    | 'email_and_phone_not_mandatory';
  roleId: string[];
  salesWonButtonText: string;
  houseSizeUnit: 'sq_m2' | 'sq_ft';
}

export type settingResponse = {
  salesModuleSettingsId: string;
  companyId: string;
  builderId: string;
  allowDuplicateLeads: boolean;
  sendEmailOnNewLead: boolean;
  showCommonFolders: boolean;
  leadMandatoryOption:
    | 'email_and_phone'
    | 'either_email_or_phone'
    | 'email_not_mandatory'
    | 'phone_not_mandatory'
    | 'email_and_phone_not_mandatory';
  roleId: string[];
  salesWonButtonText: string;
  houseSizeUnit: 'sq_m2' | 'sq_ft';
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export interface ISettingState {
  setting: setting;
  status: {
    fetch: Status;
    update: Status;
  };
}
