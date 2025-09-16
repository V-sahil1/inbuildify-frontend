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
import { useAppSelector } from "@hooks/redux";
import { formatApiDate, timeAgo } from "@lib/utils/timeAgo";

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
  const { leadDetail } = useAppSelector((state) => state.lead);
  const { users } = useAppSelector((state) => state.user);

  const getTitle = () => {
    switch (item?.type) {
      case "NOTES":
        return (item?.notes[0] as NoteDetails)?.message;
      case "APPOINTMENT":
        return (item?.appointment[0] as AppointmentDetails)?.title;
      case "TASK":
        return (item?.task[0] as TaskDetails)?.name;
      case "SMS":
        return `${(item?.sms[0] as SmsDetails)?.message}`;
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
      case "SMS": {
        const sms = item?.sms?.[0] as SmsDetails;

        type Recipient = string | { id: string; name: string };

        const recipientNames = (
          Array.isArray(sms?.recipient) ? sms?.recipient : []
        )
          .map((r: Recipient) => {
            if (typeof r === "string") {
              const contact = leadDetail?.contacts?.find(
                (c) => c?.leadsContactId === r
              );
              return contact?.name;
            } else if (typeof r === "object" && r?.name) {
              return r?.name;
            }
            return null;
          })
          .filter(Boolean)
          .join(", ");

        return `${recipientNames ? ` (To: ${recipientNames})` : ""}`;
      }
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
        <div className="mb-2 flex items-center justify-between gap-2">
          {/* Left: Tags (can be empty but keeps spacing) */}
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

          {/* Right: Avatar + Type */}
          <div className="flex items-center gap-2 ml-auto">
            {item?.type && (
              <span
                className={`px-2 py-1 text-xs rounded-md ${
                  {
                    NOTES: "bg-gray-300 text-blue-700",
                    TASK: "bg-green-100 text-green-700",
                    SMS: "bg-yellow-100 text-yellow-700",
                    APPOINTMENT: "bg-red-100 text-red-700",
                  }[item?.type] || "bg-gray-100 text-gray-700"
                }`}
              >
                {item?.type}
              </span>
            )}
           {item?.createdByName && (<div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
              <p>{item?.createdByName?.charAt(0)}</p>
            </div>)}
          </div>
        </div>

        {/* Row 2 - Title + Avatar */}
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-font-color text-base sm:text-lg">
            {getTitle()}
          </h3>
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
                  {formatApiDate(
                    (item?.notes?.[0] as NoteDetails)?.task?.dueDate
                  ) &&
                    `(Due: ${
                      (item?.notes?.[0] as NoteDetails)?.task?.dueDate
                    })`}
                </p>
              )}
            </div>
          )}
          {item?.type === "APPOINTMENT" &&
            (item?.appointment?.[0] as AppointmentDetails) && (
              <div className="text-xs text-font-color-100 space-y-1 mt-2">
                <p>
                  <strong>Date:</strong>{" "}
                  {formatApiDate(
                    (item?.appointment?.[0] as AppointmentDetails)?.date
                  ) || " "}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {(item?.appointment?.[0] as AppointmentDetails)?.startTime ||
                    "-"}
                  {" - "}
                  {(item?.appointment?.[0] as AppointmentDetails)?.endTime ||
                    "-"}
                </p>
                <p>
                  <strong>Location:</strong>{" "}
                  {(item?.appointment[0] as AppointmentDetails)?.location ||
                    "-"}
                </p>
                <p>
                  <strong>User:</strong>{" "}
                  {(() => {
                    const selectedIds =
                      (item?.appointment?.[0] as AppointmentDetails)
                        ?.selectUsers || [];

                    const userNames = Array.isArray(selectedIds)
                      ? selectedIds
                          .map((id) => {
                            const found = users.find((u) => u.usersId === id);
                            return found?.name;
                          })
                          .filter(Boolean)
                          .join(", ")
                      : "-";

                    return userNames || "-";
                  })()}
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
                <strong>Time:</strong>{" "}
                {(item.task[0] as TaskDetails)?.time || "-"}
              </p>
              <p>
                <strong>Priority:</strong>{" "}
                {(item?.task[0] as TaskDetails)?.priority || "-"}
              </p>
              <p>
                <strong>Assignee:</strong>{" "}
                {(() => {
                  const assigneeId = (item?.task?.[0] as TaskDetails)?.assignee;
                  if (!assigneeId) return "-";
                  const assigneeUser = users.find(
                    (u) => u.usersId === assigneeId
                  );
                  return assigneeUser?.name || "-";
                })()}
              </p>
            </div>
          )}
        </>

        {/* Row 4 - Created info + Actions */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {(createdAt || item?.createdAt) && item?.createdByName && (
            <p className="text-xs text-font-color-100">
              {item?.createdByName} created{" "}
              {timeAgo(createdAt || item?.createdAt)}
            </p>
          )}

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
