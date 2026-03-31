import { createActionsThunk, updateActionsThunk } from '@redux/feature/action/actionThunk';
import { AppDispatch } from '@redux/feature/store';
import { message } from 'antd';
import { NoteDetails, SmsDetails, TimelineCardProps } from 'data/types';
import { formDataGenerator } from './formDataGenerator';
import { ITask } from '@redux/feature/task/ITaskStates';
import { createTask, updateTask } from '@redux/feature/task/taskThunk';
import { createAppointment, updateAppointment } from '@redux/feature/appointment/appointmentThunk';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';

export const handleSaveTimelineCard = async <
  T extends 'Notes' | 'Appointments' | 'Tasks' | 'Sms',
  D extends T extends 'Notes'
    ? NoteDetails
    : T extends 'Appointments'
      ? IAppointment
      : T extends 'Tasks'
        ? ITask
        : SmsDetails,
>(
  leadId: string,
  editingItem: ITask | IAppointment | NoteDetails | SmsDetails | null,
  setCardsData: React.Dispatch<
    React.SetStateAction<
      {
        type: 'All' | 'NOTES' | 'SMS' | 'APPOINTMENT' | 'TASK';
        item: ITask | IAppointment | NoteDetails | SmsDetails | null;
      }[]
    >
  >,
  handleClose: () => void,
  activeTab: string,
  type: 'SMS' | 'NOTES' | 'APPOINTMENT' | 'TASK',
  data: D,
  dispatch: AppDispatch
): Promise<void> => {
  if (editingItem) {
    try {
      let response;
      if (type === 'TASK') {
        response = await dispatch(
          updateTask({
            id: (editingItem as ITask)?.taskId,
            data: formDataGenerator(data),
          })
        ).unwrap();
      } else if (type === 'APPOINTMENT') {
        response = await dispatch(
          updateAppointment({
            id: (editingItem as IAppointment)?.appointmentId,
            data: data as Partial<IAppointment>,
          })
        ).unwrap();
      } else {
        // response = await dispatch(
        //   updateActionsThunk({
        //     actionId: editingItem?.item?.item?.task?.[0].taskId,
        //     data: formDataGenerator(data),
        //   })
        // ).unwrap();
      }

      setCardsData(prev =>
        type === 'TASK'
          ? prev.map(i =>
              (i.item as ITask).taskId === response?.taskId ? { type: 'TASK', item: response } : i
            )
          : prev.map(i =>
              (i.item as IAppointment).appointmentId === response?.appointmentId
                ? { type: 'APPOINTMENT', item: response }
                : i
            )
      );
      message.success(`${type} updated successfully`);
      handleClose();
    } catch (err) {
      message.error(err || `Failed to update ${type}`);
    }
  } else {
    try {
      let response;
      if (type === 'TASK') {
        response = await dispatch(
          createTask(formDataGenerator({ ...data, leadId: leadId }))
        ).unwrap();
      } else if (type === 'APPOINTMENT') {
        response = await dispatch(
          createAppointment({ ...data, leadId: leadId } as IAppointment)
        ).unwrap();
      } else {
        response = await dispatch(
          createActionsThunk({ leadId: leadId, data: formDataGenerator(data) })
        ).unwrap();
      }
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
        setCardsData(prev => [...prev, { type: type, item: response }]);
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
          setCardsData(prev => [...prev, { type: type, item: response }]);
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
