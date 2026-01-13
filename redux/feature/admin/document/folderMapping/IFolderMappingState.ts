import { Status } from '@lib/constants/enum';

export interface IDocumentFolderMapping {
  selectAllFilesFromFolder: boolean;
  signedQuotation: string | null;
  signedColor: string | null;
  signedVariation: string | null;
  signedMaintenance: string | null;
  signedContractDocument: string | null;
  complianceCertificate: string | null;
  purchaseOrder: string | null;
  jobDocuments: string | null;
}


export interface IFolderMappingState {
  folderMapping: IDocumentFolderMapping;
  status: {
    fetch: Status;
    create: Status;
  };
}
