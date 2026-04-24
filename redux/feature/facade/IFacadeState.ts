import { Entity } from 'types/common.types';
export interface IFacadeState {
  facadeId?: string;
  name: string;
  costType: string;
  cost: string;
  builderCost: string;
  image: string;
  status: true;
  location: Entity;
  dwellingtype: Entity;
  range: Entity;
  standard?: boolean;
  upgrade?: boolean;
  createdAt?: string;
}
export interface GetFacadesParams {
  status?: boolean;
  cost_type?: 'standard' | 'upgrade';
  name?: string;
  dwelling_type_id?: string;
  range_id?: string;
  floor_plan_id?: string;
  page?: number;
  limit?: number;
  standard?: boolean;
  upgrade?: boolean;
  location_id?: string;
  search?: string;
}
