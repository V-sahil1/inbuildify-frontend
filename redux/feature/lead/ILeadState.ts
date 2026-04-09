import { PropertyDetails } from 'data/types';
import { Quotation, QuotationResponse } from '../quotation/IQuotationState';
import { Status } from '@lib/constants/enum';
import { IAddress } from '../contacts/contactState';

export interface ActivityItem {
  activityId: string;
  activityType: string;
  description: string;
  createdAt: string;
  leadId: string;
  userId?: string;
  metadata?: Record<string, any>;
  // Additional fields from API response
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  propertyName?: string;
  propertyAddress?: string;
}

export interface InitialState {
  leads: Lead[];
  status: {
    leads: Status;
    leadSources: Status;
    leadById: Status;
    leadQuotations: Status;
    updateLeadSource: Status;
    leadContact: Status;
    leadJob: Status;
    leadDeposit: Status;
    activities: Status;
  };
  leadSources: LeadSource[];
  addInstSourceModal: boolean;
  leadDetail: {
    lead: Lead | null;
    contacts: LeadContact[] | null;
    property: PropertyDetail | null;
    createdQuotations: { quotations: Quotation[] };
    job: ILeadJob | null;
    invoice: InvoiceDetails[];
    activities: ActivityItem[];
  };
}

export interface ILead {
  //old
  slugId?: string;
  leadId: string;
  builderId: string;
  status: string;
  leadSource: string;
  notes?: string | null;
  leadsContactId?: string;
  leadContactId?: string;
  name?: string;
  email?: string;
  phone?: string;
  secondaryPhone?: string | null;
  city?: string;
  zip?: string;
  countryId?: string;
  stateId?: string;
  decision?: string | null;
  assigneeId?: string;
  createdById?: string;
  updatedById?: string;
  assignee: IDNamePair | null;
  createdBy: IDNamePair | null;
  updatedBy: IDNamePair | null;
  createdAt: string;
  updatedAt: string;
}

