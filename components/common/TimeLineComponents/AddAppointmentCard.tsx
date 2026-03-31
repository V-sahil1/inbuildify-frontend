'use client';
import { FC } from 'react';
import { Button, DatePicker, TimePicker, Input, Select, Switch, Form } from 'antd';
import dayjs from 'dayjs';

import {
  dueDateRules,
  locationRules,
  optionalNotesRule,
  taskNameRules,
  timeRules,
} from '@lib/constants/formInputValidations';
import { disablePastDates, getEndDisabledTime } from '@lib/utils/getDisabledTimeDate';
import NoDataMessage from '../NoDataMessage';
import SystemRoutes from '@lib/constants/Routes';
import { useUsersHook } from '@hooks/useUserHook';
import { IAppointment } from '@redux/feature/appointment/IAppointmentState';
import { useLocationAndTimezoneHook } from '@hooks/useLocationAndTimezoneHook';
const { TextArea } = Input;

interface AddAppointmentCardProps {
  onSave: (appointment: IAppointment) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: IAppointment;
}

const AddAppointmentCard: FC<AddAppointmentCardProps> = ({
  onSave,
  onCancel,
  loading,
  initialData,
}) => {
  const { userOptions } = useUsersHook();
  const { locationOptions } = useLocationAndTimezoneHook({ type: 'location' });

  const [form] = Form.useForm();
  const handleFinish = values => {
    form.validateFields();
    values.startTime = values.startTime.format('HH:mm');
    values.date = values.date?.format('YYYY-MM-DD');
    values.endTime = values.endTime.format('HH:mm');
    onSave(values);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish} className="flex flex-col gap-3">
      <Form.Item label="Title" name="title" rules={taskNameRules} initialValue={initialData?.title}>
        <Input placeholder="Appointment Title" />
      </Form.Item>

      <div className="grid grid-cols-2 gap-3">
        <Form.Item
          label="Date"
          name="date"
          rules={dueDateRules}
          initialValue={initialData?.date ? dayjs(initialData?.date) : null}
        >
          <DatePicker
            className="w-full"
            disabledDate={disablePastDates}
            onChange={() => {
              form.setFieldsValue({
                startTime: null,
                endTime: null,
              });
            }}
          />
        </Form.Item>

        {locationOptions?.length > 0 && (
          <Form.Item
            label="Location"
            name="locationId"
            rules={locationRules}
            initialValue={initialData?.location?.[0]?.id}
          >
            <Select placeholder="Select Location" options={locationOptions} />
          </Form.Item>
        )}

        {/* Start Time */}
        <Form.Item shouldUpdate={(prev, curr) => prev.date !== curr.date}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Start Time"
              name="startTime"
              rules={timeRules}
              initialValue={initialData?.startTime ? dayjs(initialData.startTime, 'HH:mm') : null}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                hideDisabledOptions
                disabled={!getFieldValue('date')}
                disabledTime={() => {
                  const selectedDate: dayjs.Dayjs = getFieldValue('date');
                  const now = dayjs();

                  if (!selectedDate)
                    return {
                      disabledHours: () => [],
                      disabledMinutes: () => [],
                    };

                  if (selectedDate.isSame(now, 'day')) {
                    return {
                      disabledHours: () => Array.from({ length: now.hour() }, (_, i) => i),
                      disabledMinutes: (selectedHour: number) =>
                        selectedHour === now.hour()
                          ? Array.from({ length: now.minute() }, (_, i) => i)
                          : [],
                    };
                  }

                  return { disabledHours: () => [], disabledMinutes: () => [] };
                }}
              />
            </Form.Item>
          )}
        </Form.Item>

        {/* End Time */}
        <Form.Item
          shouldUpdate={(prev, curr) =>
            prev.date !== curr.date || prev.startTime !== curr.startTime
          }
        >
          {({ getFieldValue }) => (
            <Form.Item
              label="End Time"
              name="endTime"
              dependencies={['startTime', 'date']}
              initialValue={initialData?.endTime ? dayjs(initialData.endTime, 'HH:mm') : null}
              rules={[
                ...timeRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue('startTime');
                    if (!value || !start) return Promise.resolve();
                    return value.isAfter(start)
                      ? Promise.resolve()
                      : Promise.reject(new Error('End time must be later than Start time'));
                  },
                }),
              ]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                hideDisabledOptions
                disabled={!getFieldValue('date') || !getFieldValue('startTime')}
                disabledTime={() =>
                  getEndDisabledTime(getFieldValue('date'), getFieldValue('startTime'))
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      </div>

      <Form.Item
        label="User"
        name="selectUsers"
        rules={[{ required: true, message: 'Please select user(s)' }]}
        initialValue={initialData?.selectUsers?.map(user => user.id)}
      >
        <Select
          options={userOptions}
          mode="multiple"
          placeholder="Select User"
          className="w-full"
          notFoundContent={<NoDataMessage label="User" link={SystemRoutes.USERS} />}
        />
      </Form.Item>

      {/* Notes */}
      <Form.Item
        label="Notes"
        name="notes"
        rules={optionalNotesRule}
        initialValue={initialData?.notes}
      >
        <TextArea rows={4} placeholder="Additional notes" className="!resize-none" />
      </Form.Item>

      {/* Send to Customer + Actions */}
      <div className="flex items-center justify-between mt-2">
        <Form.Item
          name="sendAppointmentCustomer"
          valuePropName="checked"
          className="mb-0"
          initialValue={initialData?.sendAppointmentCustomer}
        >
          <Switch className="mr-2" /> Send this appointment to customer
        </Form.Item>

        <div className="flex gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {initialData ? 'Update' : 'Save'}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AddAppointmentCard;
