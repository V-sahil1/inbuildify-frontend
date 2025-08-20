"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Form,
  Input,
  Modal,
  Table,
  Typography,
  message,
  Spin,
  Select,
  Tabs,
} from "antd";
import type { TableColumnsType } from "antd";
import { useAppDispatch } from "@hooks/redux";
import { createUserThunk, getInvitedUsersThunk, getUsersThunk } from "@redux/feature/user/userThunk";

type User = {
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
    dispatch(getUsersThunk())
      .unwrap()
      .then((res: any) => {
        const mappedUsers: User[] = res?.data.map((user) => ({
          key: user.userId,
          role: user.role,
          email: user.email,
        }));
        setUsers(mappedUsers);
      })
      .catch((err) => {
        console.log("GET users failed:", err);
        message.error("Failed to fetch users");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);


    const fetchInvitedUsers = async () => {
        setLoading(true);
        try {
            const res: any = await dispatch(getInvitedUsersThunk()).unwrap();
            const mappedUsers: User[] = res?.data.users.map((user) => ({
                key: user.userId,
                role: user.role,
                email: user.email,
            }));
            setInvitedUsers(mappedUsers);
            setHasFetchedInvites(true);
        } catch (err) {
            console.log("GET invited users failed:", err);
            message.error("Failed to fetch invited users");
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

//   const handleEdit = (record: User) => {
//     setIsEditing(true);
//     setEditingKey(record.key);
//     form.setFieldsValue(record);
//     setIsModalOpen(true);
//   };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingKey(null);
  };

const handleSubmit = async () => {
  try {
    setLoading(true);
    const values = await form.validateFields();

    const res = await dispatch(
      createUserThunk({
        email: values.email,
        role: values.role,
      })
    ).unwrap();

    if (res) {
           const newInvitedUser: User = {
          key: `${Date.now()}`, 
          role: values.role,
          email: values.email,
        };

        setInvitedUsers((prev) => [newInvitedUser, ...prev]); 
      message.success(res.message);
    }

    setIsModalOpen(false);
    form.resetFields();
    setIsEditing(false);
    setEditingKey(null);
  } catch (err) {
    message.error((err as any)?.message || "Failed to send invitation");
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
            message.error(err );
        } finally {
            setLoading(false);
        }
    };


  // Delete user (optional, implement API)
//   const handleDeleteUser = async (record: User) => {
//     try {
//       // Example: await dispatch(deleteUserThunk(record.key)).unwrap();
//       setUsers((prev) => prev.filter((u) => u.key !== record.key));
//       message.success("User deleted successfully");
//     } catch (err) {
//       message.error("Failed to delete user");
//     }
//   };

  // Users Table Columns
  const userColumns: TableColumnsType<User> = useMemo(
    () => [
      { title: "Email", dataIndex: "email", key: "email" },
      { title: "Role", dataIndex: "role", key: "role" },
    //   {
    //     title: "Actions",
    //     key: "actions",
    //     render: (_, record) => (
    //       <div className="flex gap-2">
    //         <Button type="link" onClick={() => handleEdit(record)}>
    //           Edit
    //         </Button>
    //         <Button type="link" danger onClick={() => handleDeleteUser(record)}>
    //           Delete
    //         </Button>
    //       </div>
    //     ),
    //   },
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
              <div className="flex items-center justify-between mb-4">
                  <Typography.Title
                      level={4}
                      style={{ margin: 0, color: "var(--font-color)" }}
                  >
                      {activeTab === "users" ? "Users" : "Invited Users"}
                  </Typography.Title>

                  {/* 🔹 Always visible now */}
                {activeTab == "users" && (  <button
                      className="btn large bg-[#4c3575] cursor-pointer text-white"
                      onClick={handleOpenModal}
                  >
                      Invite User
                  </button>) }
                
              </div>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as "users" | "invites")}
          items={[
            { key: "users", label: "Users" },
            { key: "invites", label: "Invited Users" },
          ]}
        />

        <Spin spinning={loading}>
          <Table
            rowKey="key"
            columns={activeTab === "users" ? userColumns : inviteColumns}
            dataSource={activeTab === "users" ? users : invitedUsers}
            pagination={{ pageSize: 10 }}
            scroll={{ x: "max-content" }}
          />
        </Spin>

        <Modal
          title={isEditing ? "Edit User" : "Invite User"}
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={handleCancel}
          okText={isEditing ? "Update" : "Invite"}
          confirmLoading={loading}
          cancelButtonProps={{
            style: { color: "#4c3575", borderColor: "#4c3575" }, 
          }}
          okButtonProps={{
            style: { backgroundColor: "#4c3575", borderColor: "#4c3575" },
          }}
        >
          <Form form={form} layout="vertical">
            <Form.Item
              label="Role"
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select a role" disabled={isEditing}>
                <Select.Option value="super_admin">Super Admin</Select.Option>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="project_owner">Builder</Select.Option>
                <Select.Option value="service_provider">
                  Contractor
                </Select.Option>
                <Select.Option value="client">Client</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="john@example.com" disabled={isEditing} />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default UserPage;
