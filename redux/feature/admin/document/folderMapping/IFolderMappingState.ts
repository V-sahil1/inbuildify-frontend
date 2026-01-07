import { Status } from '@lib/constants/enum';

export interface IFolderMappingState {
  folderMapping: any[];
  status: {
    fetch: Status;
    create: Status;
  };
}
