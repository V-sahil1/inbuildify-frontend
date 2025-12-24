import { Status } from '@lib/constants/enum';
export interface screen {
  screenId?:string,
  name: string;
}

export interface IScreenState {
  screen: screen[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  };
}
