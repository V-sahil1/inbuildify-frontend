import { Status } from '@lib/constants/enum';
export interface functionality {
  functionalityId?:string,
  screenId: string;
  name: string;
}

export interface IFunctionaltyState {
  functionality: functionality[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  };
}
