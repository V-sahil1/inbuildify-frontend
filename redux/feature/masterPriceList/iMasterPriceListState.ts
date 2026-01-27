import { Entity } from 'types/common.types';

export interface IPriceList {
  priceListId: string;
  name: string;
  sortOrder: number;
  showInViewList: boolean;
  isActive: boolean;
  location: string;
  isExpanded?: boolean;
  items?: IPriceListItem[];
}

export interface IPriceListItem {
  priceListItemId: string;
  priceListId: string;
  itemDescription: string;
  shortDescription: string;
  costType: 'Fixed' | 'Variable' | 'Included';
  costTypeText: string | null;
  costOption: string;
  cost: string;
  builderCost: string;
  sortOrder: number;
  uom: string;
  status: 'active' | 'inactive';
  includeByDefault: boolean;
  allowRemoveFromQuotation: boolean;
  showInHlPackage: boolean;
  showOnlyInPackage: boolean;
  rangeId: string[];
  dwellingTypeId: string[];
  priceList: Entity;
  range: Entity[];
  dwelling: Entity[];
  quantity?: number;
  included?: boolean;
  modify?: boolean;
  // extraItemType?: 'Additional' | 'Complimentary' | 'Discount' | 'Note';
}

export interface PricelistItemFtechParams {
  page?: number;
  limit?: number;
  price_list_id?: string;
  range_id?: string;
  dwelling_type_id?: string;
  location_id?: string;
  cost_option?: string;
  item_description?: string;
  sort_order?: string;
  price?: number;
  status?: 'active' | 'inactive';
}

