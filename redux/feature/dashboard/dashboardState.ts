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

export interface MonthlyLead {
  month: string;
  total: number;
  newCount: number;
  workingCount: number;
  convertedCount: number;
}

export interface LeadSourceStat {
  source: string;
  count: number;
}

export interface TopPerformer {
  name: string;
  count: number;
}

export interface OverallSummary {
  totalLeads: number;
  newLeads: number;
  workingLeads: number;
  convertedLeads: number;
}

export interface FloorplanStat {
  name: string;
  count: number;
}

export interface FacadeStat {
  name: string;
  count: number;
}

export interface LeadLostReason {
  name: string;
  count: number;
}

export interface SalesDashboardStats {
  monthlyLeads: MonthlyLead[];
  leadSources: LeadSourceStat[];
  topPerformers: TopPerformer[];
  overallSummary: OverallSummary;
  topFloorplans: FloorplanStat[];
  topFacades: FacadeStat[];
  leadLostReasons: LeadLostReason[];
}
