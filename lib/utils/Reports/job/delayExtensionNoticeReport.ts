import { exportToExcel } from '@lib/utils/exportToExcel';

export const DelayExtensionNoticeReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00636',
            CustomerName: 'Demo Lead',
            JobAddress: 'Lot 203, 1 Main St, Tarneit, VIC, 3001',
            Reason: 'Weather',
            Days: '4',
            StartDate: '25-08-2025',
            EndDate: '28-08-2025',
            CreatedDate: '25-08-2025',
            Created: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00655',
            CustomerName: 'Grand Homes Demo',
            JobAddress: '234, fall street, epping, VIC, 1234',
            Reason: 'Private Inspection',
            Days: '14',
            StartDate: '20-08-2025',
            EndDate: '08-09-2025',
            CreatedDate: '20-08-2025',
            Created: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00653',
            CustomerName: 'Balram Test',
            JobAddress: '123, epping street, Melbourne, VIC, 1245',
            Reason: 'Materials',
            Days: '4',
            StartDate: '16-08-2025',
            EndDate: '20-08-2025',
            CreatedDate: '16-08-2025',
            Created: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00650',
            CustomerName: 'Demo lead',
            JobAddress: '123, office street, melbourne, VIC, 1233',
            Reason: 'Weather',
            Days: '4',
            StartDate: '29-07-2025',
            EndDate: '01-08-2025',
            CreatedDate: '29-07-2025',
            Created: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00645',
            CustomerName: 'Adam',
            JobAddress: 'Lot 201, 2 Prop Add1, Tarneit, VIC, 3000',
            Reason: 'Variation',
            Days: '3',
            StartDate: '19-06-2025',
            EndDate: '23-06-2025',
            CreatedDate: '19-06-2025',
            Created: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00634',
            CustomerName: 'Madhvi',
            JobAddress: 'Lot 60, 83 cheviot reef crt clyde, 83, berwick, VIC, 3806',
            Reason: 'Weather',
            Days: '4',
            StartDate: '12-06-2025',
            EndDate: '17-06-2025',
            CreatedDate: '12-06-2025',
            Created: 'Murthy Muthuswamy',
        },
    ];
    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF0023BD' },
        CustomerName: { label: 'Customer Name', color: 'FF0023BD' },
        JobAddress: { label: 'Job Address', color: 'FF0023BD' },
        Reason: { label: 'Reason', color: 'FF0023BD' },
        Days: { label: 'Days', color: 'FF0023BD' },
        StartDate: { label: 'Start Date', color: 'FF0023BD' },
        EndDate: { label: 'End Date', color: 'FF0023BD' },
        CreatedDate: { label: 'Created Date', color: 'FF0023BD' },
        Created: { label: 'Created', color: 'FF0023BD' },
    };

    exportToExcel({
        data: data,
        fileName: 'Extension Notice Report',
        sheetName: 'Extension Notice Report',
        columnHeaders: column,
        title: 'Extension Notice Report',
        extraHeaderRows: [
            {
                columnHeaders: {
                    BuilderName: { label: 'Builder Name', color: 'FF0023BD' },
                },
                data: [
                    {
                        BuilderName: 'All',
                    },
                ],
                layout: 'vertical',
                position: 'top',
            },
        ],
    });
};
