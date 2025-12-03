import { exportToExcel } from '@lib/utils/exportToExcel';

export const NoActionJobReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00001',
            JobStatus: 'Construction',
            PropertyAddress: 'Lot 300, Tarniet, VIC, 3029',
            Name: 'Adam',
            Email: 'ms@insimplify.com.au',
            Contact: '40612323',
            JobStartedDate: '19-05-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
        {
            ReferenceID: 'MYH00002',
            JobStatus: 'Construction',
            PropertyAddress: 'Lot 555, Melton, VIC, 3333',
            Name: 'Scott',
            Email: 'scott@insimploify.com.au',
            Contact: '2432324',
            JobStartedDate: '20-05-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
        {
            ReferenceID: 'MYH00003',
            JobStatus: 'Construction',
            PropertyAddress: 'Lot 200, Melton, VIC, 3030',
            Name: 'Ben',
            Email: 'ben@insimplify.com.au',
            Contact: '2343243424',
            JobStartedDate: '21-05-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
        {
            ReferenceID: 'MYH00004',
            JobStatus: 'Construction',
            PropertyAddress: 'Lot 202, Melton, VIC, 2345',
            Name: 'Yash',
            Email: 'yash@yashhomes.com.au',
            Contact: '401232445',
            JobStartedDate: '28-05-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
        {
            ReferenceID: 'MYH00005',
            JobStatus: 'Construction',
            PropertyAddress: 'lot 500, Wyndhamvale, VIC, 3455',
            Name: 'Lalitha',
            Email: 'lalitha@gmail.com',
            Contact: '405063434',
            JobStartedDate: '03-06-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
        {
            ReferenceID: 'MYH00007',
            JobStatus: 'Construction',
            PropertyAddress: 'Lot 300, Sydeny, VIC, 30303',
            Name: 'Rakesh',
            Email: 'rakesh@dreamhomez.com.au',
            Contact: '4534545',
            JobStartedDate: '11-06-2020',
            Assignee: 'Murthy Muthuswamy',
            LastUpdated: '29-09-2025',
        },
    ];

    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF0023BD' },
        JobStatus: { label: 'Job Status', color: 'FF0023BD' },
        PropertyAddress: { label: 'Property Address', color: 'FF0023BD' },
        Name: { label: 'Name', color: 'FF0023BD' },
        Email: { label: 'Email', color: 'FF0023BD' },
        Contact: { label: 'Contact', color: 'FF0023BD' },
        JobStartedDate: { label: 'Job started date', color: 'FF0023BD' },
        Assignee: { label: 'Assignee', color: 'FF0023BD' },
        LastUpdated: { label: 'Last updated', color: 'FF0023BD' },
    };

    exportToExcel({
        data: data,
        fileName: 'No Action Jobs Report',
        sheetName: 'No Action Jobs Report',
        columnHeaders: column,
    });
};
