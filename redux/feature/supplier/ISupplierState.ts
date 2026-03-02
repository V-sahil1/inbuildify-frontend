import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface ISupplierState {
  supplierType: ISupplierType[];
  suppliers: Supplier[];
  status: {
    supplier: {
      fetch: Status;
      create: Status;
    };
    supplierType: {
      fetch: Status;
      create: Status;
    };
    supplierContact: {
      fetch: Status;
      create: Status;
    };
    supplierChecklist: {
      fetch: Status;
      create: Status;
    };
    supplierMapping: {
      fetch: Status;
      create: Status;
    };
  };
}
export interface ISupplierType {
  supplierTypeId?: string;
  name: string;
  isActive: boolean;
  isNew?: boolean;
  suppliers?: SupplierMapping[];
  checklists?: SupplierChecklist[];
  isSupplierExpand?: boolean;
  isChecklistExpand?: boolean;
}

export interface Supplier {
  supplierId?: string;
  supplierTypeId: string[];
  companyName: string;
  abn: string;
  description: string;
  contactName: string;
  primaryPhone: string;
  secondaryPhone: string;
  website: string;
  addressLine1: string;
  city: string;
  stateId: string;
  zipCode: number;
  leadTime: string;
  status: boolean;
  emails: string[];
  workCoverUrl: File | string;
  plInsuranceUrl: File | string;
  whiteCardUrl: File | string;
  forkLiftLicenseUrl: File | string;
  tradeLicenseUrl: File | string;
  inductionPackUrl: File | string;
  supplierTypes?: Entity[];
  contacts?: SupplierContact[];
}

export interface SupplierContact {
  supplierContactId?: string;
  supplierId?: string;
  contactName: string;
  email: string;
  phone: string;
  contactType?: string;
}

export interface SupplierChecklist {
  id?: string;
  supplierTypeId: string;
  constructionChecklistId: string;
}

export interface SupplierMapping {
  id?: string;
  supplierTypeId: string;
  supplierId: string;
  isRecommended?: boolean;
  assignToNewAndExistingChecklist?: boolean;
}

export interface SupplierFetchParams {
  company_name?: string;
  emails?: string;
  phone?: string;
  website?: string;
  type?: string;
  induction?: boolean;
  isActive?: boolean;
}
