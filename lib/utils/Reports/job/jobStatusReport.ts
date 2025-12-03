import { exportToExcel } from '@lib/utils/exportToExcel';

export const JobStatusReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00660',
            JobAddress: 'Lot 333 ABC Street, Cobblebank',
            CompletedTasks: [
                'Upload all the documents-30-09-2025 ',

                'Send Initial Deposit Receipt to client-30-09-2025',
            ],
            UpcomingTasks: [
                'Receive Soil test and Survey-14-10-2025 ',

                'Request BAL ',

                ' Title Pack and Property Info-15-10-2025',
            ],
        },
        {
            ReferenceID: 'MYH00654',
            JobAddress: 'Lot 987, 1 KINGS AVENUE, FRANKSTON',
            CompletedTasks: [
                'Upload all the documents-22-09-2025 ',

                'Send Initial Deposit Receipt to client-22-09-2025 ',

                'Apply for Soil Test and Survey-22-09-2025 ',

                'Receive Soil test and Survey-22-09-2025',
            ],
            UpcomingTasks: [
                'Request for the Sketch- 03 - 10 - 2025 ',

                'Receive Sketch from the Draftperson-07 - 10 - 2025 ',

                'Sketch Signoff from client -08 - 10 - 2025 ',

                'Request Sketch revision to Draftee - 10 - 10 - 2025 ',

                'Receive Revised Sketch - 14 - 10 - 2025   ',

                'Get Revised Plan signoff from client - 15 - 10 - 2025 ',

                ' Update Quotation if any changes in the Sketch - 16 - 10 - 2025 ',

                ' Book Color Appointment - 17 - 10 - 2025',
            ],
        },
        {
            ReferenceID: 'MYH00637',
            JobAddress: 'Suite 10, 45 Tallis Circuit, Truganina',
            CompletedTasks: [
                'Electrician trench And meter application +all Conduits-08-09-2025 ',

                'Request BAL ',

                'Title Pack and Property Info-23-09-2025',
            ],
            UpcomingTasks: [
                'Receive Soil test and Survey-08-10-2025',
                'Request BAL',
                'Title Pack and Property Info-09-10-2025',
                'Receive BAL',
                'Title Pack and Property info-16-10-2025',
            ],
        },
    ];

    const column = {
        ReferenceID: { label: 'Reference ID', color: 'FF0023BD' },
        JobAddress: { label: 'Job Address', color: 'FF0023BD' },
        CompletedTasks: { label: 'Completed Tasks', color: 'FF0023BD' },
        UpcomingTasks: { label: 'Upcoming Tasks', color: 'FF0023BD' },
    };

    exportToExcel({
        data: data,
        fileName: 'Job Status Report',
        sheetName: 'Job Status Report',
        columnHeaders: column,
        title: 'Job Status Report',
    });
};
