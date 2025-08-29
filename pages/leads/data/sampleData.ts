import { Package } from '@redux/feature/package/IPackageState';
import { Quotation, LeadDetails, PropertyDetails, Plan, Facade, Category } from './types';

export const quotationData: Quotation = {
  id: 'MYH23070085',
  version: 'V1',
  status: 'Draft',
  // range: 'Premium',
  // dwellingType: 'Single Storey',
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
    packageId: '1', 
    name: 'Premium Pack', 
    amount: "5000", 
    categoryItemDescriptions: [
       'High-end wooden flooring',
       'Premium ceramic tiles for bathroom',
       'Complete home automation system',
       'High-quality interior paint',
    ],
    builderId: '1',
    categoryItemIds: ['1', '2', '3', '4'],
    createdAt: '2023-07-13T00:00:00.000Z',
    updatedAt: '2023-07-13T00:00:00.000Z'
  }
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