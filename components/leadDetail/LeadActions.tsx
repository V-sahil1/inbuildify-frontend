'use client';
import React, { useEffect, useState } from 'react';
import TimelineCard from '../common/TimeLineComponents/TimelineCard';
import TimelineActionsBar, { FilterOption } from '../common/TimeLineComponents/TimelineActionsBar';
import { Empty, MenuProps, message } from 'antd';
import { ActionType, TimelineCardProps, NoteDetails, SmsDetails } from 'data/types';
import { handleSaveTimelineCard } from '../../lib/utils/timelineCardUtils';
import TimelineActionFormRenderer from '../common/TimelineActionFormRenderer';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import Loading from '../common/Loading';
import { ITask } from '@redux/feature/task/ITaskStates';
import { fetchAllTask } from '@redux/feature/task/taskThunk';
import { Status } from '@lib/constants/enum';
import { fetchAllAppointment } from '@redux/feature/appointment/appointmentThunk';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';
import { getAllNotes, getAllSms, getLeadActions } from '@redux/feature/action/actionThunk';

const actionItems: MenuProps['items'] = [
  { key: 'addNotes', label: 'Add Notes' },
  // { key: 'sendSms', label: 'Send SMS' },
  { key: 'bookAppointment', label: 'Book An Appointment' },
  { key: 'createTask', label: 'Create Task' },
];

