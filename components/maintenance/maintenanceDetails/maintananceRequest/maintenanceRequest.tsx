'use client';
import React, { useState, useMemo } from 'react';
import { Button, Input, Select, Popover, Radio } from 'antd';
import { IconBell, IconPlus, IconSend, IconTrash, IconPaperclip } from '@tabler/icons-react';
import RequestListDisplay from './requestLIstDisplay';
import { maintenanceRequestData } from 'data/sampleData';
const { Option } = Select;

interface DescriptionNote {
  title: string;
}

interface RequestItem {
  id: string;
  reference: string;
  descriptions: DescriptionNote[];
  supplier: string;
  start: string;
  finish: string;
  complete: string;
  status: string;
  amount: string;
}

const RequestList: React.FC = () => {
  const [data, setData] = useState<RequestItem[]>(maintenanceRequestData);

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [newRequestDescriptions, setNewRequestDescriptions] = useState<string[]>(['']);

  const [openNotes, setOpenNotes] = useState<Record<string, boolean>>({});
  const [openDescriptionNotes, setOpenDescriptionNotes] = useState<
    Record<string, Record<number, boolean>>
  >({});

  const [isReminderPopoverVisible, setIsReminderPopoverVisible] = useState(false);
  const [reminderOption, setReminderOption] = useState('Pending');
  const hasPendingRequests = useMemo(() => data.some(item => item.status === 'Pending'), [data]);

  const [filters, setFilters] = useState({
    reference: '',
    supplier: '',
    start: '',
    finish: '',
    complete: '',
    status: '',
  });

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

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const filteredData = data.filter(
    item =>
      (!filters.reference ||
        item.reference.toLowerCase().includes(filters.reference.toLowerCase())) &&
      (!filters.supplier || item.supplier.toLowerCase().includes(filters.supplier.toLowerCase())) &&
      (!filters.status || item.status === filters.status) &&
      (!filters.start || item.start === filters.start) &&
      (!filters.finish || item.finish === filters.finish) &&
      (!filters.complete || item.complete === filters.complete)
  );

  const handleNewRequest = () => {
    setIsFormVisible(true);
    setNewRequestDescriptions(['']);
  };

  const handleSave = () => {
    const newId = (data.length + 1).toString();
    const newRequestItem: RequestItem = {
      id: newId,
      reference: `MYH00664-MR${newId}`,
      descriptions: newRequestDescriptions
        .filter(desc => desc.trim() !== '')
        .map(desc => ({ title: desc })),
      supplier: '',
      start: '',
      finish: '',
      complete: '',
      status: 'Pending',
      amount: '$0.00',
    };

    setData(prev => [...prev, newRequestItem]);
    setIsFormVisible(false);
    setNewRequestDescriptions(['']);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setNewRequestDescriptions(['']);
  };

  const handleAddDescriptionRow = () => {
    setNewRequestDescriptions(prev => [...prev, '']);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setNewRequestDescriptions(prev => prev.map((desc, i) => (i === index ? value : desc)));
  };

  const handleRemoveDescriptionRow = (index: number) => {
    setNewRequestDescriptions(prev => prev.filter((_, i) => i !== index));
    if (newRequestDescriptions.length === 1) {
      setNewRequestDescriptions(['']);
    }
  };

  const handleReminderOk = () => {
    setIsReminderPopoverVisible(false);
  };

  const reminderContent = (
    <div className="flex flex-col">
      <div className="font-semibold mb-2">Are you sure you want to send reminders ?</div>
      <Radio.Group onChange={e => setReminderOption(e.target.value)} value={reminderOption}>
        <Radio value="All">All</Radio>
        <Radio value="Pending">Pending</Radio>
        <Radio value="Accepted">Accepted</Radio>
      </Radio.Group>
      {reminderOption === 'Pending' && !hasPendingRequests && (
        <span className="text-red-500 mt-2">There are no pending request for this job.</span>
      )}
      <div className="flex justify-end mt-4">
        <Button key="ok" type="primary" onClick={handleReminderOk}>
          Ok
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <Popover
            content={reminderContent}
            title={null}
            trigger="click"
            open={isReminderPopoverVisible}
            onOpenChange={setIsReminderPopoverVisible}
          >
            <Button icon={<IconBell size={16} />}>Booking Reminder</Button>
          </Popover>
          <Button type="primary" icon={<IconPlus size={16} />} onClick={handleNewRequest}>
            New Request
          </Button>
          <Button icon={<IconSend size={16} />}>Notify</Button>
        </div>
      </div>

      <div className="flex gap-2 bg-white rounded-md p-3 text-sm font-medium mb-4 items-end">
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Reference No</span>
          <Select
            placeholder="All"
            allowClear
            value={filters.reference || undefined}
            onChange={val => handleFilterChange('reference', val)}
          >
            {filteredData.map(d => (
              <Option key={d.reference} value={d.reference}>
                {d.reference}
              </Option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Supplier</span>
          <Input
            value={filters.supplier}
            onChange={e => handleFilterChange('supplier', e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Start</span>
          <Input
            value={filters.start}
            onChange={e => handleFilterChange('start', e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Finish</span>
          <Input
            value={filters.finish}
            onChange={e => handleFilterChange('finish', e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Complete</span>
          <Input
            value={filters.complete}
            onChange={e => handleFilterChange('complete', e.target.value)}
          />
        </div>
        <div className="flex flex-col flex-1">
          <span className="mb-1 text-gray-600 font-semibold text-xs">Status</span>
          <Select
            placeholder="All"
            allowClear
            value={filters.status || undefined}
            onChange={val => handleFilterChange('status', val)}
          >
            <Option value="Pending">Pending</Option>
            <Option value="On Hold">On Hold</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      </div>

      {/* NEW REQUEST FORM */}
      {isFormVisible && (
        <div className="bg-white rounded-md border shadow-sm mb-4">
          <div className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-t-md">
            <h2 className="text-xl font-semibold">
              <span className="bg-cyan-400 text-white text-xs font-semibold px-2 py-1 rounded w-fit">
                MYH00664-MRX (New)
              </span>
            </h2>
            <div className="flex gap-2">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
          <div className="p-4">
            {/* Form Header */}
            <div className="flex items-center font-bold text-gray-600 border-b pb-2 mb-2 text-sm">
              <div className="w-[50px] text-left">S.No</div>
              <div className="flex-1 text-left">Description</div>
              <div className="w-[100px] flex justify-end">Attachment</div>
              <div
                className="w-[80px] flex justify-end items-center text-blue-600 cursor-pointer"
                onClick={handleAddDescriptionRow}
              >
                <IconPlus size={16} className="mr-1" /> Task
              </div>
            </div>

            {newRequestDescriptions.map((description, index) => (
              <div
                key={index}
                className="flex items-start text-sm gap-4 mb-2 pt-2 border-b border-gray-100 last:border-b-0"
              >
                <span className="font-semibold text-left w-[50px] pt-1">{index + 1}.</span>
                <div className="flex-1 flex flex-col">
                  <Input.TextArea
                    rows={2}
                    placeholder=""
                    maxLength={500}
                    showCount
                    className="w-full"
                    value={description}
                    onChange={e => handleDescriptionChange(index, e.target.value)}
                  />
                </div>
                <div className="w-[100px] flex items-center justify-end gap-2 pt-1">
                  <IconPaperclip size={17} className="cursor-pointer text-blue-500" />
                </div>
                <div className="w-[80px] flex items-center justify-end gap-2 pt-1">
                  <IconTrash
                    size={17}
                    className="cursor-pointer text-red-500"
                    onClick={() => handleRemoveDescriptionRow(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <RequestListDisplay
        filteredData={filteredData}
        handleStatusChange={handleStatusChange}
        openNotes={openNotes}
        handleToggleNotes={handleToggleNotes}
        openDescriptionNotes={openDescriptionNotes}
        handleToggleDescriptionNotes={handleToggleDescriptionNotes}
        handleDeleteDescription={handleDeleteDescription}
        handleDeleteRequest={handleDeleteRequest}
      />
    </div>
  );
};

export default RequestList;
