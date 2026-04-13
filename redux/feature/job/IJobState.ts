import { Status } from '@lib/constants/enum';

export interface JobConsultant {
  id: string;
  name: string;
  initials: string;
  email: string;
}

export type JobStatus = 'In Progress' | 'Completed' | 'On Hold' | 'Cancelled' | 'Archived';

export interface Job {
  jobId: string;
  referenceNumber: string;
  status: JobStatus;
  jobNote: string | null;
  createdAt: string;
  updatedAt: string;
  // Tenant scoping — stored directly on the job row for reliable filtering
  builderId: string | null;
  companyId: string | null;
  // Lead info
  leadsId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  // Property
  estateName: string | null;
  titleDate: string | null;
  jobAddress: string;
  // Consultant
  consultantId: string | null;
  consultantName: string | null;
  consultantInitials: string | null;
  consultantEmail: string | null;
}

export interface JobPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface JobStatusSummary {
  'In Progress': number;
  'Completed': number;
  'On Hold': number;
  'Cancelled': number;
  'Archived': number;
}

export interface JobFilters {
  page: number;
  limit: number;
  search: string;
  status: string;
  referenceId: string;
  customerName: string;
  jobAddress: string;
  estateName: string;
  consultant: string;
  assigneeId: string;
  createdAtFrom: string;
  createdAtTo: string;
  titleDateFrom: string;
  titleDateTo: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface IJobState {
  jobs: Job[];
  pagination: JobPagination;
  statusSummary: JobStatusSummary;
  totalJobs: number;
  filters: JobFilters;
  status: {
    list: Status;
    updateStatus: Status;
  };
}

export const initialJobFilters: JobFilters = {
  page: 1,
  limit: 25,
  search: '',
  status: '',
  referenceId: '',
  customerName: '',
  jobAddress: '',
  estateName: '',
  consultant: '',
  assigneeId: '',
  createdAtFrom: '',
  createdAtTo: '',
  titleDateFrom: '',
  titleDateTo: '',
  sortBy: 'created_at',
  sortOrder: 'desc',
};
