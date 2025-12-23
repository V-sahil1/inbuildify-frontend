import { Status } from '@lib/constants/enum';

export interface GeneralSetting {
  id: string;
  notificationReferralPartner: boolean;
  pdfPasswordProtected: boolean;
  pdfPassword: string;
  roundOfCost: boolean;
  negativeValueShow: boolean;
  negativeValueColor: string;
  showReferenceIdInPdf: string;
  jobIdLabel: string;
}

export interface GeneralSettingResponse {
  id: string;
  notificationReferralPartner: boolean;
  pdfPasswordProtected: boolean;
  pdfPassword: string;
  roundOfCost: boolean;
  negativeValueShow: boolean;
  negativeValueColor: string;
  showReferenceIdInPdf: string;
  jobIdLabel: string;
  companyId: string;
  builderId: string;
}

export interface IGeneralSettingState {
  settings: GeneralSetting;
  status: {
    fetch: Status;
    update: Status;
  };
}
