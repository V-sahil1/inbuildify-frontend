import React from 'react';
import { Button, Select, Dropdown, MenuProps, Input, Checkbox } from 'antd';
import { IconDotsVertical, IconPlus, IconUpload, IconPencil, IconTrash } from '@tabler/icons-react';
import { RequestItem } from '@redux/feature/maintenance/IMaintenanceState';
const { Option } = Select;
const { TextArea } = Input;

interface RequestListDisplayProps {
  filteredData: RequestItem[];
  handleStatusChange: (newStatus: string, requestId: string) => void;
  openNotes: Record<string, boolean>;
  handleToggleNotes: (requestId: string) => void;
  openDescriptionNotes: Record<string, Record<number, boolean>>;
  handleToggleDescriptionNotes: (requestId: string, descIndex: number) => void;
  handleDeleteDescription: (requestId: string, descIndex: number) => void;
  handleDeleteRequest: (requestId: string) => void;
}

const RequestListDisplay: React.FC<RequestListDisplayProps> = ({
  filteredData,
  handleStatusChange,
  openNotes,
  handleToggleNotes,
  openDescriptionNotes,
  handleToggleDescriptionNotes,
  handleDeleteDescription,
  handleDeleteRequest,
}) => {
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

  // Show No Data if array is empty
  if (!filteredData || filteredData.length === 0) {
    return (
      <div className="bg-white rounded-md border shadow-sm p-4 text-center text-gray-500 font-medium">
        No Data
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md border shadow-sm">
      {filteredData.map(item => (
        <div key={item.id} className="border-b last:border-b-0 p-3 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <span className="bg-cyan-400 text-white text-xs font-semibold px-2 py-1 rounded w-fit">
              {item.reference}
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={item.status}
                onChange={val => handleStatusChange(val, item.id)}
                bordered={false}
                className="w-24 text-sm"
              >
                <Option value="Pending">Pending</Option>
                <Option value="On Hold">On Hold</Option>
                <Option value="Completed">Completed</Option>
              </Select>
              <span className="text-blue-600 font-semibold">{item.amount}</span>
              {/* Main Request Dropdown */}
              <Dropdown menu={{ items: getMainRequestMenuItems(item.id) }} trigger={['click']}>
                <Button type="text" icon={<IconDotsVertical size={18} />} />
              </Dropdown>
              <div className="rounded-full h-8 w-8 bg-gray-200 flex items-center justify-center text-gray-600 font-medium ml-2">
                K
              </div>
            </div>
          </div>

          {/* Main Request Note Section */}
          <div className="flex flex-col gap-2 mt-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              {!openNotes[item.id] ? (
                <div
                  className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-blue-600"
                  onClick={() => handleToggleNotes(item.id)}
                >
                  <IconPlus size={20} />
                  <span>Add Notes</span>
                </div>
              ) : (
                <div className="flex flex-col gap-2 w-full">
                  <div className="flex">
                    <TextArea rows={2} placeholder="Enter notes here..." />
                    <div className="flex">
                      <Button
                        type="text"
                        icon={<IconTrash size={20} />}
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleToggleNotes(item.id)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description/Task List */}
          {item.descriptions.map((desc, index) => (
            <div key={index} className="ml-11">
              <div className="grid grid-cols-[30px_1fr_1fr_50px] items-center text-sm mb-7">
                <span className="font-semibold text-left">{index + 1}.</span>
                <span className="flex items-center text-left">
                  {desc.title && <span className="mr-1">{desc.title}</span>}
                  <Button type="text" icon={<IconPencil size={17} />} />
                </span>
                <Checkbox className="justify-self-center" />
                <div className="flex gap-2 justify-self-end">
                  <IconUpload size={20} />
                  {/* Task Dropdown */}
                  <Dropdown menu={{ items: getTaskMenuItems(item.id, index) }} trigger={['click']}>
                    <Button type="text" icon={<IconDotsVertical size={18} />} />
                  </Dropdown>
                </div>
              </div>

              {/* Individual Description Notes Section */}
              <div className="flex gap-2 text-sm mb-4">
                {!openDescriptionNotes[item.id]?.[index] ? (
                  <div
                    className="flex gap-2 cursor-pointer text-gray-600 hover:text-blue-600"
                    onClick={() => handleToggleDescriptionNotes(item.id, index)}
                  >
                    <IconPlus size={20} />
                    <span>Notes</span>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full">
                    <TextArea rows={1} placeholder="Enter notes here..." />
                    <div className="flex">
                      <Button
                        type="text"
                        icon={<IconTrash size={20} />}
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleToggleDescriptionNotes(item.id, index)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default RequestListDisplay;
