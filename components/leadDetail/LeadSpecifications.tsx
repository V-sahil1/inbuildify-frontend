import React, { useState } from "react";
import TimelineCard from "../common/TimeLineComponents/TimelineCard";
import TimelineActionsBar from "../common/TimeLineComponents/TimelineActionsBar";
import { MenuProps } from "antd";
import { ActionType, TimelineCardProps, NoteDetails, AppointmentDetails, TaskDetails, SmsDetails } from "data/types";
import AddNotesCard from "../common/TimeLineComponents/AddNotesCard";
import AddAppointmentCard from "../common/TimeLineComponents/AddAppointmentCard";
import CreateTaskCard from "../common/TimeLineComponents/CreateTaskCard";
import SendSmsCard from "../common/TimeLineComponents/SendSmsCard";

const timeLineCardData: TimelineCardProps[] = [
    {
        type: "Notes",
        date: "31-07-2023 6:00PM",
        createdBy: "Murthy Muthuswamy",
        createdAt: "22-07-2023 10:50AM",
        status: "completed",
        data: {
            title: "Follow up - Yash Murthy",
            description:
                "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
            tags: ["Customer Update", "Tag"],
        } as NoteDetails,
    },
    {
        type: "Sms",
        date: "31-07-2023 6:00PM",
        createdBy: "Murthy Muthuswamy",
        createdAt: "22-07-2023 10:50AM",
        status: "pending",
        data: {
            message: "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
            recipient: "John Doe",
        } as SmsDetails,
    },
    {
        type: "Appointments",
        date: "31-07-2023 6:00PM",
        createdBy: "Murthy Muthuswamy",
        createdAt: "22-07-2023 10:50AM",
        status: "working",
        data: {
            title: "Follow up - Yash Murthy",
            date: "31-07-2023",
            startTime: "09:00",
            endTime: "10:00",
            location: "Client Office",
            user: "Yash Murthy",
            notes: "Discuss quotation details.",
            sendToCustomer: true,
        } as AppointmentDetails,
    },
    {
        type: "Tasks",
        date: "31-07-2023 6:00PM",
        createdBy: "Murthy Muthuswamy",
        createdAt: "22-07-2023 10:50AM",
        status: "working",
        data: {
            name: "Follow up - Yash Murthy",
            dueDate: "2023-07-31",
            time: "18:00",
            priority: "High",
            description:
                "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
            assignee: "Yash Murthy",
            files: [],
        } as TaskDetails,
    },
];

