import { Status } from '@lib/constants/enum';

export interface Stage {
  constructionStage?: string;
  constructionTypeId: string;
  builder: string;
  stageName: string;
  days: number;
  sortOrder: number;
  siteImage: boolean;
  inspection: string;
  bgColor: string;
  fontColor: string;
}

export type ConstructionStageResponse = {
  constructionStage: string;
  constructionTypeId: string;
  builder: string;
  stageName: string;
  days: number;
  sortOrder: number;
  siteImage: boolean;
  inspection: string;
  bgColor: string;
  fontColor: string;
};

export interface IStageState {
  stage: Stage[];
  status: {
    fetch: Status;
    create: Status;
  };
}
