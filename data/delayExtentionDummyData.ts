export interface NoticeData {
  key: string;
  reason: string;
  days: number;
  from: string;
  to: string;
  created: string;
  status: string[];
  tags: string[]; // For the 'Job' tag
}

export const dummyData: NoticeData[] = [
  {
    key: '1',
    reason: 'Private Inspection',
    days: 14,
    from: '02-10-2025',
    to: '21-10-2025',
    created: '02-10-2025',
    status: ['Email Not Sent', 'Date Not Recalculated'],
    tags: ['Job'],
  },
  {
    key: '2',
    reason: 'Council Approval Delay',
    days: 30,
    from: '10-09-2025',
    to: '10-10-2025',
    created: '10-09-2025',
    status: ['Email Sent', 'Date Recalculated'],
    tags: ['Client'],
  },
];

export interface TemplateData {
  key: string;
  template: string;
  status: 'Requested' | 'Completed' | 'Pending' | 'Draft';
  requestedByInitials: string;
  requestedByDate: string;
  submittedBy: string;
  comments: string;
}

export const templateDummyData: TemplateData[] = [
  {
    key: '1',
    template: 'Quality Feedback',
    status: 'Requested',
    requestedByInitials: 'K',
    requestedByDate: '02-10-2025',
    submittedBy: '', // Empty in the image
    comments: '', // Empty in the image
  },
  {
    key: '2',
    template: 'Client Handover Checklist',
    status: 'Completed',
    requestedByInitials: 'A',
    requestedByDate: '01-09-2025',
    submittedBy: 'A',
    comments: 'Signed by client.',
  },
  {
    key: '3',
    template: 'Site Inspection Report',
    status: 'Pending',
    requestedByInitials: 'J',
    requestedByDate: '15-10-2025',
    submittedBy: '',
    comments: '',
  },
];
