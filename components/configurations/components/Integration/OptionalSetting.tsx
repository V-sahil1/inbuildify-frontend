import { useEffect, useState } from 'react';
import { Select, Button, Table, message, Dropdown } from 'antd';
import { useUsersHook } from '@hooks/useUserHook';
import { ActionDialogmodel, FormField } from '@/components/common/Models/ActionDialogModel';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createCustomFieldHeader,
  createCustomFieldItem,
  deleteCustomFieldHeader,
  deleteCustomFieldItem,
  fetchAllCustomFieldHeader,
  fetchAllCustomFieldItem,
  fetchIntegrationSetting,
  updateCustomFieldHeader,
  updateCustomFieldItem,
  updateIntegrationSetting,
} from '@redux/feature/admin/integration/optionalSetting/integrationOptionalThunk';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import {
  CustomerFieldItem,
  CustomerFieldItemPayload,
  CustomFieldName,
} from '@redux/feature/admin/integration/optionalSetting/IintegrationOptionalState';
import { Entity } from 'types/common.types';
import TooltipButton from '@/components/common/TooltipButton';
import { getPaginationConfig } from '@lib/utils/getPaginationConfig';

export const OptionalSettings = () => {
  const { userOptions } = useUsersHook();
  const [modelOpen, setModelOpen] = useState<
    'customField' | 'lead' | 'deleteCustomField' | 'deleteLead' | null
  >(null);
  const [selectedCustomField, setCustomField] = useState<CustomFieldName>(null);
  const [selectedRecord, setSelectedRecord] = useState<CustomerFieldItem>(null);
  const dispatch = useAppDispatch();
  const {
    integrationSetting,
    customFields,
    customFieldItems,
    customFieldItemStatus,
    customFieldStatus,
    status,
    pagination,
  } = useAppSelector(state => state.integration.optionalSetting);
  const [formValues, setFormValues] = useState(integrationSetting);
  const [showSave, setShowSave] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const fetchIntegrationSettingData = async () => {
    try {
      await dispatch(fetchIntegrationSetting()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch integration setting');
    }
  };
  const fetchCustomFieldHeaderData = async () => {
    try {
      await dispatch(fetchAllCustomFieldHeader()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch custom Field header');
    }
  };
  const fetchCustomFieldItems = async (page: number = currentPage, limit: number = PAGE_SIZE) => {
    try {
      await dispatch(fetchAllCustomFieldItem({ page, limit })).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch items data');
    }
  };

  useEffect(() => {
    fetchCustomFieldItems();
  }, [currentPage]);

  useEffect(() => {
    if (status.fetch === Status.IDLE) fetchIntegrationSettingData();
    if (customFieldStatus.fetch === Status.IDLE) {
      fetchCustomFieldHeaderData();
    }
    if (integrationSetting) setFormValues(integrationSetting);
  }, [status.fetch, customFieldStatus.fetch]);

  useEffect(() => {
    const isChanged =
      formValues?.assignLeadsIfAssigneeNotFound !==
        integrationSetting?.assignLeadsIfAssigneeNotFound ||
      formValues?.alwaysAssignLeadsTo !== integrationSetting?.alwaysAssignLeadsTo;
    setShowSave(isChanged);
  }, [formValues, integrationSetting]);

  const handleSave = async () => {
    const { isUpdated, updatedFields } = getUpdatedFields(formValues, integrationSetting);
    try {
      if (isUpdated) {
        await dispatch(updateIntegrationSetting(updatedFields)).unwrap();
      } else {
        message.info('no changes Updated');
      }
      setShowSave(false);
    } catch (error) {
      message.error(error || 'Failed to update setting');
    }
  };

  const handleSaveCustomFieldItem = async values => {
    try {
      // Map form values to API format using helper function
      const payload = mapFormToApi(values);
      if (selectedRecord) {
        await dispatch(
          updateCustomFieldItem({ data: payload, id: selectedRecord.integrationCustomFieldItemId })
        ).unwrap();
        message.success('Custom Field item updated successfully');
      } else {
        await dispatch(createCustomFieldItem(payload)).unwrap();
        message.success('Custom field item saved successfully');
      }

      setModelOpen(null);
      setSelectedRecord(null);
    } catch (error) {
      message.error(error || 'Failed to save custom field item');
    }
  };

  const handleDeleteCustomFieldItem = async () => {
    try {
      await dispatch(deleteCustomFieldItem(selectedRecord.integrationCustomFieldItemId)).unwrap();
      message.success('Custom field item deleted successfully');
      setModelOpen(null);
      setSelectedRecord(null);
    } catch (error) {
      message.error(error || 'Failed to delete custom field item');
    }
  };

  const handleSaveCustomField = async values => {
    try {
      if (selectedCustomField) {
        await dispatch(
          updateCustomFieldHeader({
            data: values,
            id: selectedCustomField.integrationCustomFieldHeaderId,
          })
        ).unwrap();
        message.success('custom field header updated successfully');
      } else {
        await dispatch(createCustomFieldHeader(values)).unwrap();
        message.success('Custom field header saved successfully');
      }
      setCustomField(null);
      setModelOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save custom field header');
    }
  };

  const handleDeleteCustomField = async () => {
    try {
      await dispatch(
        deleteCustomFieldHeader(selectedCustomField.integrationCustomFieldHeaderId)
      ).unwrap();
      await dispatch(fetchAllCustomFieldItem({ page: currentPage, limit: PAGE_SIZE })).unwrap();
      message.success('custom field header deleted successfully');
      setModelOpen(null);
      setCustomField(null);
    } catch (error) {
      message.error(error || 'Failed to delete custom field header');
    }
  };

  // Helper function to map API response to form format
  const mapApiToForm = (apiItem: CustomerFieldItem) => {
    const formValues: CustomerFieldItemPayload = {
      header1Id: apiItem.header1Id,
      value1: apiItem.value1,
      assigneeUserId: apiItem.assigneeUser?.id || '',
    };

    // Map custom field values
    if (apiItem.header1Id && apiItem.value1) {
      const field1 = customFields.find(f => f.integrationCustomFieldHeaderId === apiItem.header1Id);
      if (field1) {
        formValues[field1.headerName] = apiItem.value1;
      }
    }

    if (apiItem.header2Id && apiItem.value2) {
      const field2 = customFields.find(f => f.integrationCustomFieldHeaderId === apiItem.header2Id);
      if (field2) {
        formValues[field2.headerName] = apiItem.value2;
      }
    }

    return formValues;
  };

  // Helper function to map form values to API format
  const mapFormToApi = (formValues: CustomerFieldItemPayload) => {
    const payload: CustomerFieldItemPayload = {
      header1Id: null,
      value1: null,
      assigneeUserId: null,
    };

    // Map custom fields to headerId and value format
    customFields.forEach((field, index) => {
      const headerKey = `header${index + 1}Id`;
      const valueKey = `value${index + 1}`;

      payload[headerKey] = field.integrationCustomFieldHeaderId;
      payload[valueKey] = formValues[field.headerName] || '';
    });

    // Map assignee if present
    if (formValues.assigneeUserId) {
      payload.assigneeUserId = formValues.assigneeUserId;
    }

    return payload;
  };

  const customFieldItemsFormFields: FormField[] = [
    ...customFields.map(field => ({
      label: field.headerName,
      name: field.headerName,
      type: 'text' as const,
    })),
    {
      label: 'Assignee',
      name: 'assigneeUserId',
      type: 'select' as const,
      options: userOptions || [],
    },
  ];
  // Dynamic columns that include custom fields
  const dynamicColumns = [
    ...customFields.map((field, index) => ({
      title: (
        <div className="flex items-center justify-between">
          <span>{field.headerName}</span>
          <Dropdown
            menu={{
              items: [
                { key: 'delete', label: 'Delete' },
                { key: 'edit', label: 'Edit' },
              ],
              onClick: e => {
                if (e.key === 'delete') {
                  setCustomField(field);
                  setModelOpen('deleteCustomField');
                } else if (e.key === 'edit') {
                  setCustomField(field);
                  setModelOpen('customField');
                }
              },
            }}
            trigger={['click']}
          >
            <IconDotsVertical size={16} className="cursor-pointer" />
          </Dropdown>
        </div>
      ),
      dataIndex: `value${index + 1}`, // Use value1, value2, etc. from API
      key: field.headerName.toLowerCase().replace(/\s+/g, '_'),
      render: text => text || '-', // Display fallback for empty values
    })),

    {
      title: 'Assignee',
      dataIndex: 'assigneeUser',
      key: 'assignee',
      render: (assigneeUser: Entity) => assigneeUser?.name || '-',
    },

    {
      title: <Button onClick={() => setModelOpen('lead')}>New</Button>,
      key: 'action',
      render: (_, record: CustomerFieldItem) => (
        <div className="flex gap-2">
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconEdit size={16} />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen('lead');
            }}
          />
          <TooltipButton
            title="Delete"
            type="text"
            icon={<IconTrash size={16} />}
            className="text-red-500"
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen('deleteLead');
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <p className="text-lg font-semibold">Lead Settings or User Mapping</p>

      <div className="flex justify-between items-center  pb-3">
        <div>
          <p className="font-medium">Assign Leads (assignee not found/received)</p>
          <p className="text-font-color-100 text-sm">
            System will use the default user if REA assigned user not exist/found
          </p>
        </div>
        <div className="w-64">
          <Select
            className="w-full"
            value={formValues?.assignLeadsIfAssigneeNotFound}
            options={userOptions}
            onChange={value =>
              setFormValues(prev => ({ ...prev, assignLeadsIfAssigneeNotFound: value }))
            }
          />
        </div>
      </div>

      <div className="flex justify-between items-center pb-3">
        <div>
          <p className="font-medium">Always Assign Leads (force and assign leads)</p>
          <p className="text-font-color-100 text-sm">
            System will FORCE and assign the leads to the selected user
          </p>
        </div>
        <div className="w-64">
          <Select
            className="w-full"
            value={formValues?.alwaysAssignLeadsTo}
            options={userOptions}
            onChange={value => setFormValues(prev => ({ ...prev, alwaysAssignLeadsTo: value }))}
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
        <div className="my-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-font-color">
            Customize and assign lead enquires
          </p>
          {customFields && customFields.length < 2 && (
            <Button type="primary" onClick={() => setModelOpen('customField')}>
              New Custom Field
            </Button>
          )}
        </div>

        {customFields && customFields.length > 0 && (
          <Table
            columns={dynamicColumns}
            dataSource={customFieldItems}
            pagination={getPaginationConfig({
              currentPage,
              limit: pagination?.limit,
              totalRecords: pagination?.totalRecords,
              setCurrentPage,
            })}
            rowClassName="hover:bg-gray-50"
            loading={customFieldItemStatus.fetch === Status.PENDING}
          />
        )}

        {/* Model for add/edit */}
        {modelOpen === 'lead' && (
          <ActionDialogmodel
            open={modelOpen === 'lead'}
            title={selectedRecord ? 'Edit Lead Item' : 'New Lead Item'}
            isEditing={!!selectedRecord}
            initialValues={selectedRecord ? mapApiToForm(selectedRecord) : {}}
            onCancel={() => {
              setModelOpen(null);
              setSelectedRecord(null);
            }}
            onSubmit={handleSaveCustomFieldItem}
            fields={customFieldItemsFormFields}
            loading={customFieldItemStatus.update === Status.PENDING}
          />
        )}

        {modelOpen === 'customField' && (
          <ActionDialogmodel
            open={modelOpen === 'customField'}
            title={selectedCustomField ? 'Edit Custom Field' : 'New Custom Field'}
            isEditing={!!selectedCustomField}
            initialValues={selectedCustomField}
            onCancel={() => {
              setModelOpen(null);
              setCustomField(null);
            }}
            onSubmit={handleSaveCustomField}
            fields={[
              {
                label: 'Custom Field Name',
                type: 'text' as const,
                name: 'headerName',
                rules: [{ required: true, message: 'Please enter field name' }],
              },
            ]}
            loading={customFieldStatus.update === Status.PENDING}
          />
        )}

        {/* Delete confirmation */}
        {['deleteCustomField', 'deleteLead'].includes(modelOpen) && (
          <ConfirmationModal
            open={['deleteCustomField', 'deleteLead'].includes(modelOpen)}
            type="danger"
            onClose={() => {
              setCustomField(null);
              setSelectedRecord(null);
              setModelOpen(null);
            }}
            onConfirm={() =>
              modelOpen === 'deleteLead' ? handleDeleteCustomFieldItem() : handleDeleteCustomField()
            }
            message="Are you sure you want to delete this item?"
          />
        )}
      </div>
    </div>
  );
};
