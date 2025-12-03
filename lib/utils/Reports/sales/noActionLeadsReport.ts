import { exportToExcel } from "@lib/utils/exportToExcel";

export const NoActionLeadsReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00006',
            Name: 'John',
            ContactNo: '40503056',
            Email: 'john@homebuilder.com.au',
            PropAddress: 'Lot 7654, Melton, VIC, 2560',
            LeadCreatedDate: '03-06-2020',
            LeadStatus: 'New',
            Assignee: 'Murthy Muthuswamy',
            LastUpdatedDate: '16-07-2020',
        },
        {
            ReferenceID: 'MYH00013',
            Name: 'Brad',
            ContactNo: '406345782',
            Email: 'brad@yahoo.com',
            PropAddress: 'Lot 7654, Melton, VIC, 2560',
            LeadCreatedDate: '03-06-2020',
            LeadStatus: 'New',
            Assignee: 'Murthy Muthuswamy',
            LastUpdatedDate: '16-07-2020',
        },
        {
            ReferenceID: 'MYH00033',
            Name: 'Sash',
            ContactNo: '40560343',
            Email: 'admin@myhome.com.au',
            PropAddress: 'Lot 234, Tarneit, VIC, 3030',
            LeadCreatedDate: '28-07-2020',
            LeadStatus: 'New',
            Assignee: 'Murthy Muthuswamy',
            LastUpdatedDate: '10-08-2020',
        },
        {
            ReferenceID: 'MYH00043',
            Name: 'Arif',
            ContactNo: '34324234324',
            Email: 'arif@qove.com.au',
            PropAddress: 'Lot 234, Tarneit, VIC, 3030',
            LeadCreatedDate: '28-07-2020',
            LeadStatus: 'New',
            Assignee: 'Murthy Muthuswamy',
            LastUpdatedDate: '10-08-2020',
        },
        {
            ReferenceID: 'MYH00071',
            Name: 'Amby',
            ContactNo: '406166577',
            Email: 'amitnew@insimplify.com.au',
            PropAddress: 'Lot 543, Elements, Truganian, VIC, 2345',
            LeadCreatedDate: '08-09-2020',
            LeadStatus: 'In Progress',
            Assignee: 'Murthy Muthuswamy',
            LastUpdatedDate: '02-10-2020',
        },
    ];

    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF050980' },
        Name: { label: 'Name', color: 'FF050980' },
        ContactNo: { label: 'Contact', color: 'FF050980' },
        Email: { label: 'Email', color: 'FF050980' },
        PropAddress: { label: 'Property Address', color: 'FF050980' },
        LeadCreatedDate: { label: 'Lead Created Date', color: 'FF050980' },
        LeadStatus: { label: 'Lead Status', color: 'FF050980' },
        Assignee: { label: 'Assignee', color: 'FF050980' },
        LastUpdatedDate: { label: 'Last Updated Date', color: 'FF050980' },
    };

    exportToExcel({
        data: data,
        fileName: 'No Action Leads Report',
        sheetName: 'No Action Leads Report',
        columnHeaders: column,
    });
};