import { Status } from '@lib/constants/enum';

export interface ISchedularSettingState {
  receiverOfReplies: string[];
  status: {
    fetch: Status;
    update: Status;
  };
}
