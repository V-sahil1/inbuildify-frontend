import { useEffect, useState } from 'react';
import { Button, Input, Table, Dropdown } from 'antd';
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
import { UserFormModal } from '@/components/user/UserFormModal';
import { User } from 'data/userData';
import { UserList } from '@lib/utils/Reports/user/UserList';

const Users = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState<'resetLoginId' | 'lockUser' | 'changeStatusUser'>(
    null
  );
  const [selectedUser, setSelectedUser] = useState<User>();
  const { column, users, userSubmit, handleClose } = UserColumn(
    setModalOpen,
    setSelectedUser,
    setDrawerOpen,
    selectedUser
  );
  const user = selectedUser && users.filter(i => i.loginId === selectedUser.loginId)[0];
  const { debouncedUpdateURL, setParams, filters } = debouncedURL({
    filtersKey: ['search', 'status'],
    initialValue: { status: 'Active' },
  });
  const items = [
    { label: 'Export to XLSX', key: 'excel', icon: <IconFileSpreadsheet size={16} /> },
    { label: 'Export to CSV', key: 'csv', icon: <IconFileTypeCsv /> },
  ];
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Users Listing</h1>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Input.Search
          placeholder="Search contacts by name, email, or phone number"
          allowClear
          value={filters.search}
          onChange={e => setParams({ search: e.target.value })}
          className="w-full md:w-1/2"
        />

        <CustomFilterButtons
          filterButtons={['Active', 'InActive']}
          activeTab={filters.status}
          setActiveTab={value => setParams({ status: value })}
        />

        <div className="flex items-center gap-2">
          <p className="text-gray-500 text-sm">12 Users</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="primary"
            icon={<IconPlus size={16} />}
            onClick={() => {
              setDrawerOpen(true);
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
        <div className="grid grid-cols-3 gap-2 ">
          {users
            .filter(i => i.status === filters.status)
            .map((user, index) => (
              <UserCard
                key={index}
                user={user}
                setDrawerOpen={setDrawerOpen}
                setModalOpen={setModalOpen}
                setSelectedUser={setSelectedUser}
              />
            ))}
        </div>
      ) : (
        <Table columns={column} dataSource={users.filter(i => i.status === filters.status)} />
      )}
      {drawerOpen && (
        <UserFormModal
          open={drawerOpen}
          onCancel={handleClose}
          onSubmit={values => {
            console.log('user submit', values);
            userSubmit(values);
          }}
          setModalOpen={setModalOpen}
          isEditing={!!selectedUser}
          initialValue={selectedUser}
        />
      )}
      {modalOpen === 'resetLoginId' && (
        <ActionDialogmodel
          title="Change Login Id"
          open={modalOpen === 'resetLoginId'}
          onCancel={handleClose}
          onSubmit={values => {
            userSubmit({ loginId: values.loginId });
          }}
          fields={[
            { label: 'New Login id', name: 'loginId', type: 'text' },
            {
              label: 'Email new login Id',
              name: 'emailLoginId',
              type: 'switch',
              initialValue: true,
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
          onClose={handleClose}
          okText={
            modalOpen === 'lockUser'
              ? user?.lock
                ? 'UnLock'
                : 'Lock'
              : user?.status === 'Active'
                ? 'InActivate'
                : 'Activate'
          }
          content={`Are you sure you want to ${modalOpen === 'changeStatusUser' ? (user?.status === 'Active' ? 'InActivate' : 'Activate') : user?.lock ? 'UnLock' : 'Lock'} the user?`}
          onSubmit={() => {
            const value =
              modalOpen === 'lockUser'
                ? !user?.lock
                : user?.status === 'Active'
                  ? 'InActive'
                  : 'Active';
            userSubmit(modalOpen === 'lockUser' ? { lock: value } : { status: value });
          }}
        />
      )}
    </div>
  );
};

export default Users;
