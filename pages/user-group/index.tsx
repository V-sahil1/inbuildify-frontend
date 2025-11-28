import StatusSelect from '@/components/common/custom-selects/StatusSelect';
import { userGroupColumn } from '@/components/table-columns/userGroupColumn';
import { Button, Input, Table } from 'antd';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { userGroupField } from '@/components/formFields/userGroupFields';
const User_Group = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { debouncedUpdateURL, setParams, filters, resetParams } = debouncedURL({
    filtersKey: ['groupName', 'status'],
    initialValue: { status: 'Active' },
  });
  useEffect(() => {
    return () => {
      debouncedUpdateURL.cancel();
    };
  }, [debouncedUpdateURL]);
  const { column, userGroupData, userGroupSubmit } = userGroupColumn(
    setModalOpen,
    setSelectedGroup,
    selectedGroup
  );
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
            value={filters?.status}
            onChange={value => setParams({ status: value })}
            activeInactive={true}
            width={200}
          />
        </div>
        <div>
          <p>Group</p>
          <Input
            value={filters?.groupName}
            onChange={e => setParams({ groupName: e.target.value })}
          />
        </div>
        {/* <Button>Search</Button> */}
        <Button onClick={() => resetParams()}>Clear</Button>
      </div>
      <Table columns={column} dataSource={userGroupData} />
      {
        <ActionDialogmodel
          title="User Group"
          open={modalOpen}
          onCancel={() => setModalOpen(false)}
          onSubmit={values => {
            console.log('values', values);
            userGroupSubmit(values);
          }}
          fields={userGroupField()}
          isEditing={!!selectedGroup}
          initialValues={selectedGroup}
        />
      }
    </div>
  );
};

export default User_Group;
