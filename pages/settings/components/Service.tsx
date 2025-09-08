"use client";
import React, { useState, useEffect } from "react";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Button, Table, Tabs, message, Modal } from "antd";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields"; 

import {
  createServiceThunk,
  deleteServiceThunk,
  getServicesThunk,
  updateServiceThunk,
} from "@redux/feature/contractor/contractorThunk";
import { RootState } from "@redux/feature/store";
import { Service as serviceType } from "@redux/feature/contractor/IContractorState";

const Service = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState({
    id: null,
    open: false,
  });
  const { services } = useAppSelector((state: RootState) => state.contractor);
  const [formLoading, setFormLoading] = useState(false);

  const handleEdit = (item: serviceType) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  useEffect(() => {
    async function getLeadSources() {
      try {
        await dispatch(getServicesThunk()).unwrap();
      } catch (error) {
        message.error(error || "failed to fetch the Lead sources");
      }
    }
    getLeadSources();
  }, []);

  const confirmDelete = async () => {
    if (!deleteModalVisible.id) return;

    try {
      setFormLoading(true);

      await dispatch(deleteServiceThunk(deleteModalVisible.id)).unwrap();
      message.success("Range deleted successfully");

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

      if (editingItem) {
        await dispatch(
            updateServiceThunk({
            serviceId: editingItem.id,
            service: values.name,
          })
        ).unwrap();
        message.success("Range updated successfully");
      } else {
        await dispatch(createServiceThunk({ service: values.name })).unwrap();
        message.success("Range created successfully");
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
      title: "Service",
      dataIndex: "service",
      key: "service",
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

  return (
    <div className="p-4 bg-body-color rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Lead Sources</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={services}
        pagination={false}
        // loading={}
        rowKey="id"
      />

      <CreateFormModal
        title="Service"
        open={isModalVisible}
        initialValues={editingItem ? { name: editingItem?.service } : {}}
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

export default Service;
