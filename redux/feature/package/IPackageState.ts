import { Entity } from 'types/common.types';

export type Package = {
  packageId?: string;
  name: string;
  allowAddItemFromPricelist?: boolean;
  allowRemovePackageItems?: boolean;
  status?: boolean;
  sortOrder?: number;
  builderCost?: number;
  cost: number;
  categoryItems?: {
    id: string;
    desc: string;
    price: string;
  }[];
  amount?: string;
  dwellingTypeId?: string[];
  rangeId?: string[];
  range?: Entity[];
  dwellingType?: Entity[];
  packageGroupId?: string[];
  packageGroup?: Entity[];
  pricelistItems?: PackagePricelist[];
};
export type GroupType = {
  packageGroupId: string;
  packageId: string;
  name: string;
  noOfPackages: string;
};

export type PackagePricelist = {
  id?: string;
  packageId?: string;
  priceListItemId: string;
  uom?: string;
  cost?: number | null;
  costType?: 'Variable' | 'Included' | 'Fixed' | string;
  itemDescription?: string;
  shortDescription?: string;
};

export type PackageFetchParams = {
  page?: number;
  limit?: number;
  name?: string;
  status?: boolean;
  sort_order?: string;
  cost?: number;
  add?: boolean;
  remove?: boolean;
  dwelling_type_id?: string;
  range_id?: string;
};
