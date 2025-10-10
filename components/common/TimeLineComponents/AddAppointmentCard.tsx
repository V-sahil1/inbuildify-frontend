"use client";
import { FC, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  TimePicker,
  Input,
  Select,
  Switch,
  message,
  Form,
} from "antd";
import dayjs from "dayjs";
import { AppointmentDetails } from "data/types";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { getUsersThunk } from "@redux/feature/user/userThunk";
import {
  dueDateRules,
  locationRules,
  optionalNotesRule,
  taskNameRules,
  timeRules,
} from "@lib/constants/formInputValidations";
import {
  disablePastDates,
  getDisabledTime,
  getEndDisabledTime,
} from "@lib/utils/getDisabledTimeDate";
import NoDataMessage from "../NoDataMessage";
import SystemRoutes from "@lib/constants/Routes";
const { TextArea } = Input;

interface AddAppointmentCardProps {
  onSave: (appointment: AppointmentDetails) => void;
  onCancel: () => void;
  loading: boolean;
  initialData?: AppointmentDetails;
}

const AddAppointmentCard: FC<AddAppointmentCardProps> = ({
  onSave,
  onCancel,
  loading,
  initialData,
}) => {
  const { users, status } = useAppSelector((state) => state.user);
    const { email } = useAppSelector((state) => state.auth.user);
  
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (status.users === Status.IDLE) {
      fetchuserData();
    }
  }, [status.users]);
  const fetchuserData = async () => {
    try {
      await dispatch(getUsersThunk()).unwrap();
    } catch (error) {
      message.error(error || "failed to fetch the users");
    }
  };
  const userOptions = users.reduce((acc, user) => {
    if (user.email !== email) {
      acc.push({ label: user.name, value: user.usersId });
    }
    return acc;
  }, [] as { label: string; value: string }[]);
  const [form] = Form.useForm();
  const handleFinish = (values: any) => {
    form.validateFields();
    values.type = "APPOINTMENT";
    if (initialData) {
      values.actionId = initialData.actionId;
      values.action_type_id = initialData?.appointmentId;
    }
    values.start_time = values.start_time.format("HH:mm");
    values.date = values.date?.format("YYYY-MM-DD");
    values.end_time = values.end_time.format("HH:mm");
    onSave(values);
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleFinish}
      className="flex flex-col gap-3"
    >
      <Form.Item label="Title" name="title" rules={taskNameRules}
        initialValue={initialData?.title}>
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
                start_time: null,
                end_time: null,
              });
            }}
          />
        </Form.Item>

        <Form.Item
          label="Location"
          name="location"
          rules={locationRules}
          initialValue={initialData?.location}
        >
          <Input placeholder="Location" />
        </Form.Item>

        {/* Start Time */}
        <Form.Item shouldUpdate={(prev, curr) => prev.date !== curr.date}>
          {({ getFieldValue }) => (
            <Form.Item
              label="Start Time"
              name="start_time"
              rules={timeRules}
              initialValue={
                initialData?.startTime
                  ? dayjs(initialData.startTime, "HH:mm")
                  : null
              }
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                hideDisabledOptions
                disabled={!getFieldValue("date")}
                disabledTime={() => {
                  const selectedDate: dayjs.Dayjs = getFieldValue("date");
                  const now = dayjs();

                  if (!selectedDate)
                    return {
                      disabledHours: () => [],
                      disabledMinutes: () => [],
                    };

                  if (selectedDate.isSame(now, "day")) {
                    return {
                      disabledHours: () =>
                        Array.from({ length: now.hour() }, (_, i) => i),
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
            prev.date !== curr.date || prev.start_time !== curr.start_time
          }
        >
          {({ getFieldValue }) => (
            <Form.Item
              label="End Time"
              name="end_time"
              dependencies={["start_time", "date"]}
              initialValue={
                initialData?.endTime
                  ? dayjs(initialData.endTime, "HH:mm")
                  : null
              }
              rules={[
                ...timeRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const start = getFieldValue("start_time");
                    if (!value || !start) return Promise.resolve();
                    return value.isAfter(start)
                      ? Promise.resolve()
                      : Promise.reject(
                          new Error("End time must be later than Start time")
                        );
                  },
                }),
              ]}
            >
              <TimePicker
                format="HH:mm"
                className="w-full"
                hideDisabledOptions
                disabled={
                  !getFieldValue("date") || !getFieldValue("start_time")
                }
                disabledTime={() =>
                  getEndDisabledTime(
                    getFieldValue("date"),
                    getFieldValue("start_time")
                  )
                }
              />
            </Form.Item>
          )}
        </Form.Item>
      </div>

      <Form.Item
        label="User"
        name="select_users"
        rules={[{ required: true, message: "Please select user(s)" }]}
        initialValue={initialData?.selectUsers?.map((user) => user.id)}  
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
      <Form.Item label="Notes" name="notes" rules={optionalNotesRule}
        initialValue={initialData?.notes}
      >
        <TextArea rows={4} placeholder="Additional notes" className="!resize-none"/>
      </Form.Item>

      {/* Send to Customer + Actions */}
      <div className="flex items-center justify-between mt-2">
        {!initialData && <Form.Item
          name="sendToCustomer"
          valuePropName="checked"
          className="mb-0"
        >
          <Switch className="mr-2" /> Send this appointment to customer
        </Form.Item>}

        <div className="flex gap-3">
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
           {initialData ? "Update" : "Save"}
          </Button>
        </div>
      </div>
    </Form>
  );
};

export default AddAppointmentCard;
