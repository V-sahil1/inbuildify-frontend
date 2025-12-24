import { Status } from '@lib/constants/enum';
export interface CustomField {
  customFieldId: string;
  moduleId: string;
  fieldName: string;
  fieldType: string;
  options?: string[];
  sortOrder: number;
  isActive: boolean;
}

export interface CustomFieldModule {
  moduleId:string;
  name:string;
  description?:string;
}

export interface ICustomFieldState {
  customField: CustomField[];
  customFieldModule:CustomFieldModule[]
  status: {
    customFieldModule:Status;
    fetch: Status;
    update: Status;
    create: Status;
  };
}
