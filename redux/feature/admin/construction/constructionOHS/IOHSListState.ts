import { Status } from '@lib/constants/enum';

export interface OHSListSetting {
  signatureRequired: boolean;
  minimumAudits: number;
}

export interface OHSListCategory {
  constructionOhsListId: string;
  isExpanded: boolean;
  items: OHSListCategory[];
  fieldType: string;
  description: string;
  parentId?: string;
  sortOrder?: number;
  addDefaults?: boolean;
  fieldName?: string;
}

export interface IOHSListState {
  setting: OHSListSetting;
  ohsCategory: OHSListCategory[];
  status: {
    setting: {
      fetch: Status;
      create: Status;
    };
    ohsCategory: {
      fetch: Status;
      create: Status;
    };
    ohsItem: {
      fetch: Status;
      create: Status;
    };
  };
}
