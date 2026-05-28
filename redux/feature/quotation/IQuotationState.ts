import { PropertyDetails } from 'data/types';
import { ILeadContact, LeadContact } from '../lead/ILeadState';
import { IFloorPlanState } from '../floorPlan/IFloorPlanState';
import { IFacadeState } from '../facade/IFacadeState';
import { Package } from '../package/IPackageState';
export type QuotationStatus = 'all' | 'draft' | 'approved' | 'modified' | 'pendingApproval' | 'cancelled' | 'expired';

export type QuotationListItem = {
  quotationId: string;
  referenceNumber: string;
  leadsId: string;
  customerName: string;
  propertyAddress: string;
  propertyDetails?: string;
  contactName: string;
  createdAt: string;
  updatedAt: string;
  status: QuotationStatus;
  approverName: string;
  approverInitials: string;
  assigneeName: string;
  assigneeInitials: string;
  latestVersionId: string | null;
  latestVersionNo?: number | null;
  quotationTotal?: number | string | null;
  versionCount: number;
};

export type QuotationListPagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type QuotationListResponse = {
  data: QuotationListItem[];
  pagination: QuotationListPagination;
};

export type QuotationStatusCounts = {
  total: number;
  approved: number;
  draft: number;
  cancelled?: number;
  expired?: number;
};

export type QuotationFilterOption = {
  optionType?: 'lead' | 'contact';
  optionId?: string;
  optionLabel?: string;
  leadId: string;
  leadsId?: string;
  customerName: string;
  contactName?: string | null;
};

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
  opportunityId?: string;
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
  packageId: string;
  isApprove: boolean;
  sendToEngineer?: boolean;
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
  package?: Package;
  customSections?: CustomSection[];
  property?: any;
  quoteDetails?: string;
  referenceNumber?: string;
  uploadReport?: File | string;
  structureEngineerId?: string | null;
  structuralEngineer?: {
    structuralEngineerId: string;
    name: string;
    email: string;
    price?: number;
  };
  quotationVersionItems?: any[]; 
};

export type QuotationPriceListItem = {
  id?: string;
  quotationVersionId: string;
  quotationVersionItemId?: string;
  priceListItemCost?: string;
  isPackageCostMismatch?: boolean;
  isPriceListItemCostMismatch?: boolean;
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
  rangeId?: string[];
  dwellingTypeId?: string[];
  extraItem?:boolean;
  isAutomaticallyMapped?: boolean;
  priceListItemIsSystemData?: boolean;
};

export type QuotationPackage = {
  id?: string;
  quotationVersionId: string;
  packageId: string;
  price?: number;
  createdAt?: string;
  packageName?: string;
};

export type QuotationComparison = {
  referenceNumber: string;
  propertyAddress: string | null;

  version1: {
    quotationVersionId: string;
    quotationVersionNo: number;
    grandTotalCost: string;
  };

  version2: {
    quotationVersionId: string;
    quotationVersionNo: number;
    grandTotalCost: string;
  };

  items: IQuotationItem[];
};

export type IQuotationItem = PackageItem | FacadeItem | PriceListItem;

type PackageItem = {
  type: 'package';
  name: string;
  packageId: string;
  version1Value: string | null;
  version2Value: string | null;
};

type FacadeItem = {
  type: 'facade';
  name: string;
  version1Value: string | null;
  version2Value: string | null;
};

type PriceListItem = {
  type: 'pricelist_item';
  name: string;
  priceListItemId: string;
  priceListId: string;
  priceListName: string;
  itemCost: string;

  version1Quantity: string | null;
  version1TotalPrice: string | null;
  version1Note: string | null;

  version2Quantity: string | null;
  version2TotalPrice: string | null;
  version2Note: string | null;
};

export type CustomSection = {
  customSectionId: string;
  quotationVersionId: string;
  fileUrl: File | string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  fileName?: string;
};

export type ExtraItem = {
  extraType: 'item' | 'complimentry' | 'discount' | 'note';
  priceListId: string;
  priceListItemDescription: string;
  priceListItemCostType?: 'Fixed' | 'Variable' | string;
  priceListItemCost?: number;
  priceListItemBuilderCost?: number;
  priceListItemUom?: 'SQ_YD' | string;
  quantity?: number;
  note?: string;
  priceListItemCostTypeText?:string;
  priceListItemRangeId?:string[];
  priceListItemDwellingTypeId?:string[]
};
