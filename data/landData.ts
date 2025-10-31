export interface DataType {
  lotNumber: string;
  price: string;
  size: string;
  estate: string;
  stageName: string;
  address: string;
  status: string;
  createdby: string;
}

export const data: DataType[] = [
  {
    lotNumber: '333',
    price: '$4000.00',
    size: '448.00',
    estate: 'Ambervue',
    stageName: 'Stage 1',
    address: 'LOT 507 Stirling, Tarneit, 3002',
    status: 'Available',
    createdby: 'Meet',
  },
  {
    lotNumber: '321',
    price: '$4000.00',
    size: '448.00',
    estate: 'Ambervue',
    stageName: 'Stage 4',
    address: 'LOT 507 Stirling, Tarneit, 3002',
    status: 'Available',
    createdby: 'Akshay',
  },
];
