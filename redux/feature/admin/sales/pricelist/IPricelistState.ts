import { Status } from '@lib/constants/enum';

export interface PriceListResponse {
  priceListId: string;
  companyId: string;
  builderId: string;
  name: string;
  sortOrder: number;
  showInViewList: boolean;
  isActive: boolean;
  location: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PriceList {
  priceListId?: string;
  name: string;
  sortOrder: number;
  showInViewList: boolean;
  isActive: boolean;
  location: string;
}

export interface IPricelistState {
  pricelist: PriceList[];
  status: Status;
}
