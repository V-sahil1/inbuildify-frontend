import React, { useEffect, useState } from "react";
import TimelineCard from "../common/TimeLineComponents/TimelineCard";
import TimelineActionsBar from "../common/TimeLineComponents/TimelineActionsBar";
import { MenuProps, message } from "antd";
import {
  ActionType,
  TimelineCardProps,
  NoteDetails,
  AppointmentDetails,
  TaskDetails,
  SmsDetails,
} from "data/types";
import { handleSaveTimelineCard } from "../../lib/utils/timelineCardUtils";
import TimelineActionFormRenderer from "../common/TimelineActionFormRenderer";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { getActionsThunk } from "@redux/feature/action/actionThunk";

// const timeLineCardData: TimelineCardProps[] = [
//   {
//     type: "Notes",
//     date: "31-07-2023 6:00PM",
//     createdBy: "Murthy Muthuswamy",
//     createdAt: "22-07-2023 10:50AM",
//     // status: "completed",
//     data: {
//       // title: "Follow up - Yash Murthy",
//       message:
//         "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//       tags: ["Customer Update", "Tag1"],
//     } as NoteDetails,
//   },
//   {
//     type: "Sms",
//     date: "31-07-2023 6:00PM",
//     createdBy: "Murthy Muthuswamy",
//     createdAt: "22-07-2023 10:50AM",
//     status: "pending",
//     data: {
//       message:
//         "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//       recipient: "John Doe",
//     } as SmsDetails,
//   },
//   {
//     type: "Appointments",
//     date: "31-07-2023 6:00PM",
//     createdBy: "Murthy Muthuswamy",
//     createdAt: "22-07-2023 10:50AM",
//     status: "working",
//     data: {
//       title: "Follow up - Yash Murthy",
//       date: "31-07-2023",
//       startTime: "09:00",
//       endTime: "10:00",
//       location: "Client Office",
//       user: "Yash Murthy",
//       notes: "Discuss quotation details.",
//       sendToCustomer: true,
//     } as AppointmentDetails,
//   },
//   {
//     type: "Tasks",
//     date: "31-07-2023 6:00PM",
//     createdBy: "Murthy Muthuswamy",
//     createdAt: "22-07-2023 10:50AM",
//     status: "working",
//     data: {
//       name: "Follow up - Yash Murthy",
//       dueDate: "2023-07-31",
//       time: "18:00",
//       priority: "HIGH",
//       description:
//         "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//       assignee: "Yash Murthy",
//       files: [],
//     } as TaskDetails,
//   },
// ];

const actionItems: MenuProps["items"] = [
  { key: "addNotes", label: "Add Notes" },
  { key: "sendSms", label: "Send SMS" },
  { key: "bookAppointment", label: "Book An Appointment" },
  { key: "createTask", label: "Create Task" },
];

const LeadActions = ({ leadId }: { leadId: string }) => {
  const actions = useAppSelector((state) => state.action.actions);
  const [cardsData, setCardsData] = useState<TimelineCardProps[]>(actions);
  const [activeTab, setActiveTab] = useState("All");
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [editingItem, setEditingItem] = useState<{
    item: TimelineCardProps;
    index: number;
  } | null>(null);
  const dispatch = useAppDispatch();
  console.log("actions data", actions);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await dispatch(getActionsThunk(leadId));
      } catch (error) {
        message.error(error || "Failed to fetch actions");
      }
    }
    fetchData();
  }, []);
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
    handleSaveTimelineCard(
      leadId,
      editingItem,
      setCardsData,
      handleClose,
      "Notes",
      note,
      dispatch
    );
  };

  // Save from AddAppointmentCard
  const handleSaveAppointment = (appointment: AppointmentDetails) => {
    handleSaveTimelineCard(
      leadId,
      editingItem,
      setCardsData,
      handleClose,
      "Appointments",
      appointment,
      dispatch
    );
  };

  // Save from CreateTaskCard
  const handleSaveTask = (task: TaskDetails) => {
    try {
    handleSaveTimelineCard(
      leadId,
      editingItem,
      setCardsData,
      handleClose,
      "Tasks",
      task,
      dispatch
    );
  }
    catch (error) {
      message.error(error || "Failed to save task");
      console.error("Error in handleSaveTask:", error);
    }
  };

  // Save from SendSmsCard
  const handleSaveSms = (sms: SmsDetails) => {
    handleSaveTimelineCard(
      leadId,
      editingItem,
      setCardsData,
      handleClose,
      "Sms",
      sms,
      dispatch
    );
  };

  return (
    <div className="relative p-4 mt-0 bg-card-color">
      <div className="p-4">
        <div className="ml-8">
          <TimelineActionsBar
            tabs={["All", "NOTES", "SMS", "APPOINTMENT", "TASK"]}
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
          {actions
            ?.filter((item) => item.type === activeTab || activeTab === "All")
            .map((item, idx) => (
              <TimelineCard
                key={idx}
                {...item}
                item={item}
                onEdit={(data) => handleEdit(data, idx)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default LeadActions;
