import { Status } from '@lib/constants/enum';

export interface Category {
  colorCategoryId: string;
  colorId: string;
  categoryName: string;
  image?: string;
  items?: ColorItem[] | null;
  isExpanded?: boolean;
  status: string;
  sortOrder?: number;
  suppliers: string[];
  colorGroup: string[];
  colorName?: string;
  selectionType?: string;
}

export interface ColorType {
  colorId?: string;
  colorName: string;
  status: boolean | string;
  sortOrder: number;
  colorCategories?: Category[] | null;
  isExpanded?: boolean;
  loadingItems?: boolean;
}
export interface ColorItem {
  colorItemId: string;
  companyId: string;
  builderId: string;
  colorCategoryId?: string;
  itemName: string;
  itemCode: string;
  supplierId: string;
  upgradeOption: string | null;
  costType: string;
  cost: string | number | null;
  features: string | null;
  description: string | null;
  specificationName: string | null;
  sortOrder: number;
  units: string;
  colorImage: any[];
  specification: any[];
  status: boolean;
  customFields?: ColorItemCustomField[];
  colorGroups?: { colorGroupId: string; colorGroupName: string }[];
}

export interface ColorItemCopy {
  colorId: string;
  colorCategoryId: string;
  itemName: string;
  sortOrder: number;
}

export interface ColorGroup {
  colorGroupId?: string;
  name: string;
  status?: boolean;
  items?: ColorGroupItem[] | null;
}

export interface IColorType {
  colorTypeId?: string;
  colorTypeName: string;
}

export interface ColorGroupItem {
  id?: string;
  colorGroupId: string;
  colorItemId: string;
}

export interface ColorItemCustomField {
  colorItemCustomFieldId?: string;
  colorItem: string;
  fieldType: string;
  fieldName: string;
  requiredField: boolean;
  sortOrder: number;
  colorItemName: string;
}
export interface ColorInitialState {
  status: {
    color: {
      fetch: Status;
      create: Status;
    };
    category: {
      fetch: Status;
      create: Status;
    };
    group: {
      fetch: Status;
      create: Status;
    };
    colorItem: {
      fetch: Status;
      create: Status;
    };
    colorType: {
      fetch: Status;
      create: Status;
    };
    colorItemCustomField: {
      fetch: Status;
      create: Status;
    };
    colorGroupItem: {
      fetch: Status;
      create: Status;
    };
  };
  color: ColorType[];
  colorGroup: ColorGroup[];
  colorType: IColorType[];
  colorItems: ColorItem[];
}
