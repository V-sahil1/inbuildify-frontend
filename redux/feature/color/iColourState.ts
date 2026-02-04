import { Status } from '@lib/constants/enum';

export interface Category {
  colorCategoryId: string;
  colorId: string;
  categoryName: string;
  image?: string;
  items: SubCategoryItem[] | null;
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
  status: string;
  sortOrder?: number;
  suppliers: string[];
  colorGroups:string[]; 
  createdBy?: string;
  updatedBy?: string;
  colorName?: string;
}

export interface ColorMaster {
  colorId?: string;
  colorName: string;
  status: string;
  sortOrder: number;
  companyId: string;
  builderId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  subCategories: Category[] | null;
  isExpanded: boolean;
  loadingItems: boolean;
}

export interface Color {
  // colorCategoryId?: string;
  colorId: string;
  colorName: string;
  status: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
  colorCategories?: Category[] | null;
  isExpanded?: boolean;
  loadingItems?: boolean;
  companyId?: string;
  builderId?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface ColorMaster{
  colors: Color[];
  pagination ?:{
    currentPage: number;
    limit: number;
    total: number;
    totalPages: number;
  }

}

export interface SubCategoryItem {
  colorItemId: string;
  colorSubCategoryId: string;
  builderId: string;
  name: string;
  code: string;
  standard: boolean;
  upgrade: boolean;
  units: number;
  notes: string;
  highlightNotesOnPdf: boolean;
  supplierId: string;
  image: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  expirationDate?: string;
  isActive?: boolean;
}
export interface ColorGroup {
  colorGroupId?: string,
  companyId?: string,
  builderId?: string,
  name: string,
  status?: boolean,
  createdBy?: string,
  updatedBy?: string,
  createdAt?: string,
  updatedAt?: string
}
export interface ColorInitialState {
  status: Status;
  Color: Color[];
  ColorGroup: ColorGroup[];
  loading: boolean;
}