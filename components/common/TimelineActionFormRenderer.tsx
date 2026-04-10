import React from 'react';
import AddNotesCard from './TimeLineComponents/AddNotesCard';
import AddAppointmentCard from './TimeLineComponents/AddAppointmentCard';
import CreateTaskCard from './TimeLineComponents/CreateTaskCard';
import SendSmsCard from './TimeLineComponents/SendSmsCard';
import { ActionType, NoteDetails, SmsDetails } from 'data/types';
import { ITask } from '@redux/feature/task/ITaskStates';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';
import { Modal } from 'antd';

interface TimelineActionFormRendererProps {
  activeAction: ActionType;
  editingItem: ITask | IAppointment | NoteDetails | SmsDetails | null;
  loading: boolean;
  handleSaveNote: (note: NoteDetails) => void;
  handleSaveAppointment: (appointment: IAppointment) => void;
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
        <Modal
          title="Notes"
          open={
            (activeAction || (editingItem && type)) === 'NOTES' ||
            (activeAction || (editingItem && type)) === 'addNotes'
          }
          footer={false}
          onCancel={handleClose}
        >
          <AddNotesCard
            onSave={handleSaveNote}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'NOTES' ? (currentData as NoteDetails) : undefined}
          />
        </Modal>
      );
    case 'bookAppointment':
    case 'APPOINTMENT':
      return (
        <Modal
          title="Appointment"
          open={
            (activeAction || (editingItem && type)) === 'APPOINTMENT' ||
            (activeAction || (editingItem && type)) === 'bookAppointment'
          }
          footer={false}
          onCancel={handleClose}
        >
          <AddAppointmentCard
            onSave={handleSaveAppointment}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'APPOINTMENT' ? (currentData as IAppointment) : undefined}
          />
        </Modal>
      );
    case 'createTask':
    case 'TASK':
      return (
        <Modal
          title="Task"
          open={
            (activeAction || (editingItem && type)) === 'TASK' ||
            (activeAction || (editingItem && type)) === 'createTask'
          }
          footer={false}
          onCancel={handleClose}
        >
          <CreateTaskCard
            onSave={values => handleSaveTask(values.task)}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'TASK' ? (currentData as ITask) : undefined}
          />
        </Modal>
      );
    case 'sendSms':
    case 'SMS':
      return (
        <Modal
          title="SMS"
          open={
            (activeAction || (editingItem && type)) === 'SMS' ||
            (activeAction || (editingItem && type)) === 'sendSms'
          }
          footer={false}
          onCancel={handleClose}
        >
          <SendSmsCard
            onSave={handleSaveSms}
            onCancel={handleClose}
            loading={loading}
            initialData={type === 'SMS' ? (currentData as SmsDetails) : undefined}
          />
        </Modal>
      );
    default:
      return null;
  }
};

export default TimelineActionFormRenderer;
