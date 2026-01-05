import { Status } from '@lib/constants/enum';

export interface IConstructionOption {
  constructionOptionId?: string;
  optionName: string;
}

export interface IonstructionOptionState {
  constructionOption: IConstructionOption[];
  status: {
    fetch: Status;
    create: Status;
  };
}
