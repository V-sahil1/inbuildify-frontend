import { Status } from "@lib/constants/enum";

export interface EmailSignature {
  includeEmailSignature: boolean,
  signatureContent: string;
}

export interface IEmailSignatureState {
  emailSignature: EmailSignature;
  status: {
    fetch: Status;
    update: Status;
  }
}