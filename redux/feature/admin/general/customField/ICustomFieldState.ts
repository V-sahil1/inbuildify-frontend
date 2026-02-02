import { Status } from '@lib/constants/enum';
import { CommonPagination } from '@redux/feature/common/ICommonState';
export interface CustomField {
  customFieldId?: string;
  moduleId: string;
  fieldName: string;
  fieldType: 'text' | 'number' | 'date' | 'checkbox' | 'list' | 'multiline';
  options?: string[];
  sortOrder: number;
  isActive: boolean;
}

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
  pagination:CommonPagination
}
