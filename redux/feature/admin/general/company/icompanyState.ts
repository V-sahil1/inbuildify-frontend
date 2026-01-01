import { Status } from '@lib/constants/enum';

export interface CompanyInfo {
 companyId: string;
 builderId: string;
 name: string;
 abnNumber: string;
 timezoneId: string;
 address1: string;
 address2: string | null;
 city: string;
 zipPostalCode: string;
 stateId: string;
 countryId: string;
 bankName: string;
 accountName: string;
 accountNumber: string;
 accountBsb: string;
 emailSignatureLogo: string;
 companyLogo: string;
 createdAt: string;
 updatedAt: string;
}

export interface ICompanyState {
  company: CompanyInfo;
  status: {
    fetch: Status;
    update: Status;
  };
}
 
