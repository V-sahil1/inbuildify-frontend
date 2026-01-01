import { Status } from "@lib/constants/enum";

export interface JobInvoiceSetting {
  showInvoiceSummaryInPdf: boolean;
  invoiceTermsDays: number;
}

export interface JobInvoiceStage {
  jobInvoiceStagePaymentId: string;
  description: string;
  percentage: number;
  sortOrder: number;
  active?: boolean;
}

export interface IJobInvoiceState {
  jobInvoiceSetting: JobInvoiceSetting | null;
  jobInvoiceStage: JobInvoiceStage[];
  InvoiceStageStatus: {
    fetch: Status;
    update: Status;
  }
  status: {
    fetch: Status;
    update: Status;
  }
}