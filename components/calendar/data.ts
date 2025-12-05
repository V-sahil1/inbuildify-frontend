import dayjs from 'dayjs';

export interface Event {
  id: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  category:
  | 'General'
  | 'Sales'
  | 'Job'
  | 'Construction'
  | 'Maintenance'
  | 'ReferralPartner'
  | 'Today'
  | 'Holiday';
  type: 'Appointment' | 'Task';
}

export const dummyEvents: Event[] = [
  {
    id: '1',
    title: 'Lot 89, 09 in numquam prident - Ex qui quia aut aute - mmm',
    description: 'Important construction project review meeting',
    start_time: dayjs('2025-10-01').hour(9).minute(0).toISOString(),
    end_time: dayjs('2025-10-03').hour(17).minute(0).toISOString(),
    category: 'Construction',
    type: 'Appointment',
  },
  {
    id: '2',
    title: 'Eg. In numquam prsident - Confirm Drawing Update',
    description: 'Confirm and review drawing updates',
    start_time: dayjs('2025-10-01').hour(10).minute(0).toISOString(),
    end_time: dayjs('2025-10-01').hour(12).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '3',
    title: 'Lot 89, 09 in numquam prident - Ex qui quia aut aute - mmm',
    description: 'Multi-day construction project',
    start_time: dayjs('2025-10-05').hour(8).minute(0).toISOString(),
    end_time: dayjs('2025-10-14').hour(18).minute(0).toISOString(),
    category: 'Construction',
    type: 'Appointment',
  },
  {
    id: '4',
    title: 'Lot 28 Ballarat Street, Epping - Electrician Install',
    description: 'Electrical installation work',
    start_time: dayjs('2025-10-06').hour(9).minute(0).toISOString(),
    end_time: dayjs('2025-10-09').hour(15).minute(0).toISOString(),
    category: 'Maintenance',
    type: 'Appointment',
  },
  {
    id: '55',
    title: 'Lot 8888 Ballarat Street, Epping - Electrician Install',
    description: 'Electrical installation work',
    start_time: dayjs('2025-10-09').hour(16).minute(0).toISOString(),
    end_time: dayjs('2025-10-09').hour(17).minute(50).toISOString(),
    category: 'Maintenance',
    type: 'Task',
  },
  {
    id: '5',
    title: 'Lot 77 Modern Cr, Tarneit - Send Final Invoice',
    description: 'Send final invoice to client',
    start_time: dayjs('2025-10-09').hour(14).minute(0).toISOString(),
    end_time: dayjs('2025-10-09').hour(15).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '6',
    title: 'Eg. In numquam prsident - Confirm Revised WD',
    description: 'Confirm revised working drawings',
    start_time: dayjs('2025-10-09').hour(16).minute(0).toISOString(),
    end_time: dayjs('2025-10-09').hour(17).minute(30).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '7',
    title: 'Lot 89, 09 in numquam prident - Ex qui quia aut aute - mmm',
    description: 'Construction site inspection',
    start_time: dayjs('2025-10-12').hour(8).minute(0).toISOString(),
    end_time: dayjs('2025-10-12').hour(12).minute(0).toISOString(),
    category: 'Construction',
    type: 'Appointment',
  },
  {
    id: '8',
    title: 'Eg. In numquam prsident - Request for the Sketch',
    description: 'Request architectural sketches',
    start_time: dayjs('2025-10-27').hour(10).minute(0).toISOString(),
    end_time: dayjs('2025-10-27').hour(11).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '9',
    title: 'Eg. In numquam prsident - Receive sketch from',
    description: 'Receive and review sketches',
    start_time: dayjs('2025-10-29').hour(9).minute(0).toISOString(),
    end_time: dayjs('2025-10-29').hour(10).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '10',
    title: 'Eg. In numquam prsident - Sketch Signoff from',
    description: 'Get sketch signoff approval',
    start_time: dayjs('2025-10-30').hour(11).minute(0).toISOString(),
    end_time: dayjs('2025-10-30').hour(12).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '11',
    title: 'Melbourne Cup',
    description: 'Public holiday - Melbourne Cup',
    start_time: dayjs('2025-11-03').hour(0).minute(0).toISOString(),
    end_time: dayjs('2025-11-03').hour(23).minute(59).toISOString(),
    category: 'Holiday',
    type: 'Appointment',
  },
  {
    id: '12',
    title: 'Eg. In numquam prsident - Request Sketch review',
    description: 'Request sketch review from team',
    start_time: dayjs('2025-11-05').hour(14).minute(0).toISOString(),
    end_time: dayjs('2025-11-05').hour(15).minute(0).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '13',
    title: 'Eg. In numquam prsident - Receive Revised Sketch',
    description: 'Receive and review revised sketches',
    start_time: dayjs('2025-11-06').hour(10).minute(0).toISOString(),
    end_time: dayjs('2025-11-06').hour(11).minute(30).toISOString(),
    category: 'Job',
    type: 'Task',
  },
  {
    id: '14',
    title: 'Team Meeting - Project Updates',
    description: 'Weekly team sync and project status updates',
    start_time: dayjs('2025-10-14').hour(10).minute(0).toISOString(),
    end_time: dayjs('2025-10-14').hour(11).minute(30).toISOString(),
    category: 'General',
    type: 'Appointment',
  },
  {
    id: '15',
    title: 'Client Consultation - New Project',
    description: 'Initial consultation with new client for residential project',
    start_time: dayjs('2025-10-14').hour(14).minute(0).toISOString(),
    end_time: dayjs('2025-10-14').hour(16).minute(0).toISOString(),
    category: 'Sales',
    type: 'Appointment',
  },
  {
    id: '16',
    title: 'Site Inspection - Lot 45',
    description: 'Morning site inspection at Lot 45 construction site',
    start_time: dayjs('2025-10-14').hour(8).minute(0).toISOString(),
    end_time: dayjs('2025-10-14').hour(10).minute(0).toISOString(),
    category: 'Construction',
    type: 'Appointment',
  },
];
