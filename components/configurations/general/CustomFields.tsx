"use client";
import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  Table,
  Space,
  Form,
  Popconfirm,
  Card,
} from "antd";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconList,
} from "@tabler/icons-react";
import { customFieldsData, fieldTypeOptions } from "data/configuration/ConfigrationData";
import { ActionDialogmodel } from "@/components/common/Models/ActionDialogModel";

const sectionOptions = [
  { label: "Lead Info", value: "lead" },
  { label: "Client Info", value: "client" },
  { label: "Project Info", value: "project" },
];

const CustomFields: React.FC = () => {
  const [selectedSection, setSelectedSection] = useState("lead");
  const [sectionData, setSectionData] = useState<Record<string, any[]>>(customFieldsData);

  const [editingRow, setEditingRow] = useState<any | null>(null);
  const [listOptionsrecord, setListOptionsrecord] = useState<any | null>(null);
  const [form] = Form.useForm();

  const handleAdd = () => {
    const newRow = {
      id: Date.now(),
      name: "",
      fieldType: undefined,
      sortOrder: "",
      isActive: true,
    };
    setEditingRow(newRow);
    form.setFieldsValue(newRow);
  };

  const handleOpenListOptions = (record: any) => {
    setListOptionsrecord(record);
  };
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const newData = [...(sectionData[selectedSection] || [])];

      if (editingRow && newData.some((item) => item.id === editingRow.id)) {
        const index = newData.findIndex((item) => item.id === editingRow.id);
        newData[index] = { ...editingRow, ...values };
      } else {
        newData.push({ id: Date.now(), ...values });
      }

      setSectionData({ ...sectionData, [selectedSection]: newData });
      setEditingRow(null);
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  const handleDelete = (id: number) => {
    const updated = sectionData[selectedSection].filter(
      (item) => item.id !== id
    );
    setSectionData({ ...sectionData, [selectedSection]: updated });
  };

  const handleEdit = (record: any) => {
    setEditingRow(record);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    setEditingRow(null);
    form.resetFields();
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (_: any, record: any) =>
        editingRow?.id === record.id ? (
          <Form.Item
            name="name"
            rules={[{ required: true, message: "" }]}
            style={{ margin: 0 }}
          >
            <Input />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: "Field Type",
      dataIndex: "fieldType",
      render: (_: any, record: any) =>
        editingRow?.id === record.id ? (
          <Form.Item
            name="fieldType"
            rules={[{ required: true, message: "" }]}
            style={{ margin: 0 }}
          >
            <Select
              options={fieldTypeOptions}
              placeholder="Please select"
              className="w-full"
            />
          </Form.Item>
        ) : (
          <div className="flex items-center gap-1">
            {record.fieldType === "list" && <IconList size={14} className="cursor-pointer" onClick={() => handleOpenListOptions(record)}/>}
            {fieldTypeOptions.find((opt) => opt.value === record.fieldType)
              ?.label ?? "-"}
          </div>
        ),
    },
    {
      title: "Sort Order",
      dataIndex: "sortOrder",
      width: 120,
      render: (_: any, record: any) =>
        editingRow?.id === record.id ? (
          <Form.Item
            name="sortOrder"
            rules={[{ required: true, message: "" }]}
            style={{ margin: 0 }}
          >
            <Input type="number" />
          </Form.Item>
        ) : (
          record.sortOrder
        ),
    },
    {
      title: (
        <Button type="primary" onClick={handleAdd} disabled={!!editingRow}>
          New
        </Button>
      ),
      width: 100,
      render: (_: any, record: any) =>
        editingRow?.id === record.id ? (
          <Space>
            <Button
              icon={<IconCheck size={16} />}
              type="primary"
              size="small"
              onClick={handleSave}
            />
            <Button
              icon={<IconX size={16} />}
              danger
              size="small"
              onClick={handleCancel}
            />
          </Space>
        ) : (
          <Space>
            <Button
              icon={<IconEdit size={16} />}
              size="small"
              onClick={() => handleEdit(record)}
            />
            <Popconfirm
              title="Delete this field?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button icon={<IconTrash size={16} />} danger size="small" />
            </Popconfirm>
          </Space>
        ),
    },
  ];

  const dataSource =
    editingRow &&
    !sectionData[selectedSection].some((r) => r.id === editingRow.id)
      ? [editingRow, ...sectionData[selectedSection]]
      : sectionData[selectedSection];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4 w-full">
          <Select
            value={selectedSection}
            onChange={setSelectedSection}
            options={sectionOptions}
            className="w-full"
          />
        </div>
      </div>

      <Card>
        <Form form={form} component={false}>
          <Table
            rowKey="id"
            pagination={false}
            dataSource={dataSource}
            columns={columns}
          />
        </Form>
      </Card>

      <ActionDialogmodel 
        open={listOptionsrecord}
        onCancel={() => setListOptionsrecord(null)}
        onSubmit={() => setListOptionsrecord(null)}
        title="List Options"
        fields={[{
            label:"List Options",
            name:"listOptions",
            type:"text",
            extra:"here the list of content will come in tabular format"
        }]}
      />
    </div>
  );
};

export default CustomFields;
