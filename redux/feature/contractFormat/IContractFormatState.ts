import { Status } from '@lib/constants/enum';

export interface ContractFormatType {
  contractFormatId: string;
  builder: string;
  builderName: string;
  formatName: string;
  defaultFormat: boolean;
  status: boolean;
  updatedAt: string;
  createdAt: string;
  sections: ContractFormatSectionType[];
}

export interface ContractFormatSectionType {
  contractSectionId?: string;
  contractFormatId: string;
  sectionName: string;
  sectionUrl: File | string;
  sortOrder: number;
}

export interface ContractFormatFilterPayload {
  builder?: string;
  format_name?: string;
  created_at?: string;
  updated_at?: string;
  status?: boolean;
  default_format?: boolean;
  start_date?: string;
  end_date?: string;
  start_updated_date?: string;
  end_updated_date?: string;
}

export interface IContractFormatState {
  contractFormat: ContractFormatType[];
  contractDetail: ContractFormatType;
  contractDetailStatus: Status;
  status: {
    fetch: Status;
    create: Status;
  };
  contractSectionStatus: {
    fetch: Status;
    create: Status;
  };
}
