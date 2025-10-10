import { Status } from "@lib/constants/enum";

export interface SubCategory {
  colorSubCategoryId: string;
  colorCategoryId: string;
  name: string;
  description: string;
  image?: string;
  items: SubCategoryItem[] | null;
  isExpanded: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ColorCategory { 
  colorCategoryId: string; 
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  subCategories: SubCategory[] | null;
  isExpanded: boolean;
  loadingItems: boolean;
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
}

export interface ColorInitialState {
  status: Status;
  ColorCategory: ColorCategory[];
  loading: boolean;
}
