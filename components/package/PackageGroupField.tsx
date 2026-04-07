import { IconPlus, IconX } from '@tabler/icons-react';
import { Button, Dropdown, Form, Input, List, Popover } from 'antd';
import { useCallback, useMemo, useState } from 'react';

interface PackageGroupFieldProps {
  form: any;
  formName: string;
  label: string;
  data?: any[];
  fields?: { label: string; name: string; type: string }[];
  onSubmit?: (values: any, selectedValue: any) => void;
}

export const PackageGroupField = ({
  form,
  formName,
  label,
  data = [],
  fields = [],
  onSubmit,
}: PackageGroupFieldProps) => {
  const [childForm] = Form.useForm();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [enterPressed, setEnterPressed] = useState(false);
  const selected = form.getFieldValue(formName) || [];

  const filteredData = useMemo(
    () => data.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
    [data, search]
  );

  const hasNoResults = useMemo(
    () => search.trim() && filteredData.length === 0,
    [search, filteredData]
  );

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

  const getLabelById = useCallback(
    (id: string) => {
      const item = data.find(item => item.id === id);
      return item?.name || id;
    },
    [data]
  );

  const removeRegion = useCallback(
    (name: string) => {
      const current: string[] = form.getFieldValue(formName) || [];
      form.setFieldValue(
        formName,
        current.filter(r => r !== name)
      );
    },
    [form, formName]
  );

  const handleSubmit = (values: any) => {
    onSubmit?.(values, editingRegion);
    setEditingRegion(null);
    setCreateOpen(false);
  };

  const handleSearchEnter = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && hasNoResults) {
        setEnterPressed(true);
        setDropdownOpen(true);
      }
    },
    [hasNoResults]
  );

  const handleCreateFromSearch = useCallback(() => {
    setDropdownOpen(false);
    setEnterPressed(false);
    setCreateOpen(true);
    if (fields.length > 0) {
      childForm.setFieldsValue({ [fields[0].name]: search });
    }
  }, [fields, search, childForm]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setEnterPressed(false);
    setDropdownOpen(false);
  }, []);

  const createPopoverContent = useMemo(
    () => (
      <div className="w-56">
        <div className="mb-1 text-xs font-semibold">
          {editingRegion ? `Edit ${label}` : `Create ${label}`}
        </div>
        <Form form={childForm} onFinish={handleSubmit}>
          {fields?.map((field, index) => (
            <Form.Item key={index} name={field.name} label={field.label}>
              {field.type === 'text' && <Input />}
              {field.type === 'number' && <Input type="number" onWheel={(e) => e.currentTarget.blur()}/>}
            </Form.Item>
          ))}
          <Button type="primary" size="small" htmlType="submit">
            Save
          </Button>
        </Form>
      </div>
    ),
    [editingRegion, label, fields, childForm, handleSubmit]
  );

  // Memoized dropdown content
  const dropdownContent = useMemo(
    () => (
      <div className="w-64 p-4 bg-white rounded-lg shadow-lg border">
        <div className="text-center py-2">
          <p className="text-gray-600 mb-3">
            No {label.toLowerCase()} found matching "<strong>{search}</strong>"
          </p>
          <p className="text-gray-600 mb-4">
            Would you like to create a new {label.toLowerCase()} with this name?
          </p>
          <div className="flex gap-2 justify-center">
            <Button size="small" onClick={() => setDropdownOpen(false)}>
              Cancel
            </Button>
            <Button type="primary" size="small" onClick={handleCreateFromSearch}>
              Create {label}
            </Button>
          </div>
        </div>
      </div>
    ),
    [label, search, handleCreateFromSearch]
  );

  const content = () => (
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
              setEditingRegion(null);
            }
          }}
        >
          <Button
            size="small"
            type="default"
            onClick={() => {
              setEditingRegion(null);
              childForm.resetFields();
            }}
          >
            <IconPlus size={18} /> {label}
          </Button>
        </Popover>
      </div>
      {hasNoResults && enterPressed ? (
        <Dropdown
          open={dropdownOpen}
          onOpenChange={setDropdownOpen}
          dropdownRender={() => dropdownContent}
          trigger={['click']}
        >
          <Input
            placeholder={`Search ${label}`}
            value={search}
            onChange={handleSearchChange}
            onKeyDown={handleSearchEnter}
          />
        </Dropdown>
      ) : (
        <Input
          placeholder={`Search ${label}`}
          value={search}
          onChange={handleSearchChange}
          onKeyDown={handleSearchEnter}
        />
      )}
      {data.length === 0 ? (
        <div className="py-4 text-center text-xs text-gray-500">
          <div className="font-medium mb-1">No records found.</div>
        </div>
      ) : (
        <List
          size="small"
          dataSource={filteredData}
          renderItem={item => (
            <List.Item
              className={`cursor-pointer px-2 flex items-center justify-between ${
                selected.includes(item.id) ? 'bg-gray-100' : ''
              }`}
            >
              <div onClick={() => toggleRegion(item.id)} className="flex-1 flex items-center">
                <span>{item.name}</span>
              </div>
              <Button
                type="link"
                size="small"
                onClick={e => {
                  e.stopPropagation();
                  setEditingRegion(item);
                  childForm.setFieldsValue(item);
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
          selected?.length > 0 &&
          selected.map(region => (
            <Button key={region} size="small" type="primary">
              <span className="flex items-center gap-2">
                {getLabelById(region)} <IconX size={15} onClick={() => removeRegion(region)} />
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
