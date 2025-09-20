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
import { Status } from "@lib/constants/enum";

const Service = () => {
  const dispatch = useAppDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState({
    id: null,
    open: false,
  });
  const { services, status } = useAppSelector((state: RootState) => state.contractor);
  const [formLoading, setFormLoading] = useState(false);

  const handleEdit = (item: serviceType) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  useEffect(() => {
    async function getServices() {
      try {
        await dispatch(getServicesThunk()).unwrap();
      } catch (error) {
        message.error(error || "failed to fetch the services");
      }
    }
    getServices();
  }, []);

  const confirmDelete = async () => {
    try {
      setFormLoading(true);
      await dispatch(deleteServiceThunk(deleteModalVisible.id)).unwrap();
      message.success("Service deleted successfully");
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
            serviceId: editingItem.serviceId,
            service: values.name,
          })
        ).unwrap();
        message.success("Service updated successfully");
      } else {
        await dispatch(createServiceThunk({ service: values.name })).unwrap();
        message.success("Service created successfully");
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
          <button
            className="rounded-md p-1 group"
            onClick={() => handleEdit(record)}
            aria-label="Edit"
          >
            <IconEdit
              size={20}
              className="text-font-color group-hover:text-blue"
            />
          </button>
          <button
            className="rounded-md p-1 group"
            onClick={() => setDeleteModalVisible({ id: record.serviceId, open: true })}
            aria-label="Delete"
          >
            <IconTrash
              size={20}
              className="text-font-color group-hover:text-red-500"
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 bg-body-color rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Manage Services</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={services}
        pagination={false}
        loading={status === Status.PENDING}
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
          onConfirm={confirmDelete}
          message="Are you sure you want to delete this service? Make sure this service is not attached to any contractor."
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
