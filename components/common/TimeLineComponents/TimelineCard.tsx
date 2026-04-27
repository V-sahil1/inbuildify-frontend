'use client';
import { FC, useState } from 'react';
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
} from '@tabler/icons-react';
import { TimelineCardProps } from 'data/types';
import { NoteDetails, SmsDetails } from 'data/types';
import dayjs from 'dayjs';
import { useAppSelector, useAppDispatch } from '@hooks/redux';
import { timeAgo } from '@lib/utils/timeAgo';
import { deleteAppointment } from '@redux/feature/appointment/appointmentThunk';
import { deleteTask, updateTask } from '@redux/feature/task/taskThunk';
import {
  Button,
  Tooltip,
  Input,
  Switch,
  Upload,
  Popconfirm,
  Dropdown,
  Menu,
  Descriptions,
} from 'antd';

const { TextArea } = Input;

const TimelineCard: FC<TimelineCardProps> = ({
  type,
  onEdit,
  onReschedule,
  children,
  item,
  onSave,
  handleEdit,
}) => {
  const { users } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState(item?.reply || '');
  const [sendToCustomer, setSendToCustomer] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  // const [isCanceled, setIsCanceled] = useState(false);
  const [taskStatus, setTaskStatus] = useState<string>(item?.status || 'Yet to Start');
  const [attachedFiles, setAttachedFiles] = useState<any[]>([]);
  const [replyError, setReplyError] = useState<string>('');
  console.log('item', item);

  const handleFileChange = (info: any) => {
    const { fileList } = info;
    // Keep only the latest file to enforce single file upload
    const latestFile = fileList.slice(-1);
    setAttachedFiles(latestFile);
  };

  const handleSaveReply = () => {
    if (!item?.reply) {
      onSave({
        parentNoteId: item?.notesId,
        sendToCustomer: sendToCustomer,
        noteType: 'reply',
        attachFile: attachedFiles.length > 0 ? attachedFiles[0].originFileObj : null,
        description: replyText,
      });
    } else {
      handleEdit({ description: replyText, notesId: item?.replyId });
    }
    setEditingIndex(null);
    setReplyError('');
    setShowReply(false);
  };

  const handleCancelReply = () => {
    setReplyText('');
    setShowReply(false);
    setSendToCustomer(false);
    setEditingIndex(null);
    setAttachedFiles([]);
  };

  const handleCancelAction = async () => {
    try {
      if (item?.appointmentId) {
        await dispatch(deleteAppointment(item.appointmentId)).unwrap();
      } else if (item?.taskId) {
        await dispatch(deleteTask(item.taskId)).unwrap();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'NOTES':
        return (item as NoteDetails)?.description;
      case 'APPOINTMENT':
        return item?.title;
      case 'TASK':
        return item?.name;
      case 'SMS':
        return `${(item as SmsDetails)?.message || ''}`;
      default:
        return '';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'APPOINTMENT':
        return item?.notes;
      case 'TASK':
        return item?.description;
      case 'SMS': {
        // const sms = item as SmsDetails;
        // type Recipient = string | { id: string; name: string };
        // const recipientNames = (Array.isArray(sms?.recipient) ? sms?.recipient : [])
        //   .map((r: Recipient) => {
        //     if (typeof r === 'string') {
        //       // const contact = leadDetail?.contacts?.find(c => c?.leadsContactId === r);
        //       // return contact?.name || '';
        //       //todo
        //       return '';
        //     } else if (typeof r === 'object' && r?.name) {
        //       return r?.name;
        //     }
        //     return null;
        //   })
        //   .filter(Boolean)
        //   .join(', ');
        // return `${recipientNames ? ` (To: ${recipientNames})` : ''}`;
        return '(To: ' + (!!item?.recipientName ? item?.recipientName : 'N/A') + ')';
      }
      default:
        return '';
    }
  };

  const getTags = () => {
    if (type === 'NOTES' && (item as NoteDetails)?.noteTags) {
      return (item as NoteDetails).noteTags?.map(i => i.name);
    }
    if (type === 'TASK' && item?.priority) {
      return [`Priority: ${item.priority}`];
    }
    return [];
  };

  const getIcon = () => {
    switch (type) {
      case 'NOTES':
        return <IconMessage size={18} />;
      case 'APPOINTMENT':
        return <IconCalendar size={18} />;
      case 'TASK':
        return <IconListCheck size={18} />;
      case 'SMS':
        return <IconDeviceMobileMessage size={18} />;
      default:
        return <IconMessage size={18} />;
    }
  };
  const getStatusOptions = () => {
    const currentStatus = item?.status || 'Yet to Start';
    if (currentStatus === 'Yet to Start') {
      return [
        <Menu.Item key="Yet to Start">Yet to Start</Menu.Item>,
        <Menu.Item key="In Progress">In Progress</Menu.Item>,
        <Menu.Item key="Completed">Completed</Menu.Item>,
      ];
    } else if (currentStatus === 'In Progress') {
      return [
        <Menu.Item key="In Progress">In Progress</Menu.Item>,
        <Menu.Item key="Completed">Completed</Menu.Item>,
      ];
    } else {
      return [
        <Menu.Item key="Completed">Completed</Menu.Item>,
      ];
    }
  };

  const statusMenu = (
    <Menu onClick={({ key }) => handleStatusChange(key)}>
      {getStatusOptions()}
    </Menu>
  );

  const handleStatusChange = async (newStatus: string) => {
    setTaskStatus(newStatus);
    // Create FormData to update task status
    const formData = new FormData();
    formData.append('status', newStatus);
    try {
      if (item?.taskId) {
        // Call update task API
        await dispatch(updateTask({
          data: formData,
          id: item.taskId
        })).unwrap();

        // Update local state through onSave callback
        // if (onSave) {
        //   onSave({
        //     ...item,
        //     status: newStatus,
        //   });
        // }
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      // You could show an error message here
    }
  };

  const renderCanceledText = (text: string) => {
    return item?.isDeleted ? <del>{text}</del> : text;
  };

  const renderButtons = () => {
    if ((type === 'APPOINTMENT' || type === 'TASK') && item?.isDeleted) {
      return (
        <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-md">Canceled</span>
      );
    }
    
    // Check if task is completed
    const isTaskCompleted = type === 'TASK' && item?.status === 'Completed';
    const showDropdown = type === 'TASK' && (item.status === 'Yet to Start' || item.status === 'In Progress');
    
    return (
      <>
        {showDropdown && (
          <Dropdown overlay={statusMenu} trigger={['click']}>
            <a className="flex items-center gap-1">
              <div>{item?.status}</div> <IconCaretDown size={16} />
            </a>
          </Dropdown>
        )}
        {type === 'TASK' && !showDropdown && (
          <div className="flex items-center gap-1">
            <div>{item?.status}</div>
          </div>
        )}
        {onEdit && type !== 'SMS' && !isTaskCompleted && (
          <button onClick={() => onEdit(item)}>
            <IconEdit size={18} />
          </button>
        )}
        {(type === 'APPOINTMENT' || type === 'TASK') && !isTaskCompleted && (
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
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="flex flex-wrap gap-2">
              {getTags()
                .slice(0, 5)
                .map((tag, idx) => (
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

            <div className="flex items-center justify-between gap-3">
              <h3 className="font-medium text-font-color text-base sm:text-lg">{getTitle()}</h3>
            </div>

            <>
              {children ?? <p className="text-sm text-font-color-100 mb-3">{getDescription()}</p>}
              {type === 'NOTES' && item && (
                <div className="text-xs text-font-color-100 space-y-1 mt-2">
                  {(item as NoteDetails)?.sendToCustomer && (
                    <p>
                      <strong>Send to Customer:</strong> Yes
                    </p>
                  )}
                  {(item as NoteDetails)?.createFollowUpTask && (
                    <p>
                      <strong>Create Follow-up:</strong> Yes{' '}
                      {/* {formatApiDate((item?.notes?.[0] as NoteDetails)?.task?.dueDate) &&
                    `(Due: ${(item?.notes?.[0] as NoteDetails)?.task?.dueDate})`} */}
                    </p>
                  )}
                  {typeof (item as NoteDetails)?.attachFile === 'string' && (
                    <p className="p-0">
                      <strong>Attachments:</strong>{' '}
                      <Button
                        type="link"
                        href={String((item as NoteDetails)?.attachFile)}
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
              {type === 'APPOINTMENT' && item && (
                <div className="text-xs text-font-color-100 space-y-1 mt-2">
                  <div className="flex gap-4">

                    <p>
                      <strong>Date:</strong>{' '}
                      {renderCanceledText(item.date ? dayjs(item.date).format('YYYY-MM-DD') : '-')}
                    </p>
                    <p>
                      <strong>Time:</strong> {renderCanceledText(item?.startTime + '-' + item?.endTime)}
                    </p>
                  </div>
                  {/* <p>
                <strong>Location:</strong> {item?.location?.name || '-'}
              </p> */}
                  <div className="flex gap-4">


                    <p>
                      <strong>User:</strong>{' '}
                      {(() => {
                        const selectedIds = item?.selectUsers || [];
                        const userNames = Array.isArray(selectedIds)
                          ? selectedIds
                            .map(id => {
                              const found = users.find(u => u.usersId === id.id);
                              return found?.name;
                            })
                            .filter(Boolean)
                            .join(', ')
                          : '-';
                        return userNames || '-';
                      })()}
                    </p>
                    <p>
                      <strong>Send to Assignee:</strong> {item?.sendAppointmentCustomer ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              )}
              {type === 'TASK' && item && (
                <div className="text-xs text-font-color-100 space-y-1 mt-2">
                  <div className="flex gap-4">
                    <p>
                      <strong>Due Date:</strong>{' '}
                      {renderCanceledText(item.dueDate ? dayjs(item.dueDate).format('YYYY-MM-DD') : '-')}
                    </p>
                    <p>
                      <strong>Time:</strong> {renderCanceledText(item?.dueTime || '-')}
                    </p>
                  </div>
                  <div className="flex gap-4">

                    <p>
                      <strong>Priority:</strong> {item?.priority || '-'}
                    </p>
                    <p>
                      <strong>Assignee:</strong>{' '}
                      {(() => {
                        const assigneeId = item?.assigneeId;
                        if (!assigneeId) return '-';
                        const assigneeUser = users.find(u => u.usersId === assigneeId);
                        return assigneeUser?.name || '-';
                      })()}
                    </p>
                  </div>
                  {item?.attachFiles && (
                    <p>
                      <strong>Attachments:</strong>{' '}
                      <Button
                        type="link"
                        href={String(item?.attachFiles)}
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

              {item?.reply && (
                <div className="mt-2 p-2 bg-gray-50 border-l-4 border-primary rounded text-sm flex flex-col ml-3">
                  <div className="w-full flex justify-between items-center mb-1">
                    <div className="mr-[1%] flex-grow">
                      {editingIndex === 0 ? (
                        <Input
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          size="small"
                          className="h-9"
                        />
                      ) : (
                        item.reply
                      )}
                    </div>
                    <div>
                      {editingIndex === 0 ? (
                        <Button type="link" onClick={handleSaveReply} className="p-0 !text-primary">
                          Save
                        </Button>
                      ) : (
                        <Button
                          type="link"
                          onClick={() => {
                            setEditingIndex(0);
                            setReplyText(item.reply);
                          }}
                          className="p-0"
                        >
                          <IconPencil size={18} className="text-primary" />
                        </Button>
                      )}
                    </div>
                  </div>
                  {(item?.createdAt || item?.createdAt) && item?.createdBy?.name && (
                    <p className="text-xs text-font-color-100">
                      {item?.createdBy?.name} created {timeAgo(item?.createdAt || item?.createdAt)}
                    </p>
                  )}
                </div>
              )}
            </>

            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              {item?.createdAt && item?.createdBy && (
                <p className="text-xs text-font-color-100">
                  {item?.createdBy} created {timeAgo(item?.createdAt || item?.createdAt)}
                </p>
              )}

              <div className="flex gap-3">
                {/* {type === 'TASK' && !isCanceled && (
              <Dropdown overlay={statusMenu} trigger={['click']}>
                <a className="flex items-center gap-1">
                  <div>{taskStatus}</div> <IconCaretDown size={16} />
                </a>
              </Dropdown>
            )} */}
                {renderButtons()}
              </div>
            </div>

            {type === 'NOTES' && item?.notesId && (
              <div className={`mt-2 ${!item?.reply ? 'border-t' : ''} pt-2`}>
                {!showReply && !item?.reply && (
                  <Button
                    type="primary"
                    icon={<IconArrowBackUp size={16} />}
                    onClick={() => {
                      setShowReply(true);
                      setReplyText('');
                      setSendToCustomer(false);
                      setAttachedFiles([]);
                    }}
                    size="small"
                  >
                    Reply
                  </Button>
                )}
                {showReply && (
                  <div className="flex flex-col gap-2">
                    <TextArea
                      value={replyText}
                      // onChange={e => setReplyText(e.target.value)}
                      onChange={e => {
                        const value = e.target.value;
                        // Apply optionalDescriptionRules validation
                        if (value.startsWith(' ') || value.endsWith(' ')) {
                          setReplyError('Description cannot start or end with spaces');
                        } else {
                          setReplyError('');
                        }
                        if (value.length < 5) {
                          setReplyError('Description must be at least 5 characters');
                        }

                        if (value.length > 500) {
                          setReplyError('Description must be at most 500 characters');
                        }
                        setReplyText(value);
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        // Validate on blur
                        if (value.startsWith(' ') || value.endsWith(' ')) {
                          // Trim spaces on blur
                          setReplyText(value.trim());
                          setReplyError('');
                        }
                      }}
                      rows={2}
                      placeholder="Type your reply..."
                      className={`h-9 ${replyError ? 'border-red-500' : ''}`}
                    />
                    {replyError && (
                      <div className="text-red-500 text-xs mt-1">
                        {replyError}
                      </div>
                    )}
                    <div className="flex gap-2 justify-between items-center">
                      <div>
                        {/* <Upload
                      beforeUpload={() => false}
                      maxCount={1}
                      accept=".jpg,.jpeg,.png,.gif,.webp"
                      listType="picture"
                      onChange={handleFileChange}
                      fileList={attachedFiles}
                    >
                      <Button icon={<IconUpload />}>Attach Files</Button>
                    </Upload> */}
                      </div>
                      <div className="flex gap-2 justify-end items-center">
                        Send this reply to customer
                        <Switch
                          checked={sendToCustomer}
                          onChange={checked => setSendToCustomer(checked)}
                        />
                        <Button onClick={handleCancelReply}>Cancel</Button>
                        <Button type="primary" onClick={handleSaveReply}>
                          {sendToCustomer ? 'Send' : 'Save'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            {type && (
              <span
                className={`px-2 py-1 text-xs rounded-md ${{
                  NOTES: 'bg-gray-300 text-blue-700',
                  TASK: 'bg-green-100 text-green-700',
                  SMS: 'bg-yellow-100 text-yellow-700',
                  APPOINTMENT: 'bg-red-100 text-red-700',
                }[type] || 'bg-gray-100 text-gray-700'}`}
              >
                {type}
              </span>
            )}
            {item?.createdBy?.name && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                <p>{item?.createdBy?.name?.charAt(0)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;
