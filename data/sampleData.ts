import { Construction } from '@redux/feature/construction/IConstructionState';
import { ColorCategory, JobVariationDataType, JobVariationItems, LeadDetails } from './types';
// export const quotationData: Quotation = {
//   id: 'MYH23070085',
//   version: 'V1',
//   status: 'Draft',
//   // range: 'Premium',
//   // dwellingType: 'Single Storey',
//   expiryDate: '21-09-2023',
//   total: 5000
// };

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

// export const propertyDetails: PropertyDetails = {
//   lot: 'Lot 234',
//   location: 'Tarneit, Victoria, 3029',
//   titleDate: '13-07-2023 (Estimated)',
//   type: 'Regular',
//   width: '6',
//   depth: '0',
//   total: '25.00'
// };

// export const availablePlans: Plan[] = [
//   { id: '1', name: 'My Home 1', bedrooms: 4, bathrooms: 2, garage: 2, area: '6 x 0 = 25.00' },
//   { id: '2', name: 'Contemporary 200', bedrooms: 3, bathrooms: 2, garage: 2, area: '7 x 0 = 30.00' },
//   { id: '3', name: 'Modern Villa', bedrooms: 4, bathrooms: 3, garage: 2, area: '8 x 0 = 35.00' },
// ];

// export const availableFacades: Facade[] = [
//   { id: '1', name: 'LXL 81', type: 'Standard' }
// ];

// export const availablePackages: Package[] = [
//   { 
//     packageId: '1', 
//     name: 'Premium Pack', 
//     amount: "5000", 
//     categoryItemDescriptions: [
//        'High-end wooden flooring',
//        'Premium ceramic tiles for bathroom',
//        'Complete home automation system',
//        'High-quality interior paint',
//     ],
//     builderId: '1',
//     categoryItemIds: ['1', '2', '3', '4'],
//     createdAt: '2023-07-13T00:00:00.000Z',
//     updatedAt: '2023-07-13T00:00:00.000Z'
//   }
// ];

// export const categories = [
//   {
//     id: 'base-price',
//     name: 'Base Price',
//     items: [
//       {
//         id: '1',
//         name: 'Base price for Single Storey',
//         tags: ['Base Price', 'Variable', 'sq', 'Premium', 'Single Storey'],
//         quantity: 1,
//         price: 11500.00,
//         total: 11500.00
//       },
//       {
//         id: '2',
//         name: 'Base price for Single Storey 16 Sq',
//         tags: ['Base Price', 'Fixed'],
//         quantity: 1,
//         price: 182000.00,
//         total: 182000.00
//       },
//       {
//         id: '3',
//         name: 'Base Price for Single Storey 17Sq',
//         tags: ['Base Price', 'Fixed'],
//         quantity: 1,
//         price: 200000.00,
//         total: 200000.00
//       },
//       {
//         id: '4',
//         name: 'Base Price for Single Storey 25 Sq',
//         tags: ['Base Price', 'Fixed'],
//         quantity: 1,
//         price: 280000.00,
//         total: 280000.00
//       }
//     ]
//   },
//   {
//     id: 'site-costs',
//     name: 'Site Costs',
//     items: [
//       {
//         id: '5',
//         name: 'Site preparation',
//         tags: ['Site Costs', 'Fixed'],
//         quantity: 1,
//         price: 5000.00,
//         total: 5000.00
//       },
//       {
//         id: '6',
//         name: 'Excavation',
//         tags: ['Site Costs', 'Variable'],
//         quantity: 2,
//         price: 2500.00,
//         total: 5000.00
//       }
//     ]
//   },
//   {
//     id: 'kitchen',
//     name: 'Kitchen',
//     items: [
//       {
//         id: '7',
//         name: 'Premium Kitchen Package',
//         tags: ['Kitchen', 'Premium'],
//         quantity: 1,
//         price: 15000.00,
//         total: 15000.00
//       },
//       {
//         id: '8',
//         name: 'Stone Benchtops',
//         tags: ['Kitchen', 'Premium'],
//         quantity: 1,
//         price: 3000.00,
//         total: 3000.00
//       }
//     ]
//   },
//   {
//     id: 'electrical',
//     name: 'Electrical',
//     items: [
//       {
//         id: '9',
//         name: 'Standard Electrical Package',
//         tags: ['Electrical', 'Fixed'],
//         quantity: 1,
//         price: 8000.00,
//         total: 8000.00
//       }
//     ]
//   },
//   {
//     id: 'pre-construction',
//     name: 'Pre-Construction',
//     items: [
//       {
//         id: '10',
//         name: 'Building Permits',
//         tags: ['Pre-Construction', 'Fixed'],
//         quantity: 1,
//         price: 2000.00,
//         total: 2000.00
//       }
//     ]
//   },
//   {
//     id: 'retaining-wall',
//     name: 'Retaining Wall',
//     items: [
//       {
//         id: '11',
//         name: 'Concrete Retaining Wall',
//         tags: ['Retaining Wall', 'Variable'],
//         quantity: 10,
//         price: 150.00,
//         total: 1500.00
//       }
//     ]
//   },
//   {
//     id: 'council-requirements',
//     name: 'Council Requirements',
//     items: [
//       {
//         id: '12',
//         name: 'Council Fees',
//         tags: ['Council Requirements', 'Fixed'],
//         quantity: 1,
//         price: 1500.00,
//         total: 1500.00
//       }
//     ]
//   },
//   {
//     id: 'external-structure',
//     name: 'External Structure',
//     items: [
//       {
//         id: '13',
//         name: 'Outdoor Entertainment Area',
//         tags: ['External Structure', 'Premium'],
//         quantity: 1,
//         price: 12000.00,
//         total: 12000.00
//       }
//     ]
//   }
// ];

