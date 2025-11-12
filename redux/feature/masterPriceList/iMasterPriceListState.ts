// categoriesSlice.ts
export interface Item {
  name?: string;
  cost?: number;
  type?: 'Fixed' | 'Variable' | 'Included';
  costType?: 'FIXED' | 'VARIABLE' | 'INCLUDED';
  categoryItemId?: string;
  categoryId?: string;
  shortDescription?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  rangeId?: string;
  dwellingTypeId?: string;
  dwellingTypeName?: string;
  costOption?: string;
  status?: string;
  rangeName?: string;
  // extraItemType?: 'Additional' | 'Complimentary' | 'Discount' | 'Note';
  // builderCost?: number
}

export interface Category {
  categoryId: string;
  name: string;
  description: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  items: Item[] | null;
  isExpanded: boolean;
  loadingItems: boolean;
}

export interface CategoriesState {
  categories: Category[];
  loading: boolean;
}

export interface RequestItem {
  category_id: string;
  description: string;
  short_description?: string;
  cost_type: string;
  cost?: number;
  cost_type_text?: string;
  cost_option?: string;
  include_by_default?: boolean;
  show_in_hl_package?: boolean;
  package_only?: boolean;
  uom?: string;
  sort_order?: number;
  range?: string;
  dwelling?: string;
  conditions?: {
    name: string;
    range_start: string;
    range_end: string;
  }[];
  status?: string;
  builderCost?: number;
  // extraItemType?: string;
  // builderCost?: number
}
