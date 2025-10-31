import { PropertyDetails, QuotationVersion } from 'data/types';
import { ILeadContact } from '../lead/ILeadState';
import { IFloorPlanState } from '../floorPlan/IFloorPlanState';
import { IFacadeState } from '../facade/IFacadeState';
import { Package } from '../package/IPackageState';
export interface QuotationItem {
  price: number;
  total: number;
  itemId: string;
  quantity: number;
}

export interface Builder {
  builderId: string;
  name: string;
}
export interface Lead {
  leadId: string;
  status: string;
  leadContact: ILeadContact;
}
export interface QuotationResponse {
  slugId: string;
  leadId: string;
  quotationId: string;
  createdAt: string;
  updatedAt: string;
  totalAmount: number;
  builder: Builder;
  lead: Lead;
  property: PropertyDetails;
  floorPlan: IFloorPlanState;
  propertyAddress: string;
  leadStatus?: string;
  facade: IFacadeState;
  package: Package;
  range: {
    rangeId: string;
    name: string;
  };
  dwellingType: {
    dwellingTypeId: string;
    name: string;
  };
  versions?: Record<string, QuotationVersion[]>;
  items?: QuotationVersion[];
}

export type QuotationItemPayload = {
  range?: string;
  dwellingType?: string;
  leadId?: string;
  propertyId?: string;
  floorPlanId?: string;
  facadeId?: string;
  packageId?: string;
  items: {
    itemId: string;
    quantity: number;
    price: number;
    total: number;
  }[];
};
