export interface DataType {
  key: string;
  name: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedToId: number;
  assignedTo: string;
  tags: string[];
  contactName: string;
  phone: string;
}

export const data: DataType[] = [
  {
    key: '1',
    name: 'Task 1',
    status: 'open',
    priority: 'High',
    dueDate: '2023-10-15',
    assignedTo: 'John Doe',
    assignedToId: 1,
    contactName: 'John Doe',
    phone: '123-456-7890',
    tags: ['urgent', 'important'],
  },
  {
    key: '2',
    name: 'Task 2',
    status: 'open',
    priority: 'High',
    dueDate: '2023-10-14',
    assignedTo: 'John Doe',
    assignedToId: 2,
    contactName: 'John Doe',
    phone: '123-456-7890',
    tags: ['urgent', 'important'],
  },
  {
    key: '3',
    name: 'Task 3',
    status: 'open',
    priority: 'High',
    dueDate: '2023-10-16',
    assignedTo: 'John Doe',
    assignedToId: 3,
    contactName: 'John Doe',
    phone: '123-456-7890',
    tags: ['urgent', 'important'],
  },
];

export interface TodoDataType {
  key: string;
  jobAddress: string;
  taskName: string;
  supplier: string;
  bookingDate: string;
  startDate: string;
  siteSupervisor: string;
}

export const todoDummyData: TodoDataType[] = [
  {
    key: '1',
    jobAddress: '123 Main Street, Mumbai',
    taskName: 'Electrical Maintenance',
    supplier: 'PowerTech Ltd',
    bookingDate: '2025-10-01',
    startDate: '2025-10-05',
    siteSupervisor: 'Rajesh Kumar',
  },
  {
    key: '2',
    jobAddress: '456 Park Avenue, Delhi',
    taskName: 'Plumbing Repair',
    supplier: 'WaterWorks Co',
    bookingDate: '2025-09-28',
    startDate: '2025-10-03',
    siteSupervisor: 'Amit Sharma',
  },
  {
    key: '3',
    jobAddress: '789 Green Lane, Bangalore',
    taskName: 'HVAC Installation',
    supplier: 'CoolAir Systems',
    bookingDate: '2025-10-02',
    startDate: '2025-10-07',
    siteSupervisor: 'Neha Singh',
  },
  {
    key: '4',
    jobAddress: '321 Ocean View, Chennai',
    taskName: 'Painting & Coating',
    supplier: 'ColorPro Pvt Ltd',
    bookingDate: '2025-09-30',
    startDate: '2025-10-04',
    siteSupervisor: 'Vikram Iyer',
  },
];
