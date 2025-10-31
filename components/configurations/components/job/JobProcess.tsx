'use client';

import React, { useMemo, useState } from 'react';
import {
  Table,
  Input,
  Checkbox,
  Button,
  Select,
  Space,
  Tag,
  Tooltip,
  Modal,
  message,
  InputNumber,
} from 'antd';
import {
  IconPencil,
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconJumpRope,
} from '@tabler/icons-react';
import { JobWorkflowDrawer } from '../JobWorkflowDrawer';

type FunctionalityKey = 'Sales' | 'Workflow' | 'Color' | 'Construction' | 'Maintenance';

interface StageItem {
  id: number;
  name: string;
  dependent?: boolean;
  functionality: FunctionalityKey;
  meta?: Record<string, any>;
  sort: number;
  isActive?: boolean;
}

const DEFAULT_DATA: StageItem[] = [
  {
    id: 1,
    name: 'Sales',
    dependent: false,
    functionality: 'Sales',
    sort: 1,
    isActive: true,
  },
  {
    id: 2,
    name: 'Preconstruction',
    dependent: false,
    functionality: 'Workflow',
    sort: 2,
    isActive: true,
  },
  {
    id: 3,
    name: 'Color',
    dependent: false,
    functionality: 'Color',
    sort: 3,
    isActive: true,
  },
  {
    id: 4,
    name: 'Construction',
    dependent: false,
    functionality: 'Construction',
    sort: 4,
    isActive: true,
  },
  {
    id: 5,
    name: 'Maintenance',
    dependent: false,
    functionality: 'Maintenance',
    sort: 5,
    isActive: true,
  },
];

const FUNCTIONALITY_OPTIONS: { value: FunctionalityKey; color: string }[] = [
  { value: 'Sales', color: 'purple' },
  { value: 'Workflow', color: 'orange' },
  { value: 'Color', color: 'cyan' },
  { value: 'Construction', color: 'green' },
  { value: 'Maintenance', color: 'volcano' },
];

