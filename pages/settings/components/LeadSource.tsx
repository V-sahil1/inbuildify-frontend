"use client";
import React, { useState, useEffect } from "react";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Button, Table, message } from "antd";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields";
import {
  createLeadSourceThunk,
  deleteLeadSourceThunk,
  getLeadSourcesThunk,
  updateLeadSourceThunk,
} from "@redux/feature/lead/leadThunk";
import { Status } from "@lib/constants/enum";

const LeadSource = () => {
  const dispatch = useAppDispatch();
  const { leadSources } = useAppSelector((state) => state.lead);
  const status = useAppSelector((state) => state.lead.status.leadSources);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState({
    id: null,
    open: false,
  });
  const [formLoading, setFormLoading] = useState(false);

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  useEffect(() => {
    async function getLeadSources() {
      try {
        await dispatch(getLeadSourcesThunk()).unwrap();
      } catch (error) {
        message.error(error || "failed to fetch the Lead sources");
      }
    }
    if (status === Status.IDLE) {
      getLeadSources();
    }
  }, []);

  const confirmDelete = async () => {
    if (!deleteModalVisible.id) return;

    try {
      setFormLoading(true);

      await dispatch(deleteLeadSourceThunk(deleteModalVisible.id)).unwrap();
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
          updateLeadSourceThunk({
            leadSourceId: editingItem.leadSourceId,
            payload: { name: values.name },
          })
        ).unwrap();
        message.success("Lead source updated successfully");
      } else {
        await dispatch(createLeadSourceThunk({ name: values.name })).unwrap();
        message.success("Lead source created successfully");
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
            onClick={() =>
              setDeleteModalVisible({ id: record.leadSourceId, open: true })
            }
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
        dataSource={leadSources}
        pagination={false}
        // loading={}
        rowKey="id"
      />

      <CreateFormModal
        title="Lead Source"
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

      {/* {deleteModalVisible.open && ( */}
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
      {/* )} */}
    </div>
  );
};

export default LeadSource;
