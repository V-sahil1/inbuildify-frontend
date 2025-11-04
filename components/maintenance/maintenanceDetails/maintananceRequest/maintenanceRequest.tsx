'use client';
import React, { useState, useMemo } from 'react';
import { Button, Input, Select, Popover, Radio } from 'antd';
import { IconBell, IconPlus, IconSend, IconTrash, IconPaperclip } from '@tabler/icons-react';
import RequestListDisplay from './requestLIstDisplay';
import NotifyModal from './NotifyModal';
import { maintenanceRequestData } from 'data/sampleData';
import MailSendModal from '@/components/common/Models/MailSendModal';
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
  const [isReminderPopoverVisible, setIsReminderPopoverVisible] = useState(false);
  const [reminderOption, setReminderOption] = useState('Pending');
  const hasPendingRequests = useMemo(() => data.some(item => item.status === 'Pending'), [data]);

  const [notifyModalVisible, setNotifyModalVisible] = useState(false);
  const [notifyType, setNotifyType] = useState<'Start' | 'Completed'>('Start');
  const [taskStatus, setTaskStatus] = useState<'All' | 'Pending' | 'Completed'>('Pending');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [mailModalVisible, setMailModalVisible] = useState(false);

  const [filters, setFilters] = useState({
    reference: '',
    supplier: '',
    start: '',
    finish: '',
    complete: '',
    status: '',
  });

  const filteredData = useMemo(
    () =>
      data.filter(
        item =>
          (!filters.reference ||
            item.reference.toLowerCase().includes(filters.reference.toLowerCase())) &&
          (!filters.supplier ||
            item.supplier.toLowerCase().includes(filters.supplier.toLowerCase())) &&
          (!filters.status || item.status === filters.status) &&
          (!filters.start || item.start === filters.start) &&
          (!filters.finish || item.finish === filters.finish) &&
          (!filters.complete || item.complete === filters.complete)
      ),
    [data, filters]
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
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleAddDescriptionRow = () => {
    setNewRequestDescriptions(prev => [...prev, '']);
  };

  const handleDescriptionChange = (index: number, value: string) => {
    setNewRequestDescriptions(prev => prev.map((desc, i) => (i === index ? value : desc)));
  };

  const handleRemoveDescriptionRow = (index: number) => {
    setNewRequestDescriptions(prev => prev.filter((_, i) => i !== index));
  };

  const handleFilterChange = (field: string, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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

  const handleSaveNext = () => {
    console.log('Notify:', notifyType, taskStatus, selectedRequests);
    setNotifyModalVisible(false);
    setMailModalVisible(true);
  };

  return (
    <div className="p-6 bg-card-color min-h-screen">
      {/* Top Action Buttons */}
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
          <Button icon={<IconSend size={16} />} onClick={() => setNotifyModalVisible(true)}>
            Notify
          </Button>
        </div>
      </div>

      {/* 🔍 Filter Bar */}
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

      {/* 📝 New Request Form */}
      {isFormVisible && (
        <div className="bg-white rounded-md border shadow-sm mb-4">
          <div className="flex justify-between items-center py-2 px-4 bg-gray-100 rounded-t-md">
            <h2 className="text-xl font-semibold">
              <span className="bg-primary text-white text-xs font-semibold px-2 py-1 rounded">
                MYH00664-MR (New)
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
            {newRequestDescriptions.map((desc, index) => (
              <div key={index} className="flex items-start text-sm gap-4 mb-2 pt-2">
                <span className="font-semibold w-[50px] pt-1">{index + 1}.</span>
                <div className="flex-1 flex flex-col">
                  <Input.TextArea
                    rows={2}
                    value={desc}
                    onChange={e => handleDescriptionChange(index, e.target.value)}
                  />
                </div>
                <IconPaperclip size={17} className="cursor-pointer text-blue-500" />
                <IconTrash
                  size={17}
                  className="cursor-pointer text-red-500"
                  onClick={() => handleRemoveDescriptionRow(index)}
                />
              </div>
            ))}
            <div
              className="text-blue-600 cursor-pointer mt-2 flex items-center gap-1"
              onClick={handleAddDescriptionRow}
            >
              <IconPlus size={16} /> Task
            </div>
          </div>
        </div>
      )}

      <RequestListDisplay data={filteredData} setData={setData} />

      <NotifyModal
        open={notifyModalVisible}
        onCancel={() => setNotifyModalVisible(false)}
        onSave={handleSaveNext}
        data={filteredData}
      />

      <MailSendModal
        open={mailModalVisible}
        onCancel={() => setMailModalVisible(false)}
        onSend={data => {
          console.log('Mail data:', data);
          setMailModalVisible(false);
        }}
      />
    </div>
  );
};

export default RequestList;
