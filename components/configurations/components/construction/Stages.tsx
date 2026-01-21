'use client';
import React, { useEffect, useMemo, useState } from 'react';
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
import { useBuildersHook } from '@hooks/useBuildersHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { fetchAllType } from '@redux/feature/admin/construction/constructionType/constructionTypeThunk';
import {
  createStage,
  deleteStage,
  fetchAllConstructionStage,
  updateStage,
} from '@redux/feature/admin/construction/constructionStage/constructionStageThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { ConstructionStage } from '@redux/feature/admin/construction/constructionStage/IConstructionStageState';

function normalizeAndSort(arr: ConstructionStage[]) {
  return arr
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((r, i) => ({ ...r, sortOrder: i + 1 }));
}

function insertAtSort(rows: ConstructionStage[], newRow: ConstructionStage, desiredSort: number) {
  const max = rows.length + 1;
  const pos = Math.min(Math.max(1, Math.floor(desiredSort)), max);
  // bump all with sort >= pos
  const updated = rows.map(r => (r.sortOrder >= pos ? { ...r, sortOrder: r.sortOrder + 1 } : r));
  updated.push({ ...newRow, sortOrder: pos });
  return normalizeAndSort(updated);
}

function moveAndReindex(
  rows: ConstructionStage[],
  id: string,
  newSort: number,
  updatedValues?: Partial<ConstructionStage>
) {
  const old = rows.find(r => r.constructionStage === id);
  if (!old) return normalizeAndSort(rows);
  const oldSort = old.sortOrder;
  const max = rows.length;
  const pos = Math.min(Math.max(1, Math.floor(newSort)), max);

  const others = rows.filter(r => r.constructionStage !== id).map(r => ({ ...r }));
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
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [selectedStage, setSelectedStage] = useState<ConstructionStage | null>(null);
  const [local, setLocal] = useState<Partial<ConstructionStage> | null>(null);
  const [builderId, setBuilderId] = useState<string>('');
  const [typeId, setTypeId] = useState<string>('');
  const { builderOptions } = useBuildersHook();
  const { type, status: typeStatus } = useAppSelector(state => state.construction.constructionType);
  const { stage, status } = useAppSelector(state => state.construction.constructionStage);
  const typeOptions =
    type && type.length > 0
      ? type.map(i => ({ value: i.constructionTypeId, label: i.typesName }))
      : [];

  const fetchTypeData = async () => {
    try {
      await dispatch(fetchAllType({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction type');
    }
  };
  const fetchStageData = async () => {
    try {
      await dispatch(fetchAllConstructionStage()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction stage');
    }
  };
  useEffect(() => {
    if (typeStatus.fetch === Status.IDLE) {
      fetchTypeData();
    }
    if (type && type.length > 0) {
      setTypeId(type[0].constructionTypeId);
    }
    if (status.fetch === Status.IDLE) {
      fetchStageData();
    }
  }, [typeStatus.fetch, status.fetch]);

  useEffect(() => {
    if (builderOptions && builderOptions.length > 0 && !builderId) {
      setBuilderId(builderOptions[0].value);
    }
  }, [builderOptions, builderId]);

  const startEdit = (row?: ConstructionStage) => {
    if (!row) {
      // new row mode
      setEditingId('new');
      setLocal({
        constructionStage: 'new',
        stageName: '',
        days: 0,
        sortOrder: stage.length + 1,
        siteImage: false,
        inspection: 'stage_start',
        bgColor: '#6f2ca8',
        fontColor: '#ffffff',
      });
    } else {
      setSelectedStage(row);
      setEditingId(row.constructionStage);
      setLocal({ ...row });
    }
  };

  const cancel = () => {
    setEditingId(null);
    setLocal(null);
  };

  const saveRow = async () => {
    if (!local) return;
    if (!local.stageName?.trim() || !local.days) {
      message.error('Stage name and days are required');
      return;
    }
    try {
      if (editingId === 'new') {
        // insert
        const newRow: ConstructionStage = {
          constructionTypeId: typeId,
          builder: builderId,
          stageName: local.stageName!,
          days: Number(local.days || 0),
          sortOrder: 1,
          siteImage: Boolean(local.siteImage),
          inspection: String(local.inspection),
          bgColor: local.bgColor || '#6f2ca8',
          fontColor: local.fontColor || '#ffffff',
        };
        await dispatch(createStage(newRow)).unwrap();
        message.success('Stage added');
      } else {
        const id = editingId as string;
        const updatedValues: Partial<ConstructionStage> = {
          stageName: local.stageName,
          days: Number(local.days || 0),
          siteImage: Boolean(local.siteImage),
          inspection: String(local.inspection),
          bgColor: local.bgColor,
          fontColor: local.fontColor,
          sortOrder: local.sortOrder,
        };
        const {isUpdated,updatedFields} = getUpdatedFields(updatedValues, selectedStage);
        if (!isUpdated) {
          setSelectedStage(null);
          setEditingId(null);
          setLocal(null);
          return;
        }
        await dispatch(updateStage({ data: updatedFields, id })).unwrap();
        message.success('Stage updated');
      }
      setEditingId(null);
      setLocal(null);
    } catch (error) {
      message.error(error || 'Failed to save stage');
    }
  };

  const deleteRow = async (id: string) => {
    try {
      await dispatch(deleteStage(id)).unwrap();
      message.success('Stage deleted succcessfully');
    } catch (error) {
      message.error(error || 'Failed to delete stage');
    }
  };

  const columns = useMemo(() => {
    return [
      {
        title: 'S.No',
        key: 'sno',
        width: 70,
        render: (_, __, idx: number) => <div>{idx + 1}</div>,
      },
      {
        title: 'Stage Name',
        key: 'stageName',
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <Input
              value={local?.stageName}
              onChange={e => setLocal(s => ({ ...(s || {}), stageName: e.target.value }))}
              placeholder="Stage name"
              className="w-full"
            />
          ) : (
            <div>{rec.stageName}</div>
          ),
      },
      {
        title: 'Days',
        key: 'days',
        width: 120,
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
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
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <InputNumber
              value={local?.sortOrder}
              onChange={v => setLocal(s => ({ ...(s || {}), sortOrder: Number(v) }))}
              style={{ width: 90 }}
            />
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
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
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
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <Select
              value={local?.inspection}
              onChange={v => setLocal(s => ({ ...(s || {}), inspection: String(v) }))}
              style={{ width: 160 }}
              options={[
                { label: 'Not Required', value: 'not_required' },
                { label: 'Stage Start', value: 'stage_start' },
                { label: 'Stage Completed', value: 'stage_completed' },
              ]}
            />
          ) : (
            <div>{rec.inspection}</div>
          ),
      },
      {
        title: 'Color',
        width: 220,
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
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
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <div className="flex items-center gap-2">
              <Button
                type="primary"
                size="small"
                onClick={saveRow}
                icon={<IconCheck size={14} />}
                loading={status.create === Status.PENDING}
                disabled={status.create === Status.PENDING}
              />
              <Button size="small" onClick={cancel} icon={<IconX size={14} />} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button size="small" icon={<IconEdit size={16} />} onClick={() => startEdit(rec)} />
              <Popconfirm
                title="Delete this stage?"
                onConfirm={() => deleteRow(rec.constructionStage)}
              >
                <Button
                  size="small"
                  danger
                  icon={<IconTrash size={16} />}
                  disabled={status.create === Status.PENDING}
                />
              </Popconfirm>
            </div>
          ),
      },
    ];
  }, [stage, editingId, local]);

  const dataSource = useMemo(() => {
    if (editingId === 'new' && local) {
      return [
        ...stage,
        {
          constructionStage: local.constructionStage as string,
          constructionTypeId: typeId,
          builder: builderId,
          stageName: local.stageName || '',
          days: Number(local.days || 0),
          sortOrder: Number(local.sortOrder || stage.length + 1),
          siteImage: Boolean(local.siteImage),
          inspection: String(local.inspection),
          bgColor: local.bgColor || '#6f2ca8',
          fontColor: local.fontColor || '#fff',
        },
      ];
    }
    return stage;
  }, [stage, editingId, local]);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="w-full">
          <p className="text-base font-bold">Builder</p>
          <Select
            className="w-full"
            options={builderOptions}
            value={builderId}
            onChange={value => setBuilderId(value)}
          />
        </div>
        <div className="w-full">
          <p className="text-base font-bold">Construction type</p>
          <Select
            className="w-full"
            options={typeOptions}
            value={typeId}
            onChange={value => setTypeId(value)}
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
        rowKey="constructionStage"
        pagination={false}
        bordered
        size="middle"
        loading={status.fetch === Status.PENDING}
      />
    </div>
  );
}
