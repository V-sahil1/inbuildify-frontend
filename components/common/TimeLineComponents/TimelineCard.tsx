"use client";
import { FC, useState } from "react";
import {
  IconCalendar,
  IconMessage,
  IconDeviceMobileMessage,
  IconListCheck,
  IconEdit,
  IconUpload,
  IconArrowBackUp,
  IconPencil,
  IconCalendarCancel,
  IconCaretDown,
} from "@tabler/icons-react";
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
import { Button, Tooltip, Input, Switch, Upload, Popconfirm, Dropdown, Menu } from "antd";

const { TextArea } = Input;

const TimelineCard: FC<TimelineCardProps> = ({
  type,
  createdBy,
  createdAt,
  onEdit,
  onReschedule,
  children,
  item,
}) => {
  const { leadDetail } = useAppSelector((state) => state.lead);
  const { users } = useAppSelector((state) => state.user);

  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [replies, setReplies] = useState<string[]>([]);
  const [sendToCustomer, setSendToCustomer] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCanceled, setIsCanceled] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string>("In Progress");

  const handleSaveReply = () => {
    if (replyText.trim()) {
      if (editingIndex !== null) {
        const updatedReplies = [...replies];
        updatedReplies[editingIndex] = replyText.trim();
        setReplies(updatedReplies);
        setEditingIndex(null);
      } else {
        setReplies([...replies, replyText.trim()]);
      }
    }
    setReplyText("");
    setShowReply(false);
    setSendToCustomer(false);
  };

  const handleCancelReply = () => {
    setReplyText("");
    setShowReply(false);
    setSendToCustomer(false);
    setEditingIndex(null);
  };

  const handleCancelAction = () => {
    setIsCanceled(true);
    if (item?.type === "APPOINTMENT" && onReschedule) {
      onReschedule();
    }
  };

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

  const getIcon = () => {
    switch (type) {
      case "NOTES":
        return <IconMessage size={18} />;
      case "APPOINTMENT":
        return <IconCalendar size={18} />;
      case "TASK":
        return <IconListCheck size={18} />;
      case "SMS":
        return <IconDeviceMobileMessage size={18} />;
      default:
        return <IconMessage size={18} />;
    }
  };

  const statusMenu = (
    <Menu onClick={({ key }) => setTaskStatus(key)}>
      <Menu.Item key="Yet to start">Yet to start</Menu.Item>
      <Menu.Item key="In Progress">In Progress</Menu.Item>
      <Menu.Item key="Completed">Completed</Menu.Item>
    </Menu>
  );

  const renderCanceledText = (text: string) => {
    return isCanceled ? <del>{text}</del> : text;
  };

  const renderButtons = () => {
    if ((item?.type === "APPOINTMENT" || item?.type === "TASK") && isCanceled) {
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">
          Canceled
        </span>
      );
    }

    return (
      <>
        {onEdit && (
          <button
            onClick={() => onEdit({ item, type: item.type } as TimelineCardProps)}
          >
            <IconEdit size={18} />
          </button>
        )}
        {(item?.type === "APPOINTMENT" || item?.type === "TASK") && (
          <Popconfirm
            title="Do you want to cancel?"
            okText="Yes"
            cancelText="No"
            onConfirm={handleCancelAction}
            onCancel={() => {}}
          >
            <Tooltip title="Cancel">
              <button>
                <IconCalendarCancel size={18} />
              </button>
            </Tooltip>
          </Popconfirm>
        )}
      </>
    );
  };

  return (
    <div className="flex items-start gap-4 relative">
      <div className="relative z-10 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 text-gray-600">
        {getIcon()}
      </div>

      <div className="flex-1 bg-body-color rounded-lg shadow-sm border border-border-color p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            {getTags().slice(0, 5).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {getTags().length > 5 && (
              <Tooltip
                color="var(--card-color)"
                title={
                  <div className="flex flex-wrap gap-2 max-w-xs">
                    {getTags().map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                }
              >
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md cursor-pointer">
                  +{getTags().length - 5}
                </span>
              </Tooltip>
            )}
          </div>
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
            {createdBy?.name && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                <p>{createdBy?.name?.charAt(0)}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <h3 className="font-medium text-font-color text-base sm:text-lg">
            {getTitle()}
          </h3>
        </div>

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
              {typeof (item?.notes?.[0] as NoteDetails)?.attachment === "string" && (
                <p className="p-0">
                  <strong>Attachments:</strong>{" "}
                  <Button
                    type="link"
                    href={String((item?.notes?.[0] as NoteDetails)?.attachment)}
                    target="_blank"
                    className="p-0 m-0"
                    rel="noopener noreferrer"
                  >
                    View Attachment
                  </Button>
                </p>
              )}
            </div>
          )}
          {item?.type === "APPOINTMENT" && (item?.appointment?.[0] as AppointmentDetails) && (
            <div className="text-xs text-font-color-100 space-y-1 mt-2">
              <p>
                <strong>Date:</strong>{" "}
                {renderCanceledText(
                  formatApiDate((item?.appointment?.[0] as AppointmentDetails)?.date) || " "
                )}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {renderCanceledText(
                  `${(item?.appointment?.[0] as AppointmentDetails)?.startTime || "-"} - ${(item?.appointment?.[0] as AppointmentDetails)?.endTime || "-"}`
                )}
              </p>
              <p>
                <strong>Location:</strong>{" "}
                {(item?.appointment[0] as AppointmentDetails)?.location || "-"}
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
                          const found = users.find((u) => u.usersId === id.id);
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
                {renderCanceledText(
                  item.task[0]?.dueDate
                    ? dayjs(item.task[0].dueDate).format("YYYY-MM-DD")
                    : "-"
                )}
              </p>
              <p>
                <strong>Time:</strong>{" "}
                {renderCanceledText((item.task[0] as TaskDetails)?.time || "-")}
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
                    (u) => u.usersId === assigneeId.id
                  );
                  return assigneeUser?.name || "-";
                })()}
              </p>
              {item?.task[0]?.attachment && (
                <p>
                  <strong>Attachments:</strong>{" "}
                  <Button
                    type="link"
                    href={String((item?.task[0] as TaskDetails)?.attachment)}
                    target="_blank"
                    className="p-0 m-0"
                    rel="noopener noreferrer"
                  >
                    View Attachment
                  </Button>
                </p>
              )}
            </div>
          )}

          {replies.length > 0 &&
            replies.map((r, i) => (
              <div
                key={i}
                className="mt-2 p-2 bg-gray-50 border-l-4 border-primary rounded text-sm flex flex-col ml-3"
              >
                <div className="w-full flex justify-between items-center mb-1">
                  <div className="mr-[1%] flex-grow">
                    {editingIndex === i ? (
                      <Input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        size="small"
                        className="h-9"
                      />
                    ) : (
                      r
                    )}
                  </div>
                  <div>
                    {editingIndex === i ? (
                      <Button
                        type="link"
                        onClick={handleSaveReply}
                        className="p-0 !text-primary"
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="link"
                        onClick={() => {
                          setEditingIndex(i);
                          setReplyText(r);
                        }}
                        className="p-0"
                      >
                        <IconPencil size={18} className="text-primary" />
                      </Button>
                    )}
                  </div>
                </div>
                {(createdAt || item?.createdAt) && createdBy?.name && (
                  <p className="text-xs text-font-color-100">
                    {createdBy?.name} created{" "}
                    {timeAgo(createdAt || item?.createdAt)}
                  </p>
                )}
              </div>
            ))}
        </>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          {(createdAt || item?.createdAt) && createdBy?.name && (
            <p className="text-xs text-font-color-100">
              {createdBy?.name} created{" "}
              {timeAgo(createdAt || item?.createdAt)}
            </p>
          )}

          <div className="flex gap-3">
            {item?.type === "TASK" && !isCanceled && (
              <Dropdown overlay={statusMenu} trigger={['click']}>
                <a className="flex items-center gap-1">
                  <div>{taskStatus}</div> <IconCaretDown size={16} />
                </a>
              </Dropdown>
            )}
            {renderButtons()}
          </div>
        </div>

        {item?.type === "NOTES" && (
          <div className="mt-2 border-t pt-2">
            {!showReply && (
              <Button
                type="primary"
                icon={<IconArrowBackUp size={16} />}
                onClick={() => setShowReply(true)}
                size="small"
              >
                Reply
              </Button>
            )}
            {showReply && (
              <div className="flex flex-col gap-2">
                <TextArea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={2}
                  placeholder="Type your reply..."
                />
                <div className="flex gap-2 justify-between items-center">
                  <div>
                    <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      listType="picture"
                    >
                      <Button icon={<IconUpload />}>Attach Files</Button>
                    </Upload>
                  </div>
                  <div className="flex gap-2 justify-end items-center">
                    Send this reply to customer
                    <Switch
                      checked={sendToCustomer}
                      onChange={(checked) => setSendToCustomer(checked)}
                    />
                    <Button onClick={handleCancelReply}>Cancel</Button>
                    <Button type="primary" onClick={handleSaveReply}>
                      {sendToCustomer ? "Send" : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineCard;