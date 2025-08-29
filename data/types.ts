export interface Quotation {
    id: string;
    version: string;
    status: 'Draft' | 'Approved' | 'Sent';
    // range: string;
    // dwellingType: string;
    expiryDate: string;
    total: number;
  }
  
  export interface LeadDetails {
    name: string;
    phone: string;
    email: string;
    address: string;
    contacts?: any[];
    country: string;
    city: string;
    state: string;
    zipCode: string;
    source: string;
    status: string;
    notes: string;
  }
  
  export interface PropertyDetails {
    lead_id?: string;
    leadId?: string;
    propertyId?: string;
    lot: string;
    location: string;
    titleDate: string;
    type: string;
    widthM?: string;
    depthM?: string;
    totalSizeM2?: string;
    country?: string;
    address1?: string;
    address2?: string;
    citySuburb?: string;
    stateRegion?: string;
    zipPostalCode?: string;
    estateName?: string;
    titleStatus?: string;
    compactionReport?: string;
    landType?: string;
    siteFallMm?: string;
    landFillMm?: string;
    bushFire?: string;
    cornerBlock?: string;
  }
  
  export interface Plan {
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    garage: number;
    area: string;
  }
  
  // export interface Facade {
  //   id: string;
  //   name: string;
  //   type: string;
  // }
  
//   export interface PackageItem {
//   id: string;
//   name: string;
//   description?: string;
//   quantity?: number;
//   unit?: string;
// }

// export interface Package {
//   id: string;
//   name: string;
//   price: number;
//   description?: string;
//   items?: PackageItem[];
// }