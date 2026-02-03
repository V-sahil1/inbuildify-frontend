import { Status } from '@lib/constants/enum';

export type IDwellingType = {
  dwellingTypeId: string;
  name: string;
  isActive: boolean;
  isNew?: boolean;
};

export interface IdwellingTypeState {
  dwellingType: IDwellingType[];
  status: {
    fetch: Status;
    create: Status;
  };
}
