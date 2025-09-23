import React from "react";
import TimelineCard from "./TimeLineComponents/TimelineCard";
import AddNotesCard from "./TimeLineComponents/AddNotesCard";
import AddAppointmentCard from "./TimeLineComponents/AddAppointmentCard";
import CreateTaskCard from "./TimeLineComponents/CreateTaskCard";
import SendSmsCard from "./TimeLineComponents/SendSmsCard";
import { ActionType, TimelineCardProps, NoteDetails, AppointmentDetails, TaskDetails, SmsDetails } from "data/types";

interface TimelineActionFormRendererProps {
    activeAction: ActionType;
    editingItem: { item: TimelineCardProps; index: number } | null;
    loading: boolean;
    handleSaveNote: (note: NoteDetails) => void;
    handleSaveAppointment: (appointment: AppointmentDetails) => void;
    handleSaveTask: (task: TaskDetails) => void;
    handleSaveSms: (sms: SmsDetails) => void;
    handleClose: () => void;
}

const TimelineActionFormRenderer: React.FC<TimelineActionFormRendererProps> = ({
    activeAction,
    editingItem,
    loading,
    handleSaveNote,
    handleSaveAppointment,
    handleSaveTask,
    handleSaveSms,
    handleClose,
}) => {
    const currentData = editingItem ? editingItem.item : undefined;

    switch (activeAction || (editingItem && editingItem.item.type)) {
        case "addNotes":
        case "NOTES":
            return (
                <TimelineCard
                    type="NOTES"
                    date={new Date().toLocaleString()}
                    createdByName="Current User"
                    createdAt={new Date().toLocaleString()}
                    // notes={currentData?.item?.notes[0] as NoteDetails || { message: "", tags: [{name:"Draft"}], sendToCustomer: false, createFollowUpTask: false, attachment: [],task:{dueDate:""} }}
                >
                    <AddNotesCard
                        onSave={handleSaveNote}
                        onCancel={handleClose}
                        loading={loading}
                        initialData={
                          currentData?.type === "NOTES"
                          ? currentData?.item?.notes[0]
                           : undefined
                          }
                    />
                </TimelineCard>
            );
        case "bookAppointment":
        case "APPOINTMENT":
            return (
                <TimelineCard
                    type="APPOINTMENT"
                    date={new Date().toLocaleString()}
                    createdByName="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    // appointment={currentData as AppointmentDetails || {
                    //     title: "New Appointment",
                    //     date: new Date().toISOString().split('T')[0],
                    //     startTime: "09:00",
                    //     endTime: "10:00",
                    //     location: "",
                    //     user: "",
                    //     notes: "",
                    //     sendToCustomer: false,
                    // }}
                >
                    <AddAppointmentCard
                        onSave={handleSaveAppointment}
                        onCancel={handleClose}
                        loading={loading}
                        initialData={
                            currentData?.type === "APPOINTMENT"
                            ? currentData?.item?.appointment[0]
                            : undefined
                        }
                    />
                </TimelineCard>
            );
        case "createTask":
        case "TASK":
            return (
                <TimelineCard
                    type="TASK"
                    date={new Date().toLocaleString()}
                    createdByName="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    // task={currentData as TaskDetails || {
                    //     task:{
                    //     name: "New Task",
                    //     dueDate: new Date().toISOString().split('T')[0],
                    //     time: "09:00",
                    //     priority: "MEDIUM",
                    //     description: "",
                    //     assignee: "",
                    //     },
                    //     attachment: [],
                    // }}
                >
                    <CreateTaskCard
                        onSave={handleSaveTask}
                        onCancel={handleClose}
                        loading={loading}
                        initialData={
                            currentData?.type === "TASK"
                             ? currentData?.item?.task[0]
                             : undefined
                         }
                    />
                </TimelineCard>
            );
        case "sendSms":
        case "SMS":
            return (
                <TimelineCard
                    type="SMS"
                    date={new Date().toLocaleString()}
                    createdByName="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    // sms={currentData as SmsDetails || {
                    //     message: "",
                    //     recipient: "",
                    // }}
                >
                    <SendSmsCard
                        onSave={handleSaveSms}
                        onCancel={handleClose}
                        loading={loading}
                        initialData={
                            currentData?.type === "SMS"
                        ? currentData?.item?.sms[0]
                        : undefined
                }
                    />
                </TimelineCard>
            );
        default:
            return null;
    }
};

export default TimelineActionFormRenderer;
