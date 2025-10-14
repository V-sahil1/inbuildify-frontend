
export interface jobStatusTask {
    id: string;
    task: string;
    assignee: string;
    estimated: string;
    actual: string; 
    status: 'completed' | 'pending' | 'notapplicable';
    supervisor: string; 
}
export interface jobStatusStage {
    id: string;
    title: string;
    included?:boolean;
    tasks: jobStatusTask[];
}


export const INITIAL_STAGES_DATA: jobStatusStage[] = [
    {
        id: '1',
        title: 'Deposit',
        included:false,
        tasks: [
            {
                id: '1',
                task: 'Upload all the documents',
                assignee: 'Sales Executive',
                estimated: '13 Aug 2025',
                actual: '16 Aug 2025',
                status: 'completed',
                supervisor: 'John Doe'
            },
            {
                id: '2',
                task: 'Send Initial Deposit Receipt to client',
                assignee: 'Admin Executive',
                estimated: '20 Aug 2025',
                actual: '18 Aug 2025',
                status: 'pending',
                supervisor: 'John Doe'
            },
            {
                id: '3',
                task: 'Apply for Soil Test and Survey',
                assignee: 'Admin Executive',
                estimated: '19 Aug 2025',
                actual: '16 Aug 2025',
                status: 'completed',
                supervisor: ''
            },
        ]
    },
    {
        id: '2',
        title: 'Concept',
        included:true,
        tasks: [
            {
                id: '8',
                task: 'Send drawings to client for approval',
                assignee: 'Design Executive',
                estimated: '25 Aug 2025',
                actual: '',
                status: 'completed',
                supervisor: ''
            },
            {
                id: '9',
                task: 'Receive approved drawings from client',
                assignee: 'Design Executive',
                estimated: '30 Aug 2025',
                actual: '',
                status: 'pending',
                supervisor: ''
            }
        ]
    },
        
    { id: '3', title: 'Color Selection  ', included:true, tasks: [] },
    { id: '4', title: 'Contract Drawing', included:true, tasks: [] },
    { id: '5', title: 'Handover', included:true, tasks: [] }
];