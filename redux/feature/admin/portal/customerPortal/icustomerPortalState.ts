import { Status } from '@lib/constants/enum';

export interface CustomerPortalInfo {
  sendLoginCredentialsToCustomer: boolean;
  portalActiveDaysAfterHandover: number;
  sendMailWhenPortalInactive: boolean;
  showSiteSupervisorDetails: boolean;
  showBalanceToPay: boolean;
  addNotesEnabled: boolean;
  allowColorSelection: boolean;
  showColorCost: boolean;
  showConstructionStages: boolean;
  autoShareSiteImages: boolean;
  showProgressTab: boolean;
  defaultFacadeImage: string | File | null;
  publishPackagesToAgentPortal: boolean;
}

export interface ICustomerState {
  customer: CustomerPortalInfo;
  status: {
    fetch: Status;
    update: Status;
  };
}
