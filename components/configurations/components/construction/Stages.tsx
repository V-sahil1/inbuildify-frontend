'use client';
import React, { useMemo, useState } from 'react';
import {
  Table,
  Input,
  InputNumber,
  Switch,
  Select,
  Button,
  Popconfirm,
  message,
  ColorPicker,
} from 'antd';
import { IconPlus, IconEdit, IconTrash, IconCheck, IconX } from '@tabler/icons-react';
import { stagesData } from 'data/configuration/StagesData';

const { Option } = Select;

type StageRow = {
  id: number;
  name: string;
  days: number;
  sortOrder: number;
  siteImage: boolean;
  inspection: string;
  bgColor: string;
  fontColor: string;
};

const INSPECTION_OPTIONS = ['Stage Start', 'Stage End', 'Stage Mid'];

const dummyInitial: StageRow[] = stagesData || [];

function normalizeAndSort(arr: StageRow[]) {
  return arr
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r, i) => ({ ...r, sortOrder: i + 1 }));
}

function insertAtSort(rows: StageRow[], newRow: StageRow, desiredSort: number) {
  const max = rows.length + 1;
  const pos = Math.min(Math.max(1, Math.floor(desiredSort)), max);
  // bump all with sort >= pos
  const updated = rows.map(r => (r.sortOrder >= pos ? { ...r, sortOrder: r.sortOrder + 1 } : r));
  updated.push({ ...newRow, sortOrder: pos });
  return normalizeAndSort(updated);
}

function moveAndReindex(
  rows: StageRow[],
  id: number,
  newSort: number,
  updatedValues?: Partial<StageRow>
) {
  const old = rows.find(r => r.id === id);
  if (!old) return normalizeAndSort(rows);
  const oldSort = old.sortOrder;
  const max = rows.length;
  const pos = Math.min(Math.max(1, Math.floor(newSort)), max);

  const others = rows.filter(r => r.id !== id).map(r => ({ ...r }));
  const shifted = others.map(r => {
    if (pos < oldSort) {
      if (r.sortOrder >= pos && r.sortOrder < oldSort) return { ...r, sortOrder: r.sortOrder + 1 };
    } else if (pos > oldSort) {
      if (r.sortOrder <= pos && r.sortOrder > oldSort) return { ...r, sortOrder: r.sortOrder - 1 };
    }
    return r;
  });

  const moved = { ...old, ...(updatedValues || {}), sortOrder: pos };
  return normalizeAndSort([...shifted, moved]);
}

