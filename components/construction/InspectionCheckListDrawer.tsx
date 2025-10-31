import { IconPlus, IconUpload } from '@tabler/icons-react';
import { Button, Drawer, Radio, Space, Tag, Tooltip } from 'antd';
import React, { useState } from 'react';

const rows = [
  { id: 1, title: 'Question 1' },
  { id: 2, title: 'Question 2' },
  { id: 3, title: 'Question 3' },
];

const InspectionCheckListDrawer = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleRadioChange = (id: number, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  return (
    <Drawer
      title="Inspection Check List"
      placement="right"
      size="large"
      onClose={onClose}
      open={open}
      closeIcon={false}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={onClose}>
            OK
          </Button>
        </Space>
      }
    >
      <div className="w-full rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[1fr_auto_auto] bg-gray-100 font-semibold text-gray-700">
          <div className="p-3">Title</div>
          <div className="p-3"></div>
          <div className="p-3">Actions</div>
        </div>

        {/* Body */}
        {rows.map(row => (
          <div
            key={row.id}
            className="grid grid-cols-[1fr_auto_auto] border-b items-center text-gray-800"
          >
            {/* Title */}
            <div className="p-3 border-gray-200">
              <div className="flex flex-col gap-2">
                <div>
                  {row.title}
                  <div>
                    <Tag color="orange">Defect Created</Tag>
                  </div>
                </div>
                <div>
                  <Button type="link" size="small" icon={<IconPlus size={16} />}>
                    Notes
                  </Button>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="p-3">
              <Radio.Group
                value={answers[row.id]}
                onChange={e => handleRadioChange(row.id, e.target.value)}
              >
                <Radio value="yes">Yes</Radio>
                <Radio value="no">No</Radio>
                <Radio value="na">N/A</Radio>
              </Radio.Group>
            </div>

            {/* Actions */}
            <div className="p-3">
              <Space>
                {/* tool tip named Create Defect */}
                <Tooltip title="Create Defect">
                  <Button type="text" size="small" icon={<IconPlus size={20} />} />
                </Tooltip>
                <Button type="text" size="small" icon={<IconUpload size={20} />} />
              </Space>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
};

export default InspectionCheckListDrawer;
