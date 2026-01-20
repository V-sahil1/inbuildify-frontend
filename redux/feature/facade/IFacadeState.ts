import { Entity } from "types/common.types";

export interface IFacadeState {
  facadeId: string,
  name: string,
  costType: string,
  cost: string,
  builderCost: string,
  image: string,
  status: true,
  location: Entity,
  dwellingtype: Entity,
  range: Entity,
}
