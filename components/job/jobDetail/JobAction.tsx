import { FilterOption } from '@/components/common/FilterTabs';
import TimelineActionFormRenderer from '@/components/common/TimelineActionFormRenderer';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { ITask } from '@redux/feature/task/ITaskStates';
// import TimelineCard from '@/components/common/TimeLineComponents/TimelineCard';
// import { handleSaveTimelineCard } from '@lib/utils/timelineCardUtils';
import { Empty, MenuProps } from 'antd';
import {
  ActionType,
  AppointmentDetails,
  NoteDetails,
  SmsDetails,
  TimelineCardProps,
} from 'data/types';
import React, { useState } from 'react';

// const timeLineCardData: TimelineCardProps[] = [
//     {
//         type: "NOTES",
//         date: "31-07-2023 6:00PM",
//         createdByName: "Murthy Muthuswamy",
//         createdAt: "22-07-2023 10:50AM",
//         // status: "completed",
//         notes: [
//             {
//                 // title: "Follow up - Yash Murthy",
//                 message:
//                     "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//                 tags: ["Customer Update", "Tag1"],
//             } as NoteDetails,
//         ],
//     },
//     {
//         type: "SMS",
//         date: "31-07-2023 6:00PM",
//         createdByName: "Murthy Muthuswamy",
//         createdAt: "22-07-2023 10:50AM",
//         status: "pending",
//         sms: {
//             message: "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//             recipient: "John Doe",
//         } as SmsDetails,
//     },
//     {
//         type: "APPOINTMENT",
//         date: "31-07-2023 6:00PM",
//         createdByName: "Murthy Muthuswamy",
//         createdAt: "22-07-2023 10:50AM",
//         status: "working",
//         appointment: {
//             title: "Follow up - Yash Murthy",
//             date: "31-07-2023",
//             startTime: "09:00",
//             endTime: "10:00",
//             location: "Client Office",
//             user: "Yash Murthy",
//             notes: "Discuss quotation details.",
//             sendToCustomer: true,
//         } as AppointmentDetails,
//     },
//     {
//         type: "TASK",
//         date: "31-07-2023 6:00PM",
//         createdByName: "Murthy Muthuswamy",
//         createdAt: "22-07-2023 10:50AM",
//         status: "working",
//         task: {
//             name: "Follow up - Yash Murthy",
//             dueDate: "2023-07-31",
//             time: "18:00",
//             priority: "High",
//             description:
//                 "This is a follow-up to your quotation. Please sign the quote and send it back asap.",
//             assignee: "Yash Murthy",
//             files: [],
//         } as TaskDetails,
//     },
// ];

const actionItems: MenuProps['items'] = [
  { key: 'addNotes', label: 'Add Notes' },
  { key: 'sendSms', label: 'Send SMS' },
  { key: 'bookAppointment', label: 'Book Appointment' },
  { key: 'createTask', label: 'Create Task' },
];

const JobAction = () => {
  const [cardsData, setCardsData] = useState<TimelineCardProps[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [editingItem, setEditingItem] = useState<{
    item: TimelineCardProps;
    index: number;
  } | null>(null);

  const tabs: FilterOption[] = [
    { type: 'All', label: 'All', count: cardsData.length },
    {
      type: 'Notes',
      label: 'Notes',
      count: cardsData.filter(i => i.type === 'NOTES').length,
    },
    {
      type: 'Sms',
      label: 'SMS',
      count: cardsData.filter(i => i.type === 'SMS').length,
    },
    {
      type: 'Appointments',
      label: 'Appointments',
      count: cardsData.filter(i => i.type === 'APPOINTMENT').length,
    },
    {
      type: 'Tasks',
      label: 'Tasks',
      count: cardsData.filter(i => i.type === 'TASK').length,
    },
  ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleEdit = (item: TimelineCardProps, index: number) => {
    setEditingItem({ item, index });
    setActiveAction(null);
  };

  const handleClose = () => {
    setActiveAction(null);
    setEditingItem(null);
  };

  // Save handlers (integrate logic later)
  const handleSaveNote = (note: NoteDetails) => {};
  const handleSaveAppointment = (appointment: AppointmentDetails) => {};
  const handleSaveTask = (task: ITask) => {};
  const handleSaveSms = (sms: SmsDetails) => {};

  return (
    <div className="relative p-4 mt-0 bg-card-color">
      <div className="p-4">
        <div className="ml-8">
          <TimelineActionsBar
            tabs={tabs}
            onTabChange={handleTabChange}
            actionItems={actionItems}
            onActionSelect={key => {
              setActiveAction(key as ActionType);
              setEditingItem(null);
            }}
            isActionShow={true}
            isCountShow={false}
          />
        </div>
      </div>

      <div className="relative">
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
              loading={false}
            />
          )}

          {/* Uncomment this block once TimelineCard is ready */}
          {/* 
          {cardsData
            .filter(
              (item) => item.type === activeTab || activeTab === "All"
            )
            .map((item, idx) => (
              <TimelineCard
                key={idx}
                {...item}
                onEdit={(data) => handleEdit(data, idx)}
              />
            ))} 
          */}

          <Empty
            description={
              activeTab === 'All' ? 'No data available' : `No ${activeTab} available for this tab`
            }
          />
        </div>
      </div>
    </div>
  );
};

export default JobAction;
