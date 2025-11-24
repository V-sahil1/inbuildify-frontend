import { Button, Badge, Tooltip, Input, DatePicker, Popover, Upload, List } from 'antd';
import { IconPaperclip, IconX, IconPencil, IconUpload, IconCheck } from '@tabler/icons-react';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { data as landLots } from 'data/landData';

export interface StageItem {
  key: string;
  name: string;
  releaseDate: string;
  document?: string;
}

export interface AttachmentItem {
  name: string;
  url?: string;
  uploadedAt?: string;
}

export const useEstateStagesColumns = (estateName?: string) => {
  const router = useRouter();

  const estateStagesSampleData: StageItem[] = [
    { key: '4', name: 'Stage 4', releaseDate: '30-09-2025' },
    { key: '3', name: 'Stage 3', releaseDate: '24-09-2025' },
    { key: '2', name: 'Stage 2', releaseDate: '04-09-2025' },
    { key: '1', name: 'Stage 1', releaseDate: '28-08-2025' },
  ];

  const [data, setData] = useState<StageItem[]>(estateStagesSampleData);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDate, setNewDate] = useState<Dayjs | null>(null);
  const [attachments, setAttachments] = useState<Record<string, AttachmentItem[]>>({});

  const lotsByStage = useMemo(() => {
    const counts: Record<string, number> = {};
    const estateNorm = (estateName || '').trim().toLowerCase();
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
  }, [estateName]);

  const handleBeforeUpload = (recordKey: string) => (file: File) => {
    const url = URL.createObjectURL(file);
    const uploadedAt = new Date().toISOString();
    setAttachments(prev => ({
      ...prev,
      [recordKey]: [...(prev[recordKey] || []), { name: file.name, url, uploadedAt }],
    }));
    return false;
  };

  const handleRemoveAttachment = (recordKey: string, idx: number) => {
    setAttachments(prev => {
      const list = [...(prev[recordKey] || [])];
      const [removed] = list.splice(idx, 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return { ...prev, [recordKey]: list };
    });
  };

  const handleLotsClick = (stageName: string) => {
    const params = new URLSearchParams();
    params.set('stageName', stageName);
    if (estateName) params.set('estate', estateName);
    router.push(`/land?${params.toString()}`);
  };

  const handleConfirm = () => {
    if (!newName.trim() || !newDate) return;
    const newItem: StageItem = {
      key: String(Date.now()),
      name: newName.trim(),
      releaseDate: newDate.format('DD-MM-YYYY'),
    };
    setData(prev => [newItem, ...prev]);
    setAdding(false);
    setNewName('');
    setNewDate(null);
  };

  const handleCancel = () => {
    setAdding(false);
    setNewName('');
    setNewDate(null);
  };

  const columns = [
    {
      title: 'Stage Name',
      dataIndex: 'name',
      key: 'name',
      render: (_: any, record: StageItem) =>
        record.key === '__new__' ? (
          <Input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
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
      render: (_: any, record: StageItem) =>
        record.key === '__new__' ? (
          <DatePicker
            value={newDate}
            onChange={d => setNewDate(d)}
            format={'DD-MM-YYYY'}
            className="w-full"
          />
        ) : (
          <span>{record.releaseDate}</span>
        ),
    },
    {
      title: 'Documents',
      dataIndex: 'document',
      key: 'documents',
      render: (_: string | undefined, record: StageItem) => {
        const files = attachments[record.key] || [];
        const content = (
          <div className="w-96">
            <div className="flex items-center justify-between">
              <span>Attachments</span>
              <Upload multiple showUploadList={false} beforeUpload={handleBeforeUpload(record.key)}>
                <Button type="primary" size="small" className="mb-3">
                  <IconUpload size={16} />
                </Button>
              </Upload>
            </div>
            <List
              dataSource={files}
              locale={{ emptyText: 'No attachments' }}
              renderItem={(item, idx) => (
                <List.Item className="py-1 flex justify-between items-start gap-3">
                  <div className="flex gap-2 items-center">
                    <a
                      className="text-primary hover:underline"
                      onClick={() => item.url && window.open(item.url, '_blank')}
                    >
                      {item.name}
                    </a>
                    <span className="text-xs text-gray-500">
                      {item.uploadedAt ? dayjs(item.uploadedAt).format('DD-MM-YYYY') : ''}
                    </span>
                  </div>
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={() => handleRemoveAttachment(record.key, idx)}
                  >
                    <IconX size={14} />
                  </Button>
                </List.Item>
              )}
            />
          </div>
        );
        return (
          <Popover content={content} trigger="click">
            <Button size="small" type="text">
              <Badge count={files.length} size="small" color="orange" offset={[3, 0]}>
                <Tooltip title="Documents">
                  <IconPaperclip size={16} />
                </Tooltip>
              </Badge>
            </Button>
          </Popover>
        );
      },
    },
    {
      title: 'Lots',
      dataIndex: 'lots',
      key: 'lots',
      render: (_: string, record: StageItem) => {
        const lotsCount = lotsByStage[record.name] || 0;
        return (
          <Button
            size="small"
            type="primary"
            disabled={record.key === '__new__'}
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
      render: (_: any, record: StageItem) =>
        record.key === '__new__' ? (
          <div className="flex items-center gap-2">
            <Button type="text" onClick={handleConfirm}>
              <IconCheck size={18} className="text-green-600" />
            </Button>
            <Button type="text" onClick={handleCancel}>
              <IconX size={18} className="text-red-600" />
            </Button>
          </div>
        ) : (
          <Tooltip title="Edit">
            <Button type="text" icon={<IconPencil size={16} />} />
          </Tooltip>
        ),
    },
  ];

  const tempRow: StageItem | null = useMemo(() => {
    if (!adding) return null;
    return {
      key: '__new__',
      name: newName,
      releaseDate: newDate ? newDate.format('DD-MM-YYYY') : '',
      document: '0',
    };
  }, [adding, newName, newDate]);

  const startAdd = () => {
    setAdding(true);
    setNewName('');
    setNewDate(null);
  };

  return {
    columns,
    data: tempRow ? [tempRow, ...data] : data,
    startAdd,
  };
};
