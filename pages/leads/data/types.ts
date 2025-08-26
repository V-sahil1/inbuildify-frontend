export interface Quotation {
    id: string;
    version: string;
    status: 'Draft' | 'Approved' | 'Sent';
    range: string;
    dwellingType: string;
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
    lot: string;
    location: string;
    titleDate: string;
    type: string;
    width?: string;
    depth?: string;
    total?: string;
  }
  
  export interface Plan {
    id: string;
    name: string;
    bedrooms: number;
    bathrooms: number;
    garage: number;
    area: string;
  }
  
  export interface Facade {
    id: string;
    name: string;
    type: string;
  }
  
  export interface PackageItem {
  id: string;
  name: string;
  description?: string;
  quantity?: number;
  unit?: string;
}

export interface Package {
  id: string;
  name: string;
  price: number;
  description?: string;
  items?: PackageItem[];
}
  
  export interface QuotationItem {
    id: string;
    name: string;
    tags: string[];
    quantity: number;
    price: number;
    total: number;
  }
  
  export interface Category {
    categoryId: string;
    name: string;
    items: QuotationItem[];
  }


export interface PropertyDetails {
    lot: string;
    location: string;
    titleDate: string;
    type: string;
    width?: string;
    depth?: string;
    total?: string;
    // Extended fields for the form
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
    siteFall?: string;
    landFill?: string;
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