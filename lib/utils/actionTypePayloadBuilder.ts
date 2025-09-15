import { AppointmentDetails, NoteDetails, SmsDetails, TaskDetails } from "data/types";
import { formDataGenerator } from "./formDataGenerator";

interface UploadFile {
  uid: string;
  name: string;
  status?: string;
  url?: string;
  originFileObj?: File;
  [key: string]: any;
}

export const buildPayload = (
    type: "Notes" | "Sms" | "Appointments" | "Tasks",
    data: any
  ): FormData => {
    let payload: any;
  
    switch (type) {
      case "Notes": {
        const { task, attachment, ...rest } = data as NoteDetails & { attachment?: UploadFile[] };
        payload = {
          type: "NOTES",
          ...rest,
          task: {
            due_date: task?.dueDate,
            name: "Follow up call",
            priority: "HIGH",
          },
          attachment: attachment?.[0]?.originFileObj || attachment?.[0] || null,
        };
        break;
      }
  
      case "Sms": {
        payload = {
          type: "SMS",
          ...(data as SmsDetails),
        };
        break;
      }
  
      case "Appointments": {
        const { startTime, endTime,user, ...rest } = data as AppointmentDetails;
        payload = {
          type: "APPOINTMENT",
          start_time: startTime,
          end_time: endTime,
          select_users: user,
          ...rest,
        };
        break;
      }
  
      case "Tasks": {
        const { task, attachment } = data as TaskDetails & { attachment?: UploadFile[] };
        payload = {
          type: "TASK",
          task: {
            due_date: task?.dueDate,
            name: task?.name,
            priority: task?.priority,
            description: task?.description,
            time: task?.time,
            assignee: task?.assignee,
          },
          attachment: attachment?.[0]?.originFileObj || null,
        };
        break;
      }
  
      default:
        payload = data;
    }
  console.log("submitted payload",payload)
    return formDataGenerator(payload);
  };