"use client";
import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Select,
  Table,
  Input,
  Switch,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";
import {
  IconCheck,
  IconEdit,
  IconPlus,
  IconX,
  IconTrash,
} from "@tabler/icons-react";
import { checklistDrawerData } from "data/configuration/ConfigrationData";

interface ChecklistDrawerProps {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

const ChecklistDrawer: React.FC<ChecklistDrawerProps> = ({
  open,
  onClose,
  record,
}) => {
  const [form] = Form.useForm();
  const [filters, setFilters] = useState({
    constructionType: "Double Storey",
    stage: "Base Stage",
  });

  const [data, setData] = useState<any[]>([]);
  const [editingKey, setEditingKey] = useState<string>("");
  const [newItem, setNewItem] = useState(false);

  useEffect(() => {
    if (record) {
      setData(checklistDrawerData(record));
    }
  }, [record]);

  const handleChange = (key: string, field: string, value: any) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddNew = () => {
    if (newItem) return;
    const newRow = {
      key: "new",
      sno: data.length + 1,
      description: "",
      notes: false,
      required: false,
      type: "Checkbox",
      sort: data.length + 1,
    };
    setData([...data, newRow]);
    setNewItem(true);
    setEditingKey("new");
  };

  const handleEdit = (key: string) => {
    setEditingKey(key);
  };

  const handleSave = (key: string) => {
    if (key === "new") {
      const newKey = Date.now().toString();
      const updated = data.map((d) =>
        d.key === "new" ? { ...d, key: newKey } : d
      );
      setData(updated);
      setNewItem(false);
    }
    setEditingKey("");
    message.success("Saved successfully");
  };

  const handleCancel = (key: string) => {
    if (key === "new") {
      setData((prev) => prev.filter((item) => item.key !== "new"));
      setNewItem(false);
    }
    setEditingKey("");
  };

  const handleDelete = (key: string) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    message.success("Deleted successfully");
  };

  const columns = [
    {
      title: "Description",
      dataIndex: "description",
      align: "left" as const,
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Input
            placeholder="Enter description"
            value={record.description}
            onChange={(e) =>
              handleChange(record.key, "description", e.target.value)
            }
          />
        ) : (
          record.description
        ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.notes}
          onChange={(val) => handleChange(record.key, "notes", val)}
          disabled={editingKey !== record.key}
        />
      ),
    },
    {
      title: "Required",
      dataIndex: "required",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Switch
          checked={record.required}
          onChange={(val) => handleChange(record.key, "required", val)}
          disabled={editingKey !== record.key}
        />
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Select
            style={{ width: "100%" }}
            value={record.type}
            onChange={(val) => handleChange(record.key, "type", val)}
            options={[
              { label: "Checkbox", value: "Checkbox" },
              { label: "Text", value: "Text" },
              { label: "Number", value: "Number" },
            ]}
          />
        ) : (
          record.type
        ),
    },
    {
      title: "Sort",
      dataIndex: "sort",
      width: "10%",
      render: (_: any, record: any) =>
        editingKey === record.key ? (
          <Input
            type="number"
            value={record.sort}
            onChange={(e) => handleChange(record.key, "sort", e.target.value)}
          />
        ) : (
          record.sort
        ),
    },
    {
      title: "Actions",
      width: "12%",
      align: "center",
      render: (_: any, record: any) => {
        if (editingKey === record.key) {
          return (
            <Space>
              <Button
                type="text"
                icon={<IconCheck style={{ color: "green" }} />}
                onClick={() => handleSave(record.key)}
              />
              <Button
                type="text"
                icon={<IconX style={{ color: "red" }} />}
                onClick={() => handleCancel(record.key)}
              />
            </Space>
          );
        }

        return (
          <Space>
            <Button
              type="text"
              icon={<IconEdit style={{ color: "blue" }} />}
              onClick={() => handleEdit(record.key)}
            />
            <Popconfirm
              title="Are you sure to delete this item?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => handleDelete(record.key)}
              okButtonProps={{ danger: true }}
            >
              <Button
                type="text"
                icon={<IconTrash style={{ color: "red" }} />}
              />
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  return (
    <Drawer
      title={record ? `Checklist Items - ${record.name}` : "Checklist Items"}
      placement="right"
      width={"60%"}
      onClose={onClose}
      open={open}
    >
      <Form form={form} layout="inline" style={{ marginBottom: 16 }}>
        <Form.Item label="Construction Types">
          <Select
            style={{ width: 200 }}
            value={filters.constructionType}
            onChange={(val) =>
              setFilters((p) => ({ ...p, constructionType: val }))
            }
            // this will be removed with api call dynamic data
            options={[
              { label: "Single Storey", value: "Single Storey" },
              { label: "Double Storey", value: "Double Storey" },
              { label: "Apartment", value: "Apartment" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Stage">
          <Select
            style={{ width: 200 }}
            value={filters.stage}
            onChange={(val) => setFilters((p) => ({ ...p, stage: val }))}
            // this will be removed with api call dynamic data
            options={[
              { label: "Base Stage", value: "Base Stage" },
              { label: "Fixing Stage", value: "Fixing Stage" },
              { label: "Final Stage", value: "Final Stage" },
            ]}
          />
        </Form.Item>

        <Button
          type="primary"
          icon={<IconPlus />}
          onClick={handleAddNew}
          style={{ marginLeft: "auto" }}
        >
          New
        </Button>
      </Form>

      <Table
        columns={columns as any}
        dataSource={data}
        pagination={false}
        size="middle"
        rowKey="key"
      />
    </Drawer>
  );
};

export default ChecklistDrawer;
