import { Status } from '@lib/constants/enum';

export interface IDrive {
  driveId: string;
  name: string;
}


export interface IDriveState {
  drives: IDrive[];
  status: {
    fetch: Status;
    create: Status;
  };
}
