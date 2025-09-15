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
import { formDataGenerator } from "./formDataGenerator";

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
): Promise<void> => {
  if (editingItem && editingItem?.item?.type === type) {
    console.log(`🔄 Updated ${type}:`, data);
    setCardsData((prev) =>
      prev.map((card, i) =>
        i === editingItem.index
          ? ({ ...card, data: data, type: type } as TimelineCardProps)
          : card
      )
    );
  } else {
    try {
      const response = await dispatch(
        createActionsThunk({ leadId: leadId, data: formDataGenerator(data) })
      ).unwrap();
      console.log(response)
      // setCardsData((prev) => [...prev]);
      message.success(`${type} created successfully`);
      handleClose();
    } catch (error) {
      message.error(error || `Failed to create ${type}`); 
    }
    // const newCard: TimelineCardProps = {
    //   type: type,
    //   date: new Date().toLocaleString(),
    //   createdBy: "Current User",
    //   createdAt: new Date().toLocaleString(),
    //   status: type === "Notes" ? undefined : "pending",
    //   data: data,
    // } as TimelineCardProps;
   
  }
 
};
