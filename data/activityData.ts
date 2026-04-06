
import { FilterOption } from '@/components/common/FilterTabs';

export const EmailData: any[] = [
  {
    id: 'e1',
    date: '2025/10/17',
    time: '09:00 AM',
    sender: 'john.doe@client.com',
    status: 'Delivered',
    subject: 'Meeting Minutes for Project Alpha',
    body: 'Please review the attached minutes before the next meeting.',
    recipient: 'project.team@company.com',
    attachment: true,
  },
  {
    id: 'e2',
    date: '2025/10/17',
    time: '11:30 AM',
    sender: 'sarah.smith@company.com',
    status: 'Sent',
    subject: 'Draft Proposal V2',
    body: 'Sent out the updated proposal for internal review.',
    recipient: 'legal.dept@company.com',
    attachment: true,
  },
  {
    id: 'e3',
    date: '2025/10/16',
    time: '04:00 PM',
    sender: 'system@alert.com',
    status: 'Delivered',
    subject: 'Login Alert on your account',
    body: 'A new device logged into your account.',
    recipient: 'my.email@domain.com',
    attachment: false,
  },
];

export const filterTabs: FilterOption[] = [
  { type: 'Own', label: 'own', count: 2 },
  { type: 'All', label: 'All', count: 15 },
];
