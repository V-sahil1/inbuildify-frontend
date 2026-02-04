import { Status } from '@lib/constants/enum';
export interface ISupplierType {
  supplierTypeId: string;
  name: string;
  isActive: boolean;
}

export interface ISupplierState {
  supplierType: ISupplierType[];
  suppliers: Supplier[];
  status: {
    fetch: Status;
  };
}

export interface Supplier {
  supplierId?: string,
  companyId: string,
  builderId: string,
  supplierTypeId: string[],
  companyName: string,
  abn: string,
  description: string,
  contactName: string,
  primaryPhone: string,
  secondaryPhone: string,
  website: string,
  addressLine1: string,
  city: string,
  stateId: string,
  zipCode: number,
  leadTime: string,
  status: boolean,
  emails: string[],
  supplierTypes?: [
    {
      id : string,
      name : string
    }
  ],
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string
}
