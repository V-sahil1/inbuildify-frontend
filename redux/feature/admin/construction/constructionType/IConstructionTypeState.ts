import { Status } from '@lib/constants/enum';
export interface Type {
  constructionTypeId?:string,
  builder: string;
  typesName: string;
  startConstructionDays: number;
  sortOrder: number;
  dwellingType:string[]
}

export interface ITypeState {
  type: Type[];
  status: {
    fetch: Status;
    update: Status;
    create: Status;
  }
}
