import { Status } from '@lib/constants/enum';

export interface ConstructionStage {
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

export interface IStageState {
  stage: ConstructionStage[];
  status: {
    fetch: Status;
    create: Status;
  };
}
