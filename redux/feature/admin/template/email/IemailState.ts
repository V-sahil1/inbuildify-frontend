import { Status } from '@lib/constants/enum';
import { Entity } from 'types/common.types';

export interface IEmailTemplate {
  templateEmailId: string;
  name: string;
  type: string;
  subject: string | null;
  emailContent: string;
  additionalRecipientUsers: string[] | Entity[];
  additionalRecipientGroups: string[] | Entity[];
  isActive: boolean;
}

export interface IEmailTemplateState {
  emailTemplate: IEmailTemplate[];
  count: {
    total: number;
    standard: number;
    customized: number;
  };
  status: {
    fetch: Status;
    update: Status;
  };
}
