import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IDocumentCommonFolder {
  documentCommonFolderId: string;
  name: string;
  sortOrder: number;
  notify: boolean;
  shareToCustomer: boolean;
  isLocked: boolean;
  roles: Entity[];
  users: Entity[];
  subFolder?: DocumentSubFolder[];
  isExpanded?: boolean;
}

export interface DocumentSubFolder {
  documentCommonSubfolderId: string;
  documentCommonFolderId: string;
  name: string;
  sortOrder: number;
}

export interface IDocumentAreaState {
  commonFolder: IDocumentCommonFolder[];
  subFolderStatus: {
    fetch: Status;
    create: Status;
  };
  status: {
    fetch: Status;
    create: Status;
  };
}
