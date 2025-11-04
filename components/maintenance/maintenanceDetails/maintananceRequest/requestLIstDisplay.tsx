import React, { useState } from 'react';
import { Button, Select, Dropdown, MenuProps, Input, Checkbox } from 'antd';
import {
  IconDotsVertical,
  IconPlus,
  IconUpload,
  IconPencil,
  IconTrash,
  IconCheck,
  IconX,
} from '@tabler/icons-react';
import { RequestItem } from '@redux/feature/maintenance/IMaintenanceState';

const { Option } = Select;
const { TextArea } = Input;

const NotesSection = ({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) => {
  const [noteValue, setNoteValue] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (noteValue.trim()) {
      setSaved(true);
    }
  };

  const handleCancel = () => {
    setNoteValue('');
    setSaved(false);
    onToggle();
  };

  return !isOpen ? (
    <div
      className="flex items-center gap-2 cursor-pointer text-blue-600 hover:text-blue-700 w-fit"
      onClick={onToggle}
    >
      <IconPlus size={18} className="text-primary" />
      <span className="text-sm font-medium text-primary">Notes</span>
    </div>
  ) : (
    <div className="flex flex-col mt-2 gap-2">
      <div className="flex items-start w-full gap-2">
        <TextArea
          rows={1}
          value={noteValue}
          onChange={e => setNoteValue(e.target.value)}
          placeholder="Enter notes here..."
          className="w-full text-sm border-gray-300"
          disabled={saved}
        />
        <div className="flex justify-end gap-2 mt-1">
          {!saved ? (
            <>
              <Button onClick={handleSave}>
                <IconCheck size={16} />
              </Button>
              <Button onClick={handleCancel}>
                <IconX size={16} />
              </Button>
            </>
          ) : (
            <button
              onClick={() => {
                setSaved(false);
                setNoteValue('');
                onToggle();
              }}
              className="hover:text-red-700"
            >
              <IconTrash size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface RequestListDisplayProps {
  data: RequestItem[];
  setData: React.Dispatch<React.SetStateAction<RequestItem[]>>;
}

const RequestListDisplay: React.FC<RequestListDisplayProps> = ({ data, setData }) => {
  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [openDescriptionNotes, setOpenDescriptionNotes] = useState<
    Record<string, Record<number, boolean>>
  >({});

  const handleStatusChange = (newStatus: string, requestId: string) => {
    setData(prev => prev.map(req => (req.id === requestId ? { ...req, status: newStatus } : req)));
  };

  const handleToggleNotes = (requestId: string) => {
    setOpenNotes(prev => ({
      ...prev,
      [requestId]: !prev[requestId],
    }));
  };

  const handleToggleDescriptionNotes = (requestId: string, descIndex: number) => {
    setOpenDescriptionNotes(prev => ({
      ...prev,
      [requestId]: {
        ...prev[requestId],
        [descIndex]: !prev[requestId]?.[descIndex],
      },
    }));
  };

  const handleDeleteRequest = (requestId: string) => {
    setData(prev => prev.filter(req => req.id !== requestId));
  };

  const handleDeleteDescription = (requestId: string, descIndex: number) => {
    setData(prev =>
      prev.map(req => {
        if (req.id !== requestId) return req;
        return {
          ...req,
          descriptions: req.descriptions.filter((_, i) => i !== descIndex),
        };
      })
    );
  };

  const getTaskMenuItems = (requestId: string, descIndex: number): MenuProps['items'] => [
    {
      key: '1',
      label: 'Cancel Task',
      onClick: () => handleDeleteDescription(requestId, descIndex),
    },
  ];

  const getMainRequestMenuItems = (requestId: string): MenuProps['items'] => [
    { key: '1', label: 'Edit' },
    {
      key: '2',
      label: 'Delete Request',
      onClick: () => handleDeleteRequest(requestId),
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-md border shadow-sm p-4 text-center text-gray-500 font-medium">
        No Data
      </div>
    );
  }

  return (
    <div className="bg-card-color shadow-sm">
      {data.map(item => (
        <div
          key={item.id}
          className="relative border-l-4 border-primary p-4 mb-2 last:mb-0 hover:bg-body-color transition-all"
        >
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                {item.reference}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Select
                value={item.status}
                onChange={val => handleStatusChange(val, item.id)}
                bordered={false}
                className="text-sm font-medium w-24 text-gray-700"
              >
                <Option value="Pending">Pending</Option>
                <Option value="On Hold">On Hold</Option>
                <Option value="Completed">Completed</Option>
              </Select>
              <span className="text-blue-600 font-semibold text-sm">{item.amount}</span>
              <Dropdown menu={{ items: getMainRequestMenuItems(item.id) }} trigger={['click']}>
                <Button
                  type="text"
                  icon={<IconDotsVertical size={18} />}
                  className="text-gray-600 hover:text-gray-800"
                />
              </Dropdown>
              <div className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-sm">
                K
              </div>
            </div>
          </div>

          <div className="mt-4">
            <NotesSection isOpen={openNotes[item.id]} onToggle={() => handleToggleNotes(item.id)} />
          </div>

          {/* Description list */}
          {item.descriptions.map((desc, index) => (
            <div key={index} className="mt-5 ml-8">
              <div className="grid grid-cols-[30px_1fr_1fr_60px] items-center text-sm mb-5">
                <span className="font-medium text-gray-700">{index + 1}.</span>
                <div className="flex items-center gap-2 text-gray-800">
                  <span>{desc.title}</span>
                  <Button
                    type="text"
                    icon={<IconPencil size={17} />}
                    className="text-gray-500 hover:text-blue-600"
                  />
                </div>
                <Checkbox className="justify-self-center" />
                <div className="flex gap-2 justify-self-end text-gray-500">
                  <IconUpload size={18} className="cursor-pointer hover:text-blue-600" />
                  <Dropdown menu={{ items: getTaskMenuItems(item.id, index) }} trigger={['click']}>
                    <Button
                      type="text"
                      icon={<IconDotsVertical size={18} />}
                      className="text-gray-600 hover:text-gray-800"
                    />
                  </Dropdown>
                </div>
              </div>

              <NotesSection
                isOpen={openDescriptionNotes[item.id]?.[index]}
                onToggle={() => handleToggleDescriptionNotes(item.id, index)}
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RequestListDisplay;
