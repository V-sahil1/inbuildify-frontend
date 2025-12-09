'use client';
import { Color } from '@/components/pdf/Color';
import { Document,} from '@react-pdf/renderer';

const colorData = [
  {
    category: 'BRICKS',
    items: [
      {
        color: 'Cream',
        status: 'Standard',
        itemName: 'ACCESS RANGE',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Tan',
        status: 'Standard',
        itemName: 'ACCESS RANGE',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'ChestNut',
        status: 'Standard',
        itemName: 'Category 1',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Code: BCC001, Supplie: Austral Bricks',
        cost: null,
      },
    ],
  },
  {
    category: 'ROOF TILES',
    items: [
      {
        color: 'Ebony',
        status: 'Standard',
        itemName: 'BORAL SLIM LINE CONCRETE TILES',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Gunmetal',
        status: 'Standard',
        itemName: 'BORAL SLIM LINE CONCRETE TILES',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png',
        items: 'Standard',
        cost: null,
      },
      {
        color: 'Charcoal Grey',
        status: 'Standard',
        itemName: 'Classic Range',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Standard',
        cost: null,
      },
    ],
  },
  {
    category: 'DOORS',
    items: [
      {
        color: 'External 1', // Description/Color field for door
        status: 'Upgrade',
        itemName: 'Entry Door',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Upgrade',
        cost: '800.00', // Upgrade cost
      },
    ],
  },
  {
    category: 'FLOORING',
    items: [
      {
        color: 'Matang Cappuccino',
        status: 'Standard',
        itemName: 'Tiles',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Code: FTM001, Supplie: Building Suppliers',
        cost: null,
      },
    ],
  },
  {
    category: 'KITCHEN', // This section appears to be for upgrades
    items: [
      {
        color: 'Chrome Matte',
        status: 'Upgrade',
        itemName: 'Kitchen Cabinetry Handles',
        imageURL: 'https://img.icons8.com/ios-filled/50/e63946/phone.png', // Placeholder
        items: 'Cost: $50.00 x 5 Units',
        cost: '250.00',
      },
    ],
  },
];

export const ColorPdf = ({}) => {
 
  return (
    <Document>
        <Color colorData={colorData} />
    </Document>
  );
};

export default ColorPdf;
