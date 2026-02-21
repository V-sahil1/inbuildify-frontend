import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IEstate {
  estateId?: string;
  name: string;
  streetName: string;
  city: string;
  stateId: string;
  countryId: string;
  zip: string;
  estateLogo: string | null;
  website: string;
  description: string;
  status?: boolean;
  featured?: boolean;
  documents?: EstateDocument[];
  features?: EstateFeature[];
  stages?: EstateStage[];
  isExpanded?: { document?: boolean; feature?: boolean; stage?: boolean; image?: boolean };
  image?: EstateImage;
}

export interface EstateDocument {
  estateDocumentId: string;
  estate: Entity;
  documentName: string;
  fileUrl: string;
}

export interface EstateFeature {
  estateFeatureId?: string;
  estateId?: string;
  featureName: string;
  createdAt?: string;
}

export interface EstateStage {
  estateStageId: string;
  estateId?: string;
  name: string;
  releaseDate: string;
  createdAt?: string;
  updatedAt?: string;
  attachFile?: File[];
}

export interface EstateImage {
  estateImageId: string;
  estate: Entity;
  imageUrl: File | string;
}

export interface IEstateState {
  estate: IEstate[];
  status: {
    estate: {
      fetch: Status;
      create: Status;
    };
    document: {
      fetch: Status;
      create: Status;
    };
    feature: {
      fetch: Status;
      create: Status;
    };
    stage: {
      fetch: Status;
      create: Status;
    };
    image: {
      fetch: Status;
      create: Status;
    };
  };
}
