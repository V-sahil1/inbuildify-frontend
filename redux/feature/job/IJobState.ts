import { Status } from '@lib/constants/enum';

export interface JobDetailInvoice {
  invoiceId: string;
  referenceNumber: string | null;
  invoiceAmount: number | null;
  depositAmount: number | null;
  status: string | null;
}

export interface IJobDetail {
  jobId: string;
  referenceNumber: string;
  status: string;
  jobNote: string | null;
  builderId: string | null;
  companyId: string | null;
  quotationVersionId: string | null;
  createdAt: string;
  updatedAt: string;
  // Customer
  leadsId: string;
  customerName: string;
  customerEmail: string | null;
  customerPhone: string | null;
  // Property / Address
  jobAddress: string;
  estateName: string | null;
  titleDate: string | null;
  titleStatus: string | null;
  // Builder
  builderName: string | null;
  // Lead source
  leadSourceName: string | null;
  // Consultant
  consultantId: string | null;
  consultantName: string | null;
  consultantInitials: string | null;
  consultantEmail: string | null;
  // Financial
  quotationTotal: number;
  totalPaid: number;
  invoices: JobDetailInvoice[];
}

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
  currentJob: IJobDetail | null;
  pagination: JobPagination;
  statusSummary: JobStatusSummary;
  totalJobs: number;
  filters: JobFilters;
  status: {
    list: Status;
    updateStatus: Status;
    detail: Status;
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
