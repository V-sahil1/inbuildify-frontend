'use client';

import React, { useState } from 'react';
import { Button, Form, Input, Popover, Tag, List } from 'antd';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconPlus } from '@tabler/icons-react';
import { estateDetailsFields } from '@/components/formFields/estateDetails';
import { useStateHook } from '@hooks/useStateHook';
import { IEstate } from '@redux/feature/estate/IEstateState';

interface EstateDetailModalProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (values: IEstate) => void;
}

export const RegionField: React.FC = () => {
  const form = Form.useFormInstance();
  const selected: string[] = form.getFieldValue('region') || [];
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editingRegion, setEditingRegion] = useState<string | null>(null);
  const [editActionType, setEditActionType] = useState<'editName' | 'editRegion' | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  //todo: region

  const toggleRegion = (name: string) => {
    const current: string[] = form.getFieldValue('region') || [];
    if (current.includes(name)) {
      form.setFieldValue(
        'region',
        current.filter(r => r !== name)
      );
    } else {
      form.setFieldValue('region', [...current, name]);
    }
  };

  const removeRegion = (name: string) => {
    const current: string[] = form.getFieldValue('region') || [];
    form.setFieldValue(
      'region',
      current.filter(r => r !== name)
    );
  };

  const handleCreateRegion = () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setAvailableRegions(prev => {
      if (editingRegion) {
        const updated = prev.map(r => (r === editingRegion ? trimmed : r));
        const current: string[] = form.getFieldValue('region') || [];
        if (current.includes(editingRegion)) {
          form.setFieldValue(
            'region',
            current.map(r => (r === editingRegion ? trimmed : r))
          );
        }
        return updated;
      }
      return prev.includes(trimmed) ? prev : [...prev, trimmed];
    });
    setEditName('');
    setEditingRegion(null);
    setEditActionType(null);
    setCreateOpen(false);
  };

  const filteredRegions = availableRegions.filter(r =>
    r.toLowerCase().includes(search.toLowerCase())
  );

  const createPopoverContent = (
    <div className="w-56">
      <div className="mb-1 text-xs font-semibold">
        {editActionType ? 'Edit Region' : 'Create Region'}
      </div>
      <div className="flex gap-2">
        <Input
          value={editName}
          onChange={e => setEditName(e.target.value)}
          placeholder="Name"
          size="small"
          onPressEnter={handleCreateRegion}
        />
        <Button type="primary" size="small" onClick={handleCreateRegion}>
          Save
        </Button>
      </div>
    </div>
  );

  const content = (
    <div className="w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Region</div>
        <Popover
          content={createPopoverContent}
          trigger="click"
          placement="bottomRight"
          open={createOpen}
          onOpenChange={visible => {
            setCreateOpen(visible);
            if (!visible) {
              setEditName('');
              setEditingRegion(null);
              setEditActionType(null);
            }
          }}
        >
          <Button
            size="small"
            type="default"
            onClick={() => {
              setEditingRegion(null);
              setEditName('');
              setEditActionType(null);
            }}
          >
            <IconPlus size={18} /> Region
          </Button>
        </Popover>
      </div>
      <Input placeholder="Search region" value={search} onChange={e => setSearch(e.target.value)} />
      {filteredRegions.length === 0 ? (
        <div className="py-4 text-center text-xs text-gray-500">
          <div className="font-medium mb-1">No records found.</div>
        </div>
      ) : (
        <List
          size="small"
          dataSource={filteredRegions}
          renderItem={item => (
            <List.Item
              className={`cursor-pointer px-2 flex items-center justify-between ${
                selected.includes(item) ? 'bg-gray-100' : ''
              }`}
            >
              <div onClick={() => toggleRegion(item)} className="flex-1 flex items-center">
                <span>{item}</span>
              </div>
              <Button
                type="link"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setEditingRegion(item);
                  setEditName(item);
                  setEditActionType('editName');
                  setCreateOpen(true);
                }}
              >
                Edit
              </Button>
            </List.Item>
          )}
        />
      )}
    </div>
  );

  return (
    <div className="flex gap-2">
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
      >
        <Button size="small" type="default">
          <IconPlus size={18} /> Region
        </Button>
      </Popover>
      <div className="flex flex-wrap gap-1">
        {selected.map(region => (
          <Tag key={region} closable onClose={() => removeRegion(region)}>
            {region}
          </Tag>
        ))}
      </div>
    </div>
  );
};

const EstateDetailModal: React.FC<EstateDetailModalProps> = ({
  open,
  loading,
  onCancel,
  onSubmit,
}) => {
  const { stateOptions } = useStateHook();

  return (
    <ActionDialogmodel
      open={open}
      onCancel={onCancel}
      title="New Estate"
      isEditing={true}
      loading={loading}
      fields={estateDetailsFields(
        () => (
          <RegionField />
        ),
        stateOptions
      )}
      onSubmit={onSubmit}
      submitButtonText="Save"
    />
  );
};

export default EstateDetailModal;