export const ColorItemList: ColorCategory[] = [
  {
    category: "bricks-access",
    items: [
      {
        key: "br-001",
        images: ["https://img.freepik.com/free-photo/background-made-from-bricks_23-2148742475.jpg?t=st=1757423430~exp=1757427030~hmac=6fd91972a1d2c7126ce68c51132bd8fdca6a0ceeb29968afbfbda1c3dce77123&w=2000", "https://placehold.co/600x400"],
        itemName: "Red Sand Brick",
        itemCode: "BR-001",
        itemDescription: "Durable red sand brick suitable for exterior walls.",
        itemFeatures: "High strength, weather resistant, eco-friendly",
        itemUnits: 100,
        itemSupplier: "Supplier 1",
        itemCost: 150,
        isAdded: false,
      },
      {
        key: "br-002",
        images: ["https://img.freepik.com/free-photo/effect-view-grungy-construction-vintage-material_1417-1038.jpg?t=st=1757423521~exp=1757427121~hmac=f706a084b106859b448dd937d389c9f6b2910c2e11b152243fdc2733baee51ea&w=2000", "https://placehold.co/600x400"],
        itemName: "Grey Cement Brick",
        itemCode: "BR-002",
        itemDescription: "Grey cement brick with smooth finish.",
        itemFeatures: "Cost-effective, low maintenance",
        itemUnits: 80,
        itemCost: 150,
        isAdded: true,
      },
    ],
  },
  {
    category: "roof-concrete",
    items: [
      {
        key: "rf-001",
        images: ["https://img.freepik.com/free-photo/roof-tiles_23-2148742475.jpg?t=st=1757423612~exp=1757427212~hmac=2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b"],
        itemName: "Classic Concrete Tile",
        itemCode: "RF-001",
        itemDescription: "Concrete roof tile with natural stone finish.",
        itemFeatures: "Fire resistant, sound insulation",
        itemUnits: 200,
        isAdded: true,
      },
    ],
  },
  {
    category: "windows-black",
    items: [
      {
        key: "wd-001",
        images: ["https://img.freepik.com/free-photo/roof-tiles_23-2148742475.jpg?t=st=1757423612~exp=1757427212~hmac=2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b"],
        itemName: "Black Aluminium Window",
        itemCode: "WD-001",
        itemDescription: "Sleek black frame for modern homes.",
        itemFeatures: "Powder-coated, double-glazed option",
        itemUnits: 50,
        isAdded: true,
      },
    ],
  },
  {
    category: "doors-hinged",
    items: [
      {
        key: "dr-001",
        images: ["https://img.freepik.com/free-photo/roof-tiles_23-2148742475.jpg?t=st=1757423612~exp=1757427212~hmac=2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b"],
        itemName: "Classic Hinged Door",
        itemCode: "DR-001",
        itemDescription: "Traditional wooden hinged door with premium finish.",
        itemFeatures: "Solid wood, customizable handle",
        itemUnits: 30,
        isAdded: false,
      },
    ],
  },
  {
    category: "flooring-timber",
    items: [
      {
        key: "fl-001",
        images: ["https://img.freepik.com/free-photo/roof-tiles_23-2148742475.jpg?t=st=1757423612~exp=1757427212~hmac=2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b2b3b"],
        itemName: "Oak Timber Flooring",
        itemCode: "FL-001",
        itemDescription: "Premium oak timber flooring for luxury interiors.",
        itemFeatures: "Durable, scratch resistant, natural look",
        itemUnits: 500,
        isAdded: false,
      },
    ],
  },
];


