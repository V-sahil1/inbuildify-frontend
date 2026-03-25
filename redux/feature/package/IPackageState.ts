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
  search?: string;
  page?: number;
  limit?: number;
  status?: boolean;
  dwelling_type_id?: string;
  range_id?: string;
  package_group_id?: string;
  name?: 'asc' | 'desc' | string;
  cost?: 'asc' | 'desc' | string;
  builder_cost?: 'asc' | 'desc' | string;
};
