import { useEffect, useState } from 'react';
import { Button, Input, Table, Dropdown, message, Spin } from 'antd';
import {
  IconDownload,
  IconFileSpreadsheet,
  IconFileTypeCsv,
  IconLayoutGrid,
  IconLayoutList,
  IconPlus,
} from '@tabler/icons-react';
import { debouncedURL } from '@lib/utils/debounceURL';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { CustomFilterButtons } from '@/components/common/CustomFilterButtons';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import TooltipButton from '@/components/common/TooltipButton';
import { UserColumn } from '@/components/table-columns/UserColumn';
import { UserCard } from '@/components/user/UserCard';
import { UserList } from '@lib/utils/Reports/user/UserList';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getUsersThunk } from '@redux/feature/user/userThunk';
import { IUser } from '@redux/feature/user/UserState';
import { Status } from '@lib/constants/enum';
import { UserFormDrawer } from '@/components/user/UserFormDrawer';
import dayjs from 'dayjs';

const Users = () => {
  const dispatch = useAppDispatch();
  const { users, status } = useAppSelector(state => state.user);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [drawerOpen, setDrawerOpen] = useState<'create' | 'resetPassword' | null>(null);
  const [modalOpen, setModalOpen] = useState<'resetLoginId' | 'lockUser' | 'changeStatusUser'>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<IUser>();
  const [emailLoginId, setEmailLoginId] = useState(false);
  const { column, userSubmit, handleLock, handleStatus, handleLoginId, handleResetPassword } =
    UserColumn(setModalOpen, setSelectedUser, setDrawerOpen, selectedUser);

  const user = selectedUser && users.filter(i => i.loginId === selectedUser.loginId)[0];
  const { debouncedUpdateURL, setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['search', 'status'],
    initialValue: { status: '' },
  });
  const items = [
    { label: 'Export to XLSX', key: 'excel', icon: <IconFileSpreadsheet size={16} /> },
    { label: 'Export to CSV', key: 'csv', icon: <IconFileTypeCsv /> },
  ];
  useEffect(() => {
    fetchUsersData();
  }, [filters]);

  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  const fetchUsersData = async () => {
    try {
      const params = {
        is_active: filters?.status !== '' ? filters?.status === 'Active' : undefined,
        search: filters?.search || undefined,
      };
      await dispatch(getUsersThunk(params)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch users');
    }
  };
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users Listing</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input.Search
          placeholder="Search contacts by name, email, or phone number"
          allowClear
          value={instantFilters.search}
          onChange={e => setParams({ search: e.target.value })}
          className="w-full md:w-1/2"
        />

        <CustomFilterButtons
          filterButtons={['Active', 'InActive']}
          activeTab={instantFilters.status}
          setActiveTab={value => setParams({ status: value })}
        />

        <div className="flex items-center gap-2">
          <p className="text-gray-500 text-sm">{users?.length || 0} Users</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setDrawerOpen('create');
            }}
          >
            New User
          </Button>

          {viewMode === 'grid' ? (
            <TooltipButton
              title="Switch to Table View"
              icon={<IconLayoutList size={16} />}
              onClick={() => setViewMode('table')}
            />
          ) : (
            <TooltipButton
              title="Switch to Grid View"
              icon={<IconLayoutGrid size={16} />}
              onClick={() => setViewMode('grid')}
            />
          )}

          <Dropdown menu={{ items, onClick: e => UserList(e.key, users) }} trigger={['click']}>
            <TooltipButton title="Export" icon={<IconDownload size={16} />} />
          </Dropdown>
        </div>
      </div>
      {viewMode === 'grid' ? (
        status.users.fetch === Status.PENDING ? (
          <div className="flex justify-center items-center h-full">
            <Spin />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
            {users &&
              users.length > 0 &&
              users.map((user, index) => (
                <UserCard
                  key={index}
                  user={user}
                  setDrawerOpen={setDrawerOpen}
                  setModalOpen={setModalOpen}
                  setSelectedUser={setSelectedUser}
                />
              ))}
          </div>
        )
      ) : (
        <Table
          columns={column}
          dataSource={users}
          loading={status.users.fetch === Status.PENDING}
        />
      )}
      {!!drawerOpen && (
        <UserFormDrawer
          open={!!drawerOpen}
          onCancel={() => {
            setSelectedUser(null);
            setDrawerOpen(null);
          }}
          onSubmit={userSubmit}
          resetPassword={handleResetPassword}
          setModalOpen={setModalOpen}
          setDrawerOpen={setDrawerOpen}
          isEditing={!!selectedUser}
          initialValue={{
            ...selectedUser,
            dateOfJoining: selectedUser?.dateOfJoining ? dayjs(selectedUser.dateOfJoining) : null,
            dateOfBirth: selectedUser?.dateOfBirth ? dayjs(selectedUser.dateOfBirth) : null,
          }}
          type={drawerOpen}
        />
      )}
      {modalOpen === 'resetLoginId' && (
        <ActionDialogmodel
          title="Change Login Id"
          open={modalOpen === 'resetLoginId'}
          onCancel={() => {
            setSelectedUser(null);
            setModalOpen(null);
          }}
          onSubmit={values => {
            handleLoginId({ ...values, emailLoginId });
          }}
          fields={[
            { label: 'New Login id', name: 'newLoginId', type: 'text' },
            {
              label: 'Email new login Id',
              name: 'emailLoginId',
              type: 'switch',
              initialValue: emailLoginId,
              onChange: setEmailLoginId,
            },
          ]}
          isEditing={!!selectedUser}
          initialValues={selectedUser}
        />
      )}
      {['changeStatusUser', 'lockUser'].includes(modalOpen) && (
        <ConfirmationContentModal
          title="Confirmation"
          open={['changeStatusUser', 'lockUser'].includes(modalOpen)}
          onClose={() => {
            setSelectedUser(null);
            setModalOpen(null);
          }}
          okText={
            modalOpen === 'lockUser'
              ? user?.isLocked
                ? 'UnLock'
                : 'Lock'
              : user?.isActive
                ? 'InActivate'
                : 'Activate'
          }
          content={`Are you sure you want to ${modalOpen === 'changeStatusUser' ? (user?.isActive ? 'InActivate' : 'Activate') : user?.isLocked ? 'UnLock' : 'Lock'} the user?`}
          onSubmit={() => {
            modalOpen === 'lockUser' ? handleLock() : handleStatus();
          }}
          loading={status.users.create === Status.PENDING}
        />
      )}
    </div>
  );
};

export default Users;
