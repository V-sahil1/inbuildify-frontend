import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
export interface ConstructionType {
  constructionTypeId?: string;
  builder: Entity;
  typesName: string;
  startConstructionDays: number;
  sortOrder: number;
  dwellingType: Entity[];
}

export interface ITypeState {
  type: ConstructionType[];
  status: {
    fetch: Status;
    create: Status;
  };
}
