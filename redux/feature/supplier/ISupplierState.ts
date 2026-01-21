import { Status } from '@lib/constants/enum';
export interface ISupplierType {
  supplierTypeId: string;
  name: string;
  isActive: boolean;
}

export interface ISupplierState {
  supplierType: ISupplierType[];
  status: {
    fetch: Status;
  };
}
