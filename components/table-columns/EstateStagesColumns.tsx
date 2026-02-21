import { Button, Tooltip, Input, DatePicker, Upload,message } from 'antd';
import { IconPaperclip, IconX, IconPencil, IconUpload, IconCheck } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { data as landLots } from 'data/landData';
import { EstateStage, IEstate } from '@redux/feature/estate/IEstateState';
import { useAppDispatch } from '@hooks/redux';
import { createEStateStage, updateEStateStage } from '@redux/feature/estate/estateThunk';
import { formDataGenerator } from '@lib/utils/formDataGenerator';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
//todo: lot manage
export const useEstateStagesColumns = (estate?: IEstate) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [editingRow, setEditingRow] = useState<EstateStage | null>(null);

  const handleDocumentUpload = (file: File) => {
    if (!editingRow) return false;
    if (file.type !== 'application/pdf') {
      message.error('Only PDF files are allowed');
      return false;
    }
    setEditingRow(prev => ({
      ...prev!,
      attachFile: [...(prev?.attachFile || []), file],
    }));

    return false;
  };

  const handleRemoveDocument = (index: number) => {
    if (!editingRow) return;

    setEditingRow(prev => {
      const docs = [...(prev?.attachFile || [])];
      docs.splice(index, 1);
      return { ...prev!, attachFile: docs };
    });
  };

  const lotsByStage = useMemo(() => {
    const counts: Record<string, number> = {};
    const estateNorm = (estate?.name || '').trim().toLowerCase();
    landLots.forEach(lot => {
      const stage = lot.stageName;
      if (!stage) return;
      const lotEstate = (lot.estate || '').toLowerCase();
      const estateMatches = estateNorm
        ? lotEstate.includes(estateNorm) || estateNorm.includes(lotEstate)
        : true;
      if (!estateMatches) return;
      counts[stage] = (counts[stage] || 0) + 1;
    });
    return counts;
  }, [estate?.name]);

  const handleLotsClick = (stageName: string) => {
    const params = new URLSearchParams();
    params.set('stageName', stageName);
    if (estate?.name) params.set('estate', estate?.name);
    router.push(`/land?${params.toString()}`);
  };

  const handleConfirm = async () => {
    try {
      if (editingRow?.estateStageId === '') {
        delete editingRow?.estateStageId;
        const formData = formDataGenerator({ ...editingRow, estateId: estate.estateId });
        await dispatch(createEStateStage(formData)).unwrap();
        message.success('Estate stage created successfully');
      } else {
        const { isUpdated, updatedFields } = getUpdatedFields(
          editingRow,
          estate.stages.find(i => i.estateStageId === editingRow?.estateStageId)
        );
        if (!isUpdated) {
          setEditingRow(null);
          return;
        }
        await dispatch(
          updateEStateStage({ id: editingRow?.estateStageId, data: updatedFields })
        ).unwrap();
        message.success('Estate stage updated successfully');
      }
      setEditingRow(null);
    } catch (error) {
      message.error(error || 'Failed to save estate stage');
    }
  };

  const columns = [
    {
      title: 'Stage Name',
      dataIndex: 'name',
      key: 'name',
      render: (_, record: EstateStage) =>
        record.estateStageId === editingRow?.estateStageId ? (
          <Input
            autoFocus
            value={editingRow?.name}
            onChange={e => setEditingRow(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Stage name"
          />
        ) : (
          <span>{record.name}</span>
        ),
    },
    {
      title: 'Release Date',
      dataIndex: 'releaseDate',
      key: 'releaseDate',
      render: (_, record: EstateStage) =>
        record.estateStageId === editingRow?.estateStageId ? (
          <DatePicker
            value={editingRow?.releaseDate ? dayjs(editingRow.releaseDate) : null}
            onChange={d =>
              setEditingRow(prev => ({ ...prev, releaseDate: d?.format('YYYY-MM-DD') || '' }))
            }
            format={'DD-MM-YYYY'}
            className="w-full"
          />
        ) : (
          <span>{dayjs(record.releaseDate).format('DD-MM-YYYY')}</span>
        ),
    },
    {
      title: 'Documents',
      dataIndex: 'document',
      key: 'documents',
      render: (_, record: EstateStage) => {
        // Show documents from record when not editing, from editingRow when editing
        const documents =
          record.estateStageId === editingRow?.estateStageId
            ? editingRow?.attachFile || []
            : record.attachFile || [];

        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">PDF Documents</span>
              {record.estateStageId === editingRow?.estateStageId && (
                <Upload
                  multiple
                  showUploadList={false}
                  beforeUpload={handleDocumentUpload}
                  accept=".pdf"
                >
                  <Button type="primary" size="small">
                    <IconUpload size={14} />
                    <span className="ml-1">Add PDF</span>
                  </Button>
                </Upload>
              )}
            </div>

            {documents.length > 0 && (
              <div className="space-y-1">
                {documents?.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded bg-gray-50"
                  >
                    <div className="flex items-center gap-2 flex-1">
                      <IconPaperclip size={14} className="text-red-500" />
                      <span className="text-sm truncate">{doc.name}</span>
                      <span className="text-xs text-gray-500">
                        {dayjs(doc.lastModified).format('DD-MM-YYYY HH:mm')}
                      </span>
                    </div>
                    {record.estateStageId === editingRow?.estateStageId && (
                      <Button
                        type="text"
                        danger
                        size="small"
                        onClick={() => handleRemoveDocument(index)}
                        title="Remove document"
                      >
                        <IconX size={12} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Lots',
      dataIndex: 'lots',
      key: 'lots',
      render: (_: string, record: EstateStage) => {
        const lotsCount = lotsByStage[record.name] || 0;
        return (
          <Button
            size="small"
            type="primary"
            disabled={record.estateStageId === editingRow?.estateStageId}
            onClick={() => handleLotsClick(record.name)}
          >
            Lots
            {lotsCount > 0 ? (
              <span className="text-primary bg-white rounded-full w-4 h-4 ml-1 flex items-center justify-center">
                {lotsCount}
              </span>
            ) : null}
          </Button>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: EstateStage) =>
        record.estateStageId === editingRow?.estateStageId ? (
          <div className="flex items-center gap-2">
            <Button type="text" onClick={handleConfirm}>
              <IconCheck size={18} className="text-green-600" />
            </Button>
            <Button type="text" onClick={() => setEditingRow(null)}>
              <IconX size={18} className="text-red-600" />
            </Button>
          </div>
        ) : (
          <Tooltip title="Edit">
            <Button
              type="text"
              icon={<IconPencil size={16} />}
              onClick={() => setEditingRow(record)}
            />
          </Tooltip>
        ),
    },
  ];

  const startAdd = () => {
    const tempRow = {
      estateStageId: '',
      name: '',
      releaseDate: '',
    };
    setEditingRow(tempRow);
  };

  return {
    columns,
    data:
      !!editingRow && editingRow?.estateStageId === ''
        ? [editingRow, ...estate?.stages]
        : estate?.stages,
    startAdd,
  };
};
