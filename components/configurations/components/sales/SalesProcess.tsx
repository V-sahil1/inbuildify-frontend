'use client';

import React, { useState } from 'react';
import { Table, Input, Checkbox, Button, Select, Space, Tag, message, Popconfirm } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { salesProcessData, salesProcessProcessesData } from 'data/configuration/salesData';

const { Option } = Select;

interface Process {
  id: number;
  name: string;
  isDefault: boolean;
}

interface Stage {
  id: number;
  processId: number;
  name: string;
  functionality: string[];
  category: string;
  sort: number;
}

export const SalesProcess: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>(salesProcessProcessesData);

  const [stages, setStages] = useState<Stage[]>(salesProcessData);

  const [selectedProcessId, setSelectedProcessId] = useState<number | null>(1);
  const [editingProcessId, setEditingProcessId] = useState<number | null>(null);
  const [editingStageId, setEditingStageId] = useState<number | null>(null);
  const [newProcess, setNewProcess] = useState(false);
  const [newStage, setNewStage] = useState(false);

  // ---- Process Logic ----
  const handleAddProcess = () => {
    const tempId = -Date.now();
    setProcesses(prev => [...prev, { id: tempId, name: '', isDefault: false }]);
    setEditingProcessId(tempId);
    setNewProcess(true);
  };

  const handleSaveProcess = (record: Process) => {
    const trimmedName = record.name.trim();
    if (!trimmedName) return message.warning('Process name cannot be empty');

    setProcesses(prev => {
      let updated = [...prev];
      const exists = updated.find(p => p.id === record.id);

      // Apply default only at save time
      if (record.isDefault) {
        updated = updated.map(p => ({ ...p, isDefault: false }));
      }

      if (exists) {
        return updated.map(p =>
          p.id === record.id ? { ...p, name: trimmedName, isDefault: record.isDefault } : p
        );
      } else {
        return [...updated, { ...record, id: Date.now(), name: trimmedName }];
      }
    });

    setEditingProcessId(null);
    setNewProcess(false);
  };

  const handleDeleteProcess = (id: number) => {
    const process = processes.find(p => p.id === id);
    if (process?.isDefault) return message.warning('Default process cannot be deleted');

    setProcesses(prev => prev.filter(p => p.id !== id));
    setStages(prev => prev.filter(s => s.processId !== id));
    if (selectedProcessId === id) setSelectedProcessId(null);
  };

  const handleCancelProcess = () => {
    if (newProcess) {
      setProcesses(prev => prev.filter(p => p.name.trim() !== ''));
    }
    setEditingProcessId(null);
    setNewProcess(false);
  };

  // ---- Stage Logic ----
  const handleAddStage = () => {
    if (!selectedProcessId) return message.warning('Select a process first');
    const tempId = -Date.now();
    const nextSort =
      Math.max(0, ...stages.filter(s => s.processId === selectedProcessId).map(s => s.sort)) + 1;

    const newStageObj: Stage = {
      id: tempId,
      processId: selectedProcessId,
      name: '',
      functionality: [],
      category: '',
      sort: nextSort,
    };
    setStages(prev => [...prev, newStageObj]);
    setEditingStageId(tempId);
    setNewStage(true);
  };

  const handleSaveStage = (record: Stage) => {
    const trimmedName = record.name.trim();
    if (!trimmedName) return message.warning('Stage name cannot be empty');

    // validate unique sort per process
    const sameProcessStages = stages.filter(
      s => s.processId === record.processId && s.id !== record.id
    );
    if (record.sort < 1) return message.error('Sort value must be greater than 0');
    if (sameProcessStages.some(s => s.sort === record.sort)) {
      return message.error('Sort value must be unique within a process');
    }

    setStages(prev => {
      const exists = prev.find(s => s.id === record.id);
      if (exists) {
        return prev.map(s => (s.id === record.id ? { ...record } : s));
      } else {
        return [...prev, { ...record, id: Date.now() }];
      }
    });

    setEditingStageId(null);
    setNewStage(false);
  };

  const handleDeleteStage = (id: number) => {
    setStages(prev => prev.filter(s => s.id !== id));
  };

  const handleCancelStage = () => {
    if (newStage) {
      setStages(prev => prev.filter(s => s.name.trim() !== ''));
    }
    setEditingStageId(null);
    setNewStage(false);
  };

  // ---- Columns ----
  const processColumns = [
    {
      title: 'S.No',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Process Name',
      dataIndex: 'name',
      render: (_: string, record: Process) => {
        const editable = editingProcessId === record.id;
        return editable ? (
          <Input
            value={record.name}
            onChange={e =>
              setProcesses(prev =>
                prev.map(p => (p.id === record.id ? { ...p, name: e.target.value } : p))
              )
            }
            autoFocus
          />
        ) : (
          record.name || <i className="text-gray-400">Enter name...</i>
        );
      },
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      width: 90,
      render: (_: boolean, record: Process) => {
        const editable = editingProcessId === record.id;
        return editable ? (
          <Checkbox
            checked={record.isDefault}
            onChange={e =>
              setProcesses(prev =>
                prev.map(p => (p.id === record.id ? { ...p, isDefault: e.target.checked } : p))
              )
            }
          />
        ) : (
          <Checkbox checked={record.isDefault} disabled />
        );
      },
    },

    {
      title: '',
      width: 140,
      render: (_: any, record: Process) => {
        const editable = editingProcessId === record.id;
        return (
          <Space>
            {editable ? (
              <>
                <Button
                  type="text"
                  icon={<IconCheck size={18} color="green" />}
                  onClick={() => handleSaveProcess(record)}
                />
                <Button
                  type="text"
                  icon={<IconX size={18} color="red" />}
                  onClick={handleCancelProcess}
                />
              </>
            ) : (
              <>
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={() => setEditingProcessId(record.id)}
                />
                {!record.isDefault && (
                  <Popconfirm
                    title="Are you sure to delete this process?"
                    onConfirm={() => handleDeleteProcess(record.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" icon={<IconTrash size={18} color="red" />} />
                  </Popconfirm>
                )}
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const stageColumns = [
    {
      title: 'S.No',
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Stage Name',
      dataIndex: 'name',
      render: (_: string, record: Stage) => {
        const editable = editingStageId === record.id;
        return editable ? (
          <Input
            value={record.name}
            onChange={e =>
              setStages(prev =>
                prev.map(s => (s.id === record.id ? { ...s, name: e.target.value } : s))
              )
            }
          />
        ) : (
          record.name || <i className="text-gray-400">Enter stage name...</i>
        );
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      render: (_: string[], record: Stage) => {
        const editable = editingStageId === record.id;
        return editable ? (
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={record.functionality}
            onChange={v =>
              setStages(prev =>
                prev.map(s => (s.id === record.id ? { ...s, functionality: v } : s))
              )
            }
          >
            <Option value="Contact">Contact</Option>
            <Option value="Property">Property</Option>
            <Option value="Quotation">Quotation</Option>
            <Option value="Capture Deposit">Capture Deposit</Option>
            <Option value="Close">Close</Option>
          </Select>
        ) : (
          record.functionality?.map(tag => <Tag key={tag}>{tag}</Tag>)
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (_: string, record: Stage) => {
        const editable = editingStageId === record.id;
        return editable ? (
          <Select
            value={record.category}
            style={{ width: '100%' }}
            onChange={v =>
              setStages(prev => prev.map(s => (s.id === record.id ? { ...s, category: v } : s)))
            }
          >
            <Option value="Lead">Lead</Option>
            <Option value="Opportunity">Opportunity</Option>
          </Select>
        ) : (
          record.category
        );
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 100,
      render: (_: number, record: Stage) => {
        const editable = editingStageId === record.id;
        return editable ? (
          <Input
            type="number"
            value={record.sort}
            min={1}
            onChange={e => {
              const val = Number(e.target.value);
              setStages(prev => prev.map(s => (s.id === record.id ? { ...s, sort: val } : s)));
            }}
          />
        ) : (
          record.sort
        );
      },
    },
    {
      title: '',
      width: 140,
      render: (_: any, record: Stage) => {
        const editable = editingStageId === record.id;
        return (
          <Space>
            {editable ? (
              <>
                <Button
                  type="text"
                  icon={<IconCheck size={18} color="green" />}
                  onClick={() => handleSaveStage(record)}
                />
                <Button
                  type="text"
                  icon={<IconX size={18} color="red" />}
                  onClick={handleCancelStage}
                />
              </>
            ) : (
              <>
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={() => setEditingStageId(record.id)}
                />
                <Popconfirm
                  title="Are you sure to delete this stage?"
                  onConfirm={() => handleDeleteStage(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" icon={<IconTrash size={18} color="red" />} />
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];

  const filteredStages = stages.filter(s => s.processId === selectedProcessId);

  return (
    <div className="space-y-6">
      {/* Left Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Sales Process</h3>
          <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAddProcess}>
            New
          </Button>
        </div>
        <Table
          size="small"
          rowKey="id"
          columns={processColumns}
          dataSource={processes}
          pagination={false}
          onRow={record => ({
            onClick: () => setSelectedProcessId(record.id),
          })}
          rowClassName={record => (record.id === selectedProcessId ? 'bg-blue-50' : '')}
        />
      </div>

      {/* Right Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Stages —{' '}
            {selectedProcessId ? processes.find(p => p.id === selectedProcessId)?.name : '—'}
          </h3>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAddStage}
            disabled={!selectedProcessId}
          >
            New
          </Button>
        </div>
        <Table
          size="small"
          rowKey="id"
          columns={stageColumns}
          dataSource={filteredStages.sort((a, b) => a.sort - b.sort)}
          pagination={false}
        />
      </div>
    </div>
  );
};
