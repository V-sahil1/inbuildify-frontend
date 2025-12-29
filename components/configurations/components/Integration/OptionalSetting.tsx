import { useEffect, useState } from 'react';
import { Select, Button, Table } from 'antd';
import { useUsersHook } from '@hooks/useUserHook';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { getIntegrationOptionalSettingFields } from '@/components/formFields/IntegrationOptionalSettingFields';
import { intergrationOptionalSettingData } from 'data/configuration/IntergrationOptionalSettingData';

export const OptionalSettings = () => {
  const { users } = useUsersHook();
  const [modelOpen, setModelOpen] = useState<boolean>(false);
  const [deleteModelOpen, setDeleteModelOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const [initialValues, setInitialValues] = useState({
    assignLeads: 1,
    alwaysAssign: 2,
  });

  const [formValues, setFormValues] = useState({
    assignLeads: 1,
    alwaysAssign: 2,
  });

  const [showSave, setShowSave] = useState(false);

  useEffect(() => {
    const isChanged =
      formValues.assignLeads !== initialValues.assignLeads ||
      formValues.alwaysAssign !== initialValues.alwaysAssign;
    setShowSave(isChanged);
  }, [formValues, initialValues]);

  const handleSave = () => {
    setInitialValues(formValues);
    setShowSave(false);
    console.log('Saved values:', formValues);
  };

  const columns = [
    {
      title: 'Field Name',
      dataIndex: 'fieldName',
      key: 'fieldName',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Assignee',
      dataIndex: 'assignee',
      key: 'assignee',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <div className="flex gap-2">
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen(true);
            }}
          />
          <Button
            icon={<IconTrash />}
            className="text-red-500"
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setDeleteModelOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-lg font-semibold">Lead Settings or User Mapping</p>

      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <p className="font-medium">Assign Leads (assignee not found/received)</p>
          <p className="text-gray-600 text-sm">
            System will use the default user if REA assigned user not exist/found
          </p>
        </div>
        <div className="w-64">
          <Select
            className="w-full"
            value={formValues.assignLeads}
            options={users.map(user => ({
              label: user.name,
              value: user.usersId,
            }))}
            onChange={value => setFormValues(prev => ({ ...prev, assignLeads: value }))}
          />
        </div>
      </div>

      <div className="flex justify-between items-center border-b pb-3">
        <div>
          <p className="font-medium">Always Assign Leads (force and assign leads)</p>
          <p className="text-gray-600 text-sm">
            System will FORCE and assign the leads to the selected user
          </p>
        </div>
        <div className="w-64">
          <Select
            className="w-full"
            value={formValues.alwaysAssign}
            options={users.map(user => ({
              label: user.name,
              value: user.usersId,
            }))}
            onChange={value => setFormValues(prev => ({ ...prev, alwaysAssign: value }))}
          />
        </div>
      </div>

      {/* Save button */}
      {showSave && (
        <div className="pt-3 text-right">
          <Button type="primary" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}

      <div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500">Customize and assign lead enquires</p>
          <Button
            type="primary"
            icon={<IconPlus />}
            onClick={() => {
              setSelectedRecord(null);
              setModelOpen(true);
            }}
          >
            New
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={intergrationOptionalSettingData}
          pagination={false}
          rowClassName="hover:bg-gray-50"
        />

        {/* Model for add/edit */}
        <ActionDialogmodel
          open={modelOpen}
          title={selectedRecord ? 'Edit Folder' : 'New Folder'}
          isEditing={!!selectedRecord}
          initialValues={selectedRecord}
          onCancel={() => setModelOpen(false)}
          onSubmit={() => setModelOpen(false)}
          fields={getIntegrationOptionalSettingFields()}
        />

        {/* Delete confirmation */}
        <ConfirmationModal
          open={deleteModelOpen}
          type="danger"
          onClose={() => setDeleteModelOpen(false)}
          onConfirm={() => setDeleteModelOpen(false)}
          message="Are you sure you want to delete this folder?"
        />
      </div>
    </div>
  );
};