export interface IDNamePair {
  id: string;
  name: string;
}
export interface ILeadContact {
  //old
  leadId?: string;
  leadsContactId: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone: string | null;
  address1: string;
  address2: string | null;
  city: string;
  zip: string;
  countryId: string;
  countryName: string;
  stateId: string;
  stateName: string;
  leadSource?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ILeadProperty {}

export interface leadDetail {
  contact: ILeadContact;
  property: PropertyDetails;
  createdQuotations: QuotationResponse[];
}

export interface LeadSourceRequest {
  name: string;
}

export interface LeadSource {
  leadSourceId: string;
  name: string;
  builderId: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

//new
export interface Lead {
  leadsId: string;
  slugId?: string;
  referenceNumber: string;
  companyId: string;
  builderId: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
  sendLetter: boolean;
  leadSourceId: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost' | string;
  outcome: string | null;
  rating: 'Hot' | 'Warm' | 'Cold' | string;
  land: 'Yes' | 'No' | string;
  finance: 'Yes' | 'No' | string;
  faceToFace: 'Yes' | 'No' | string;
  purpose: string;
  clientTypeId: string;
  forcastClose: string;
  buildBudget: string;
  regionId: string;
  prelimAgreement: string;
  clientProfile: string;
  hLBudget: string;
  assigneeId: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  leadSourceName: string;
  clientTypeName: string;
  regionName: string;
  assigneeName: string;
  createdByName: string;
  updatedByName: string;
  leadsContactId?: string; // todo add
  houseLandPackage: string;
  company: BusinessContact;
  conveyancer: BusinessContact;
  mortgageBroker: BusinessContact;
  financer: BusinessContact;
  houseLandPackageId?: string;
  houseLandPackageDetails: {
    houseLandPackageId: string;
    title: string;
    lotId: string | null;
    facadeId: string | null;
    floorPlanId: string | null;
    attachFiles: string[] | null;
  };
  lotDetails?: ILotDetail;
  quotations?: Quotation[];
  opportunityStatus?: string;
  structureEngineerId?: string;
  structureReportFile?: string;
}

export interface BusinessContact {
  businessContactId?: string;
  leadsId: string;
  contactType?: 'company' | 'conveyancer' | 'mortgage_broker' | 'financer';
  name?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  zipCode?: string;
  countryId?: string | null;
  stateId?: string | null;
  abnNumber?: string;
  acnNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type LeadContact = {
  id: string;
  leadsId: string;
  contactId: string;
  usersId: string;
  name: string;
  email: string;
  phone: string;
  secondaryPhone: string | null;
  remark: string | null;
  roleId: string;
  addressId: string;
  hasLogin: boolean;
  isActive: boolean;
  address: IAddress;
  contactCreatedAt: string;
  contactUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
};

export type ILeadJob = {
  jobFormId: string;
  leadsId: string;
  streetName: string;
  landDeveloper: string;
  council: string;
  titleVolume: string;
  folio: string;
  planSubdivision: string;
  siteFall: string;
  existingTree: boolean;
  driveawayLocation: string;
  anySewerTie: boolean;
  easements: boolean;
  buildupAreaEasements: boolean;
  buildZone: string;
  storyId: string;
  finishedSurfaceM: number;
  existingSurfaceM: number;
  filledAreaFailM: number;
  maxFillLocation: string;
  maxFinishedSurfaceM: number;
  minFinishedSurfaceM: number;
  engineeringFailM: number;
  failType: string;
  ceilingHeight: number;
  eavesLocation: string;
  lotType: string;
  siteCoverageAllowed: string;
  eavesSize: string;
  eavesReturn: string;
  roofCovering: string;
  roofPitch: string;
  flatRoofPitch: string;
  parapetWall: string;
  singleStory: string;
  doubleStoryGf: string;
  doubleStoryFf: string;
  wallOverGarage: string;
  wallOverLowerRoof: string;
  allElectric: boolean;
  typeOfCooling: string;
  garageDoorType: string;
  connection: string;
  recycledWater: boolean;
  extraRequirement: string;
  threePhase: boolean;
  driveway: string;
  frontWall: string;
  betweenGarageBuilding: string;
  garageSide: string;
  otherSide: string;
  rear: string;
  allowedPorchEncroachment: string;
  boundryBuild: boolean;
  boundryConstruction: boolean;
  doubleStoryFrontWall: string;
  doubleStoryGarageSide: string;
  doubleStoryOtherSide: string;
  doubleStoryRear: string;
  doubleStoryBalconyEncroachment: string;
  raisedPorchFacade: boolean;
  parapetWallsPitchRoof: boolean;
  parapetWallsTrayDeckRoof: boolean;
  conceptInspiration: boolean;
  planSubdivisionEngineering: boolean;
  memorandumCommonProvisions: boolean;
  developerGuidelines: boolean;
  contactForSale: boolean;
  variationalList: boolean;
  specialJobNotes: string;
};

export type InvoiceDetails = {
  leadsId: string;
  generateInvoice: boolean;
  invoiceDate: string;
  dueDate: string;
  invoiceAmount: string;
  // Optional deposit fields
  depositeDate?: string;
  depositeAmount?: string;
  paymentMethod?: string;
  transactionNo?: string;
  description: string;
};

export type PropertyDetail = {
  propertyDetailId?: string;
  lotId: string | null;
  lotNumber: string;
  street: string;
  addressLine1?: string;
  addressLine2?: string | null;
  city: string;
  stateId?: string;
  countryId?: string;
  zipCode: string;
  estateId: string | null;
  estateStageId: string | null;
  estateName: string;
  titleStatus: string;
  titleDate: string;
  clearingDate?: string;
  compactionReport?: string;
  landType: string;
  widthM: number;
  depthM: number;
  totalSizeM2: number;
  siteFallMm?: number;
  landFillMm?: number;
  price?: number;
  bushFire?: boolean;
  cornerBlock?: boolean;
  isHlPackageLot?: boolean;
  createdAt?: string;
  updatedAt?: string;
  stateName?: string;
  compactionReportContent?: CompactionReport;
  compactionReportUrl?: string;
  compactionReportProvider?: string;
};

export type ILotDetail = {
  lotId: string;
  lotNumber: string;
  street: string;
  city: string;
  zipCode: string;
  titleStatus: string;
  titleDate: string;
  lotType: string;
  cornerBlock: boolean;
  widthM: number;
  depthM: number;
  price: number;
  totalSizeM2: number;
  estateId: string;
  estateName: string;
  estateStageId: string;
  estateStageName: string;
};

export type SoilClass = 'A' | 'S' | 'M' | 'H' | 'E' | 'P';

export type SoilType = 'Clay' | 'Sand' | 'Gravel' | 'Silt' | 'Rocky' | 'Mixed';

export type GroundLevel = 'Below Road Level' | 'At Road Level' | 'Above Road Level';

export type SlopeCondition = 'Flat' | 'Gentle' | 'Moderate' | 'Steep';

export type TestResult = 'pass' | 'fail';

export interface CompactionReport {
  compaction: number;
  dryDensity: number;
  maxDryDensity: number;
  moistureContent: number;
  soilClass: SoilClass;
  soilType: SoilType;
  groundLevel: GroundLevel;
  slopeCondition: SlopeCondition;
  landType: string;
  engineerName: string;
  remarks?: string;
  result: TestResult;
}

export type WonLostPayload = {
  outCome: string;
  quotationVersionId?: string;
  jobNote?: string;
  sendEmail?: boolean;
  leadLostComment?: string;
  leadLostReasonId?: string;
};
