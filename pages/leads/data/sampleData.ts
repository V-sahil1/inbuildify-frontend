import { Quotation, LeadDetails, PropertyDetails, Plan, Facade, Package, Category } from './types';

export const quotationData: Quotation = {
  id: 'MYH23070085',
  version: 'V1',
  status: 'Draft',
  range: 'Premium',
  dwellingType: 'Single Storey',
  expiryDate: '21-09-2023',
  total: 5000
};

export const leadDetails: LeadDetails = {
  name: 'Yash Murthy',
  phone: '0406166590',
  email: 'yashmurthy@nsimplify.com.au',
  address: '45 Tallis Cct, Truganina, Victoria, 3029',
  country: 'Australia',
  city: 'Melbourne',
  state: 'Victoria',
  zipCode: '3029',
  source: 'Online',
  status: 'Active',
  notes: 'No notes'
};

export const propertyDetails: PropertyDetails = {
  lot: 'Lot 234',
  location: 'Tarneit, Victoria, 3029',
  titleDate: '13-07-2023 (Estimated)',
  type: 'Regular',
  width: '6',
  depth: '0',
  total: '25.00'
};

export const availablePlans: Plan[] = [
  { id: '1', name: 'My Home 1', bedrooms: 4, bathrooms: 2, garage: 2, area: '6 x 0 = 25.00' },
  { id: '2', name: 'Contemporary 200', bedrooms: 3, bathrooms: 2, garage: 2, area: '7 x 0 = 30.00' },
  { id: '3', name: 'Modern Villa', bedrooms: 4, bathrooms: 3, garage: 2, area: '8 x 0 = 35.00' },
];

export const availableFacades: Facade[] = [
  { id: '1', name: 'LXL 81', type: 'Standard' }
];

export const availablePackages: Package[] = [
  { 
    id: '1', 
    name: 'Premium Pack', 
    price: 5000, 
    description: 'Includes premium finishes and extras',
    items: [
      { id: 'i1', name: 'Premium Flooring', description: 'High-end wooden flooring', quantity: 1, unit: 'sqm' },
      { id: 'i2', name: 'Designer Tiles', description: 'Premium ceramic tiles for bathroom', quantity: 2, unit: 'box' },
      { id: 'i3', name: 'Smart Home System', description: 'Complete home automation system', quantity: 1, unit: 'set' },
      { id: 'i4', name: 'Premium Paint', description: 'High-quality interior paint', quantity: 10, unit: 'liters' },
    ]
  },
  { 
    id: '2', 
    name: 'Standard Pack', 
    price: 3000, 
    description: 'Standard inclusions and finishes',
    items: [
      { id: 'i5', name: 'Standard Flooring', description: 'Laminate flooring', quantity: 1, unit: 'sqm' },
      { id: 'i6', name: 'Basic Tiles', description: 'Standard ceramic tiles', quantity: 1, unit: 'box' },
      { id: 'i7', name: 'Standard Paint', description: 'Regular interior paint', quantity: 8, unit: 'liters' },
    ]
  },
  { 
    id: '3', 
    name: 'Luxury Pack', 
    price: 8000, 
    description: 'Top-tier luxury inclusions',
    items: [
      { id: 'i8', name: 'Luxury Marble Flooring', description: 'Imported Italian marble', quantity: 1, unit: 'sqm' },
      { id: 'i9', name: 'Smart Home Pro', description: 'Advanced home automation with AI', quantity: 1, unit: 'set' },
      { id: 'i10', name: 'Premium Kitchen Set', description: 'Custom-designed luxury kitchen', quantity: 1, unit: 'set' },
      { id: 'i11', name: 'Home Theater System', description: 'Dolby Atmos surround system', quantity: 1, unit: 'set' },
      { id: 'i12', name: 'Luxury Bath Fittings', description: 'Designer bathroom fixtures', quantity: 3, unit: 'set' },
    ]
  },
];

export const categories: Category[] = [
  {
    id: 'base-price',
    name: 'Base Price',
    items: [
      {
        id: '1',
        name: 'Base price for Single Storey',
        tags: ['Base Price', 'Variable', 'sq', 'Premium', 'Single Storey'],
        quantity: 1,
        price: 11500.00,
        total: 11500.00
      },
      {
        id: '2',
        name: 'Base price for Single Storey 16 Sq',
        tags: ['Base Price', 'Fixed'],
        quantity: 1,
        price: 182000.00,
        total: 182000.00
      },
      {
        id: '3',
        name: 'Base Price for Single Storey 17Sq',
        tags: ['Base Price', 'Fixed'],
        quantity: 1,
        price: 200000.00,
        total: 200000.00
      },
      {
        id: '4',
        name: 'Base Price for Single Storey 25 Sq',
        tags: ['Base Price', 'Fixed'],
        quantity: 1,
        price: 280000.00,
        total: 280000.00
      }
    ]
  },
  {
    id: 'site-costs',
    name: 'Site Costs',
    items: [
      {
        id: '5',
        name: 'Site preparation',
        tags: ['Site Costs', 'Fixed'],
        quantity: 1,
        price: 5000.00,
        total: 5000.00
      },
      {
        id: '6',
        name: 'Excavation',
        tags: ['Site Costs', 'Variable'],
        quantity: 2,
        price: 2500.00,
        total: 5000.00
      }
    ]
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    items: [
      {
        id: '7',
        name: 'Premium Kitchen Package',
        tags: ['Kitchen', 'Premium'],
        quantity: 1,
        price: 15000.00,
        total: 15000.00
      },
      {
        id: '8',
        name: 'Stone Benchtops',
        tags: ['Kitchen', 'Premium'],
        quantity: 1,
        price: 3000.00,
        total: 3000.00
      }
    ]
  },
  {
    id: 'electrical',
    name: 'Electrical',
    items: [
      {
        id: '9',
        name: 'Standard Electrical Package',
        tags: ['Electrical', 'Fixed'],
        quantity: 1,
        price: 8000.00,
        total: 8000.00
      }
    ]
  },
  {
    id: 'pre-construction',
    name: 'Pre-Construction',
    items: [
      {
        id: '10',
        name: 'Building Permits',
        tags: ['Pre-Construction', 'Fixed'],
        quantity: 1,
        price: 2000.00,
        total: 2000.00
      }
    ]
  },
  {
    id: 'retaining-wall',
    name: 'Retaining Wall',
    items: [
      {
        id: '11',
        name: 'Concrete Retaining Wall',
        tags: ['Retaining Wall', 'Variable'],
        quantity: 10,
        price: 150.00,
        total: 1500.00
      }
    ]
  },
  {
    id: 'council-requirements',
    name: 'Council Requirements',
    items: [
      {
        id: '12',
        name: 'Council Fees',
        tags: ['Council Requirements', 'Fixed'],
        quantity: 1,
        price: 1500.00,
        total: 1500.00
      }
    ]
  },
  {
    id: 'external-structure',
    name: 'External Structure',
    items: [
      {
        id: '13',
        name: 'Outdoor Entertainment Area',
        tags: ['External Structure', 'Premium'],
        quantity: 1,
        price: 12000.00,
        total: 12000.00
      }
    ]
  }
];