import { Status } from "@lib/constants/enum";

export interface EmailTemplate {
  templateEmailId: string;
  name: string;
  type: string;
  subject: string | null;
  emailContent: string;
  additionalRecipientUsers: string[];
  additionalRecipientGroups: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IEmailTemplateState {
  emailTemplate: EmailTemplate[];
  count: {
    total: number;
    standard: number;
    customized: number;
  };
  status: {
    fetch: Status;
    update: Status;
  }
}