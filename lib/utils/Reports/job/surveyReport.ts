import { exportToExcel } from '@lib/utils/exportToExcel';

export const SurveyReport = () => {
    const data = [
        {
            ReferenceID: 'MYH004301',
            JobAddress: 'Lot 2890, Tarneit, Melbourne, VIC 3029',
            Sent: '01-10-2025',
            SubmittedOn: '02-10-2025',
            SubmittedBy: 'Murthy Muthuswamy',
            HowDoYouRateTheSalesPerson: 'Excellent',
            HowKnowledgeableTheSalesPersonIs: 'Very High',
        },
        {
            ReferenceID: 'MYH004302',
            JobAddress: 'Lot 339, Point Cook, VIC 3030',
            Sent: '01-10-2025',
            SubmittedOn: '—',
            SubmittedBy: '',
            HowDoYouRateTheSalesPerson: '',
            HowKnowledgeableTheSalesPersonIs: '',
        },
        {
            ReferenceID: 'MYH004303',
            JobAddress: '15 King Road, Epping, VIC 3076',
            Sent: '28-09-2025',
            SubmittedOn: '29-09-2025',
            SubmittedBy: 'Kishan',
            HowDoYouRateTheSalesPerson: 'Good',
            HowKnowledgeableTheSalesPersonIs: 'Moderate',
        },
        {
            ReferenceID: 'MYH004304',
            JobAddress: '9 Maxwell Street, Tarneit, VIC 3029',
            Sent: '30-09-2025',
            SubmittedOn: '',
            SubmittedBy: '',
            HowDoYouRateTheSalesPerson: '',
            HowKnowledgeableTheSalesPersonIs: '',
        },
        {
            ReferenceID: 'MYH004305',
            JobAddress: 'Lot 45 Hazelwood Drive, Melton, VIC 3337',
            Sent: '22-09-2025',
            SubmittedOn: '23-09-2025',
            SubmittedBy: 'Adam',
            HowDoYouRateTheSalesPerson: 'Average',
            HowKnowledgeableTheSalesPersonIs: 'High',
        },
    ];

    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF0023BD' },
        JobAddress: { label: 'Job Address', color: 'FF0023BD' },
        Sent: { label: 'Sent', color: 'FF0023BD' },
        SubmittedOn: { label: 'Submitted On', color: 'FF0023BD' },
        SubmittedBy: { label: 'Submitted By', color: 'FF0023BD' },
        HowDoYouRateTheSalesPerson: { label: 'How do you rate the Sales Person?', color: 'FF0023BD' },
        HowKnowledgeableTheSalesPersonIs: {
            label: 'How Knowledgeable the sales person is?',
            color: 'FF0023BD',
        },
    };

    exportToExcel({
        data: data,
        fileName: 'Survey Report',
        sheetName: 'Survey Report',
        columnHeaders: column,
        title: 'Survey Report - My Home',
        extraHeaderRows: [
            {
                layout: 'vertical',
                position: 'top',
                columnHeaders: {
                    Template: { label: 'Template', color: 'FF0023BD' },
                    DateofExport: { label: 'Date of Export', color: 'FF0023BD' },
                },
                data: [
                    {
                        Template: 'Customer Sales Feedback',
                        DateofExport: '25-12-2025',
                    },
                ],
            },
        ],
    });
};
