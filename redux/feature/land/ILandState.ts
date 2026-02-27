import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';
import dayjs from 'dayjs';

export interface ILandLot {
  lotId: string;
  companyId: string;
  builderId: string;
  estateId: string;
  estateStageId: string;
  lotNumber: string;
  street: string;
  city: string;
  stateId: string;
  zipCode: string;
  titleStatus: "available" |
  "sold" |
  "reserved" |
  "pending" |
  "under_contract" |
  "off_market"
  titleDate: string | Date | dayjs.Dayjs;
  lotType: "regular" | "irregular";
  cornerBlock: boolean;
  widthM: number;
  depthM: number;
  sizeM2: number;
  price: number;
  siteFallMm: number;
  landFillMm: number;
  totalSizeM2: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
  createdByName?: string;
  estate?: Entity;
  estateStage?: Entity;
  packages?: HouseLandPackage[];
  estateName?:string
}

export interface HouseLandPackage {
  houseLandPackageId: string;
  companyId: string;
  builderId: string;
  title: string;
  dwellingTypeId: string;
  rangeId: string;
  templateId: string;
  facadeId: string;
  floorPlanId: string;
  contactId: string;
  dwellingType: Entity;
  range: Entity;
  template: Entity;
  facade?: {
    id: string;
    name: string;
    image: string;
  };
  floorPlan?: {
    id: string;
    name: string;
    simpleImage: string;
  };
  contact?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  contactShowPdf: boolean | null;
  lotDetails: ILandLot;
  packageGroupId: string | null;
  floorPlanDescription: string | null;
  priceType: string | null;
  landPrice: number;
  houseTotal: number;
  commissionTotal: number;
  totalPrice: number;
  packageDescription: string | null;
  houseFeatureId: string | null;
  disclaimerType: string;
  disclaimerDescription: string;
  attachFiles: string;
  createdByName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  commissions: HLPackageCommission[];
  pricelist: HLPackagePriceItem[];
}

export interface LotPackageGroup {
  lotPackageGroupId: string;
  groupName: string;
}

export interface HLPackageCommission {
  id?: string;
  houseLandPackageId: string;
  jobCommissionId: string;
  commissionName?: string;
  packageTitle?: string;
  totalCommission?: number;
}

export interface HLPackagePriceItem {
  id?: string;
  houseLandPackageId: string;
  priceListItemId: string;
  priceListItemDescription?: string;
  packageTitle?: string;
  quantity: number;
  totalPrice?: number;
  cost?: number;
  note: string | null;
}


export interface ILandState {
  lot: ILandLot[];
  package: HouseLandPackage[];
  packageGroup: LotPackageGroup[];
  packageDetails: HouseLandPackage | null;
  status: {
    lot: {
      fetch: Status;
      create: Status;
    }
    package: {
      fetch: Status;
      create: Status;
    }
    packageCommission: {
      fetch: Status;
      create: Status;
    }
    packagePricelist: {
      fetch: Status;
      create: Status;
    }
    packageGroup: Status
    packageDetails: Status
  }
}
