import { PropertyDetails } from 'data/types';
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

//new

export type Quotation = {
  quotationId: string;
  leadsId: string;
  referenceNumber: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string | null;
  totalAmount?: number;
  leadStatus: string;
  versions: QuotationVersionDetails[];
};

export type QuotationVersion = {
  quotationVersionId: string;
  quotationVersionNo: number;
  locationId: string | null;
  rangeId: string | null;
  dwellingTypeId: string | null;
  floorPlanId: string | null;
  facadeId: string | null;
  isApprove: boolean;
  sketchNumber: string | null;
  totalPackageCost: number;
  totalPricelistCost: number;
  grandTotalCost: number;
  createdAt: string;
  updatedAt: string;
};

export type QuotationVersionDetails = {
  quotationVersionId: string;
  quotationId?: string;
  quotationVersionNo: number;
  locationId: string | null;
  rangeId: string | null;
  dwellingTypeId: string | null;
  floorPlanId: string | null;
  facadeId: string | null;
  isApprove: boolean;
  sketchNumber: string | null;
  createdAt: string;
  updatedAt: string;
  locationName?: string | null;
  rangeName?: string | null;
  dwellingTypeName?: string | null;
  floorPlanName?: string | null;
  facadeName?: string | null;
  totalPackageCost: string;
  totalPricelistCost: string;
  grandTotalCost: string;
  leadId?: string;
  leadLotId?: string | null;
  leadContacts?: LeadContact[];
  floorPlan?: IFloorPlanState;
  facade?: IFacadeState;
  packages?: Package[];
};

export type LeadContact = {
  id: string;
  contactId: string;
  name: string;
  email: string;
  phone: string;
};

export type QuotationPriceListItem = {
  id?: string;
  quotationVersionId: string;
  priceListItemId: string;
  quantity: number;
  note?: string;
  totalPrice?: string;
  createdAt?: string;
  updatedAt?: string;
  itemDescription?: string;
  shortDescription?: string;
  itemCost?: number;
  costType?: 'Fixed' | 'Variable' | 'Included';
  uom?: string;
};

export type QuotationPackage = {
  id?: string;
  quotationVersionId: string;
  packageId: string;
  price?: number;
  createdAt?: string;
  packageName?: string;
};