export const WorkStepsChecklist = [
  {
    title: 'Deposite',
    checklist: [
      {
        id: 1,
        task: 'Sketch Signoff from client',
        tag: 'Sales Execut.',
        estimatedDate: '11 Aug 2023',
        actualDate: '10 Aug 2023',
        link: '#',
        user: 'Madan',
        status: 'active',
      },
      {
        id: 2,
        task: 'New Task',
        tag: 'Designer',
        estimatedDate: '15 Sep 2023',
        actualDate: '14 Sep 2023',
        link: '',
        user: 'AB',
        status: 'inactive',
      },
    ],
  },
  {
    title: 'Concept',
    checklist: [
      {
        id: 3,
        task: 'Sketch Signoff from client',
        tag: 'Sales Execut.',
        estimatedDate: '11 Aug 2023',
        actualDate: '10 Aug 2023',
        link: '',
        user: 'Madan',
        status: 'inactive',
      },
      {
        id: 4,
        task: 'Client Meeting',
        tag: 'Project Manager',
        estimatedDate: '16 Sep 2023',
        actualDate: '16 Sep 2023',
        link: '',
        user: 'Nina',
        status: 'active',
      },
      {
        id: 13,
        task: 'Review Color Options with Client',
        tag: 'Color Consultant',
        estimatedDate: '22 Sep 2023',
        actualDate: '22 Sep 2023',
        link: '',
        user: 'Michael',
        status: 'inactive',
      },
    ],
  },
  {
    title: 'Colour Selection',
    checklist: [
      {
        id: 5,
        task: 'Select Interior Colors',
        tag: 'Interior Designer',
        estimatedDate: '20 Sep 2023',
        actualDate: '20 Sep 2023',
        link: '',
        user: 'Laura',
        status: 'active',
      },
      {
        id: 6,
        task: 'Review Color Options with Client',
        tag: 'Color Consultant',
        estimatedDate: '22 Sep 2023',
        actualDate: '22 Sep 2023',
        link: '',
        user: 'Michael',
        status: 'inactive',
      },
    ],
  },
  {
    title: 'Contract Drawing',
    checklist: [
      {
        id: 7,
        task: 'Prepare Floor Plan',
        tag: 'Architect',
        estimatedDate: '25 Sep 2023',
        actualDate: '25 Sep 2023',
        link: '',
        user: 'Emma',
        status: 'active',
      },
      {
        id: 8,
        task: 'Client Signoff on Drawing',
        tag: 'Architect',
        estimatedDate: '27 Sep 2023',
        actualDate: '26 Sep 2023',
        link: '',
        user: 'Emma',
        status: 'inactive',
      },
    ],
  },
  {
    title: 'Approval & Contract',
    checklist: [
      {
        id: 9,
        task: 'Submit Documents for Approval',
        tag: 'Admin',
        estimatedDate: '29 Sep 2023',
        actualDate: '29 Sep 2023',
        link: '',
        user: 'John',
        status: 'inactive',
      },
      {
        id: 10,
        task: 'Sign Contract',
        tag: 'Client',
        estimatedDate: '30 Sep 2023',
        actualDate: '30 Sep 2023',
        link: '',
        user: 'Murthy',
        status: 'active',
      },
    ],
  },
  {
    title: 'Permits & Pre Construction',
    checklist: [
      {
        id: 11,
        task: 'Apply for Building Permit',
        tag: 'Admin',
        estimatedDate: '02 Oct 2023',
        actualDate: '01 Oct 2023',
        link: '',
        user: 'Sophie',
        status: 'active',
      },
      {
        id: 12,
        task: 'Site Preparation',
        tag: 'Construction Manager',
        estimatedDate: '05 Oct 2023',
        actualDate: '05 Oct 2023',
        link: '',
        user: 'Liam',
        status: 'inactive',
      },
    ],
  },
];


