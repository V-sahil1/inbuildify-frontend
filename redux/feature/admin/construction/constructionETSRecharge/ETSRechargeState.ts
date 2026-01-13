import { Status } from '@lib/constants/enum';

export interface IETSRechargeSetting {
  enableEtsSupplier: boolean;
  enableRechargeSupplier: boolean;
  signatureSection: boolean;
}

export interface ETSRechargeItem {
  constructionEtsRechargeApprovalId: string;
  roleId: string;
  roleName: string;
  amount: string;
}

export interface IETSRechargeState {
  setting: IETSRechargeSetting;
  etsItems:ETSRechargeItem[];
  etsItemStatus:{
    fetch: Status;
    create: Status;
  };
  status: {
    fetch: Status;
    create: Status;
  };
}
