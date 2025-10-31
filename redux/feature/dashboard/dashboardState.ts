export interface Contractor {
  contractorId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Customer {
  customerId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface User {
  usersId: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Lead {
  leadId?: string;
  name?: string;
  email?: string;
  createdAt?: string;
}

export interface DashboardData {
  contractorCount: string;
  contractorData: Contractor[];
  customerCount: string;
  customerData: Customer[];
  usersCount: string;
  usersData: User[];
  leadCount: string;
  leadData: Lead[];
}
