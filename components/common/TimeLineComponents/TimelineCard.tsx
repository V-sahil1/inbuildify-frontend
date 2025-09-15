"use client";
import { FC } from "react";
import {
  IconEdit,
  IconCalendar,
  IconCheck,
  IconMessage,
} from "@tabler/icons-react";
// import { Button } from "antd";
import { TimelineCardProps } from "data/types";
import {
  AppointmentDetails,
  TaskDetails,
  NoteDetails,
  SmsDetails,
} from "data/types";
import dayjs from "dayjs";

const statusColors: Record<string, string> = {
  completed: "text-blue-600",
  pending: "text-yellow-600",
  working: "text-green-600",
};

const TimelineCard: FC<TimelineCardProps> = ({
  type,
  // date,
  // createdBy,
  createdAt,
  status,
  onEdit,
  onReschedule,
  children,
  item,
  // data,
}) => {
  const getTitle = () => {
    switch (item?.type) {
      case "NOTES":
        return (item?.notes[0] as NoteDetails)?.message;
      case "APPOINTMENT":
        return (item?.appointment[0] as AppointmentDetails)?.title;
      case "TASK":
        return (item?.task[0] as TaskDetails)?.name;
      case "SMS":
        return `SMS to ${(item?.sms[0] as SmsDetails)?.message}`;
      default:
        return "";
    }
  };

  const getDescription = () => {
    switch (item?.type) {
      // case "NOTES":
      //   return (item?.notes[0] as NoteDetails)?.message;
      case "APPOINTMENT":
        return (item?.appointment[0] as AppointmentDetails)?.notes;
      case "TASK":
        return (item?.task[0] as TaskDetails)?.description;
      case "SMS":
        return (item?.sms[0] as SmsDetails)?.message;
      default:
        return "";
    }
  };

  const getTags = () => {
    if (item?.type === "NOTES" && (item?.notes?.[0] as NoteDetails)?.tags) {
      return (item.notes[0] as NoteDetails).tags.map((tag) => tag.name);
    }
  
    if (item?.type === "TASK" && (item?.task?.[0] as TaskDetails)?.priority) {
      return [`Priority: ${(item.task[0] as TaskDetails).priority}`];
    }
  
    return [];
  };
  

  return (
    <div className="flex items-start gap-4 relative">
      {/* Left Icon */}
      <div className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600">
        {type === "TASK" ? <IconCheck size={18} /> : <IconMessage size={18} />}
      </div>

      {/* Card */}
      <div className="flex-1 bg-body-color rounded-lg shadow-sm border border-border-color  p-4">
        {/* Row 1 - Tags + Status */}
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          {getTags().length > 0 && (
            <>
              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {getTags().map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Status */}
          {status && (
            <span className={`text-sm font-medium ${statusColors[status]}`}>
              {status?.charAt(0).toUpperCase() + status?.slice(1)}
            </span>
          )}
        </div>

        {/* Row 2 - Title + Avatar */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-font-color text-base sm:text-lg">
            {getTitle()}
          </h3>
          {/* Placeholder Avatar */}
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            {item?.createdByName?.charAt(0)}
          </div>
        </div>

        {/* Row 3 - Description / Details */}
        <>
          {children ?? (
            <p className="text-sm text-font-color-100 mb-3">
              {getDescription()}
              {
                // <div className="font-medium text-font-color text-base sm:text-lg">
                //   {item?.type === "NOTES" && item?.notes?.length > 0 ? (item?.notes[0] as NoteDetails)?.message : ""}
                // </div>
              }
            </p>
          )}
          {item?.type === "NOTES" && item?.notes?.length > 0 && (
            <div className="text-xs text-font-color-100 space-y-1 mt-2">
              {/* {(item?.notes?.[0] as NoteDetails)?.attachment &&
                (item?.notes?.[0] as NoteDetails)?.attachment!.length > 0 && (
                  <p>
                    <strong>Files:</strong>{" "}
                    {(item?.notes?.[0] as NoteDetails)
                      ?.attachment!?.map((f) => f?.name)
                      .join(", ")}
                  </p>
                )} */}
              {(item?.notes?.[0] as NoteDetails)?.sendToCustomer && (
                <p>
                  <strong>Send to Customer:</strong> Yes
                </p>
              )}
              {(item?.notes?.[0] as NoteDetails)?.createFollowUpTask && (
                <p>
                  <strong>Create Follow-up:</strong> Yes{" "}
                  {(item?.notes?.[0] as NoteDetails)?.task?.dueDate &&
                    `(Due: ${(item?.notes?.[0] as NoteDetails)?.task?.dueDate})`}
                </p>
              )}
            </div>
          )}
          {item?.type === "APPOINTMENT" &&
            (item?.appointment?.[0] as AppointmentDetails) && (
              <div className="text-xs text-font-color-100 space-y-1 mt-2">
                <p>
                  <strong>Date:</strong>{" "}
                  {(item?.appointment?.[0] as AppointmentDetails)?.date || "-"}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {(item?.appointment?.[0] as AppointmentDetails)?.startTime || "-"} 
                  {(item?.appointment?.[0] as AppointmentDetails)?.endTime || "-"}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {(item?.appointment[0] as AppointmentDetails)?.location || "-"}
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {(item?.appointment[0] as AppointmentDetails)?.user || "-"}
                </p>
                <p>
                  <strong>Send to Customer:</strong>{" "}
                  {(item?.appointment[0] as AppointmentDetails)?.sendToCustomer
                    ? "Yes"
                    : "No"}
                </p>
              </div>
            )}
          {item?.type === "TASK" && (item.task[0] as TaskDetails) && (
            <div className="text-xs text-font-color-100 space-y-1 mt-2">
              <p>
                <strong>Due Date:</strong>{" "}
                {item.task[0]?.dueDate
                  ? dayjs(item.task[0].dueDate).format("YYYY-MM-DD")
                  : "-"}
              </p>
              <p>
                <strong>Time:</strong> {(item.task[0] as TaskDetails)?.time || "-"}
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                {(item?.task[0] as TaskDetails)?.priority || "-"}
              </p>
              <p>
                <strong>Assignee:</strong>{" "}
                {(item?.task[0] as TaskDetails)?.assignee || "-"}
              </p>
            </div>
          )}
        </>

        {/* Row 4 - Created info + Actions */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-xs text-font-color-100">
            {item?.createdByName} created on {createdAt}
          </p>

          <div className="flex gap-3">
            {/* {onEdit && (
              // <button
              //   onClick={() =>
              //     onEdit({
              //       type,
              //       date,
              //       createdBy,
              //       createdAt,
              //       status,
              //       data,
              //     } as TimelineCardProps)
              //   }
              // >
              //   <IconEdit size={18} />
              // </button>
            )} */}
            {onReschedule && (
              <button onClick={onReschedule}>
                <IconCalendar size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
