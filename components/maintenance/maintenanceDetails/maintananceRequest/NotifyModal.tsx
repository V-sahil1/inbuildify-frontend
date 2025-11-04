'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { Modal, Button, Radio, Checkbox, Tag } from 'antd';
import TimelineActionsBar, {
  FilterOption,
} from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { RequestItem } from '@redux/feature/maintenance/IMaintenanceState';

interface NotifyModalProps {
  open: boolean;
  onCancel: () => void;
  onSave: (selected: string[], notifyType: 'Start' | 'Completed') => void;
  data: RequestItem[];
}

const NotifyModal: React.FC<NotifyModalProps> = ({ open, onCancel, onSave, data }) => {
  const [notifyType, setNotifyType] = useState<'Start' | 'Completed'>('Start');
  const [taskStatus, setTaskStatus] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);

  const tabs: FilterOption[] = [
    { type: 'Start', label: 'Start' },
    { type: 'Completed', label: 'Completed' },
  ];

  const displayedData = useMemo(() => {
    let filtered = [...data];

    if (notifyType === 'Completed') {
      filtered = filtered.filter(item => item.status === 'Completed');
    }

    if (taskStatus !== 'All') {
      filtered = filtered.filter(item => item.status === taskStatus);
    }

    return filtered;
  }, [data, notifyType, taskStatus]);

  const allKeys = useMemo(() => {
    const keys: string[] = [];
    displayedData.forEach(item => {
      keys.push(item.reference);
      item.descriptions?.forEach(desc => keys.push(`${item.reference}-${desc.title}`));
    });
    return keys;
  }, [displayedData]);

  const handleSelectAll = (checked: boolean) => {
    setSelectedRequests(checked ? allKeys : []);
  };

  const handleSelectItem = (key: string, checked: boolean) => {
    setSelectedRequests(prev => (checked ? [...prev, key] : prev.filter(r => r !== key)));
  };

  const isReferenceChecked = (item: RequestItem) => {
    const descKeys = item.descriptions?.map(d => `${item.reference}-${d.title}`) || [];
    return descKeys.every(key => selectedRequests.includes(key));
  };

  const isReferenceIndeterminate = (item: RequestItem) => {
    const descKeys = item.descriptions?.map(d => `${item.reference}-${d.title}`) || [];
    return descKeys.some(key => selectedRequests.includes(key)) && !isReferenceChecked(item);
  };

  const handleReferenceToggle = (item: RequestItem, checked: boolean) => {
    const descKeys = item.descriptions?.map(d => `${item.reference}-${d.title}`) || [];
    const allKeys = [item.reference, ...descKeys];

    setSelectedRequests(prev =>
      checked ? Array.from(new Set([...prev, ...allKeys])) : prev.filter(r => !allKeys.includes(r))
    );
  };

  const isAllChecked = selectedRequests.length === allKeys.length && allKeys.length > 0;
  const isIndeterminate = selectedRequests.length > 0 && selectedRequests.length < allKeys.length;

  const handleTabChange = (tab: string) => {
    setNotifyType(tab as 'Start' | 'Completed');
    if (tab === 'Completed') {
      setTaskStatus('Completed');
    } else {
      setTaskStatus('All');
    }
  };

  return (
    <Modal
      title="Notify"
      open={open}
      onCancel={onCancel}
      centered
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={() => onSave(selectedRequests, notifyType)}>
          Save & Next
        </Button>,
      ]}
    >
      <div className="mb-4">
        <TimelineActionsBar
          tabs={tabs}
          activeTab={notifyType}
          onTabChange={handleTabChange}
          isActionShow={false}
        />
      </div>

      <div className="flex gap-4 mb-4 items-center">
        <span className="font-semibold">Task status:</span>
        <Radio.Group onChange={e => setTaskStatus(e.target.value)} value={taskStatus}>
          <Radio value="All">All</Radio>
          <Radio value="Pending">Pending</Radio>
          <Radio value="Completed">Completed</Radio>
        </Radio.Group>
      </div>

      <div className="pt-3">
        <Checkbox
          checked={isAllChecked}
          indeterminate={isIndeterminate}
          onChange={e => handleSelectAll(e.target.checked)}
        >
          Select All
        </Checkbox>

        <div className="mt-3 max-h-64 overflow-y-auto">
          {displayedData.map(item => (
            <div key={item.reference} className="flex justify-between items-start pb-3">
              <div className="flex flex-col">
                <Checkbox
                  checked={isReferenceChecked(item)}
                  indeterminate={isReferenceIndeterminate(item)}
                  onChange={e => handleReferenceToggle(item, e.target.checked)}
                >
                  <span className="font-medium text-gray-800">{item.reference}</span>
                </Checkbox>

                {item.descriptions && item.descriptions.length > 0 ? (
                  <ul className="ml-6 mt-1 text-gray-600 text-sm">
                    {item.descriptions.map((desc, idx) => {
                      const descKey = `${item.reference}-${desc.title}`;
                      return (
                        <li key={idx}>
                          <Checkbox
                            checked={selectedRequests.includes(descKey)}
                            onChange={e => handleSelectItem(descKey, e.target.checked)}
                          >
                            {desc.title}
                          </Checkbox>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="ml-6 text-gray-400 text-xs italic">No tasks listed</div>
                )}
              </div>

              <Tag
                color={
                  item.status === 'Pending'
                    ? 'orange'
                    : item.status === 'Completed'
                      ? 'green'
                      : 'blue'
                }
              >
                {item.status}
              </Tag>
            </div>
          ))}

          {displayedData.length === 0 && (
            <div className="text-gray-400 text-sm text-center py-4">No Task found.</div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default NotifyModal;
