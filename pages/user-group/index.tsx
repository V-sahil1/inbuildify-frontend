import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { userGroupColumn } from '@/components/table-columns/userGroupColumn';
import { Button, Input, message, Table } from 'antd';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { useUserGroupField } from '@/components/formFields/userGroupFields';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { fetchAllUserGroup } from '@redux/feature/userGroup/userGroupThunk';
import { Status } from '@lib/constants/enum';

const UserGroup = () => {
  const dispatch = useAppDispatch();
  const { userGroups, status } = useAppSelector(state => state.userGroup);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const userGroupFields = useUserGroupField();
  const { column, userGroupSubmit } = userGroupColumn(
    setModalOpen,
    setSelectedGroup,
    selectedGroup
  );
  const { debouncedUpdateURL, setParams, filters, resetParams, instantFilters } = debouncedURL({
    filtersKey: ['groupName', 'status'],
    initialValue: { status: 'Active' },
  });
  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchUserGroup();
    }
  }, [status.fetch]);

  const fetchUserGroup = () => {
    try {
      dispatch(fetchAllUserGroup()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch user group');
    }
  };
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Group List</h1>
        <div className="flex gap-2">
          <Button type="primary" onClick={() => {}}>
            Total Records 12
          </Button>
          <Button
            type="primary"
            onClick={() => {
              setModalOpen(true);
            }}
          >
            New Group
          </Button>
        </div>
      </div>
      <div className="flex items-end gap-3 mb-2 ">
        <div>
          <p>Status</p>
          <StatusSelect
            value={instantFilters?.status}
            onChange={value => setParams({ status: value })}
            activeInactive={true}
            width={200}
          />
        </div>
        <div>
          <p>Group</p>
          <Input
            value={instantFilters?.groupName}
            onChange={e => setParams({ groupName: e.target.value })}
          />
        </div>
        <Button onClick={() => resetParams()}>Clear</Button>
      </div>
      <Table columns={column} dataSource={userGroups} />
      {modalOpen && (
        <ActionDialogmodel
          title="User Group"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onSubmit={values => {
            userGroupSubmit(values);
          }}
          fields={userGroupFields}
          isEditing={!!selectedGroup}
          initialValues={
            selectedGroup && { ...selectedGroup, usersId: selectedGroup.users?.map(i => i.id) }
          }
        />
      )}
    </div>
  );
};

export default UserGroup;
