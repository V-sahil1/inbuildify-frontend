export type Pagination = {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  limit: number;
  hasMore: boolean;
};

export const initialPagination: Pagination = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  limit: 10,
  hasMore: false,
};

export type MasterItem = {
  id: number | string;
  name: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  sortOrder: number;
};

export type MasterHeading = {
  id: number | string;
  name: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  sortOrder: number;
  items?: MasterItem[];
  itemsPagination?: Pagination;
};

export type MasterGroup = {
  id: number | string;
  masterSectionId?: string;
  name: string;
  active: boolean;
  headings: MasterHeading[];
  headingsPagination?: Pagination;
};

export const mockMasters: MasterGroup[] = [];