const LeadActions = ({ leadId }: { leadId: string }) => {
  const dispatch = useAppDispatch();
  const [cardsData, setCardsData] = useState<
    {
      type: 'All' | 'NOTES' | 'SMS' | 'APPOINTMENT' | 'TASK';
      item: ITask | IAppointment | NoteDetails | SmsDetails | null;
    }[]
  >([]);
  const [activeTab, setActiveTab] = useState('All');
  const [activeAction, setActiveAction] = useState<ActionType>(null);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { tasks, status } = useAppSelector(state => state.task);
  const { appointment, status: appointmentStatus } = useAppSelector(state => state.appointment);
  const {
    sms,
    notes,
    tagStatus,
    smsStatus,
    actions,
    status: actionStatus,
  } = useAppSelector(state => state.action);
  const tabs: FilterOption[] = [
    { type: 'All', label: 'All' },
    { type: 'NOTES', label: 'Notes' },
    // { type: 'SMS', label: 'SMS' },
    { type: 'APPOINTMENT', label: 'Appointment' },
    { type: 'TASK', label: 'Task' },
  ];

  const fetchTaskData = async () => {
    try {
      let taskData;
      if (status.fetch === Status.IDLE) {
        taskData = await dispatch(fetchAllTask({ lead_id: leadId })).unwrap();
      } else {
        taskData = { tasks };
      }

      const transformedTasks = taskData?.tasks?.map((task: ITask) => ({
        type: 'TASK',
        item: { ...task, createdBy: { id: task.assigneeId, name: task.assigneeName || 'Unknown' } },
      }));

      if (activeTab === 'TASK' || activeTab === 'All') {
        setCardsData(transformedTasks || []);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch taskdata');
    }
  };

  const fetchAppointmentData = async () => {
    try {
      let appointmentData;
      if (appointmentStatus.fetch === Status.IDLE) {
        appointmentData = await dispatch(fetchAllAppointment({ lead_id: leadId })).unwrap();
      } else {
        appointmentData = { appointment };
      }

      const transformedAppointments = appointmentData?.appointment?.map(i => ({
        type: 'APPOINTMENT',
        item: { ...i, createdBy: i.createdBy },
      }));

      if (activeTab === 'APPOINTMENT' || activeTab === 'All') {
        setCardsData(transformedAppointments || []);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch appointment');
    }
  };

  const fetchSMSData = async () => {
    try {
      let smsData;
      if (smsStatus === Status.IDLE) {
        smsData = await dispatch(getAllSms({ leads_id: leadId })).unwrap();
      } else {
        smsData = { sms };
      }
      const transformedAppointments = smsData?.sms?.map(i => ({
        type: 'SMS',
        item: i,
      }));
      if (activeTab === 'SMS') {
        setCardsData(transformedAppointments || []);
      }
    } catch (error) {
      message.error(error || 'Failed to fetch SMS');
    }
  };

  const fetchNotesData = async () => {
    try {
      let notesData;
      if (tagStatus === Status.IDLE) {
        const response = await dispatch(getAllNotes({ leads_id: leadId })).unwrap();
        const data = response.notes;
        const filteredNote = data.filter(i => !i.parentNoteId);
        notesData = filteredNote?.map(i => ({
          ...i,
          reply: data.find(j => j.parentNoteId === i.notesId)?.description,
          replyId: data.find(j => j.parentNoteId === i.notesId)?.notesId,
        }));
      } else {
        notesData = notes;
      }
      const transformedNotes = notesData?.map(i => ({
        type: 'NOTES' as const,
        item: i,
      }));
      if (activeTab === 'NOTES') {
        setCardsData(transformedNotes || []);
      }
    } catch (error) {
      message.error(error?.message || 'Failed to fetch Notes');
    }
  };

  const fetchAllActionsData = async () => {
    try {
      let actionData = {
        notes: [],
        tasks: [],
        appointments: [],
        sms: [],
      };
      if (actionStatus === Status.IDLE) {
        const response = await dispatch(getLeadActions(leadId)).unwrap();
        const data = response?.notes;
        const filteredNote = data?.filter(i => !i.parentNoteId) || [];
        actionData.notes =
          filteredNote?.map(i => ({
            ...i,
            reply: data.find(j => j.parentNoteId === i.notesId)?.description,
            replyId: data.find(j => j.parentNoteId === i.notesId)?.notesId,
          })) || [];
        actionData.appointments = response.appointments;
        actionData.sms = response.sms;
        actionData.tasks = response.tasks;
      } else {
        actionData = actions;
      }
      const appointments =
        actionData?.appointments?.map(i => ({ type: 'APPOINTMENT' as const, item: i })) || [];
      const tasks = actionData?.tasks?.map(i => ({ type: 'TASK' as const, item: i })) || [];
      const sms = actionData?.sms?.map(i => ({ type: 'SMS' as const, item: i })) || [];
      const notes = actionData?.notes?.map(i => ({ type: 'NOTES' as const, item: i })) || [];

      const transformedAppointments = [...appointments, ...tasks, ...sms, ...notes];
      if (activeTab === 'All') {
        setCardsData(transformedAppointments || []);
      }
    } catch (error) {
      message.error(error?.message || error || 'Failed to fetch appointment');
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        if (activeTab === 'All') {
          fetchAllActionsData();
        } else if (activeTab === 'TASK') {
          fetchTaskData();
        } else if (activeTab === 'APPOINTMENT') {
          fetchAppointmentData();
        } else if (activeTab === 'SMS') {
          fetchSMSData();
        } else if (activeTab === 'NOTES') {
          fetchNotesData();
        }
      } catch (error) {
        message.error(error || 'Failed to fetch actions');
      } finally {
        setLoading(false);
      }
    }

    if (leadId && activeTab) {
      fetchData();
    }
  }, [
    dispatch,
    leadId,
    activeTab,
    status.fetch,
    appointmentStatus.fetch,
    tasks,
    appointment,
    actions,
    sms,
    notes,
    actionStatus,
    tagStatus,
    smsStatus,
  ]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Edit existing timeline cards
  const handleEdit = (item: TimelineCardProps) => {
    setEditingItem(item);
    setActiveAction(null); // Close any active creation form
  };

  const handleClose = () => {
    setActiveAction(null);
    setEditingItem(null);
  };

  // Save from AddNotesCard
  const handleSaveNote = async (note: NoteDetails, editing?: NoteDetails) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem ?? editing,
        setCardsData,
        handleClose,
        activeTab,
        'NOTES',
        note,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Save from AddAppointmentCard
  const handleSaveAppointment = async (appointment: IAppointment) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        'APPOINTMENT',
        appointment,
        dispatch
      );
    } finally {
      setFormLoading(false);
    }
  };

  // Save from CreateTaskCard
  const handleSaveTask = async (task: ITask) => {
    setFormLoading(true);
    try {
      await handleSaveTimelineCard(
        leadId,
        editingItem,
        setCardsData,
        handleClose,
        activeTab,
        'TASK',
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
        'SMS',
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
            tabs={tabs}
            onTabChange={handleTabChange}
            actionItems={actionItems}
            onActionSelect={key => {
              setActiveAction(key as ActionType);
              setEditingItem(null); // Clear editing state when starting a new action
            }}
          />
        </div>
      </div>

      {/* Timeline list */}
      <div className="relative">
        {(activeAction || editingItem || (cardsData && cardsData.length > 0)) && (
          <div className="absolute left-[13px] top-0 bottom-0 w-[1px] bg-gray-300" />
        )}
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
              type={
                (editingItem as ITask)?.taskId && (editingItem as ITask)?.dueDate
                  ? 'TASK'
                  : (editingItem as IAppointment)?.appointmentId
                    ? 'APPOINTMENT'
                    : (editingItem as NoteDetails)?.notesId
                      ? 'NOTES'
                      : 'SMS'
              }
            />
          )}

          {/* Timeline */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loading type="primary" />
            </div>
          ) : cardsData && cardsData.length > 0 ? (
            cardsData.map((item, idx) => (
              <TimelineCard
                key={idx}
                type={item.type}
                item={item.item}
                onEdit={data => handleEdit(data)}
                onSave={handleSaveNote}
                handleEdit={value => {
                  handleSaveNote(value, value);
                }}
              />
            ))
          ) : (
            <Empty
              description={
                activeTab === 'All' ? 'No data available' : `No ${activeTab} available for this tab`
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadActions;
