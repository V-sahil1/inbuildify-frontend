import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface FileNamingRule {
  documentFileNamingRuleId?: string;
  fileType: string;
  folderNames: Entity[];
  namingFormat: string;
}

export interface IFileNamingState {
  files: FileNamingRule[];
  namingFormat: string;
  namingFormatStatus: {
    fetch: Status;
    create: Status;
  } ;
  status: {
    fetch: Status;
    create: Status;
  };
}
