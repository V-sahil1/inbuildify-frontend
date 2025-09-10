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
    handleSaveNote: (note: NoteDetails) => void;
    handleSaveAppointment: (appointment: AppointmentDetails) => void;
    handleSaveTask: (task: TaskDetails) => void;
    handleSaveSms: (sms: SmsDetails) => void;
    handleClose: () => void;
}

const TimelineActionFormRenderer: React.FC<TimelineActionFormRendererProps> = ({
    activeAction,
    editingItem,
    handleSaveNote,
    handleSaveAppointment,
    handleSaveTask,
    handleSaveSms,
    handleClose,
}) => {
    const currentData = editingItem ? editingItem.item.data : undefined;

    switch (activeAction || (editingItem && editingItem.item.type)) {
        case "addNotes":
        case "Notes":
            return (
                <TimelineCard
                    type="Notes"
                    date={new Date().toLocaleString()}
                    createdBy="Current User"
                    createdAt={new Date().toLocaleString()}
                    data={currentData as NoteDetails || { message: "", tags: ["Draft"], sendToCustomer: false, createFollowUpTask: false, attachment: [],task:{dueDate:""} }}
                >
                    <AddNotesCard
                        onSave={handleSaveNote}
                        onCancel={handleClose}
                        initialData={currentData as NoteDetails}
                    />
                </TimelineCard>
            );
        case "bookAppointment":
        case "Appointments":
            return (
                <TimelineCard
                    type="Appointments"
                    date={new Date().toLocaleString()}
                    createdBy="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    data={currentData as AppointmentDetails || {
                        title: "New Appointment",
                        date: new Date().toISOString().split('T')[0],
                        startTime: "09:00",
                        endTime: "10:00",
                        location: "",
                        user: "",
                        notes: "",
                        sendToCustomer: false,
                    }}
                >
                    <AddAppointmentCard
                        onSave={handleSaveAppointment}
                        onCancel={handleClose}
                        initialData={currentData as AppointmentDetails}
                    />
                </TimelineCard>
            );
        case "createTask":
        case "Tasks":
            return (
                <TimelineCard
                    type="Tasks"
                    date={new Date().toLocaleString()}
                    createdBy="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    data={currentData as TaskDetails || {
                        task:{
                        name: "New Task",
                        dueDate: new Date().toISOString().split('T')[0],
                        time: "09:00",
                        priority: "MEDIUM",
                        description: "",
                        assignee: "",
                        },
                        attachment: [],
                    }}
                >
                    <CreateTaskCard
                        onSave={handleSaveTask}
                        onCancel={handleClose}
                        initialData={currentData as TaskDetails}
                    />
                </TimelineCard>
            );
        case "sendSms":
        case "Sms":
            return (
                <TimelineCard
                    type="Sms"
                    date={new Date().toLocaleString()}
                    createdBy="Current User"
                    createdAt={new Date().toLocaleString()}
                    status="pending"
                    data={currentData as SmsDetails || {
                        message: "",
                        recipient: "",
                    }}
                >
                    <SendSmsCard
                        onSave={handleSaveSms}
                        onCancel={handleClose}
                        initialData={currentData as SmsDetails}
                    />
                </TimelineCard>
            );
        default:
            return null;
    }
};

export default TimelineActionFormRenderer;
