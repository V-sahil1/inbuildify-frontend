import { IconPlus, IconX } from '@tabler/icons-react';
import { Button, Input, List, Popover} from 'antd';
import { useState } from 'react';

export const PackageGroupField = ({ form, formName, label }) => {
  const selected: string[] = form.getFieldValue(formName) || [];
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [editingRegion, setEditingRegion] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const toggleRegion = (name: string) => {
    const current: string[] = form.getFieldValue(formName) || [];
    if (current.includes(name)) {
      form.setFieldValue(
        formName,
        current.filter(r => r !== name)
      );
    } else {
      form.setFieldValue(formName, [...current, name]);
    }
  };

  const removeRegion = (name: string) => {
    const current: string[] = form.getFieldValue(formName) || [];
    form.setFieldValue(
      formName,
      current.filter(r => r !== name)
    );
  };

  const handleCreateRegion = () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setAvailableRegions(prev => {
      if (editingRegion) {
        const updated = prev.map(r => (r === editingRegion ? trimmed : r));
        const current: string[] = form.getFieldValue(formName) || [];
        if (current.includes(editingRegion)) {
          form.setFieldValue(
            formName,
            current.map(r => (r === editingRegion ? trimmed : r))
          );
        }
        return updated;
      }
      return prev.includes(trimmed) ? prev : [...prev, trimmed];
    });
    setEditName('');
    setEditingRegion(null);
    setCreateOpen(false);
  };

  const filteredRegions = availableRegions.filter(r =>
    r.toLowerCase().includes(search.toLowerCase())
  );

  const createPopoverContent = (
    <div className="w-56">
      <div className="mb-1 text-xs font-semibold">
        {editingRegion ? `Edit ${label}` : `Create ${label}`}
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
        <div className="font-semibold">{label}</div>
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
            }
          }}
        >
          <Button
            size="small"
            type="default"
            onClick={() => {
              setEditingRegion(null);
              setEditName('');
            }}
          >
            <IconPlus size={18} /> {label}
          </Button>
        </Popover>
      </div>
      <Input
        placeholder={`Search ${label}`}
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
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
    <div className="flex gap-2 items-center">
      <div className="flex flex-wrap gap-1">
        {selected &&
          selected.length > 0 &&
          selected.map(region => (
            <Button key={region} size="small" type="primary">
              <span className="flex items-center gap-2">
                {region} <IconX size={15} onClick={() => removeRegion(region)} />
              </span>
            </Button>
          ))}
      </div>
      <Popover
        content={content}
        trigger="click"
        open={open}
        onOpenChange={setOpen}
        placement="bottomLeft"
      >
        <Button type="default">
          <span className="flex items-center gap-2">
            <IconPlus size={18} /> {label}
          </span>
        </Button>
      </Popover>
    </div>
  );
};
