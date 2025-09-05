"use client";
import React, { useState, useEffect } from "react";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Button, Table, Tabs, message, Modal } from "antd";
import {
  createDwellingType,
  createRange,
  deleteDwellingType,
  deleteRange,
  getFloorPlanFilters,
  updateDwellingType,
  updateRange,
} from "@redux/feature/floorPlan/floorPlanThunk";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields";

type ItemType = {
  id: string;
  name: string;
};

const RangeAndDwelling = () => {
  const dispatch = useAppDispatch();
  const { filters } = useAppSelector((state) => state.floorPlan);
  const [activeTab, setActiveTab] = useState("range");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemType | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItemType | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!filters) {
      dispatch(getFloorPlanFilters());
    }
  }, [dispatch]);

  const handleCreate = () => {
    setEditingItem(null);
    setIsModalVisible(true);
  };

  const handleEdit = (item: ItemType) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleDelete = (item: ItemType) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setLoading(true);
      if (activeTab === "range") {
        await dispatch(deleteRange({ id: itemToDelete.id })).unwrap();
        message.success("Range deleted successfully");
      } else {
        await dispatch(deleteDwellingType({ id: itemToDelete.id })).unwrap();
        message.success("Dwelling type deleted successfully");
      }
      setDeleteModalVisible(false);
      setItemToDelete(null);
    } catch (error) {
      message.error(
        `Failed to delete ${activeTab === "range" ? "range" : "dwelling type"}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      setLoading(true);
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
    } catch (error) {
      message.error(
        `Failed to ${editingItem ? "update" : "create"} ${
          activeTab === "range" ? "range" : "dwelling type"
        }`
      );
    } finally {
      setLoading(false);
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
      render: (_: any, record: ItemType) => (
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
            onClick={() => handleDelete(record)}
            aria-label="Delete"
          />
        </div>
      ),
    },
  ];

  //   const dataSource =
  //     activeTab === "range"
  //       ? filters?.range?.map((item: any) => ({
  //           id: item.rangeId,
  //           name: item.name,
  //           key: item.rangeId,
  //         })) || []
  //       : filters?.dwelling_type?.map((item: any) => ({
  //           id: item.dwellingTypeId,
  //           name: item.name,
  //           key: item.dwellingTypeId,
  //         })) || [];

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Manage {activeTab === "range" ? "Ranges" : "Dwelling Types"}
        </h2>
        <Button type="primary" onClick={handleCreate}>
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
                dataSource={[{ id: "123456", name: "abcd" }]}
                pagination={false}
                loading={!filters}
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
                dataSource={[{ id: "123456", name: "abcd" }]}
                pagination={false}
                loading={!filters}
                rowKey="id"
              />
            ),
          },
        ]}
      />
 
      <CreateFormModal
        title={`${activeTab === "range" ? "Range" : "Dwelling Type"}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        fields={rangeAndDwellingTypeFields(activeTab)}
        initialValues={editingItem ? { name: editingItem.name } : {}}
        isEditing={!!editingItem}
        loading={loading}
      />

      {deleteModalVisible && (
        <ConfirmationModal
          open={deleteModalVisible}
          onClose={() => setDeleteModalVisible(false)}
          onConfirm={() => confirmDelete}
          message="Are you sure you want to delete this package?"
          type="danger"
          confirmText="Delete"
          cancelText="Cancel"
          //   loading={loading}
          maxWidth="sm"
        />
      )}
    </div>
  );
};

export default RangeAndDwelling;
