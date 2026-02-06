export interface IFloorPlanState {
  floorPlanId: string;
  name: string;
  minLandWidth: string;
  minLandDepth: string;
  dwellingArea: string;
  dwellingTypeId: string | null;
  image: string;
  beds: number;
  baths: number;
  carpark: number;
  living: number;
  rangeId: string | null;
  garageArea: string;
  porchArea: string;
  alfrescoArea: string;
  totalArea: string;
  detailedImage: string | null;
  simpleImage: string | null;
  description: string;
  status: boolean;
  dwellingTypeName?: string;
  rangeName?: string;
  locationId: string;
  locationName?: string;
  facade?: FloorplanFacade[];
  pricelistItems?: FloorplanPricelist[];
}

export interface FloorplanPricelist {
  id?: string;
  includeDefault?: boolean;
  modify?: boolean;
  quantity: number;
  floorPlanId: string;
  priceListItemId: string;
}

export interface FloorplanFacade {
  id?: string;
  floorPlanId: string;
  facadeId: string;
}

export interface FloorPlanGetParams {
  name?: string;
  dwelling_type_id?: string;
  location_id?: string;
  range_id?: string;
  status?: boolean;
  page?: number;
  limit?: number;
}
