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
  activeTab: string,
  type: "SMS" | "NOTES" | "APPOINTMENT" | "TASK",
  data: D,
  dispatch: AppDispatch
): Promise<void> => {
  // if (editingItem && editingItem?.item?.type === type) {
  //   console.log(`🔄 Updated ${type}:`, data);
  //   setCardsData((prev) =>
  //     prev.map((card, i) =>
  //       i === editingItem.index
  //         ? ({ ...card, data: data, type: type } as TimelineCardProps)
  //         : card
  //     )
  //   );
  // } else {
    try {
      const response = await dispatch(
        createActionsThunk({ leadId: leadId, data: formDataGenerator(data) })
      ).unwrap();
    
      const baseCard = { ...response };
      let newCard;
    
      if (activeTab === "All") {
        newCard = {
          ...baseCard,
          appointment: response?.appointment ? [response.appointment] : [],
          task: response?.task ? [response.task] : [],
          sms: response?.sms ? [response.sms] : [],
          notes: response?.notes ? [response.notes] : [],
        };
        setCardsData((prev) => [newCard, ...prev]);
        message.success(`${type} created successfully`);
        handleClose();
        return;
      }
    
      if (activeTab.toLowerCase() === response.type?.toLowerCase()) {
        switch (response.type) {
          case "NOTES":
            newCard = { ...baseCard, notes: response?.notes ? [response.notes] : [] };
            break;
          case "APPOINTMENT":
            newCard = { ...baseCard, appointment: response?.appointment ? [response.appointment] : [] };
            break;
          case "TASK":
            newCard = { ...baseCard, task: response?.task ? [response.task] : [] };
            break;
          case "SMS":
            newCard = { ...baseCard, sms: response?.sms ? [response.sms] : [] };
            break;
        }
    
        if (newCard) {
          setCardsData((prev) => [newCard, ...(prev || [])]);
          message.success(`${type} created successfully`);
        }
      }
    
      // ✅ Always close modal at the end
      handleClose();
    } catch (error) {
      message.error(error?.message || `Failed to create ${type}`); 
    }
    // const newCard: TimelineCardProps = {
    //   type: type,
    //   date: new Date().toLocaleString(),
    //   createdBy: "Current User",
    //   createdAt: new Date().toLocaleString(),
    //   status: type === "Notes" ? undefined : "pending",
    //   data: data,
    // } as TimelineCardProps;
   
  // }
 
};
