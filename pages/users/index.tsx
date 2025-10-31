'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button, Form, Table, Typography, message, Tabs } from 'antd';
import type { TableColumnsType } from 'antd';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createUserThunk,
  getInvitedUsersThunk,
  getUsersThunk,
} from '@redux/feature/user/userThunk';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import { Status } from '@lib/constants/enum';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { DetailModal } from '@/components/common/DetailModal';
import { RootState } from '@redux/feature/store';
import { invitedUser, user } from '@redux/feature/user/UserState';
import { userDetailModelFields, userInviteFormFields } from '@/components/formFields/userField';
import Loading from '@/components/common/Loading';

const UserPage = () => {
  const { users, status, invitedUsers } = useAppSelector((state: RootState) => state.user);
  const [activeTab, setActiveTab] = useState<'users' | 'invites'>('users');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm<user>();
  const [userInviteLoading, setuserInviteLoading] = useState(false);
  const [resendInvite, setresendInvite] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const dispatch = useAppDispatch();

  // Fetch active users
  useEffect(() => {
    async function fetchData() {
      try {
        await dispatch(getUsersThunk()).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch users');
      }
    }
    if (status.users === Status.IDLE) {
      fetchData();
    }
  }, [dispatch, status]);

  const fetchInvitedUsers = async () => {
    try {
      await dispatch(getInvitedUsersThunk()).unwrap();
    } catch (err) {
      message.error(err || 'Failed to fetch invited users');
    }
  };

  useEffect(() => {
    if (activeTab === 'invites' && status.invitedUsers === Status.IDLE) {
      fetchInvitedUsers();
    }
  }, [activeTab]);

  const handleSubmit = async values => {
    await form.validateFields();
    try {
      setuserInviteLoading(true);
      const res = await dispatch(
        createUserThunk({
          email: values.email,
          role: values.role,
        })
      ).unwrap();
      message.success('Invitation sent successfully');
      form.resetFields();
      setIsModalOpen(false);
    } catch (err) {
      message.error(err || 'Failed to send invitation');
    } finally {
      setuserInviteLoading(false);
    }
  };

  const handleResendInvite = async (record: invitedUser) => {
    try {
      setresendInvite(record.email);
      const res = await dispatch(
        createUserThunk({
          email: record.email,
          role: record.role,
        })
      ).unwrap();
      message.success('Invitation sent successfully');
    } catch (err) {
      message.error(err || 'Failed to resend invitation');
    } finally {
      setresendInvite('');
    }
  };
  const handleRowClick = async (record: user) => {
    const user = { ...record, role: enumToReadable(record.role.join(' , ')) };
    setSelectedUser(user);
  };

  // Users Table Columns
  const userColumns: TableColumnsType<user> = useMemo(
    () => [
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (_, record) => enumToReadable(record.role.join(' , ')),
      },
    ],
    []
  );
  // Invited Users Table Columns
  const inviteColumns: TableColumnsType<invitedUser> = useMemo(
    () => [
      { title: 'Email', dataIndex: 'email', key: 'email' },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        render: (_, record) => enumToReadable(record.role),
      },

      {
        title: 'Actions',
        key: 'actions',
        render: (_, record) => (
          <div>
            {resendInvite === record?.email ? (
              <div className="ml-6">
                {' '}
                <Loading type="primary" />
              </div>
            ) : (
              <Button
                type="link"
                onClick={() => handleResendInvite(record)}
                disabled={resendInvite !== '' && resendInvite !== record.email}
              >
                Resend
              </Button>
            )}
          </div>
        ),
      },
    ],
    [resendInvite]
  );

  return (
    <div className="p-4">
      <div className="w-full">
        <Typography.Title level={4} style={{ margin: 0, color: 'var(--font-color)' }}>
          {activeTab === 'users' ? 'Users' : 'Invited Users'}
        </Typography.Title>
        <div className="flex items-center justify-between mb-4">
          <div className="w-full">
            <Tabs
              activeKey={activeTab}
              onChange={key => setActiveTab(key as 'users' | 'invites')}
              items={[
                { key: 'users', label: 'Users' },
                { key: 'invites', label: 'Invited Users' },
              ]}
            />
          </div>
          {/* 🔹 Always visible now */}
          {activeTab == 'users' && (
            <button
              className="btn large bg-primary cursor-pointer text-white w-36 ml-10"
              onClick={() => setIsModalOpen(true)}
            >
              Invite User
            </button>
          )}
        </div>
        <Table
          rowKey="key"
          columns={
            activeTab === 'users'
              ? (userColumns as TableColumnsType<user | invitedUser>)
              : (inviteColumns as TableColumnsType<user | invitedUser>)
          }
          dataSource={activeTab === 'users' ? users : invitedUsers}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          onRow={
            activeTab === 'users'
              ? (record: user) => ({
                  style: { cursor: 'pointer' },
                  onClick: () => handleRowClick(record),
                })
              : record => ({})
          }
          loading={{
            spinning:
              activeTab === 'users'
                ? status.users === Status.PENDING
                : status.invitedUsers === Status.PENDING,
            indicator: (
              <div className="flex justify-center items-center h-full">
                {' '}
                <Loading type="primary" />
              </div>
            ),
          }}
          locale={{
            emptyText: (
              activeTab === 'users'
                ? status.users === Status.PENDING
                : status.invitedUsers === Status.PENDING
            ) ? (
              <div className="min-h-[200px]"></div>
            ) : (
              'No Data'
            ),
          }}
        />
        <CreateFormModal
          title="User"
          open={isModalOpen}
          onSubmit={handleSubmit}
          invite={true}
          onCancel={() => setIsModalOpen(false)}
          loading={userInviteLoading}
          fields={userInviteFormFields()}
        />
        <DetailModal
          title="User Details"
          open={selectedUser !== null}
          onCancel={() => setSelectedUser(null)}
          data={selectedUser}
          fields={userDetailModelFields()}
        />
      </div>
    </div>
  );
};

export default UserPage;
