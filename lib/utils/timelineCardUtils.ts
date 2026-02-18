import { createActionsThunk, updateActionsThunk } from '@redux/feature/action/actionThunk';
import { AppDispatch } from '@redux/feature/store';
import { message } from 'antd';
import {
  AppointmentDetails,
  NoteDetails,
  SmsDetails,
  TaskDetails,
  TimelineCardProps,
} from 'data/types';
import { formDataGenerator } from './formDataGenerator';
import { ITask } from '@redux/feature/task/ITaskStates';

interface EditingItem {
  item: TimelineCardProps;
  index: number;
}

export const handleSaveTimelineCard = async <
  T extends 'Notes' | 'Appointments' | 'Tasks' | 'Sms',
  D extends T extends 'Notes'
    ? NoteDetails
    : T extends 'Appointments'
      ? AppointmentDetails
      : T extends 'Tasks'
        ? ITask
        : SmsDetails,
>(
  leadId: string,
  editingItem: EditingItem | null,
  setCardsData: React.Dispatch<React.SetStateAction<TimelineCardProps[]>>,
  handleClose: () => void,
  activeTab: string,
  type: 'SMS' | 'NOTES' | 'APPOINTMENT' | 'TASK',
  data: D,
  dispatch: AppDispatch
): Promise<void> => {
  if (editingItem) {
    const { actionId, ...rest } = data;
    try {
      const response = await dispatch(
        updateActionsThunk({
          actionId: actionId,
          data: formDataGenerator(rest),
        })
      ).unwrap();

      setCardsData(prev =>
        prev.map(card => {
          if (card?.actionId === response.actionId) {
            const updatedTasks = response.task ? [response.task] : [];
            const updatedNotes = response.notes ? [response.notes] : [];
            const updatedAppointments = response.appointment ? [response.appointment] : [];
            const updatedSms = response.sms ? [response.sms] : [];
            return {
              ...card,
              ...response,
              task: updatedTasks,
              notes: updatedNotes,
              appointment: updatedAppointments,
              sms: updatedSms,
            };
          }
          return card;
        })
      );
      message.success(`${type} updated successfully`);
      handleClose();
    } catch (err) {
      message.error(err || `Failed to update ${type}`);
    }
  } else {
    try {
      const response = await dispatch(
        createActionsThunk({ leadId: leadId, data: formDataGenerator(data) })
      ).unwrap();

      const baseCard = { ...response };
      let newCard;

      if (activeTab === 'All') {
        newCard = {
          ...baseCard,
          appointment: response?.appointment ? [response.appointment] : [],
          task: response?.task ? [response.task] : [],
          sms: response?.sms ? [response.sms] : [],
          notes: response?.notes ? [response.notes] : [],
        };
        setCardsData(prev => [newCard, ...(Array.isArray(prev) ? prev : [])]);
        message.success(`${type} created successfully`);
        handleClose();
        return;
      }

      if (activeTab.toLowerCase() === response.type?.toLowerCase()) {
        switch (response.type) {
          case 'NOTES':
            newCard = { ...baseCard, notes: response?.notes ? [response.notes] : [] };
            break;
          case 'APPOINTMENT':
            newCard = {
              ...baseCard,
              appointment: response?.appointment ? [response.appointment] : [],
            };
            break;
          case 'TASK':
            newCard = { ...baseCard, task: response?.task ? [response.task] : [] };
            break;
          case 'SMS':
            newCard = { ...baseCard, sms: response?.sms ? [response.sms] : [] };
            break;
        }

        if (newCard) {
          setCardsData(prev => [newCard, ...(Array.isArray(prev) ? prev : [])]);
          message.success(`${type} created successfully`);
        }
      }

      // ✅ Always close modal at the end
      handleClose();
    } catch (error) {
      message.error(error?.message || `Failed to create ${type}`);
    }
  }
};
