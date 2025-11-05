import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { commonFolderSettingFields } from '@/components/formFields/CommonFolderSettingFields';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { Button, Table } from 'antd';
import type { TableProps } from 'antd';
import { commonFolderData } from 'data/configuration/commonFolderData';
import { useState } from 'react';

export const CommonFolder = () => {
  const [modelOpen, setModelOpen] = useState<'parent' | 'child' | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: any, record: any) => (
        <div className="space-y-2">
          <p>{text}</p>
          {!record.isChild && (
            <p className="ml-3 cursor-pointer flex gap-2" onClick={() => setModelOpen('child')}>
              <IconPlus /> Sub folder
            </p>
          )}
        </div>
      ),
    },
    {
      title: 'Roles/Users',
      dataIndex: 'roles',
      key: 'roles',
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
    },
    {
      title: 'Share to customer',
      dataIndex: 'shareToCustomer',
      key: 'shareToCustomer',
    },
    {
      title: 'Lock',
      dataIndex: 'lock',
      key: 'lock',
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text: any, record: any) => (
        <div className="flex gap-2">
          <Button
            icon={<IconEdit />}
            size="small"
            onClick={e => {
              e.stopPropagation();
              setSelectedRecord(record);
              setModelOpen(record.isChild ? 'child' : 'parent');
            }}
          />
          <Button
            icon={<IconTrash />}
            className="text-red-500"
            size="small"
            onClick={e => {
              e.stopPropagation();
              if (record.isChild) {
                console.log(
                  `Delete clicked on Child "${record.name}" (Parent ID: ${record.parentKey})`
                );
              } else {
                console.log(`Delete clicked on Parent "${record.name}" (ID: ${record.key})`);
              }
            }}
          />
        </div>
      ),
    },
  ];

  const tagChildrenWithParent = (items: any[]) => {
    return items.map(item => {
      if (item.children) {
        item.children = item.children.map(child => ({
          ...child,
          isChild: true,
          parentKey: item.key,
        }));
        item.children = tagChildrenWithParent(item.children);
      }
      return item;
    });
  };

  const processedData = tagChildrenWithParent(commonFolderData);

  const onRow: TableProps<any>['onRow'] = record => ({
    onClick: () => {
      if (record.isChild) {
        console.log(`Child row clicked: ${record.name}, Parent ID: ${record.parentKey}`);
      } else {
        console.log(`Parent row clicked: ${record.name}`);
      }
    },
  });

  return (
    <>
      <div
        className="mb-4 flex items-center justify-between"
        onClick={() => setModelOpen('parent')}
      >
        <p className="text-sm font-semibold text-gray-500">
          Note: These folders will be shown in the job details under Documents section
        </p>
        <Button type="primary" icon={<IconPlus />}>
          New
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={processedData}
        onRow={onRow}
        rowClassName={record => (record.isChild ? 'bg-gray-100' : '')}
        pagination={false}
      />

      <ActionDialogmodel
        open={!!modelOpen}
        title={modelOpen === 'parent' ? 'New Folder' : 'New Sub Folder'}
        isEditing={!!selectedRecord}
        initialValues={selectedRecord}
        onCancel={() => setModelOpen(null)}
        onSubmit={() => setModelOpen(null)}
        fields={commonFolderSettingFields(modelOpen)}
      />
    </>
  );
};