export const JobProcess: React.FC = () => {
  const [list, setList] = useState<StageItem[]>(DEFAULT_DATA);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<number, Partial<StageItem>>>({});
  const [funcModal, setFuncModal] = useState<{
    open: boolean;
    type?: FunctionalityKey;
    row?: StageItem;
  }>({ open: false });

  const activeSorted = useMemo(() => {
    return [...list].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));
  }, [list]);

  const nextPositiveId = () => Date.now();

  // Insert a new item into list at targetSort (1-based). If targetSort > activeCount, insert at end.
  const insertAtSort = (prev: StageItem[], newItem: StageItem, desiredSort?: number) => {
    const active = prev.slice().sort((a, b) => a.sort - b.sort);
    const activeCount = active.length;
    const pos =
      desiredSort && Number.isFinite(desiredSort)
        ? Math.max(1, Math.min(desiredSort, activeCount + 1))
        : activeCount + 1;
    // Note: when calling this, caller should have removed any temporary item from prev first if necessary.
    const newList = [...active.slice(0, pos - 1), newItem, ...active.slice(pos - 1)];
    return newList.map((it, idx) => ({ ...it, sort: idx + 1 }));
  };

  // Move/update an existing item to desired sort and apply updates. Keeps sequence contiguous.
  const moveExistingAndUpdate = (
    prev: StageItem[],
    id: number,
    updates: Partial<StageItem>,
    desiredSort?: number
  ) => {
    const active = prev.slice().sort((a, b) => a.sort - b.sort);
    const idx = active.findIndex(x => x.id === id);
    if (idx === -1) return prev; // not found
    const item = { ...active[idx], ...updates };
    const others = active.filter((_, i) => i !== idx);
    const pos =
      desiredSort && Number.isFinite(desiredSort)
        ? Math.max(1, Math.min(desiredSort, others.length + 1))
        : item.sort;
    const newList = [...others.slice(0, pos - 1), item, ...others.slice(pos - 1)];
    return newList.map((it, i) => ({ ...it, sort: i + 1 }));
  };

  const handleAdd = () => {
    if (editingId !== null) {
      message.warning('Finish current edit before adding a new stage');
      return;
    }
    const tempId = -Date.now();
    const newRow: StageItem = {
      id: tempId,
      name: '',
      dependent: false,
      functionality: 'Workflow',
      sort: 1, // visible input; real sort will be resolved on save
      isActive: true,
    };
    // Add to top in UI so user can edit immediately
    setList(prev => [newRow, ...prev]);
    setDrafts(d => ({ ...d, [tempId]: { ...newRow } }));
    setEditingId(tempId);
  };

  const startEdit = (row: StageItem) => {
    if (editingId !== null && editingId !== row.id) {
      message.warning('Finish current edit before editing another row');
      return;
    }
    setEditingId(row.id);
    setDrafts(d => ({ ...d, [row.id]: { ...row } }));
  };

  const cancelEdit = (id: number) => {
    setDrafts(d => {
      const c = { ...d };
      delete c[id];
      return c;
    });
    setEditingId(null);
    if (id < 0) {
      // remove temp row
      setList(prev => prev.filter(p => p.id !== id));
    }
  };

  const saveEdit = (id: number) => {
    const draft = drafts[id];
    if (!draft) {
      message.error('Nothing to save');
      return;
    }
    const name = (draft.name || '').trim();
    if (!name) {
      message.error('Stage name is required');
      return;
    }

    let desiredSort = Number(draft.sort ?? NaN);
    if (!Number.isFinite(desiredSort) || desiredSort < 1) {
      desiredSort = 1;
    }

    const activeCount =
      list.filter(p => p.isActive !== false && p.id !== id).length +
      (id > 0 && list.some(l => l.id === id) ? 1 : 0);

    if (desiredSort > activeCount + (id < 0 ? 0 : 0)) {
      desiredSort = activeCount + 1;
    }

    if (id < 0) {
      const finalId = nextPositiveId();
      const newItem: StageItem = {
        id: finalId,
        name,
        dependent: !!draft.dependent,
        functionality: (draft.functionality || 'Workflow') as FunctionalityKey,
        meta: draft.meta,
        sort: desiredSort,
        isActive: true,
      };

      setList(prev => {
        const prevClean = prev.filter(p => p.id !== id);
        return insertAtSort(prevClean, newItem, desiredSort);
      });

      setDrafts(d => {
        const c = { ...d };
        delete c[id];
        return c;
      });
      setEditingId(null);
      message.success('Stage added');
      return;
    } else {
      setList(prev => {
        const updated = moveExistingAndUpdate(
          prev,
          id,
          {
            name,
            dependent: !!draft.dependent,
            functionality: (draft.functionality || 'Workflow') as FunctionalityKey,
            meta: draft.meta,
          },
          desiredSort
        );
        return updated;
      });
      setDrafts(d => {
        const c = { ...d };
        delete c[id];
        return c;
      });
      setEditingId(null);
      message.success('Stage updated');
      return;
    }
  };

  const confirmDelete = (id: number) => {
    if (editingId === id) {
      setEditingId(null);
      setDrafts(d => {
        const c = { ...d };
        delete c[id];
        return c;
      });
    }

    setList(prev => {
      const filtered = prev.filter(p => p.id !== id);
      const reordered = filtered
        .slice()
        .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
        .map((it, idx) => ({ ...it, sort: idx + 1 }));
      return reordered;
    });
    message.success('Deleted');
  };

  const openFuncModal = (type: FunctionalityKey, row?: StageItem) => {
    setFuncModal({ open: true, type, row });
  };
  const closeFuncModal = () => setFuncModal({ open: false });
  const renderFuncTag = (f: FunctionalityKey) => {
    const opt = FUNCTIONALITY_OPTIONS.find(o => o.value === f);
    return (
      <Tag color={opt?.color} style={{ fontWeight: 600 }}>
        {f}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      width: 70,
      render: (_: any, __: StageItem, index: number) => index + 1,
    },
    {
      title: 'Stage Name',
      dataIndex: 'name',
      render: (_: any, row: StageItem) => {
        const editing = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        return editing ? (
          <Input
            value={draft.name ?? ''}
            onChange={e =>
              setDrafts(d => ({
                ...d,
                [row.id]: { ...(d[row.id] ?? row), name: e.target.value },
              }))
            }
            placeholder="Enter stage name"
            autoFocus
          />
        ) : (
          <span>{row.name}</span>
        );
      },
    },
    {
      title: 'Dependent',
      dataIndex: 'dependent',
      width: 120,
      render: (_: any, row: StageItem) => {
        const editing = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        return editing ? (
          <Checkbox
            checked={!!draft.dependent}
            onChange={e =>
              setDrafts(d => ({
                ...d,
                [row.id]: {
                  ...(d[row.id] ?? row),
                  dependent: e.target.checked,
                },
              }))
            }
          />
        ) : (
          <Checkbox checked={!!row.dependent} disabled />
        );
      },
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      render: (_: any, row: StageItem) => {
        const editing = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        if (editing) {
          return (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Select
                value={(draft.functionality as FunctionalityKey) ?? row.functionality}
                style={{ minWidth: 160 }}
                onChange={val =>
                  setDrafts(d => ({
                    ...d,
                    [row.id]: { ...(d[row.id] ?? row), functionality: val },
                  }))
                }
                options={FUNCTIONALITY_OPTIONS.map(o => ({
                  label: o.value,
                  value: o.value,
                }))}
              />
            </div>
          );
        } else {
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {renderFuncTag(row.functionality)}
              {/* <Tooltip title="Open functionality settings">
                <Button type="text" icon={<IconDots size={16} />} onClick={() => openFuncModal(row.functionality, row)} />
              </Tooltip> */}
            </div>
          );
        }
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 120,
      render: (_: any, row: StageItem) => {
        const editing = editingId === row.id;
        const draft = drafts[row.id] ?? {};
        return editing ? (
          <InputNumber
            min={1}
            value={draft.sort ?? row.sort}
            onChange={val =>
              setDrafts(d => ({
                ...d,
                [row.id]: { ...(d[row.id] ?? row), sort: Number(val ?? 1) },
              }))
            }
            style={{ width: 120 }}
          />
        ) : (
          <span>{row.sort}</span>
        );
      },
    },
    {
      title: '',
      width: 160,
      render: (_: any, row: StageItem) => {
        const editing = editingId === row.id;
        return (
          <div style={{ textAlign: 'right' }}>
            <Space>
              {editing ? (
                <>
                  <Tooltip title="Save">
                    <Button
                      type="text"
                      icon={<IconCheck size={18} color="green" />}
                      onClick={() => saveEdit(row.id)}
                    />
                  </Tooltip>
                  <Tooltip title="Cancel">
                    <Button
                      type="text"
                      icon={<IconX size={18} color="red" />}
                      onClick={() => cancelEdit(row.id)}
                    />
                  </Tooltip>
                </>
              ) : (
                <>
                  {row.functionality === 'Workflow' && (
                    <Tooltip title="Job workflow">
                      <Button
                        type="text"
                        icon={<IconJumpRope size={16} />}
                        onClick={() => openFuncModal(row.functionality, row)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title="Edit">
                    <Button
                      type="text"
                      icon={<IconPencil size={18} />}
                      onClick={() => startEdit(row)}
                    />
                  </Tooltip>
                  <Tooltip title="Delete">
                    <Button
                      type="text"
                      icon={<IconTrash size={18} color="red" />}
                      onClick={
                        () => {}
                        // Modal.confirm({
                        //   title: "Delete stage?",
                        //   content: `Are you sure you want to delete "${row.name}"?`,
                        //   okText: "Delete",
                        //   okType: "danger",
                        //   onOk: () => confirmDelete(row.id),
                        // })
                      }
                    />
                  </Tooltip>
                </>
              )}
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold m-0">Configure Job Stages</h3>
          <div className="text-sm text-gray-500">
            Admins can set up fully customizable job progress.
          </div>
        </div>

        <Button type="primary" icon={<IconPlus size={16} />} onClick={handleAdd}>
          New
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={[...list].sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))}
        pagination={false}
        size="middle"
        bordered
      />
      <JobWorkflowDrawer
        open={funcModal.open}
        onClose={() => setFuncModal({ open: false })}
        record={funcModal.row}
      />
    </div>
  );
};
