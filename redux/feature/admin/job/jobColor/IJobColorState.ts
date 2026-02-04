import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';

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

export interface JobColorColumnType {
  jobColorColumnId: string;
  columnName: string;
  displayOption: 'dont_show' | 'show_as_separate_column' | 'show_in_existing_items_column';
  sortOrder: number | null;
  width: number | null;
}

export interface JobColorSection {
  jobColorColumnSectionId: string;
  sectionName: string;
  attachments: File | Object;
  sortOrder: number;
}

export interface IJobColorState {
  jobColor: JobColorSettings | null;
  jobColorColumn: JobColorColumnType[];
  jobColorSection: JobColorSection[];
  jobColorColumnStatus: {
    fetch: Status;
    update: Status;
  };
  jobColorSectionStatus: {
    fetch: Status;
    update: Status;
  };
  status: {
    fetch: Status;
    update: Status;
  };
  pagination:CommonPagination
}
