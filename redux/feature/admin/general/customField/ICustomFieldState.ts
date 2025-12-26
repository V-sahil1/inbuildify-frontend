import { Status } from '@lib/constants/enum';
export interface CustomField {
  customFieldId?: string;
  moduleId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'checkbox' | 'list' | 'multiline';
  options?: string[];
  sortOrder: number;
  isActive: boolean;
}

export type CustomFieldResponse = {
  customFieldId: string;
  companyId: string;
  builderId: string;
  moduleId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'checkbox' | 'list' | 'multiline';
  options: string[];
  sortOrder: number;
  isActive: boolean;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
};

export interface CustomFieldModule {
  moduleId: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ICustomFieldState {
  customField: CustomField[];
  customFieldModule: CustomFieldModule[];
  status: {
    customFieldModule: Status;
    fetch: Status;
    create: Status;
  };
}
