import { Status } from '@lib/constants/enum';
export interface setting {
  salesModuleSettingsId?:string,
  allowDuplicateLeads: boolean;
  sendEmailOnNewLead: boolean;
  showCommonFolders: boolean;
  leadMandatoryOption: string;
  roleId: string[];
  salesWonButtonText: string;
  houseSizeUnit: string;
}

export interface ISettingState {
  setting: setting;
  status: {
    fetch:Status
  }
}
