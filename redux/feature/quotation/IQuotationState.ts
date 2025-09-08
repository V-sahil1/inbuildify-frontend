import { QuotationVersion } from "data/types";
export interface QuotationItem {
    price: number;
    total: number;
    itemId: string;
    quantity: number;
  }
  
  export interface QuotationResponse {
    slugId: string;
    quotationId: string;
    builderId: string;
    leadId: string;
    propertyId: string;
    floorPlanId: string;
    facadeId: string;
    packageId: string;
    rangeId: string;
    dwellingTypeId: string;
    totalAmount: number;
    items: QuotationItem[];
    createdAt: string;
    updatedAt: string;    
    builderName?: string;
    leadStatus?: string;
    propertyAddress?: string;
    floorPlanName?: string;
    facadeName?: string;
    packageName?: string;
    rangeName?: string;
    dwellingTypeName?: string;
    versions: QuotationVersion[];
  }
  
  export type QuotationItemPayload = {
    range: string;
    dwellingType: string;
    leadId: string;
    propertyId: string;
    floorPlanId: string;
    facadeId: string;
    packageId: string;
    items: {
      itemId: string;
      quantity: number;
      price: number;
      total: number;
    }[];
  };
  