export const JobVariationData: JobVariationDataType[] = [
  {
      ReferenceID: 'MYH00486-V1',
      Amount: 7000.00,
      RequestedBy: 'Aman',
      DelayedBy: 'Hiren',
      DrawingChanges: "Yes",
      Created: { user: 'MM', date: "1/1/2002" },
      Approved: { user: 'MM', date: "1/1/2002" },
      Status: 'Approved',
      Invoice: 'invoice',
      Profile: 'MM'
  },
  {
      ReferenceID: 'MYH00486-V2',
      Amount: 7000.00,
      RequestedBy: 'Aman',
      DelayedBy: 'Hiren',
      DrawingChanges: "No",
      Created: { user: 'MM', date: "1/1/2002" },
      Approved: { user: 'MM', date: "1/1/2002" },
      Status: 'Approved',
      Invoice: 'invoice',
      Profile: 'A'
  },
  {
      ReferenceID: 'MYH00486-V3',
      Amount: 7000.00,
      RequestedBy: 'Aman',
      DelayedBy: 'Hiren',
      DrawingChanges: "Yes",
      Created: { user: 'MM', date: "1/1/2002" },
      Approved: { user: 'MM', date: "1/1/2002" },
      Status: 'Draft',
      Invoice: 'invoice',
      Profile: 'A'
  },
]

export const JobVariationCreateTableData: JobVariationItems[] = [
  {
    key: '1',
    additional: 'Additional',
    siteCost: 'Site Cost',
    cost: 'Cost',
    drawingChanges: false,
    quantity: 2,
    price: 2.10,
    total: 4.20,
  },
  {
    key: '2',
    additional: 'Additional',
    siteCost: 'Site Cost',
    cost: 'Cost',
    drawingChanges: false,
    quantity: 4,
    price: 4.10,
    total: 16.40,
  },
];

export const ConstructionDashboardData: Construction[] = [
  {
    id: 1,
    customerName: 'John Doe',
    jobAddress: '123 Main St',
    builderName: 'My Home',
    jobTitle: 'single Storey - Standard Build',
    currentStage: 'Frame stage',
    dueDate: '2023-09-24',
    siteSupervisor: 'Patrick',
    status: 'readyforconstruction',
  },
  {
    id: 2,
    customerName: 'Lionel Messi',
    jobAddress: '123 Main St',
    builderName: 'PWC',
    jobTitle: 'single Storey - Standard Build',
    currentStage: 'Base Stage',
    dueDate: '2023-10-20',
    siteSupervisor: '',
    status: 'underconstruction',
  },
  {
    id: 3,
    customerName: 'Bill Gates',
    jobAddress: '123 Main St',
    builderName: 'Sahara',
    jobTitle: 'single Storey - Standard Build',
    currentStage: 'Base Stage',
    dueDate: '2023-08-05',
    siteSupervisor: '',
    status: 'completed',
  },
  {
    id: 4,
    customerName: 'Ronaldo',
    jobAddress: '123 Main St',
    builderName: 'Sahara',
    jobTitle: 'single Storey - Standard Build',
    currentStage: 'Base Stage',
    dueDate: '2023-08-05',
    siteSupervisor: '',
    status: 'onhold',
  }
]