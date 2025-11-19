import { FormField } from '@/components/common/Models/ActionDialogModel';
export interface FileItem {
  uid: string;
  lastModified: number;
  lastModifiedDate: string;
  name: string;
  size: number;
  type: string;
  percent: number;
  originFileObj: Record<string, any>;
  error: Record<string, any>;
  response: Record<string, any>;
  status: string;
  xhr: Record<string, any>;
  thumbUrl: string;
}
export type DataType = {
  id?: string;
  sectionName?: string;
  sectionTitle?: string;
  merge?: boolean;
  sort?: number;
  file?: FileItem;
};

export const sectionFields: FormField[] = [
  {
    label: 'Section Name',
    name: 'sectionName',
    type: 'select',
    options: [{ label: 'Attach PDF', value: 'Attach PDF' }],
  },
  { label: 'Sort Order', name: 'sort', type: 'number' },
  { label: 'Upload', name: 'file', type: 'image' },
];

export type contractDataType = {
  id?: string;
  builderName: string;
  formatName: string;
  createdDate?: string;
  updatedDate?: string;
  status: string;
  contract: string;
};

export const contractdata: contractDataType[] = [
  {
    id: '1',
    builderName: 'My Home',
    formatName: 'Home',
    createdDate: '30-09-2025',
    updatedDate: '30-09-2025',
    status: 'Active',
    contract: 'Yes',
  },
  {
    id: '2',
    builderName: 'My Home2',
    formatName: 'Dulger homes test',
    createdDate: '31-08-2025',
    updatedDate: '01-09-2025',
    status: 'Active',
    contract: 'No',
  },
  {
    id: '3',
    builderName: 'My Home3',
    formatName: 'Dulger homes test',
    createdDate: '31-08-2025',
    updatedDate: '01-09-2025',
    status: 'Active',
    contract: 'No',
  },
  {
    id: '4',
    builderName: 'My Home4',
    formatName: 'Dulger homes test',
    createdDate: '31-08-2025',
    updatedDate: '01-09-2025',
    status: 'Active',
    contract: 'No',
  },
];
