import TimelineActionFormRenderer from '@/components/common/TimelineActionFormRenderer';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import TimelineCard from '@/components/common/TimeLineComponents/TimelineCard';
import { handleSaveTimelineCard } from '@lib/utils/timelineCardUtils';
import { MenuProps } from 'antd';
import { ActionType, AppointmentDetails, NoteDetails, SmsDetails, TaskDetails, TimelineCardProps } from 'data/types';
import React, { useState } from 'react'

const timeLineCardData: TimelineCardProps[] = [
    {
        type: "Notes",
        date: "31-07-2023 6:00PM",
        createdBy: "Murthy Muthuswamy",
        createdAt: "22-07-2023 10:50AM",
        // status: "completed",
        data: {
            // title: "Follow up - Yash Murthy",
            description:
                "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
            tags: ["Customer Update", "Tag1"],
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

const actionItems: MenuProps["items"] = [
    { key: "addNotes", label: "Add Notes" },
    { key: "sendSms", label: "Send SMS" },
    { key: "bookAppointment", label: "Book An Appointment" },
    { key: "createTask", label: "Create Task" },
];

const JobAction = () => {
    const [cardsData, setCardsData] = useState<TimelineCardProps[]>(timeLineCardData);
    const [activeTab, setActiveTab] = useState("All");
    const [activeAction, setActiveAction] = useState<ActionType>(null);
    const [editingItem, setEditingItem] = useState<{ item: TimelineCardProps; index: number } | null>(null);

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
        handleSaveTimelineCard(editingItem, setCardsData, handleClose, "Notes", note);
    };

    // Save from AddAppointmentCard
    const handleSaveAppointment = (appointment: AppointmentDetails) => {
        handleSaveTimelineCard(editingItem, setCardsData, handleClose, "Appointments", appointment);
    };

    // Save from CreateTaskCard
    const handleSaveTask = (task: TaskDetails) => {
        handleSaveTimelineCard(editingItem, setCardsData, handleClose, "Tasks", task);
    };

    // Save from SendSmsCard
    const handleSaveSms = (sms: SmsDetails) => {
        handleSaveTimelineCard(editingItem, setCardsData, handleClose, "Sms", sms);
    };
    return (
        <div className="relative p-4 mt-0 bg-card-color">
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

            <div className="relative ">
                <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-gray-300" />
                <div className="space-y-8">
                    {(activeAction || editingItem) && (
                        <TimelineActionFormRenderer
                            activeAction={activeAction}
                            editingItem={editingItem}
                            handleSaveNote={handleSaveNote}
                            handleSaveAppointment={handleSaveAppointment}
                            handleSaveTask={handleSaveTask}
                            handleSaveSms={handleSaveSms}
                            handleClose={handleClose}
                        />
                    )}

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
        </div>
    )
}

export default JobAction