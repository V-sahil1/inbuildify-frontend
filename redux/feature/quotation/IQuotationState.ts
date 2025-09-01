export interface QuotationItem {
    price: number;
    total: number;
    itemId: string;
    quantity: number;
  }
  
  export interface QuotationResponse {
    quotationId: string;
    builderId: string;
    leadId: string;
    propertyId: string;
    floorPlanId: string;
    facadeId: string;
    packageId: string;
    rangeId: string;
    dwellingTypeId: string;
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
  