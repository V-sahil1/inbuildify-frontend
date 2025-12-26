import { Status } from '@lib/constants/enum';

export type quotationSetting = {
  quotationSettingsId: string;
  allowSaveAsNewVersion: boolean;
  mandatoryContactDetails: boolean;
  mandatoryDwellingType: boolean;
  mandatorySketchNumber: boolean;
  mandatoryLandTitle: boolean;
  enableDwellingSize: boolean;
  enableBuilderCost: boolean;
  allowNotes: boolean;
  allowCostAdjustment: boolean;
  showNotesByDefault: boolean;
  allowMultiplePackages: boolean;
  includeAdditionalItemsInPriceAdjustedList: boolean;
  autoApproveOnSalesWon: boolean;
  showDefaultPricelistInAdditionalItems: boolean;
  hidePriceToCustomer: boolean;
  enableEstimatedPriceRange: boolean;
  quotationValidityDays: number;
  extendValidityFromUpdatedDate: number;
  renameSendForApprovalButton: string | null;
  defaultPricelistId: string | null;
};

export interface IQuotationSettingState {
  quotationSetting: quotationSetting;
  status: {
    fetch: Status;
    update: Status;
  };
}
