import { exportToExcel } from '@lib/utils/exportToExcel';

export const MaintenanceDetailReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00655',
            CustomerName: 'Grand Homes Demo',
            JobAddress: '234, fall street, epping, VIC, 1234',
            StartDate: '23-08-2025',
            EndDate: '22-08-2026',
            Completed: '1',
            Pending: '0',
            OnHold: '0',
            SupervisorName: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00638',
            CustomerName: 'Soundarya',
            JobAddress: '14, Melbourne view, Sydney, VIC, 3024',
            StartDate: '25-04-2025',
            EndDate: '24-04-2026',
            Completed: 1,
            Pending: 1,
            OnHold: 0,
            SupervisorName: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00622',
            CustomerName: 'Sam1T',
            JobAddress: 'Lot 1, 2 Coco street, Tarneit, VIC, 3029',
            StartDate: '02-02-2025',
            EndDate: '01-02-2026',
            Completed: 1,
            Pending: 0,
            OnHold: 0,
            SupervisorName: 'Shanthini',
        },
        {
            ReferenceID: 'MYH00589',
            CustomerName: 'Sarah',
            JobAddress: '9, Parkville, Footscray, VIC, 3432',
            StartDate: '01-07-2024',
            EndDate: '30-06-2025',
            Completed: '3',
            Pending: '2',
            OnHold: '0',
            SupervisorName: 'Sushmitha',
        },
        {
            ReferenceID: 'MYH00534',
            CustomerName: 'Muthu',
            JobAddress: 'Lot 12 Mainto way, Tarneit, VIC, 3029',
            StartDate: '06-01-2024',
            EndDate: '04-01-2025',
            Completed: '3',
            Pending: '0',
            OnHold: '0',
            SupervisorName: 'Murthy Muthuswamy',
        },
        {
            ReferenceID: 'MYH00131',
            CustomerName: 'Mr and Mrs Smith',
            JobAddress: 'Lot 1234, Tarneit, VIC, 3030',
            StartDate: '27-05-2021',
            EndDate: '26-07-2021',
            Completed: '9',
            Pending: '4',
            OnHold: '0',
            SupervisorName: 'Murthy Muthuswamy',
        },
    ];

    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF0023BD' },
        CustomerName: { label: 'Customer Name', color: 'FF0023BD' },
        JobAddress: { label: 'Job Address', color: 'FF0023BD' },
        StartDate: { label: 'Start Date', color: 'FF0023BD' },
        EndDate: { label: 'End Date', color: 'FF0023BD' },
        Completed: { label: 'Completed', color: 'FF0023BD' },
        Pending: { label: 'Pending', color: 'FF0023BD' },
        OnHold: { label: 'On Hold', color: 'FF0023BD' },
        SupervisorName: { label: 'Supervisor Name', color: 'FF0023BD' },
    };

    exportToExcel({
        data: data,
        fileName: 'Maintenance Report',
        sheetName: 'Maintenance Report',
        columnHeaders: column,
        title: 'Maintenance Report',
        extraHeaderRows: [
            {
                columnHeaders: {
                    DateOfExport: { label: 'Date of Export', color: 'FF0023BD' },
                },
                data: [
                    {
                        DateOfExport: '25-08-2025',
                    },
                ],
                layout: 'vertical',
                position: 'top',
            },
        ],
    });
};
