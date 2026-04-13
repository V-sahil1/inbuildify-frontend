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
import {
  createStage,
  deleteStage,
  fetchAllConstructionStage,
  updateStage,
} from '@redux/feature/admin/construction/constructionStage/constructionStageThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { ConstructionStage } from '@redux/feature/admin/construction/constructionStage/IConstructionStageState';
import { useConstructionTypeHook } from '@hooks/useConstructionTypeHook';
import TooltipButton from '@/components/common/TooltipButton';
import { handleReorder } from '@lib/utils/reorderBySort';
import { updateStageList } from '@redux/feature/admin/construction/constructionStage/constructionStageSlice';

export function Stages() {
  const dispatch = useAppDispatch();
  const [editingId, setEditingId] = useState<string | 'new' | null>(null);
  const [selectedStage, setSelectedStage] = useState<ConstructionStage | null>(null);
  const [local, setLocal] = useState<Partial<ConstructionStage> | null>(null);
  const [header, setHeader] = useState<{ builder: string; type: string }>({
    builder: null,
    type: null,
  });
  const { builderOptions } = useBuildersHook();
  const { stage, status } = useAppSelector(state => state.construction.constructionStage);
  const { typeOptions } = useConstructionTypeHook();

  const fetchStageData = async () => {
    try {
      await dispatch(fetchAllConstructionStage({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction stage');
    }
  };
  useEffect(() => {
    if (typeOptions && typeOptions.length > 0) {
      setHeader(prev => ({ ...prev, type: typeOptions[0].value }));
    }
  }, [typeOptions]);

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchStageData();
    }
  }, [status.fetch]);

  useEffect(() => {
    if (builderOptions && builderOptions.length > 0) {
      setHeader(prev => ({ ...prev, builder: builderOptions[0].value }));
    }
  }, [builderOptions]);

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
      let response;
      if (editingId === 'new') {
        // insert
        const newRow: ConstructionStage = {
          constructionTypeId: header.type,
          builder: header.builder,
          stageName: local.stageName!,
          days: Number(local.days || 0),
          sortOrder: 1,
          siteImage: Boolean(local.siteImage),
          inspection: String(local.inspection),
          bgColor: local.bgColor || '#6f2ca8',
          fontColor: local.fontColor || '#ffffff',
        };
        response = await dispatch(createStage(newRow)).unwrap();
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
        const { isUpdated, updatedFields } = getUpdatedFields(updatedValues, selectedStage);
        if (!isUpdated) {
          setSelectedStage(null);
          setEditingId(null);
          setLocal(null);
          return;
        }
        response = await dispatch(updateStage({ data: updatedFields, id })).unwrap();
        message.success('Stage updated');
      }
      setEditingId(null);
      setLocal(null);
      if (response) {
        const updatedList = handleReorder(stage, response, {
          idKey: 'constructionStage',
          sortKey: 'sortOrder',
        });
        dispatch(updateStageList(updatedList));
      }
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
        width: 120,
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <Input
              value={local?.stageName}
              onChange={e => setLocal(s => ({ ...(s || {}), stageName: e.target.value }))}
              placeholder="Stage name"
              className="w-25"
            />
          ) : (
            <div>{rec.stageName}</div>
          ),
      },
      {
        title: 'Days',
        key: 'days',
        render: (_, rec: ConstructionStage) =>
          editingId === rec.constructionStage ||
          (editingId === 'new' && rec.constructionStage === (local?.constructionStage ?? 0)) ? (
            <InputNumber
              min={0}
              value={local?.days}
              onChange={v => setLocal(s => ({ ...(s || {}), days: Number(v || 0) }))}
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
                type="text"
                size="small"
                onClick={saveRow}
                icon={<IconCheck size={16} />}
                loading={status.create === Status.PENDING}
                disabled={status.create === Status.PENDING}
              />
              <Button size="small" type="text" onClick={cancel} icon={<IconX size={16} />} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <TooltipButton
                title="Edit"
                size="small"
                type="text"
                icon={<IconEdit size={16} />}
                onClick={() => startEdit(rec)}
              />
              <Popconfirm
                title="Are you sure you want to delete this stage?"
                onConfirm={() => deleteRow(rec.constructionStage)}
              >
                <TooltipButton
                  title="Delete"
                  size="small"
                  type="text"
                  icon={<IconTrash size={16} color="red" />}
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
          constructionTypeId: header?.type,
          builder: header?.builder,
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
    <div className="p-4 bg-card-color rounded-lg shadow-sm">
      <div className="flex justify-between items-end mb-6 gap-4">
        <div className="w-full">
          <p className="text-base font-bold">Builder</p>
          <Select
            className="w-full"
            options={builderOptions}
            value={header?.builder}
            onChange={value => setHeader(prev => ({ ...prev, builder: value }))}
          />
        </div>
        <div className="w-full">
          <p className="text-base font-bold">Construction type</p>
          <Select
            className="w-full"
            options={typeOptions}
            value={header?.type}
            onChange={value => setHeader(prev => ({ ...prev, type: value }))}
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
