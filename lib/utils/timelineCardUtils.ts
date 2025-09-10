import { createActionsThunk } from "@redux/feature/action/actionThunk";
import { AppDispatch } from "@redux/feature/store";
import { message } from "antd";
import {
  AppointmentDetails,
  NoteDetails,
  SmsDetails,
  TaskDetails,
  TimelineCardProps,
} from "data/types";

interface EditingItem {
  item: TimelineCardProps;
  index: number;
}

export const handleSaveTimelineCard = async <
  T extends "Notes" | "Appointments" | "Tasks" | "Sms",
  D extends T extends "Notes"
    ? NoteDetails
    : T extends "Appointments"
    ? AppointmentDetails
    : T extends "Tasks"
    ? TaskDetails
    : SmsDetails
>(
  leadId: string,
  editingItem: EditingItem | null,
  setCardsData: React.Dispatch<React.SetStateAction<TimelineCardProps[]>>,
  handleClose: () => void,
  type: T,
  data: D,
  dispatch: AppDispatch
) => {
  if (editingItem && editingItem.item.type === type) {
    console.log(`🔄 Updated ${type}:`, data);
    setCardsData((prev) =>
      prev.map((card, i) =>
        i === editingItem.index
          ? ({ ...card, data: data, type: type } as TimelineCardProps)
          : card
      )
    );
  } else {
    console.log(`✨ Created New ${type}:`, data);

    const { sendToCustomer, task, attachment, ...restData } =
      data as NoteDetails;
    const NotePayload = {
      type: "NOTES",
      ...restData,
      task: {
        due_date: task?.dueDate,
        name: "Follow up call",
        priority: "HIGH",
      },
    };

    const SmsPayload = {
      type: "SMS",
      ...data,
    };

    const { location, notes, user,startTime,endTime, ...appointmentData } =
      data as AppointmentDetails;
    const AppointmentPayload = {
      type: "APPOINTMENT",

      start_time: startTime,
      end_time: endTime,
      ...appointmentData,
    };
    
    const TaskPayload = type === "Tasks" ? {
      type: "TASK",
      task: {
        due_date: (data as TaskDetails).task.dueDate,
        name: (data as TaskDetails).task.name,
        priority: (data as TaskDetails).task.priority,
        description: (data as TaskDetails).task.description,
      },
    //   attachment: (data as TaskDetails).attachment || []
    } : null;
    
    const payload =
      type === "Notes"
        ? NotePayload
        : type === "Sms"
        ? SmsPayload
        : type === "Appointments"
        ? AppointmentPayload
        : type === "Tasks"
        ? TaskPayload
        : data;
    try {
      await dispatch(
        createActionsThunk({ leadId: leadId, data: payload })
      ).unwrap();
      message.success(`${type} created successfully`);
    } catch (error) {
      message.error(error || `Failed to create ${type}`);
    }
    const newCard: TimelineCardProps = {
      type: type,
      date: new Date().toLocaleString(),
      createdBy: "Current User",
      createdAt: new Date().toLocaleString(),
      status: type === "Notes" ? undefined : "pending",
      data: payload,
    } as TimelineCardProps;
    setCardsData((prev) => [newCard, ...prev]);
  }
  handleClose();
};
