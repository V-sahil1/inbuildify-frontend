import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { commonFolderSettingFields } from '@/components/formFields/CommonFolderSettingFields';
import { useRoleHook } from '@hooks/useRoleHook';
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { toggleExpand } from '@redux/feature/admin/document/area/documentAreaSlice';
import {
  createDocumentArea,
  createDocumentSubFolder,
  deleteDocumentArea,
  deleteDocumentSubFolder,
  fetchAllDocumentArea,
  fetchAllDocumentSubFolder,
  updateDocumentArea,
  updateDocumentSubFolder,
} from '@redux/feature/admin/document/area/documentAreaThunk';
import {
  DocumentSubFolder,
  IDocumentCommonFolder,
} from '@redux/feature/admin/document/area/IDocumentAreaState';

import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, message, Popconfirm, Space, Switch, Table, Tag, Tooltip } from 'antd';

import { useEffect, useState } from 'react';
import TooltipButton from '@/components/common/TooltipButton';

export const CommonFolder = () => {
  const dispatch = useAppDispatch();
  const { commonFolder, status } = useAppSelector(state => state.document.area);
  const { roleOptions } = useRoleHook();
  const { userOptions } = useUsersHook();
  const [modelOpen, setModelOpen] = useState<'parent' | 'child' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [selectedParent, setSelectedParent] = useState<IDocumentCommonFolder>(null);

  const fetchAllDocumentAreaData = () => {
    try {
      dispatch(fetchAllDocumentArea()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch document area');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) {
      fetchAllDocumentAreaData();
    }
  }, [status.fetch]);

  const handleSaveParent = async values => {
    try {
      if (selectedRecord) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedRecord);
        if (!isUpdated) {
          setModelOpen(null);
          setSelectedRecord(null);
          return;
        }
        await dispatch(
          updateDocumentArea({ data: updatedFields, id: selectedRecord.documentCommonFolderId })
        ).unwrap();
        message.success('Document area updated successfully');
      } else {
        await dispatch(createDocumentArea(values)).unwrap();
        message.success('Document area created successfully');
      }
      setModelOpen(null);
      setSelectedRecord(null);
    } catch (error) {
      message.error(error || 'Failed to create document area');
    }
  };

  const handleDeleteParennt = async (id: string) => {
    try {
      await dispatch(deleteDocumentArea(id)).unwrap();
      message.success('Document area deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete document area');
    }
  };
  const handleSaveChild = async values => {
    try {
      if (selectedRecord) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, selectedRecord);
        if (!isUpdated) {
          setModelOpen(null);
          setSelectedRecord(null);
          return;
        }
        await dispatch(
          updateDocumentSubFolder({
            data: updatedFields,
            id: selectedRecord.documentCommonSubfolderId,
          })
        ).unwrap();
        message.success('Document sub folder updated successfully');
      } else {
        await dispatch(
          createDocumentSubFolder({
            ...values,
            documentCommonFolderId: selectedParent.documentCommonFolderId,
          })
        ).unwrap();
        message.success('Document sub folder created successfully');
      }
      setModelOpen(null);
      setSelectedRecord(null);
    } catch (error) {
      message.error(error || 'Failed to create document sub folder');
    }
  };

  const handleDeleteChild = async (record: DocumentSubFolder) => {
    try {
      await dispatch(
        deleteDocumentSubFolder({
          commonFolderId: record.documentCommonFolderId,
          id: record.documentCommonSubfolderId,
        })
      ).unwrap();
      message.success('Document sub folder deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete document sub folder');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record: IDocumentCommonFolder) => (
        <div className="space-y-2">
          <p>{text}</p>
          <p
            className="cursor-pointer flex items-center gap-2"
            onClick={() => {
              setSelectedParent(record);
              setModelOpen('child');
            }}
          >
            <IconPlus size={14} /> Sub folder
          </p>
        </div>
      ),
    },
    {
      title: 'Roles/Users',
      dataIndex: 'roles',
      key: 'roles',
      render: (_, record: IDocumentCommonFolder) => (
        <div className="space-y-2">
          {record.roles && (
            <>
              <p>Roles</p>
              {record.roles?.slice(0, 3).map((role, index) => {
                return <Tag key={index}>{role.name}</Tag>;
              })}
              {record.roles?.length > 3 && (
                <Tooltip
                  title={record.roles
                    ?.slice(3)
                    ?.map(i => i.name)
                    ?.join(' , ')}
                >
                  <Tag>...</Tag>
                </Tooltip>
              )}
            </>
          )}
          {record.users && (
            <>
              <p>Users</p>
              {record.users?.slice(0, 3).map((user, index) => {
                return <Tag key={index}>{user.name}</Tag>;
              })}
              {record.users?.length > 3 && (
                <Tooltip
                  title={record.users
                    ?.slice(3)
                    ?.map(i => i.name)
                    ?.join(' , ')}
                >
                  <Tag>...</Tag>
                </Tooltip>
              )}
            </>
          )}
        </div>
      ),
    },
    {
      title: 'Sort order',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
    },
    {
      title: 'Notify',
      dataIndex: 'notify',
      key: 'notify',
      render: notify => <Switch checked={notify} disabled={true} />,
    },
    {
      title: 'Share to customer',
      dataIndex: 'shareToCustomer',
      key: 'shareToCustomer',
      render: shareToCustomer => <Switch checked={shareToCustomer} disabled={true} />,
    },
    {
      title: 'Lock',
      dataIndex: 'isLocked',
      key: 'isLocked',
      render: isLocked => <Switch checked={isLocked} disabled={true} />,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record: IDocumentCommonFolder) => (
        <div className="flex gap-2">
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconEdit size={16} />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen('parent');
            }}
          />
          <Popconfirm
            title="Are you sure you want to delete this?"
            onConfirm={() => handleDeleteParennt(record.documentCommonFolderId)}
          >
            <TooltipButton
              title="Delete"
              type="text"
              icon={<IconTrash size={16} color="red" />}
              size="small"
            />
          </Popconfirm>
        </div>
      ),
    },
  ];
  const getSubFolderData = async record => {
    if (!record.isExpanded) {
      dispatch(toggleExpand(record.documentCommonFolderId));
      try {
        await dispatch(fetchAllDocumentSubFolder(record.documentCommonFolderId)).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch stage data');
      }
    }
  };

  const expandedRowRender = record => {
    getSubFolderData(record);
    const subFolderColumns = [
      { title: 'Name', dataIndex: 'name' },
      { title: 'Sort', dataIndex: 'sortOrder', width: 80 },
      {
        title: '',
        width: 120,
        render: (_, record) => (
          <Space>
            <TooltipButton
              title="Edit"
              type="text"
              size="small"
              icon={<IconEdit size={16} />}
              onClick={() => {
                setSelectedRecord(record);
                setModelOpen('child');
              }}
            />
            <Popconfirm
              title="Are you sure you want to delete this?"
              onConfirm={() => handleDeleteChild(record)}
            >
              <TooltipButton
                type="text"
                title="Delete"
                icon={<IconTrash size={16} color="red" />}
                className="text-red-500"
                size="small"
              />
            </Popconfirm>
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={subFolderColumns}
        dataSource={record.subFolder}
        pagination={false}
        size="small"
      />
    );
  };

  return (
    <>
      <div
        className="mb-4 flex items-center justify-between"
        onClick={() => setModelOpen('parent')}
      >
        <p className="text-sm font-semibold text-font-color-100">
          Note: These folders will be shown in the job details under Documents section
        </p>
        <Button type="primary" icon={<IconPlus />}>
          New
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={commonFolder}
        pagination={false}
        expandable={{ expandedRowRender }}
      />

      {!!modelOpen && (
        <ActionDialogmodel
          open={!!modelOpen}
          title={modelOpen === 'parent' ? 'New Folder' : 'New Sub Folder'}
          isEditing={!!selectedRecord}
          initialValues={
            !!selectedRecord &&
            (modelOpen === 'parent'
              ? {
                  ...selectedRecord,
                  roleIds: selectedRecord.roles && selectedRecord?.roles.map(i => i.id),
                  userIds: selectedRecord.users && selectedRecord?.users.map(i => i.id),
                }
              : selectedRecord)
          }
          onCancel={() => {
            setSelectedRecord(null);
            setModelOpen(null);
          }}
          onSubmit={values => {
            modelOpen === 'parent' ? handleSaveParent(values) : handleSaveChild(values);
          }}
          fields={modelOpen ? commonFolderSettingFields(modelOpen, roleOptions, userOptions) : []}
        />
      )}
    </>
  );
};
