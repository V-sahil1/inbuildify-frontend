"use client";
import React, { useState, useEffect } from "react";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Button, Table, Tabs, message, Modal } from "antd";
import {
  createDwellingType,
  createRange,
  deleteDwellingType,
  deleteRange,
  getDwellingTypes,
  getRanges,
  updateDwellingType,
  updateRange,
} from "@redux/feature/types/typesThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields";
import { Status } from "@lib/constants/enum";

const RangeAndDwelling = () => {
  const dispatch = useAppDispatch();
  const { range, dwellingType, status } = useAppSelector(
    (state) => state.types
  );
  const [activeTab, setActiveTab] = useState("range");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState({
    id: null,
    open: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (activeTab === "range") {
      if (status.range === Status.IDLE) {
        dispatch(getRanges());
      }
    } else {
      if (status.dwellingType === Status.IDLE) {
        dispatch(getDwellingTypes());
      }
    }
  }, [dispatch, activeTab, status.range, status.dwellingType]);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!deleteModalVisible.id) return;

    try {
      setFormLoading(true);
      if (activeTab === "range") {
        await dispatch(deleteRange({ id: deleteModalVisible.id })).unwrap();
        message.success("Range deleted successfully");
      } else {
        await dispatch(
          deleteDwellingType({ id: deleteModalVisible.id })
        ).unwrap();
        message.success("Dwelling type deleted successfully");
      }
      setDeleteModalVisible({ id: null, open: false });
    } catch (error: any) {
      message.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      setFormLoading(true);
      if (activeTab === "range") {
        if (editingItem) {
          await dispatch(
            updateRange({ id: editingItem.id, name: values.name })
          ).unwrap();
          message.success("Range updated successfully");
        } else {
          await dispatch(createRange({ name: values.name })).unwrap();
          message.success("Range created successfully");
        }
      } else {
        if (editingItem) {
          await dispatch(
            updateDwellingType({ id: editingItem.id, name: values.name })
          ).unwrap();
          message.success("Dwelling type updated successfully");
        } else {
          await dispatch(createDwellingType({ name: values.name })).unwrap();
          message.success("Dwelling type created successfully");
        }
      }
      setIsModalVisible(false);
      setEditingItem(null);
    } catch (error: any) {
      message.error(error);
    } finally {
      setFormLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      width: 120,
      render: (_: any, record) => (
        <div className="flex gap-2">
          <Button
            type="text"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
            aria-label="Edit"
          />
          <Button
            type="text"
            danger
            icon={<IconTrash />}
            onClick={() => setDeleteModalVisible({ id: record.id, open: true })}
            aria-label="Delete"
          />
        </div>
      ),
    },
  ];

  const dataSource =
    activeTab === "range"
      ? range?.map((item: any) => ({
          id: item.rangeId,
          name: item.name,
          key: item.rangeId,
        })) || []
      : dwellingType?.map((item: any) => ({
          id: item.dwellingTypeId,
          name: item.name,
          key: item.dwellingTypeId,
        })) || [];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Manage {activeTab === "range" ? "Ranges" : "Dwelling Types"}
        </h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key)}
        items={[
          {
            key: "range",
            label: "Ranges",
            children: (
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={status.range === Status.PENDING}
                rowKey="id"
              />
            ),
          },
          {
            key: "dwelling",
            label: "Dwelling Types",
            children: (
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={false}
                loading={status.dwellingType === Status.PENDING}
                rowKey="id"
              />
            ),
          },
        ]}
      />

      <CreateFormModal
        title={`${activeTab === "range" ? "Range" : "Dwelling Type"}`}
        open={isModalVisible}
        initialValues={editingItem ? { name: editingItem?.name } : {}}
        fields={rangeAndDwellingTypeFields()}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        isEditing={!!editingItem}
        onSubmit={handleSubmit}
        loading={formLoading}
      />

      {deleteModalVisible.open && (
        <ConfirmationModal
          open={deleteModalVisible.open}
          onClose={() => setDeleteModalVisible({ id: null, open: false })}
          onConfirm={() => confirmDelete()}
          message="Are you sure you want to delete this package?"
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
          loading={formLoading}
          maxWidth="sm"
        />
      )}
    </div>
  );
};

export default RangeAndDwelling;
