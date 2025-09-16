import React, { useEffect, useState } from "react";
import TimelineCard from "../common/TimeLineComponents/TimelineCard";
import TimelineActionsBar from "../common/TimeLineComponents/TimelineActionsBar";
import { Empty, MenuProps, message, Spin } from "antd";
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
  const [cardsData, setCardsData] = useState<TimelineCardProps[]>([]);
  const [activeTab, setActiveTab] = useState("All");
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<{
    item: TimelineCardProps;
    index: number;
  } | null>(null);
  const dispatch = useAppDispatch();
  // console.log("actions data", actions);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await dispatch(
          getActionsThunk({ leadId, type: activeTab.toLowerCase() })
        ).unwrap();
        setCardsData(res);
      } catch (error) {
        message.error(error || "Failed to fetch actions");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [dispatch, leadId, activeTab]);

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
  const handleSaveNote = async (note: NoteDetails) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        "NOTES",
        note,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Save from AddAppointmentCard
  const handleSaveAppointment = async (appointment: AppointmentDetails) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        "APPOINTMENT",
        appointment,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Save from CreateTaskCard
  const handleSaveTask = async (task: TaskDetails) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        "TASK",
        task,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Save from SendSmsCard
  const handleSaveSms = async (sms: SmsDetails) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        "SMS",
        sms,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
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
              loading={formLoading}
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
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : cardsData && cardsData.length > 0 ? (
            cardsData.map((item, idx) => (
              <TimelineCard
                key={idx}
                {...item}
                item={item}
                onEdit={(data) => handleEdit(data, idx)}
              />
            ))
          ) : (
            <Empty
              description={
                activeTab === "All"
                  ? "No data available"
                  : `No ${activeTab} available for this tab`
              }
            />
          )}

          {/* {cardsData.length > 0 && cardsData.map((item, idx) => (
              <TimelineCard
                key={idx}
                {...item}
                item={item}
                onEdit={(data) => handleEdit(data, idx)}
              />
            ))} */}
        </div>
      </div>
    </div>
  );
};

export default LeadActions;
