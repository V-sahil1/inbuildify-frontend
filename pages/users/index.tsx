"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Table, Typography, message, Spin, Tabs } from "antd";
import type { TableColumnsType } from "antd";
import { useAppDispatch } from "@hooks/redux";
import {
  createUserThunk,
  getInvitedUsersThunk,
  getUsersThunk,
} from "@redux/feature/user/userThunk";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { roleRules, emailRules } from "@lib/constants/formInputValidations";
import { Roles } from "@lib/constants/enum";
import { enumToReadable } from "@lib/utils/enumToRedable";
export type User = {
  key: string;
  role: string;
  email: string;
};

const UserPage = () => {
  const [activeTab, setActiveTab] = useState<"users" | "invites">("users");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [hasFetchedInvites, setHasFetchedInvites] = useState(false);
  const [form] = Form.useForm<User>();
  const [users, setUsers] = useState<User[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();

  // Fetch active users
  useEffect(() => {
    setLoading(true);
    const fetchUserData = async()=>{
    await dispatch(getUsersThunk())
      .unwrap()
      .then((res: any) => {
        const mappedUsers: User[] = res?.data.map((user) => ({
          key: user.usersId,
          role: user.role.map(enumToReadable).join(", "),
          email: user.email,
        }));

        setUsers(mappedUsers);
      })
      .catch((err) => {
        message.error(err || "Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });
    }
    fetchUserData();
  }, [dispatch]);

  const fetchInvitedUsers = async () => {
    setLoading(true);
    try {
      const res: any = await dispatch(getInvitedUsersThunk()).unwrap();
      const mappedUsers: User[] = res?.data.users?.map((user) => ({
        key: user.userId,
        role: enumToReadable(user.role),
        email: user.email,
      }));
      setInvitedUsers(mappedUsers);
      setHasFetchedInvites(true);
    } catch (err) {
      message.error(err || "Failed to fetch invited users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "invites" && !hasFetchedInvites) {
      fetchInvitedUsers();
    }
  }, [activeTab, hasFetchedInvites]);

  const handleOpenModal = () => {
    setIsEditing(false);
    setEditingKey(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingKey(null);
  };

  const handleSubmit = async (values) => {
    await form.validateFields();
    try {
      setLoading(true);
      const res = await dispatch(
        createUserThunk({
          email: values.email,
          role: values.role,
        })
      ).unwrap();

      if (res) {
        const newInvitedUser: User = {
          key: `${Date.now()}`,
          role: enumToReadable(values.role),
          email: values.email,
        };

        setInvitedUsers((prev) => prev?.length ? [newInvitedUser, ...prev] : [newInvitedUser]);
        message.success(res.message);
      }

      form.resetFields();
      setIsModalOpen(false);
      setIsEditing(false);
      setEditingKey(null);
    } catch (err) {
      message.error(err || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleResendInvite = async (record: User) => {
    try {
      setLoading(true);
      const res = await dispatch(
        createUserThunk({
          email: record.email,
          role: record.role,
        })
      ).unwrap();

      if (res) {
        message.success(res.message);
        // fetchInvitedUsers();
      }
    } catch (err) {
      message.error(err || 'Failed to resend invitation');
    } finally {
      setLoading(false);
    }
  };

  // Users Table Columns
  const userColumns: TableColumnsType<User> = useMemo(
    () => [
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Role", dataIndex: "role", key: "role" },
    ],
    []
  );

  // Invited Users Table Columns
  const inviteColumns: TableColumnsType<User> = useMemo(
    () => [
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Role", dataIndex: "role", key: "role" },
      {
        title: "Status",
        key: "status",
        render: () => <span style={{ color: "orange" }}>Pending</span>,
      },
      {
        title: "Actions",
        key: "actions",
        render: (_, record) => (
          <div className="flex gap-2">
            <Button type="link" onClick={() => handleResendInvite(record)}>
              Resend
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="p-4">
      <div className="w-full">
          <Typography.Title
            level={4}
            style={{ margin: 0, color: "var(--font-color)" }}
          >
            {activeTab === "users" ? "Users" : "Invited Users"}
          </Typography.Title>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full">
          <Tabs
            activeKey={activeTab}
            onChange={(key) => setActiveTab(key as "users" | "invites")}
            items={[
              { key: "users", label: "Users" },
              { key: "invites", label: "Invited Users" },
            ]}
          />
          </div>
          {/* 🔹 Always visible now */}
          {activeTab == "users" && (
            <button
              className="btn large bg-primary cursor-pointer text-white w-36 ml-10"
              onClick={handleOpenModal}
            >
              Invite User
            </button>
          )}
        </div>
        <Spin spinning={loading}>
          <Table
            rowKey="key"
            columns={activeTab === "users" ? userColumns : inviteColumns}
            dataSource={activeTab === "users" ? users : invitedUsers}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>
        <CreateFormModal
          title="User"
          open={isModalOpen}
          onSubmit={handleSubmit}
          invite={true}
          onCancel={handleCancel}
          loading={loading}
          fields={[
            {
              label: "Role",
              name: "role",
              rules: roleRules,
              type: "select",
              placeholder: "Select Role",
              disabled: isEditing,
              options: Roles,
            },
            {
              label: "Email",
              name: "email",
              type: "email",
              rules: emailRules,
              placeholder: "john@example.com",
              disabled: isEditing,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default UserPage;