export function Stages() {
  const [rows, setRows] = useState<StageRow[]>(() => normalizeAndSort(dummyInitial));
  const [editingId, setEditingId] = useState<number | 'new' | null>(null);
  const [local, setLocal] = useState<Partial<StageRow> | null>(null);

  const totalCount = rows.length;

  const startEdit = (row?: StageRow) => {
    if (!row) {
      // new row mode
      setEditingId('new');
      setLocal({
        id: Date.now(),
        name: '',
        days: 0,
        sortOrder: rows.length + 1,
        siteImage: false,
        inspection: INSPECTION_OPTIONS[0],
        bgColor: '#6f2ca8',
        fontColor: '#ffffff',
      });
    } else {
      setEditingId(row.id);
      setLocal({ ...row });
    }
  };

  const cancel = () => {
    setEditingId(null);
    setLocal(null);
  };

  const saveRow = async () => {
    if (!local) return;
    if (!local.name || !local.days) {
    }
    if (!local.name?.trim()) {
      message.error('Stage name is required');
      return;
    }
    const desiredSort = Number(local.sortOrder) || rows.length + (editingId === 'new' ? 1 : 0);

    if (editingId === 'new') {
      // insert
      const newRow: StageRow = {
        id: local.id as number,
        name: local.name!,
        days: Number(local.days || 0),
        sortOrder: Math.min(Math.max(1, Math.floor(desiredSort)), rows.length + 1),
        siteImage: Boolean(local.siteImage),
        inspection: String(local.inspection),
        bgColor: local.bgColor || '#6f2ca8',
        fontColor: local.fontColor || '#ffffff',
      };
      const updated = insertAtSort(rows, newRow, newRow.sortOrder);
      setRows(updated);
      message.success('Stage added');
    } else {
      const id = editingId as number;
      const newSort = Number(local.sortOrder) || rows.length;
      const updatedValues: Partial<StageRow> = {
        name: local.name,
        days: Number(local.days || 0),
        siteImage: Boolean(local.siteImage),
        inspection: String(local.inspection),
        bgColor: local.bgColor,
        fontColor: local.fontColor,
      };
      const updated = moveAndReindex(rows, id, newSort, updatedValues);
      setRows(updated);
      message.success('Stage updated');
    }

    setEditingId(null);
    setLocal(null);
  };

  const deleteRow = (id: number) => {
    const filtered = rows.filter(r => r.id !== id);
    setRows(normalizeAndSort(filtered));
    message.info('Stage deleted');
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'S.No',
        key: 'sno',
        width: 70,
        render: (_: any, __: StageRow, idx: number) => <div>{idx + 1}</div>,
      },
      {
        title: 'Stage Name',
        key: 'name',
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <Input
              value={local?.name}
              onChange={e => setLocal(s => ({ ...(s || {}), name: e.target.value }))}
              placeholder="Stage name"
              className="w-full"
            />
          ) : (
            <div>{rec.name}</div>
          ),
      },
      {
        title: 'Days',
        key: 'days',
        width: 120,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <InputNumber
              min={0}
              value={local?.days}
              onChange={v => setLocal(s => ({ ...(s || {}), days: Number(v || 0) }))}
              className="w-24"
            />
          ) : (
            <div>{rec.days} Days</div>
          ),
      },
      {
        title: 'Sort',
        key: 'sortOrder',
        width: 110,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <Select
              value={local?.sortOrder}
              onChange={v => setLocal(s => ({ ...(s || {}), sortOrder: Number(v) }))}
              style={{ width: 90 }}
            >
              {Array.from(
                { length: rows.length + (editingId === 'new' ? 1 : 0) },
                (_, i) => i + 1
              ).map(n => (
                <Option key={n} value={n}>
                  {n}
                </Option>
              ))}
            </Select>
          ) : (
            <div>{rec.sortOrder}</div>
          ),
      },
      {
        title: (
          <div className="flex items-center gap-2">
            <span>Site Image</span>
            <span className="text-xs text-gray-500">i</span>
          </div>
        ),
        key: 'siteImage',
        width: 120,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <Switch
              checked={Boolean(local?.siteImage)}
              onChange={v => setLocal(s => ({ ...(s || {}), siteImage: v }))}
            />
          ) : (
            <Switch checked={rec.siteImage} disabled />
          ),
      },
      {
        title: 'Inspection',
        key: 'inspection',
        width: 180,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <Select
              value={local?.inspection}
              onChange={v => setLocal(s => ({ ...(s || {}), inspection: String(v) }))}
              style={{ width: 160 }}
            >
              {INSPECTION_OPTIONS.map(opt => (
                <Option key={opt} value={opt}>
                  {opt}
                </Option>
              ))}
            </Select>
          ) : (
            <div>{rec.inspection}</div>
          ),
      },
      {
        title: 'Color',
        key: 'color',
        width: 220,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">BG color</div>
                <ColorPicker
                  value={local?.bgColor}
                  onChange={c =>
                    setLocal(s => ({ ...(s || {}), bgColor: c?.toHexString() || '#6f2ca8' }))
                  }
                />
              </div>
              <div className="flex flex-col items-center">
                <div className="text-xs mb-1">Font color</div>
                <ColorPicker
                  value={local?.fontColor}
                  onChange={c =>
                    setLocal(s => ({ ...(s || {}), fontColor: c?.toHexString() || '#ffffff' }))
                  }
                />
              </div>
              <div
                className="ml-2 rounded px-3 py-1 font-medium"
                style={{
                  background: local?.bgColor || '#6f2ca8',
                  color: local?.fontColor || '#fff',
                }}
              >
                Sample
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-6 rounded"
                style={{ background: rec.bgColor, border: '1px solid #ddd' }}
              />
              <div>{/* spacer */}</div>
              <div
                className="px-3 py-1 rounded font-medium"
                style={{ background: rec.bgColor, color: rec.fontColor }}
              >
                Sample
              </div>
            </div>
          ),
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 160,
        render: (_: any, rec: StageRow) =>
          editingId === rec.id || (editingId === 'new' && rec.id === (local?.id ?? 0)) ? (
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                size="small"
                onClick={saveRow}
                icon={<IconCheck size={14} />}
              />
              <Button size="small" onClick={cancel} icon={<IconX size={14} />} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="small" icon={<IconEdit size={16} />} onClick={() => startEdit(rec)} />
              <Popconfirm title="Delete this stage?" onConfirm={() => deleteRow(rec.id)}>
                <Button size="small" danger icon={<IconTrash size={16} />} />
              </Popconfirm>
            </div>
          ),
      },
    ];
  }, [rows, editingId, local]);

  const dataSource = useMemo(() => {
    if (editingId === 'new' && local) {
      return normalizeAndSort([
        ...rows,
        {
          id: local.id as number,
          name: local.name || '',
          days: Number(local.days || 0),
          sortOrder: Number(local.sortOrder || rows.length + 1),
          siteImage: Boolean(local.siteImage),
          inspection: String(local.inspection),
          bgColor: local.bgColor || '#6f2ca8',
          fontColor: local.fontColor || '#fff',
        },
      ]);
    }
    return rows;
  }, [rows, editingId, local]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="w-full">
          <p className="text-base font-bold">Builder</p>
          <Select
            className="w-full"
            options={[
              { label: 'company level', value: 'companylevel' },
              { label: 'builder level', value: 'builderlevel' },
            ]}
          />
        </div>
        <div className="w-full">
          <p className="text-base font-bold">Construction type</p>
          <Select
            className="w-full"
            options={[
              { label: 'Single storey', value: 'singlestorey' },
              { label: 'Multi storey', value: 'multistorey' },
            ]}
          />
        </div>
        <div>
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => startEdit(undefined)}
            disabled={editingId !== null}
          >
            New
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="id"
        pagination={false}
        bordered
        size="middle"
      />
    </div>
  );
}
