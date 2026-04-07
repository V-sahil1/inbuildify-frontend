import React from 'react';
import TimelineCard from './TimeLineComponents/TimelineCard';
import AddNotesCard from './TimeLineComponents/AddNotesCard';
import AddAppointmentCard from './TimeLineComponents/AddAppointmentCard';
import CreateTaskCard from './TimeLineComponents/CreateTaskCard';
import SendSmsCard from './TimeLineComponents/SendSmsCard';
import { ActionType, NoteDetails, SmsDetails } from 'data/types';
import { ITask } from '@redux/feature/task/ITaskStates';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';

interface TimelineActionFormRendererProps {
  activeAction: ActionType;
  editingItem: ITask | IAppointment | NoteDetails | SmsDetails | null;
  loading: boolean;
  handleSaveNote: (note: NoteDetails) => void;
  handleSaveAppointment: (appointment: IAppointment) => void; //appointmentDetails
  handleSaveTask: (task: ITask) => void;
  handleSaveSms: (sms: SmsDetails) => void;
  handleClose: () => void;
  type?: string;
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
  type,
}) => {
  const currentData = editingItem ?? undefined;

  switch (activeAction || (editingItem && type)) {
    case 'addNotes':
    case 'NOTES':
      return (
        <TimelineCard
          type="NOTES"
          date={new Date().toLocaleString()}
          // createdByName="Current User"
          createdAt={new Date().toLocaleString()}
          onSave={handleSaveNote}
          // notes={currentData?.item?.notes[0] as NoteDetails || { message: "", tags: [{name:"Draft"}], sendToCustomer: false, createFollowUpTask: false, attachment: [],task:{dueDate:""} }}
        >
          <AddNotesCard
            onSave={handleSaveNote}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'NOTES' ? (currentData as NoteDetails) : undefined}
          />
        </TimelineCard>
      );
    case 'bookAppointment':
    case 'APPOINTMENT':
      return (
        <TimelineCard
          type="APPOINTMENT"
          date={new Date().toLocaleString()}
          createdAt={new Date().toLocaleString()}
          status="pending"
        >
          <AddAppointmentCard
            onSave={handleSaveAppointment}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'APPOINTMENT' ? (currentData as IAppointment) : undefined}
          />
        </TimelineCard>
      );
    case 'createTask':
    case 'TASK':
      return (
        <TimelineCard
          type="TASK"
          date={new Date().toLocaleString()}
          createdAt={new Date().toLocaleString()}
          status="pending"
        >
          <CreateTaskCard
            onSave={values => handleSaveTask(values.task)}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'TASK' ? (currentData as ITask) : undefined}
          />
        </TimelineCard>
      );
    case 'sendSms':
    case 'SMS':
      return (
        <TimelineCard
          type="SMS"
          date={new Date().toLocaleString()}
          // createdByName="Current User"
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
            initialData={type === 'SMS' ? (currentData as SmsDetails) : undefined}
          />
        </TimelineCard>
      );
    default:
      return null;
  }
};

export default TimelineActionFormRenderer;
