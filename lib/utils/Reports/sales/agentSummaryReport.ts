import { exportToExcel } from '@lib/utils/exportToExcel';

export const AgentSummaryReport = () => {
    const data = [
        {
            ReferenceID: 'MYH00660',
            JobAddress: 'Lot 333 ABC Street, Cobblebank',
            CompletedTasks: [
                'Upload all the documents-22-09-2025',

                'Send Initial Deposit Receipt to client-22-09-2025',

                'Apply for Soil Test and Survey-22-09-2025',

                'Receive Soil test and Survey-22-09-2025',
            ],
            UpcomingTasks: [
                'Request for the Sketch-03-10-2025',

                'Receive Sketch from the Draftperson-07-10-2025',

                'Sketch Signoff from client-08-10-2025',

                'Request Sketch revision to Draftee-10-10-2025',

                'Receive Revised Sketch-14-10-2025',

                'Get Revised Plan signoff from client-15-10-2025',

                'Update Quotation if any changes in the Sketch-16-10-2025',
            ],
            Agent: 'Adam',
        },
        {
            ReferenceID: 'MYH00654',
            JobAddress: 'Lot 987, 1 KINGS AVENUE, FRANKSTON',
            UpcomingTasks: [
                'Send Initial Deposit Receipt to client-02-10-2025',
                'Apply for Soil Test and Survey-03-10-2025',
                'Receive Soil test and Survey-15-10-2025',
                'Request BAL',
                'Title Pack and Property Info-16-10-2025',
            ],
            CompletedTasks: [],
            Agent: 'Chirag',
        },
        {
            ReferenceID: 'MYH00637',
            JobAddress: 'Suite 10, 45 Tallis Circuit, Truganina',
            CompletedTasks: [
                'Upload all the documents-24-09-2025',
                'Send Initial Deposit Receipt to client-24-09-2025',
            ],
            UpcomingTasks: [
                'Receive Soil test and Survey-08-10-2025',
                'Request BAL',
                'Title Pack and Property Info-09-10-2025',
                'Receive BAL',
                'Title Pack and Property info-16-10-2025',
            ],
            Agent: 'Adam',
        },
    ];

    const column = {
        ReferenceID: 'Reference ID',
        JobAddress: 'Job Address',
        CompletedTasks: 'Completed Tasks',
        UpcomingTasks: 'Upcoming Tasks',
        Agent: 'Agent',
    };

    exportToExcel({
        data: data,
        fileName: 'Agent Summary Report',
        sheetName: 'Agent Summary Report',
        columnHeaders: column,
        title: "Agent Summary Report"
    });
};
