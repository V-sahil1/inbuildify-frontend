export interface StructuralEngineer {
  structureEngineerId?: string;
  builderId?: string;
  companyId?: string;
  name: string;
  email: string;
  phone: string;
  address?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  key?: string;
}

export interface StructuralEngineersResponse {
  engineers: StructuralEngineer[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}