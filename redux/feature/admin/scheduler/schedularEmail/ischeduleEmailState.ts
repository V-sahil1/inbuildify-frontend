import { Status } from '@lib/constants/enum';

export interface ScheduleEmail {
  schedulerEmailId: string;
  name: string;
  frequency: string;
  sendToAllActiveUsers: boolean;
  notificationRecipientUsers: string[];
  replyToUsers: string[];
  excludeRecipients: string[];
  subject: string | null;
  messageBody: string | null;
  noOfActionDays: number | null;
  noRecordMessage: boolean;
  noRecordMessageBody: string | null;
  isActive: boolean;
  attachFiles: File[] | null;
}

export interface IScheduleEmailState {
  scheduleEmail: ScheduleEmail[];
  counts: { total: number; active: number; inactive: number };
  status: {
    fetch: Status;
    update: Status;
  };
}
