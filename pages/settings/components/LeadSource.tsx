"use client";
import React, { useState, useEffect } from "react";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Button, Table, message } from "antd";
import { useAppDispatch } from "@hooks/redux";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import rangeAndDwellingTypeFields from "@/components/formFields/rangeAndDwellingTypeFields";
import {
  createLeadSourceThunk,
  deleteLeadSourceThunk,
  getLeadSourcesThunk,
  updateLeadSourceThunk,
} from "@redux/feature/lead/leadThunk";  

const LeadSource = () => {
  const dispatch = useAppDispatch();
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
    getLeadSources();
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
            leadSourceId: editingItem.id,
            payload: {leadSourceName: values.name},
          })
        ).unwrap();
        message.success("Range updated successfully");
      } else {
        await dispatch(
          createLeadSourceThunk({ leadSourceName: values.name })
        ).unwrap();
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

  const datasource = [
    {  name: "Admin Panel" },
    { name: "WEBSITE" },
    { name: "INSTAGRAM" },
    { name: "FACEBOOK" },
    { name: "YOUTUBE" },
    { name: "LINKEDIN" },
    { name: "TWITTER" },
    { name: "TIKTOK" },
    { name: "WHATSAPP" },
    { name: "EMAIL_CAMPAIGN" },
    { name: "GOOGLE_ADS" },
    { name: "FACEBOOK_ADS" },
    { name: "INSTAGRAM_ADS" },
    { name: "YOUTUBE_ADS" },
    { name: "LINKEDIN_ADS" },
    { name: "REFERRAL" },
    { name: "PHONE_CALL" },
    { name: "TRADE_SHOW" },
  ];

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
        dataSource={datasource}
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

export default LeadSource;
