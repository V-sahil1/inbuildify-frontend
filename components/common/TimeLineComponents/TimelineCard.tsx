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
import { AppointmentDetails, TaskDetails, NoteDetails, SmsDetails } from "data/types";

const statusColors: Record<string, string> = {
    completed: "text-blue-600",
    pending: "text-yellow-600",
    working: "text-green-600",
};

const TimelineCard: FC<TimelineCardProps> = ({
    type,
    date,
    createdBy,
    createdAt,
    status,
    onEdit,
    onReschedule,
    children,
    item,
    data,
}) => {
    const getTitle = () => {
        switch (item?.type) {
            case "NOTES":
                return (item?.notes[0] as NoteDetails)?.message;
            case "APPOINTMENT":
                return (item?.appointment[0] as AppointmentDetails)?.title;
            case "TASK":
                return (item?.task[0] as TaskDetails)?.task?.name;
            case "SMS":
                return `SMS to ${(item?.sms[0] as SmsDetails)?.message}`;
            default:
                return "";
        }
    };

    const getDescription = () => {
        switch (item?.type) {
            case "NOTES":
                return (item?.notes[0] as NoteDetails)?.message;
            case "APPOINTMENT":
                return (item?.appointment[0] as AppointmentDetails)?.notes;
            case "TASK":
                return (item?.task[0] as TaskDetails)?.task?.description;
            case "SMS":
                return (item?.sms[0] as SmsDetails)?.message;
            default:
                return "";
        }
    };

    const getTags = () => {
        if (type === "NOTES" && (data as NoteDetails)?.tags) {
            return (data as NoteDetails)?.tags;
        }
        if (type === "TASK" && (data as TaskDetails)?.task?.priority) {
            return [`Priority: ${(data as TaskDetails)?.task?.priority}`];
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
                    {(getTags().length > 0) && (
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
                        <span
                            className={`text-sm font-medium ${statusColors[status]}`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
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
                        {createdBy?.charAt(0)}
                    </div>
                </div>

                {/* Row 3 - Description / Details */}
                <>
                    {children ?? (
                        <p className="text-sm text-font-color-100 mb-3">
                            {getDescription()}  
                            {
                                <div className="font-medium text-font-color text-base sm:text-lg">
                                    {type === "NOTES" ? (data as NoteDetails)?.message : ""}
                                </div>
                            }
                        </p>
                    )}
                    {type === "NOTES" && (data as NoteDetails) && (
                        <div className="text-xs text-font-color-100 space-y-1 mt-2">
                            {(data as NoteDetails)?.attachment && (data as NoteDetails).attachment!.length > 0 && (
                                <p><strong>Files:</strong> {(data as NoteDetails).attachment!.map(f => f.name).join(', ')}</p>
                            )}
                            {(data as NoteDetails).sendToCustomer && (
                                <p><strong>Send to Customer:</strong> Yes</p>
                            )}
                            {(data as NoteDetails).createFollowUpTask && (
                                <p><strong>Create Follow-up:</strong> Yes {(data as NoteDetails).task?.dueDate && `(Due: ${(data as NoteDetails).task?.dueDate})`}</p>
                            )}
                        </div>
                    )}
                    {type === "APPOINTMENT" && (data as AppointmentDetails) && (
                        <div className="text-xs text-font-color-100 space-y-1 mt-2">
                            <p><strong>Date:</strong> {(data as AppointmentDetails).date}</p>
                            <p><strong>Time:</strong> {(data as AppointmentDetails).startTime} - {(data as AppointmentDetails).endTime}</p>
                            <p><strong>Location:</strong> {(data as AppointmentDetails).location}</p>
                            <p><strong>User:</strong> {(data as AppointmentDetails).user}</p>
                            <p><strong>Send to Customer:</strong> {(data as AppointmentDetails).sendToCustomer ? "Yes" : "No"}</p>
                        </div>
                    )}
                    {type === "TASK" && (data as TaskDetails) && (
                        <div className="text-xs text-font-color-100 space-y-1 mt-2">
                            <p><strong>Due Date:</strong> {(data as TaskDetails).task?.dueDate}</p>
                            <p><strong>Time:</strong> {(data as TaskDetails).task?.time}</p>
                            <p><strong>Priority:</strong> {(data as TaskDetails).task?.priority}</p>
                            <p><strong>Assignee:</strong> {(data as TaskDetails).task?.assignee}</p>
                        </div>
                    )}
                </>

                {/* Row 4 - Created info + Actions */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <p className="text-xs text-font-color-100">
                        {createdBy} created on {createdAt}
                    </p>

                    <div className="flex gap-3">
                        {onEdit && (
                            <button onClick={() => onEdit({ type, date, createdBy, createdAt, status, data } as TimelineCardProps)}>
                                <IconEdit size={18} />
                            </button>
                        )}
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
