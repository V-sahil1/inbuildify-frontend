'use client';

import React, { useState } from 'react';
import { Button, Input, List, Tooltip } from 'antd';
import { IconCirclePlus, IconPencil } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useAppSelector } from '@hooks/redux';

interface FeatureItem {
  id: string;
  text: string;
  author: string;
  createdAt: string;
}

export default function EstateFeatures() {
  const { user } = useAppSelector(state => state.auth);
  const currentUserName = user?.name || '';
  const [items, setItems] = useState<FeatureItem[]>([
    { id: '1', text: 'new', author: currentUserName, createdAt: new Date().toISOString() },
  ]);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');

  const onAdd = () => {
    setAdding(true);
    setValue('');
  };

  const confirmAdd = () => {
    if (!value.trim()) return;
    setItems(prev => [
      {
        id: String(Date.now()),
        text: value.trim(),
        author: currentUserName,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setAdding(false);
    setValue('');
  };

  const cancelAdd = () => {
    setAdding(false);
    setValue('');
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditingValue(text);
  };

  const saveEdit = () => {
    if (!editingId) return;
    setItems(prev => prev.map(it => (it.id === editingId ? { ...it, text: editingValue } : it)));
    setEditingId(null);
    setEditingValue('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingValue('');
  };

  return (
    <div className="bg-white p-4">
      <div className="flex items-center justify-center mb-3 text-primary">
        <Button type="text" onClick={onAdd} disabled={adding}>
          <IconCirclePlus size={16} />
          <span>Feature</span>
        </Button>
      </div>

      {adding && (
        <div className="mb-3">
          <Input.TextArea
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder="Write feature description..."
          />
          <div className="mt-2 flex gap-2 justify-end">
            <Button onClick={cancelAdd}>Cancel</Button>
            <Button type="primary" onClick={confirmAdd}>
              Add
            </Button>
          </div>
        </div>
      )}

      <List
        dataSource={items}
        renderItem={item => (
          <List.Item className="border rounded-md mb-3 p-3">
            <div className="w-full mx-3">
              {editingId === item.id ? (
                <div>
                  <Input.TextArea
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    value={editingValue}
                    onChange={e => setEditingValue(e.target.value)}
                  />
                  <div className="mt-2 flex gap-2 justify-end">
                    <Button onClick={cancelEdit}>Cancel</Button>
                    <Button type="primary" onClick={saveEdit}>
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div>{item.text}</div>
                  <Tooltip title="Edit">
                    <Button
                      type="text"
                      icon={<IconPencil size={16} />}
                      onClick={() => startEdit(item.id, item.text)}
                    />
                  </Tooltip>
                </div>
              )}
              <div className="text-xs text-primary mt-2">
                {item.author} added feature on {dayjs(item.createdAt).format('DD-MM-YYYY')}
              </div>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
}
