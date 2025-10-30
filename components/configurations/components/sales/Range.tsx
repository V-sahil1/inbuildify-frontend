"use client";

import React, { useState } from "react";
import {
  Table,
  Input,
  Button,
  Tooltip,
  message,
  Space,
  Popconfirm,
  Select,
  Upload,
} from "antd";
import {
  IconTrash,
  IconPlus,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconPencil,
  IconUpload,
} from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { useUsersHook } from "@hooks/useUserData";
import { RangeData } from "data/configuration/leadsourceData";

interface StyledItem {
  id: number;
  name: string;
  sort: number;
  logo?: string;  
  header?: string;
  users?: number[]; 
  bgColor?: string;
  fontColor?: string;
  isActive?: boolean;
  isDraft?: boolean;
}

const initialData: StyledItem[] = RangeData;

export const Range: React.FC = () => {
  const [data, setData] = useState<StyledItem[]>(initialData);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingRow, setEditingRow] = useState<Partial<StyledItem>>({});
  const [isAdding, setIsAdding] = useState(false);
  const { users } = useUsersHook();
  const [isModalOpen, setIsModalOpen] = useState<{
    open: boolean;
    type: "activate" | "deactivate" | null;
    row: StyledItem | null;
  }>({
    open: false,
    type: null,
    row: null,
  });

  const sorted = (list: StyledItem[]) =>
    [...list].sort((a, b) => a.sort - b.sort);

  const insertAtSort = (
    prev: StyledItem[],
    newItem: StyledItem,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const maxPos = list.length + 1;
    const pos = Math.min(
      Math.max(
        1,
        Number.isFinite(desiredSort as number) ? (desiredSort as number) : 1
      ),
      maxPos
    );
    const newList = [
      ...list.slice(0, pos - 1),
      newItem,
      ...list.slice(pos - 1),
    ];
    return newList.map((item, idx) => ({ ...item, sort: idx + 1 }));
  };

  const moveExistingItem = (
    prev: StyledItem[],
    id: number,
    updates: Partial<StyledItem>,
    desiredSort?: number
  ) => {
    const list = sorted(prev);
    const idx = list.findIndex((i) => i.id === id);
    if (idx === -1) return prev;
    const item = { ...list[idx], ...updates };
    const others = list.filter((_, i) => i !== idx);
    const maxPos = others.length + 1;
    const pos = Math.min(
      Math.max(
        1,
        Number.isFinite(desiredSort as number)
          ? (desiredSort as number)
          : item.sort
      ),
      maxPos
    );
    const newList = [
      ...others.slice(0, pos - 1),
      item,
      ...others.slice(pos - 1),
    ];
    return newList.map((it, i) => ({ ...it, sort: i + 1 }));
  };

  const startEdit = (record: StyledItem) => {
    setEditingId(record.id);
    setEditingRow({ ...record });
  };

  const saveEdit = (id: number) => {
    if (!editingRow.name || editingRow.name.trim() === "") {
      message.error("Name cannot be empty");
      return;
    }

    const isNew = id < 0;
    const desiredSort = Number(editingRow.sort);

    if (isNew) {
      const finalId = Math.abs(id) || Date.now();
      const newItem: StyledItem = {
        ...(editingRow as StyledItem),
        id: finalId,
        sort: Number.isFinite(desiredSort) ? desiredSort : 1,
        isDraft: false,
        isActive: editingRow.isActive ?? true,
      } as StyledItem;

      setData((prev) => {
        const prevClean = prev.filter((it) => it.id !== id); 
        return insertAtSort(prevClean, newItem, newItem.sort);
      });

      setIsAdding(false);
    } else {
      setData((prev) => {
        const current = prev.find((p) => p.id === id);
        if (!current) return prev;

        const updatedFields: Partial<StyledItem> = {
          ...editingRow,
          isDraft: false,
        };

        if (Number.isFinite(desiredSort) && desiredSort !== current.sort) {
          return moveExistingItem(prev, id, updatedFields, desiredSort);
        }

        // just update
        return prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      });
    }

    setEditingId(null);
    setEditingRow({});
    message.success("Saved successfully");
  };

  const cancelEdit = () => {
    if (isAdding && editingId) {
      setData((prev) => prev.filter((item) => item.id !== editingId));
      setIsAdding(false);
    }
    setEditingId(null);
    setEditingRow({});
  };

  const handleAdd = () => {
    const newRow: StyledItem = {
      id: -Date.now(),
      name: "",
      sort: 1,
      isActive: true,
      isDraft: true,
    };
    setData((prev) => [newRow, ...prev]);
    setEditingId(newRow.id);
    setEditingRow(newRow);
    setIsAdding(true);
  };

  const openDeactivateModal = (row: StyledItem) =>
    setIsModalOpen({ open: true, type: "deactivate", row });

  const openActivateModal = (row: StyledItem) =>
    setIsModalOpen({ open: true, type: "activate", row });

  const handleDeactivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    setData((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, isActive: false } : p))
    );
    message.success("Item deactivated");
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const handleActivateConfirm = () => {
    const row = isModalOpen.row;
    if (!row) return;
    setData((prev) =>
      prev.map((p) => (p.id === row.id ? { ...p, isActive: true } : p))
    );
    message.success("Item activated");
    setIsModalOpen({ open: false, type: null, row: null });
  };

  const handleSortChange = (value: number | string) => {
    const num = Number(value);
    setEditingRow((prev) => ({ ...prev, sort: isNaN(num) ? undefined : num }));
  };
  const columns = [
    {
      title: (
        <div className="flex items-center gap-1">
          Name
          <Tooltip title="Display label">
            <IconInfoCircle size={14} />
          </Tooltip>
        </div>
      ),
      dataIndex: "name",
      key: "name",
      render: (_: any, record: StyledItem) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) {
          return <span className="text-gray-400 italic">{record.name}</span>;
        }
        return isEditing ? (
          <div className="flex flex-col gap-2">
            <Input
              value={editingRow.name}
              placeholder="Enter name"
              onChange={(e) =>
                setEditingRow((p) => ({ ...p, name: e.target.value }))
              }
            />
            <div className="flex items-center gap-3">
              <div>
                <div className="text-xs text-gray-500">BG color</div>
                <Input
                  type="color"
                  value={editingRow.bgColor ?? "#7c3aed"}
                  onChange={(e) =>
                    setEditingRow((p) => ({ ...p, bgColor: e.target.value }))
                  }
                  style={{ width: 56, height: 32, padding: 0, borderRadius: 4 }}
                />
              </div>
              <div>
                <div className="text-xs text-gray-500">Font color</div>
                <Input
                  type="color"
                  value={editingRow.fontColor ?? "#ffffff"}
                  onChange={(e) =>
                    setEditingRow((p) => ({ ...p, fontColor: e.target.value }))
                  }
                  style={{ width: 56, height: 32, padding: 0, borderRadius: 4 }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>
            <span
              className="px-4 py-1 rounded-full text-sm"
              style={{
                background: record.bgColor ?? "#a78bfa",
                color: record.fontColor ?? "#fff",
                display: "inline-block",
              }}
            >
              {record.name}
            </span>
          </div>
        );
      },
    },
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      width: 120,
      render: (_: any, record: StyledItem) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload
            showUploadList={false}
            listType="picture"
            beforeUpload={() => false}
          >
            <Button icon={<IconUpload />}>Upload</Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            {/* placeholder logo */}
            <span className="text-xs text-gray-400">NO IMAGE</span>
          </div>
        );
      },
    },
    {
      title: "Header",
      dataIndex: "header",
      key: "header",
      width: 120,
      render: (_: any, record: StyledItem) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Upload
            showUploadList={false}
            listType="picture"
            beforeUpload={() => false}
          >
            <Button icon={<IconUpload />}>Upload</Button>
          </Upload>
        ) : (
          <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
            <span className="text-xs text-gray-400">NO IMAGE</span>
          </div>
        );
      },
    },
    {
      title: "User",
      dataIndex: "users",
      key: "users",
      render: (_: any, record: StyledItem) => {
        const isEditing = editingId === record.id;
        if (!record.isActive) return <div className="text-gray-400">-</div>;
        return isEditing ? (
          <Select
            mode="multiple"
            placeholder="Select Users"
            value={(editingRow.users as number[]) ?? []}
            options={users.map((user) => ({ value: user.usersId, label: user.name }))}
            onChange={(vals) => setEditingRow((p) => ({ ...p, users: vals }))}
            style={{ minWidth: 220 }}
          />
        ) : (
          <div className="text-sm text-gray-600">
            {(record.users ?? []).length > 0
              ? `${(record.users ?? []).length} user(s)`
              : ""}
          </div>
        );
      },
    },
    {
      title: "Sort",
      dataIndex: "sort",
      key: "sort",
      width: 100,
      render: (sort: number, record: StyledItem) => {
        const isEditing = editingId === record.id;
        if (!record.isActive)
          return <div className="text-gray-400">{record.sort}</div>;
        return (
          <Input
            type="number"
            value={isEditing ? editingRow.sort ?? "" : sort}
            onChange={(e) => isEditing && handleSortChange(e.target.value)}
            disabled={!isEditing}
            style={{ width: 72 }}
          />
        );
      },
    },
    {
      title: "",
      key: "actions",
      width: 140,
      render: (_: any, row: StyledItem) => {
        const inactive = row.isActive === false;
        const editing = editingId === row.id;

        if (inactive) {
          return (
            <div className="text-right">
              <Tooltip title="Reactivate this item">
                <Button
                  type="text"
                  icon={<IconPlus size={18} />}
                  onClick={() => openActivateModal(row)}
                />
              </Tooltip>
            </div>
          );
        }

        if (editing) {
          return (
            <div className="text-right">
              <Space>
                <Tooltip title="Save">
                  <Button
                    type="text"
                    icon={<IconCheck size={18} className="text-green-500" />}
                    onClick={() => saveEdit(row.id)}
                  />
                </Tooltip>
                <Tooltip title="Cancel">
                  <Button
                    type="text"
                    icon={<IconX size={18} className="text-red-500" />}
                    onClick={cancelEdit}
                  />
                </Tooltip>
              </Space>
            </div>
          );
        }

        return (
          <div className="text-right">
            <Space>
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={() => startEdit(row)}
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to deactivate?"
                onConfirm={() => openDeactivateModal(row)}
                okText="Inactivate"
                cancelText="Cancel"
              >
                <Button
                  type="text"
                  icon={<IconTrash size={18} className="text-red-500" />}
                />
              </Popconfirm>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-xl">Range</h3>
        <div className="flex items-center gap-2">
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={handleAdd}
            disabled={!!editingId}
          >
            New
          </Button>
        </div>
      </div>

      <Table
        pagination={false}
        columns={columns}
        dataSource={sorted(data)}
        rowKey="id"
        size="middle"
        className="ant-table-striped"
      />

      <ConfirmationModal
        open={isModalOpen.open}
        onClose={() => setIsModalOpen({ open: false, type: null, row: null })}
        onConfirm={
          isModalOpen.type === "activate"
            ? handleActivateConfirm
            : handleDeactivateConfirm
        }
        title={
          isModalOpen.type === "activate"
            ? "Activate item?"
            : "Deactivate item?"
        }
        message={
          isModalOpen.row
            ? `Are you sure you want to ${
                isModalOpen.type === "activate" ? "activate" : "deactivate"
              } "${isModalOpen.row.name}"?`
            : "Confirm Action"
        }
        type={isModalOpen.type === "activate" ? "success" : "warning"}
        confirmText={
          isModalOpen.type === "activate" ? "Activate" : "Deactivate"
        }
      />
    </div>
  );
};
