export interface DataType  {
    packages: string;
    lotAddress: string;
    estateName: string;
    facadeName: string;
    floorplanName: string;
    cost: string;
    createdDate: string;
    assignee: string;
}
export const data:DataType[] = [
    {
        packages: 'New HL pack',
        lotAddress: 'LOT 507 Stirling, Tarneit, 3002',
        estateName: 'Ambervue',
        facadeName: 'LKL 81',
        floorplanName: 'My Home 2',
        cost: '$3000.00',
        createdDate: '01-10-2025',
        assignee: 'Krunal'
    },
    {
        packages: 'Epping 123',
        lotAddress: 'LOT 507 Stirling, Tarneit, 3002',
        estateName: 'Ambervue',
        facadeName: 'LKL 44',
        floorplanName: 'My Home 2',
        cost: '$3000.00',
        createdDate: '01-10-2025',
        assignee: 'Meet'
    },
]
