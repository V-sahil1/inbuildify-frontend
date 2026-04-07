'use client';

import React, { useEffect, useState } from 'react';
import { Table, Input, Checkbox, Button, Select, Space, Tag, message, Popconfirm } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconCheck, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  ProcessType,
  StageType,
  StageTypePayload,
} from '@redux/feature/admin/sales/process/IProcessState';
import {
  createProcess,
  createStage,
  deleteProcess,
  deleteStage,
  fetchAllProcess,
  fetchAllStage,
  fetchFunctionality,
  updateProcess,
  updateStage,
} from '@redux/feature/admin/sales/process/processThunk';
import { Status } from '@lib/constants/enum';
import { toggleExpand } from '@redux/feature/admin/sales/process/processSlice';
import TooltipButton from '@/components/common/TooltipButton';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export const SalesProcess: React.FC = () => {
  const dispatch = useAppDispatch();
  const { process, functionality, functionalityStatus, stageStatus, status } = useAppSelector(
    (state: RootState) => state.sales.process
  );

  const [localProcesses, setLocalProcesses] = useState<ProcessType[]>([]);
  const [stages, setStages] = useState([]);
  const [selectedProcess, setSelectedProcess] = useState<ProcessType | null>();
  const [editingProcessId, setEditingProcessId] = useState<string | null>(null);
  const [editingStageId, setEditingStageId] = useState<string | null>(null);
  const [newStageRow, setNewStageRow] = useState(null);
  const [newProcess, setNewProcess] = useState<boolean>(false);
  const [errors, setErrors] = useState<{
    process: { name: string };
    stage: { stageName: string; category: string; sortOrder: string };
  }>({
    process: { name: '' },
    stage: { stageName: '', category: '', sortOrder: '' },
  });
  const functionalityOptions =
    functionality && functionality.map(i => ({ label: i.name, value: i.functionalityId }));

  const fetchProcesses = async () => {
    try {
      await dispatch(fetchAllProcess()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch processes');
    }
  };

  const fetchFunctionalityData = async () => {
    try {
      await dispatch(fetchFunctionality()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to  fetch functionality');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchProcesses();
    }

    if (functionalityStatus === Status.IDLE) {
      fetchFunctionalityData();
    }
  }, [status.fetch, functionalityStatus]);

  useEffect(() => {
    if (process && process.length > 0) {
      setLocalProcesses([...process]);

      if (selectedProcess) {
        const stage = process.find(i => i.salesProcessId === selectedProcess.salesProcessId);
        if (stage) {
          setStages(stage?.Stages);
        } else {
          setSelectedProcess(process[0]);
          fetchStagesData(process[0]);
          setStages(process[0].Stages);
        }
      } else {
        setSelectedProcess(process[0]);
        fetchStagesData(process[0]);
        setStages(process[0].Stages);
      }
    }
  }, [process]);

  const processValidation = record => {
    const errors = {
      name: '',
    };
    let isValid = true;
    if (!record.name?.trim()) {
      errors.name = 'Process name is required';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, process: errors }));
    return isValid;
  };

  const stageValidation = record => {
    const errors = {
      stageName: '',
      category: '',
      sortOrder: '',
    };
    let isValid = true;
    if (!record.stageName?.trim()) {
      errors.stageName = 'Stage name is required';
      isValid = false;
    }
    if (!record.category?.trim()) {
      errors.category = 'Category is required';
      isValid = false;
    }
    if (!record.sortOrder || record.sortOrder <= 0) {
      errors.sortOrder = 'Sort order is required and must be greater than 0';
      isValid = false;
    }

    setErrors(prev => ({ ...prev, stage: errors }));
    return isValid;
  };

  // ---- Process Logic ----
  const handleAddProcess = () => {
    const newRow = {
      salesProcessId: '',
      name: '',
      isDefault: false,
    };
    setNewProcess(true);
    setLocalProcesses(prev => [newRow, ...prev]);
    setEditingProcessId('');
  };

  const handleSaveProcess = async record => {
    if (!processValidation(record)) return;

    const payload = {
      name: record.name,
      isDefault: record.isDefault,
    };

    try {
      if (newProcess) {
        await dispatch(createProcess(payload)).unwrap();
        message.success('Process created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields(
          payload,
          process.find(i => i.salesProcessId === record.salesProcessId)
        );
        if (!isUpdated) {
          setEditingProcessId(null);
          setNewProcess(false);
          return;
        }
        const res = await dispatch(
          updateProcess({ data: updatedFields, id: record.salesProcessId })
        ).unwrap();
        if (selectedProcess.salesProcessId === record.salesProcessId) {
          setSelectedProcess(prev => ({ ...prev, ...res }));
        }
        message.success('Process updated successfully');
      }
      setEditingProcessId(null);
      setNewProcess(false);
    } catch (error) {
      message.error(error?.message || error || 'Failed to save process');
    }
  };

  const handleDeleteProcess = async record => {
    if (record?.isDefault) return message.warning('Default process cannot be deleted');
    try {
      await dispatch(deleteProcess(record.salesProcessId)).unwrap();
      message.success('Process deleted successfully');
    } catch (error) {
      message.error(error?.message || error || 'Failed to delete process');
    }
  };

  const handleCancelProcess = () => {
    if (newProcess) {
      setLocalProcesses(prev => prev.filter(p => p.salesProcessId !== ''));
    } else {
      setLocalProcesses([...process]);
    }
    setEditingProcessId(null);
    setNewProcess(false);
    setErrors(prev => ({ ...prev, process: null }));
  };

  // ---- Stage Logic ----
  const handleAddStage = () => {
    if (!selectedProcess) return message.warning('Select a process first');
    const newStageObj: StageType = {
      salesStageId: '',
      salesProcessId: selectedProcess.salesProcessId,
      stageName: '',
      functionality: [],
      category: '',
      sortOrder: 1,
      isActive: true,
    };
    setNewStageRow(newStageObj);
    setEditingStageId('');
  };

  const handleSaveStage = async record => {
    const functionalityId =
      record.functionality
        ?.map(item => {
          if (typeof item === 'string') {
            return item;
          } else if (item?.id) {
            return item.id;
          }
          return null;
        })
        .filter(Boolean) || null;
    const payload: StageTypePayload = {
      stageName: record.stageName,
      salesProcessId: record.salesProcessId,
      category: record.category,
      functionalityId,
      sortOrder: record.sortOrder,
    };
    if (!stageValidation(payload)) {
      return;
    }
    const id = record.salesStageId;
    try {
      if (record.salesStageId === '') {
        await dispatch(createStage(payload)).unwrap();
        message.success('stage created successfully');
      } else {
        delete payload.salesProcessId;
        await dispatch(updateStage({ data: payload, id: id })).unwrap();
        message.success('stage updated successfully');
      }
      setEditingStageId(null);
      setNewStageRow(null);
    } catch (error) {
      message.error(error || 'Failed to save stage');
    }
  };

  const handleDeleteStage = async record => {
    try {
      await dispatch(
        deleteStage({ id: record.salesStageId, processId: record.salesProcessId })
      ).unwrap();
      message.success('stage deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete stage');
    }
  };

  const handleCancelStage = () => {
    if (newStageRow) {
      setNewStageRow(null);
    } else {
      if (selectedProcess) {
        const originalProcess = process.find(
          i => i.salesProcessId === selectedProcess.salesProcessId
        );
        setStages(originalProcess?.Stages || []);
      }
    }
    setErrors(prev => ({ ...prev, stage: null }));
    setEditingStageId(null);
  };

  // ---- Columns ----
  const processColumns = [
    {
      title: 'S.No',
      render: (_, __, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Process Name',
      dataIndex: 'name',
      render: (_, record) => {
        const editable = editingProcessId === record.salesProcessId;
        return editable ? (
          <>
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
              onClick={e => e.stopPropagation()}
              autoFocus
              disabled={status.create === Status.PENDING}
            />
            {errors?.process?.name && <span className="text-red-500">{errors?.process?.name}</span>}
          </>
        ) : (
          record.name || <i className="text-gray-400">Enter name...</i>
        );
      },
    },
    {
      title: 'Default',
      dataIndex: 'isDefault',
      width: 90,
      render: (_, record) => {
        const editable = editingProcessId === record.salesProcessId;
        return editable ? (
          <Checkbox
            checked={record.isDefault}
            onChange={e => {
              e.stopPropagation();
              setLocalProcesses(prev =>
                prev.map(p =>
                  p.salesProcessId === record.salesProcessId
                    ? { ...p, isDefault: e.target.checked }
                    : p
                )
              );
            }}
            onClick={e => e.stopPropagation()}
            disabled={status.create === Status.PENDING}
          />
        ) : (
          <Checkbox checked={record.isDefault} disabled />
        );
      },
    },

    {
      title: '',
      width: 140,
      render: (_, record) => {
        const editable = editingProcessId === record.salesProcessId;
        return (
          <Space>
            {editable ? (
              <>
                <Button
                  type="text"
                  icon={<IconCheck size={18} color="green" />}
                  onClick={e => {
                    e.stopPropagation();
                    handleSaveProcess(record);
                  }}
                  loading={status.create === Status.PENDING}
                  disabled={status.create === Status.PENDING}
                />
                <Button
                  type="text"
                  icon={<IconX size={18} color="red" />}
                  onClick={e => {
                    e.stopPropagation();
                    handleCancelProcess();
                  }}
                  disabled={status.create === Status.PENDING}
                />
              </>
            ) : (
              <>
                <TooltipButton
                  title="Edit"
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={e => {
                    e.stopPropagation();
                    if (newProcess) {
                      setLocalProcesses(prev => prev.filter(p => p.salesProcessId !== ''));
                      setNewProcess(false);
                    }
                    setEditingProcessId(record.salesProcessId);
                  }}
                  disabled={newProcess && record.salesProcessId === ''}
                />
                {!record.isDefault && (
                  <Popconfirm
                    title="Are you sure to delete this process?"
                    onConfirm={e => {
                      e.stopPropagation();
                      handleDeleteProcess(record);
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    <TooltipButton
                      title="Delete"
                      type="text"
                      icon={<IconTrash size={16} color="red" />}
                      onClick={e => {
                        e.stopPropagation();
                        if (newProcess) {
                          setLocalProcesses(prev => prev.filter(p => p.salesProcessId !== ''));
                          setNewProcess(false);
                          setEditingProcessId(null);
                        }
                        handleDeleteProcess(record);
                      }}
                    />
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
      render: (_, __, index: number) => index + 1,
      width: 60,
    },
    {
      title: 'Stage Name',
      dataIndex: 'stageName',
      render: (_, record: StageType) => {
        const editable =
          editingStageId === record.salesStageId || (newStageRow && record.salesStageId === '');
        return editable ? (
          <>
            <Input
              value={record.stageName}
              onChange={e => {
                if (record.salesStageId === '' && newStageRow) {
                  setNewStageRow({ ...newStageRow, stageName: e.target.value });
                } else {
                  setStages(prev =>
                    prev.map(s =>
                      s.salesStageId === record.salesStageId
                        ? { ...s, stageName: e.target.value }
                        : s
                    )
                  );
                }
              }}
              disabled={stageStatus.create === Status.PENDING}
            />
            {errors?.stage?.stageName && (
              <span className="text-red-500">{errors?.stage?.stageName}</span>
            )}
          </>
        ) : (
          record.stageName || <i className="text-gray-400">Enter stage name...</i>
        );
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      render: (_, record: StageType) => {
        const editable =
          editingStageId === record.salesStageId || (newStageRow && record.salesStageId === '');
        return editable ? (
          <Select
            mode="tags"
            style={{ width: '100%' }}
            value={record.functionality?.map(i => (typeof i === 'string' ? i : i.id)) || []}
            onChange={v => {
              if (record.salesStageId === '' && newStageRow) {
                setNewStageRow({ ...newStageRow, functionality: v });
              } else {
                setStages(prev =>
                  prev.map(s =>
                    s.salesStageId === record.salesStageId ? { ...s, functionality: v } : s
                  )
                );
              }
            }}
            options={functionalityOptions}
            disabled={stageStatus.create === Status.PENDING}
          />
        ) : (
          record.functionality?.map(tag => <Tag key={tag.id}>{tag.name}</Tag>)
        );
      },
    },
    {
      title: 'Category',
      dataIndex: 'category',
      render: (_: string, record: StageType) => {
        const editable =
          editingStageId === record.salesStageId || (newStageRow && record.salesStageId === '');
        return editable ? (
          <>
            <Select
              value={record.category}
              style={{ width: '100%' }}
              onChange={v => {
                if (record.salesStageId === '' && newStageRow) {
                  setNewStageRow({ ...newStageRow, category: v });
                } else {
                  setStages(prev =>
                    prev.map(s =>
                      s.salesStageId === record.salesStageId ? { ...s, category: v } : s
                    )
                  );
                }
              }}
              options={[
                { label: 'Lead', value: 'lead' },
                { label: 'Opportunity', value: 'opportunity' },
              ]}
              disabled={stageStatus.create === Status.PENDING}
            />
            {errors?.stage?.category && (
              <span className="text-red-500">{errors?.stage?.category}</span>
            )}
          </>
        ) : (
          record.category
        );
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      width: 100,
      render: (_: number, record: StageType) => {
        const editable =
          editingStageId === record.salesStageId || (newStageRow && record.salesStageId === '');
        return editable ? (
          <>
            <Input
              type="number"
              value={record.sortOrder}
              min={1}
              onChange={e => {
                const val = Number(e.target.value);
                if (record.salesStageId === '' && newStageRow) {
                  setNewStageRow({ ...newStageRow, sortOrder: val });
                } else {
                  setStages(prev =>
                    prev.map(s =>
                      s.salesStageId === record.salesStageId ? { ...s, sortOrder: val } : s
                    )
                  );
                }
              }}
              disabled={stageStatus.create === Status.PENDING}
              onWheel={(e) => e.currentTarget.blur()}
            />
            {errors?.stage?.sortOrder && (
              <span className="text-red-500">{errors?.stage?.sortOrder}</span>
            )}
          </>
        ) : (
          record.sortOrder
        );
      },
    },
    {
      title: '',
      width: 140,
      render: (_, record: StageType) => {
        const editable =
          editingStageId === record.salesStageId || (newStageRow && record.salesStageId === '');
        return (
          <Space>
            {editable ? (
              <>
                <Button
                  type="text"
                  icon={<IconCheck size={16} color="green" />}
                  onClick={() => handleSaveStage(record)}
                  loading={stageStatus.create === Status.PENDING}
                  disabled={stageStatus.create === Status.PENDING}
                />
                <Button
                  type="text"
                  icon={<IconX size={16} color="red" />}
                  onClick={handleCancelStage}
                  disabled={stageStatus.create === Status.PENDING}
                />
              </>
            ) : (
              <>
                <TooltipButton
                  title="Edit"
                  type="text"
                  icon={<IconPencil size={16} />}
                  onClick={() => {
                    if (newStageRow) {
                      setNewStageRow(null);
                    }
                    setEditingStageId(record.salesStageId);
                  }}
                  disabled={newStageRow && record.salesStageId === ''}
                />
                <Popconfirm
                  title="Are you sure to delete this stage?"
                  onConfirm={() => {
                    if (newStageRow) {
                      setNewStageRow(null);
                    }
                    handleDeleteStage(record);
                  }}
                  okText="Yes"
                  cancelText="No"
                >
                  <TooltipButton
                    title="Delete"
                    type="text"
                    icon={<IconTrash size={16} color="red" />}
                    disabled={stageStatus.create === Status.PENDING}
                  />
                </Popconfirm>
              </>
            )}
          </Space>
        );
      },
    },
  ];
  const fetchStagesData = async record => {
    if (record.salesProcessId !== '') {
      if (!record.isExpanded) {
        dispatch(toggleExpand(record.salesProcessId));
        try {
          const response = await dispatch(fetchAllStage(record.salesProcessId)).unwrap();
          setStages(response?.data);
        } catch (error) {
          message.error(error?.message || error || 'Failed to fetch stages');
        }
      }
    }
  };

  const stageDataSource = selectedProcess ? (newStageRow ? [newStageRow, ...stages] : stages) : [];
  return (
    <div className="space-y-6">
      {/* Left Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">Sales Process</h3>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAddProcess}
            disabled={newProcess}
          >
            New
          </Button>
        </div>
        <Table
          size="small"
          rowKey="salesProcessId"
          columns={processColumns}
          dataSource={[...localProcesses]}
          pagination={false}
          onRow={record => ({
            onClick: () => {
              if (newProcess && record.salesProcessId !== '') {
                setLocalProcesses(prev => prev.filter(p => p.salesProcessId !== ''));
                setNewProcess(false);
                setEditingProcessId(null);
              }
              if (record.salesProcessId !== '') {
                setSelectedProcess(record);
                fetchStagesData(record);
                setStages(record.Stages || []);
                if (newStageRow) {
                  setNewStageRow(null);
                  setEditingStageId(null);
                }
              }
            },
          })}
          rowClassName={record =>
            record.salesProcessId === selectedProcess?.salesProcessId ? 'bg-blue-50' : ''
          }
          loading={status.fetch === Status.PENDING}
        />
      </div>

      {/* Right Table */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold">
            Stages — {selectedProcess ? selectedProcess.name : '—'}
          </h3>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAddStage}
            disabled={!!newStageRow}
          >
            New
          </Button>
        </div>
        <Table
          size="small"
          rowKey="salesStageId"
          columns={stageColumns}
          dataSource={stageDataSource}
          pagination={false}
          loading={stageStatus.fetch === Status.PENDING}
        />
      </div>
    </div>
  );
};
