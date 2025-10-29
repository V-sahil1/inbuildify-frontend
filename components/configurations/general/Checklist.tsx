import React, { useState } from "react";
import { Table, Input, Select, Button, Space, Popconfirm, Drawer } from "antd";
import {
  IconCheck,
  IconTrash,
  IconEdit,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import ChecklistDrawer from "../components/ChecklistDrawer";
import { checklistData, checklistFunctionalityOptions, checklistScreenOptions } from "data/configuration/ConfigrationData";

const Checklist = () => {
  const [data, setData] = useState(checklistData || []);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [formRow, setFormRow] = useState({
    name: "",
    screen: "",
    functionality: "",
  });

  const handleAddNew = () => {
    setIsAdding(true);
    setFormRow({ name: "", screen: "", functionality: "" });
  };

  const handleSaveNew = () => {
    if (!formRow.name || !formRow.screen || !formRow.functionality) return;
    setData([...data, { id: Date.now(), ...formRow }]);
    setIsAdding(false);
  };

  const handleCancelNew = () => {
    setIsAdding(false);
  };

  const handleEdit = (record: any) => {
    setEditingId(record.id);
    setFormRow({
      name: record.name,
      screen: record.screen,
      functionality: record.functionality,
    });
  };

  const handleSaveEdit = (id: number) => {
    setData(
      data.map((item) => (item.id === id ? { ...item, ...formRow } : item))
    );
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handleRowClick = (record: any) => {
    setSelectedRecord(record);
    setIsDrawerVisible(true);
  };

  const columns = [
    {
      title: "Checklist Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any, index: number) => {
        if (isAdding && index === 0 && !record.id) {
          return (
            <Input
              value={formRow.name}
              onChange={(e) => setFormRow({ ...formRow, name: e.target.value })}
            />
          );
        }
        if (editingId === record.id) {
          return (
            <Input
              value={formRow.name}
              onChange={(e) => setFormRow({ ...formRow, name: e.target.value })}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Screen",
      dataIndex: "screen",
      key: "screen",
      render: (text: string, record: any, index: number) => {
        if (isAdding && index === 0 && !record.id) {
          return (
            // on the chnage of the screen the functionality will be chnaged
            <Select
              value={formRow.screen}
              options={checklistScreenOptions}
              style={{ width: "100%" }}
              onChange={(val) => setFormRow({ ...formRow, screen: val })}
            />
          );
        }
        if (editingId === record.id) {
          return (
            <Select
              value={formRow.screen}
              options={checklistScreenOptions}
              style={{ width: "100%" }}
              onChange={(val) => setFormRow({ ...formRow, screen: val })}
            />
          );
        }
        return text;
      },
    },
    {
      title: "Functionality",
      dataIndex: "functionality",
      key: "functionality",
      render: (text: string, record: any, index: number) => {
        if (isAdding && index === 0 && !record.id) {
          return (
            <Select
              value={formRow.functionality}
              options={checklistFunctionalityOptions}
              style={{ width: "100%" }}
              onChange={(val) => setFormRow({ ...formRow, functionality: val })}
            />
          );
        }
        if (editingId === record.id) {
          return (
            <Select
              value={formRow.functionality}
              options={checklistFunctionalityOptions}
              style={{ width: "100%" }}
              onChange={(val) => setFormRow({ ...formRow, functionality: val })}
            />
          );
        }
        return text;
      },
    },
    {
      key: "actions",
      render: (_: any, record: any, index: number) => {
        const iconStyle = { cursor: "pointer" };
        if (isAdding && index === 0 && !record.id) {
          return (
            <Space>
              <IconCheck
                onClick={handleSaveNew}
                style={{ color: "green", ...iconStyle }}
              />
              <IconX
                onClick={handleCancelNew}
                style={{ color: "red", ...iconStyle }}
              />
            </Space>
          );
        }

        if (editingId === record.id) {
          return (
            <Space>
              <IconCheck
                onClick={() => handleSaveEdit(record.id)}
                style={{ color: "green", ...iconStyle }}
              />
              <IconX
                onClick={handleCancelEdit}
                style={{ color: "red", ...iconStyle }}
              />
            </Space>
          );
        }

        return (
          <Space>
            <IconPlus style={{ color: "green", ...iconStyle }} />
            <IconEdit onClick={() => handleEdit(record)} style={iconStyle} />
            <Popconfirm
              title="Delete this checklist?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <IconTrash style={{ color: "red", ...iconStyle }} />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  const tableData = isAdding ? [{ key: "new", ...formRow }, ...data] : data;

  return (
    <div>
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}
      >
        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleAddNew}
          disabled={isAdding}
        >
          New
        </Button>
      </div>
      <ChecklistDrawer
        open={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        record={selectedRecord}
      />
      <Table
        columns={columns}
        dataSource={tableData}
        onRow={(record) => ({
          onClick: (e) => {
            e.preventDefault();
            handleRowClick(record);
          },
        })}
        pagination={false}
        rowKey="id"
      />
    </div>
  );
};

export default Checklist;
