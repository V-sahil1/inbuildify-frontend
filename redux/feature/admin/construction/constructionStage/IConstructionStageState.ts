import { Status } from '@lib/constants/enum';

export interface Stage {
  constructionStage?:string,
  constructionTypeId:string,
  builder: string;
  stageName: string;
  days: number;
  sortOrder: number;
  siteImage:string;
  inspection:string;
  bgColor:string;
  fontColor:string;
}

export interface IStageState {
  stage: Stage[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  }
}
