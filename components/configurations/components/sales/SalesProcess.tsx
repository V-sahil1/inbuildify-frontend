'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Checkbox, Button, Select, Space, Tag, message, Popconfirm } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { Process } from '@redux/feature/admin/sales/process/IProcessState';
import {
  createProcess,
  deleteProcess,
  fetchAllProcess,
  updateProcess,
} from '@redux/feature/admin/sales/process/processThunk';
import { Status } from '@lib/constants/enum';
import {
  createStage,
  deleteStage,
  fetchAllStage,
  updateStage,
} from '@redux/feature/admin/sales/stage/stageThunk';
import { Stage } from '@redux/feature/admin/sales/stage/IStageState';

const { Option } = Select;

export const SalesProcess: React.FC = () => {
  const dispatch = useAppDispatch();
  const { process, status } = useAppSelector((state: RootState) => state.sales.process);
  const { stage, status: stageStatus } = useAppSelector((state: RootState) => state.sales.stage);
  const [localProcesses, setLocalProcesses] = useState<Process[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [newProcess, setNewProcess] = useState(false);
  const [newStage, setNewStage] = useState(false);

  console.log("process----",process);
  console.log("local process----",localProcesses);


  // Sync Redux state with local state
  useEffect(() => {
    if (process && process.length > 0) {
      setLocalProcesses([...process]);
    }
  }, [process]);

  useEffect(() => {
    if (stage && stage.length > 0) {
      setStages([...stage]);
    }
  }, [stage]);
  useEffect(() => {
    const fetchData = async () => {
      if (status.fetch === Status.IDLE) {
        dispatch(fetchAllProcess()).unwrap();
      }
      if (stageStatus.fetch === Status.IDLE) {
        dispatch(fetchAllStage()).unwrap();
      }
    };
    fetchData();
  }, []);
  // ---- Process Logic ----
  const handleAddProcess = () => {
    const tempId = `new-${Date.now()}`;
    const newRow = {
      salesProcessId: tempId,
      name: '',
      isDefault: false,
    };
    setLocalProcesses(prev => [...prev, newRow]);
    setEditingProcessId(tempId);
    setNewProcess(true);
  };

  const handleSaveProcess = async record => {
    const trimmedName = record.name.trim();
    if (!trimmedName) return message.warning('Process name cannot be empty');

    const payload = {
      name: trimmedName,
      isDefault: record.isDefault,
    };

    try {
      const exists = process.find(p => p.salesProcessId === record.salesProcessId);
      if (exists) {
        await dispatch(updateProcess({ data: payload, id: record.salesProcessId })).unwrap();
        message.success('Process updated successfully');
      } else {
        await dispatch(createProcess(payload)).unwrap();
        message.success('Process created successfully');
      }
      setEditingProcessId(null);
      setNewProcess(false);
    } catch (error) {
      message.error(error || 'Failed to save process');
    }
    setEditingProcessId(null);
    setNewProcess(false);
  };

  const handleDeleteProcess = async (id: string) => {
    const process = localProcesses.find(p => p.salesProcessId === id);
    if (process?.isDefault) return message.warning('Default process cannot be deleted');
    try {
      await dispatch(deleteProcess(id)).unwrap();
      message.success('Process deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete process');
    }
    if (selectedProcessId === id) setSelectedProcessId(null);
  };

  const handleCancelProcess = () => {
    if (newProcess) {
      setLocalProcesses(prev => prev.filter(p => p.name.trim() !== ''));
    }
    setEditingProcessId(null);
    setNewProcess(false);
  };

  // ---- Stage Logic ----
  const handleAddStage = () => {
    if (!selectedProcessId) return message.warning('Select a process first');
    const tempId = Date.now().toString();
    const nextSort =
      Math.max(
        0,
        ...stages.filter(s => s.salesProcessId === selectedProcessId).map(s => s.sortOrder)
      ) + 1;
    const newStageObj: Stage = {
      salesStageId: tempId,
      salesProcessId: selectedProcessId,
      stageName: '',
      functionalityId: [],
      category: '',
      sortOrder: nextSort,
      isActive: true,
    };
    setStages(prev => [...prev, newStageObj]);
    setEditingStageId(tempId);
    setNewStage(true);
  };

  const handleSaveStage = async (record: Stage) => {
    const trimmedName = record.stageName.trim();
    if (!trimmedName) return message.warning('Stage name cannot be empty');
    // validate unique sort per process
    const sameProcessStages = stages.filter(
      s => s.salesProcessId === record.salesProcessId && s.salesStageId !== record.salesStageId
    );
    if (record.sortOrder < 1) return message.error('Sort value must be greater than 0');
    if (sameProcessStages.some(s => s.sortOrder === record.sortOrder)) {
      return message.error('Sort value must be unique within a process');
    }

    try {
      const exists = stage.find(s => s.salesStageId === record.salesStageId);
      if (exists) {
        await dispatch(updateStage({ data: record, id: record.salesStageId })).unwrap();
      } else {
        await dispatch(createStage(record)).unwrap();
      }
    } catch (error) {
      message.error(error || 'Failed to save stage');
    }
    setEditingStageId(null);
    setNewStage(false);
  };

  const handleDeleteStage = async (id: string) => {
    try {
      await dispatch(deleteStage(id)).unwrap();
      message.success('stage deleted successfully');
    } catch (error) {
      message.error('Failed to delete stage');
    }
    // setStages(prev => prev.filter(s => s.salesStageId !== id));
  };

  const handleCancelStage = () => {
    if (newStage) {
      setStages(prev => prev.filter(s => s.stageName.trim() !== ''));
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
      render: (_: string, record) => {
        const editable = editingProcessId === record.salesProcessId;
        return editable ? (
          <Input
            value={record.name || ''}
            onChange={e => {
              const newValue = e.target.value;
              setLocalProcesses(prev =>
                prev.map(p =>
                  p.salesProcessId === record.salesProcessId ? { ...p, name: newValue } : p
                )
              );
            }}
            autoFocus
            onKeyDown={e => e.stopPropagation()}
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
      render: (_: boolean, record) => {
        const editable = editingProcessId === record.salesProcessId;
        return editable ? (
          <Checkbox
            checked={record.isDefault}
            onChange={e =>
              setLocalProcesses(prev =>
                prev.map(p =>
                  p.salesProcessId === record.salesProcessId
                    ? { ...p, isDefault: e.target.checked }
                    : p
                )
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
      render: (_: any, record) => {
        const editable = editingProcessId === record.salesProcessId;
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
                  onClick={() => setEditingProcessId(record.salesProcessId)}
                />
                {!record.isDefault && (
                  <Popconfirm
                    title="Are you sure to delete this process?"
                    onConfirm={() => handleDeleteProcess(record.salesProcessId)}
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
      dataIndex: 'stageName',
      render: (_: string, record: Stage) => {
        const editable = editingStageId === record.salesStageId;
        return editable ? (
          <Input
            value={record.stageName}
            onChange={e =>
              setStages(prev =>
                prev.map(s =>
                  s.salesStageId === record.salesStageId ? { ...s, stageName: e.target.value } : s
                )
              )
            }
          />
        ) : (
          record.stageName || <i className="text-gray-400">Enter stage name...</i>
        );
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      render: (_: string[], record: Stage) => {
        const editable = editingStageId === record.salesStageId;
        return editable ? (
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={record.functionalityId}
            onChange={v =>
              setStages(prev =>
                prev.map(s =>
                  s.salesStageId === record.salesStageId ? { ...s, functionalityId: v } : s
                )
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
          record.functionalityId?.map(tag => <Tag key={tag}>{tag}</Tag>)
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (_: string, record: Stage) => {
        const editable = editingStageId === record.salesStageId;
        return editable ? (
          <Select
            value={record.category}
            style={{ width: '100%' }}
            onChange={v =>
              setStages(prev =>
                prev.map(s => (s.salesStageId === record.salesStageId ? { ...s, category: v } : s))
              )
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
        const editable = editingStageId === record.salesStageId;
        return editable ? (
          <Input
            type="number"
            value={record.sortOrder}
            min={1}
            onChange={e => {
              const val = Number(e.target.value);
              setStages(prev =>
                prev.map(s => (s.salesStageId === record.salesStageId ? { ...s, sort: val } : s))
              );
            }}
          />
        ) : (
          record.sortOrder
        );
      },
    },
    {
      title: '',
      width: 140,
      render: (_: any, record: Stage) => {
        const editable = editingStageId === record.salesStageId;
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
                  onClick={() => setEditingStageId(record.salesStageId)}
                />
                <Popconfirm
                  title="Are you sure to delete this stage?"
                  onConfirm={() => handleDeleteStage(record.salesStageId)}
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

  const filteredStages = stages.filter(s => s.salesProcessId === selectedProcessId);

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
          dataSource={[...localProcesses]}
          pagination={false}
          onRow={record => ({
            onClick: () => setSelectedProcessId(record.salesProcessId),
          })}
          rowClassName={record => (record.salesProcessId === selectedProcessId ? 'bg-blue-50' : '')}
        />
      </div>

      {/* Right Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Stages —{' '}
            {selectedProcessId
              ? process.find(p => p.salesProcessId === selectedProcessId)?.name
              : '—'}
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
          dataSource={filteredStages.sort((a, b) => a.sortOrder - b.sortOrder)}
          pagination={false}
        />
      </div>
    </div>
  );
};