const LeadSpecifications = () => {
    const [cardsData, setCardsData] = useState<TimelineCardProps[]>(timeLineCardData);
    const [activeTab, setActiveTab] = useState("All");
    const [activeAction, setActiveAction] = useState<ActionType>(null);
    const [editingItem, setEditingItem] = useState<{ item: TimelineCardProps; index: number } | null>(null);

    const actionItems: MenuProps["items"] = [
        { key: "addNotes", label: "Add Notes" },
        { key: "sendSms", label: "Send SMS" },
        { key: "bookAppointment", label: "Book An Appointment" },
        { key: "createTask", label: "Create Task" },
    ];

    const handleAction = (key: string) => {
        setActiveAction(key as ActionType);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    // Edit existing timeline cards
    const handleEdit = (item: TimelineCardProps, index: number) => {
        setEditingItem({ item, index });
        setActiveAction(null); // Close any active creation form
    };

    const handleClose = () => {
        setActiveAction(null);
        setEditingItem(null);
    };

    // Save from AddNotesCard
    const handleSaveNote = (note: NoteDetails) => {
        if (editingItem && editingItem.item.type === "Notes") {
            console.log("🔄 Updated Note:", note);
            setCardsData((prev) =>
                prev.map((card, i) =>
                    i === editingItem.index
                        ? ({ ...card, data: note } as TimelineCardProps)
                        : card
                )
            );
        } else {
            console.log("✨ Created New Note:", note);
            const newNote: TimelineCardProps = {
                type: "Notes",
                date: new Date().toLocaleString(),
                createdBy: "Current User",
                createdAt: new Date().toLocaleString(),
                status: "pending",
                data: note,
            };
            setCardsData((prev) => [newNote, ...prev]);
        }
        handleClose();
    };

    // Save from AddAppointmentCard
    const handleSaveAppointment = (appointment: AppointmentDetails) => {
        if (editingItem && editingItem.item.type === "Appointments") {
            console.log("🔄 Updated Appointment:", appointment);
            setCardsData((prev) =>
                prev.map((card, i) =>
                    i === editingItem.index
                        ? ({ ...card, data: appointment } as TimelineCardProps)
                        : card
                )
            );
        } else {
            console.log("✨ Created New Appointment:", appointment); // <-- log created
            const newAppointment: TimelineCardProps = {
                type: "Appointments",
                date: new Date().toLocaleString(),
                createdBy: "Current User",
                createdAt: new Date().toLocaleString(),
                status: "pending",
                data: appointment,
            };
            setCardsData((prev) => [newAppointment, ...prev]);
        }
        handleClose();
    };

    // Save from CreateTaskCard
    const handleSaveTask = (task: TaskDetails) => {
        if (editingItem && editingItem.item.type === "Tasks") {
            console.log("🔄 Updated Task:", task);
            setCardsData((prev) =>
                prev.map((card, i) =>
                    i === editingItem.index
                        ? ({ ...card, data: task } as TimelineCardProps)
                        : card
                )
            );
        } else {
            console.log("✨ Created New Task:", task);
            const newTask: TimelineCardProps = {
                type: "Tasks",
                date: new Date().toLocaleString(),
                createdBy: "Current User",
                createdAt: new Date().toLocaleString(),
                status: "pending",
                data: task,
            };
            setCardsData((prev) => [newTask, ...prev]);
        }
        handleClose();
    };

    // Save from SendSmsCard
    const handleSaveSms = (sms: SmsDetails) => {
        if (editingItem && editingItem.item.type === "Sms") {
            console.log("🔄 Updated SMS:", sms);
            setCardsData((prev) =>
                prev.map((card, i) =>
                    i === editingItem.index
                        ? ({ ...card, data: sms } as TimelineCardProps)
                        : card
                )
            );
        } else {
            console.log("✨ Created New SMS:", sms);
            const newSms: TimelineCardProps = {
                type: "Sms",
                date: new Date().toLocaleString(),
                createdBy: "Current User",
                createdAt: new Date().toLocaleString(),
                status: "pending",
                data: sms,
            };
            setCardsData((prev) => [newSms, ...prev]);
        }
        handleClose();
    };

    const renderActionForm = () => {
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
                        status="pending"
                        data={currentData as NoteDetails || { title: "Add a new note", description: "", tags: ["Draft"], sendToCustomer: false, createFollowup: false, files: [] }}
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
                            name: "New Task",
                            dueDate: new Date().toISOString().split('T')[0],
                            time: "09:00",
                            priority: "Medium",
                            description: "",
                            assignee: "",
                            files: [],
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

    return (
        <div className="relative m-4 mt-0">
            <div className="p-4">
                <div className="ml-8">
                    <TimelineActionsBar
                        tabs={["All", "Notes", "Sms", "Appointments", "Tasks"]}
                        activeTab={activeTab}
                        onTabChange={handleTabChange}
                        actionItems={actionItems}
                        onActionSelect={(key) => {
                            setActiveAction(key as ActionType);
                            setEditingItem(null); // Clear editing state when starting a new action
                        }}
                    />
                </div>
            </div>

            <div className="absolute left-[14px] top-0 bottom-0 w-[2px] bg-gray-300" />

            <div className="space-y-8">
                {(activeAction || editingItem) && renderActionForm()}

                {/* Timeline */}
                {cardsData
                    .filter((item) => item.type === activeTab || activeTab === "All")
                    .map((item, idx) => (
                        <TimelineCard
                            key={idx}
                            {...item}
                            onEdit={(data) => handleEdit(data, idx)}
                        />
                    ))}
            </div>
        </div>
    );
};

export default LeadSpecifications;
