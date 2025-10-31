import React, { useState } from 'react';
import { Button, Table, Form, Select, Space, Typography, message } from 'antd';
import { IconCheck, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { useUsersHook } from '@hooks/useUserData';
import {
  RoleAndMappingData,
  RoleMapping,
  rolesOfRoleMapping,
  typeOptionsOfRoleMapping,
} from 'data/configuration/ConfigrationData';

const { Title, Text } = Typography;

const RoleAndUser: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<RoleMapping[]>(RoleAndMappingData);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [taskManager, setTaskManager] = useState('Murthy Muthuswamy');
  const { users } = useUsersHook();

  const isEditing = (record: RoleMapping) => record.id === editingKey;

  const handleAdd = () => {
    if (editingKey) {
      message.warning('Please save or cancel the current edit first.');
      return;
    }

    const newKey = Date.now();
    const newRow: RoleMapping = {
      id: newKey,
      type: '--',
      role: rolesOfRoleMapping[0],
      user: users[0]?.name,
    };

    setData(prev => [newRow, ...prev]);
    setEditingKey(newKey);
    form.setFieldsValue(newRow);
  };

  const handleEdit = (record: RoleMapping) => {
    if (editingKey) {
      message.warning('Please save or cancel the current edit first.');
      return;
    }
    setEditingKey(record.id);
    form.setFieldsValue(record);
  };

  const handleSave = async (key: string | number) => {
    try {
      const row = (await form.validateFields()) as RoleMapping;

      const newData = [...data];
      const index = newData.findIndex(item => key === item.id);

      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
          id: item?.isNew ? item.id : key,
        });

        setData(newData);
        setEditingKey('');
        message.success(
          item?.isNew
            ? 'New role mapping added successfully.'
            : 'Role mapping updated successfully.'
        );
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.error('Validate Failed:', errInfo);
    }
  };

  const handleCancel = () => {
    const item = data.find(i => i.id === editingKey);
    if (item && item.isNew) {
      setData(data.filter(i => i.id !== editingKey));
    }
    setEditingKey('');
    form.resetFields();
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'id',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      onCell: (record: RoleMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'type',
        title: 'Type',
        inputOptions: typeOptionsOfRoleMapping,
      }),
      render: text => text || '--',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      onCell: (record: RoleMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'role',
        title: 'Role',
        inputOptions: rolesOfRoleMapping.map(r => ({ label: r, value: r })),
      }),
    },
    {
      title: 'User',
      dataIndex: 'user',
      onCell: (record: RoleMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'user',
        title: 'User',
        inputOptions: users?.map(u => ({ label: u.name, value: u.name })),
      }),
    },
    {
      title: (
        <Button type="primary" icon={<IconPlus />} onClick={handleAdd} disabled={!!editingKey}>
          New
        </Button>
      ),
      key: 'actions',
      align: 'right' as const,
      width: 100,
      render: (_: any, record: RoleMapping) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="small">
            <Button
              icon={<IconCheck />}
              type="primary"
              size="small"
              onClick={() => handleSave(record.id)}
            />
            <Button icon={<IconX />} danger size="small" onClick={handleCancel} />
          </Space>
        ) : (
          <Button
            type="text"
            icon={<IconEdit />}
            onClick={() => handleEdit(record)}
            disabled={!!editingKey}
          />
        );
      },
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8 p-4 border rounded-lg bg-white shadow-sm">
        <Title level={4} style={{ marginBottom: 4 }}>
          Assign Task Manager
        </Title>
        <div className="flex items-center justify-between">
          <div className="w-full md:w-1/2 gap-2">
            <Title level={5} style={{ marginBottom: 4 }}>
              Task Manager
            </Title>
            <Text type="secondary">
              Task Manager will be mapped as assigned user in case any user not mapped or mapped
              user is inactive.
            </Text>
          </div>
          <div className="w-full md:w-1/2">
            <Select
              onChange={setTaskManager}
              options={users?.map(u => ({ label: u.name, value: u.usersId }))}
              className="w-full"
              placeholder="Select a Task Manager"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <Title level={4}>Assign User for Role Mapping</Title>

        <Form form={form} component={false}>
          <Table
            dataSource={data}
            columns={columns.map(col => {
              if (!col.onCell) {
                return col;
              }

              return {
                ...col,
                render: (text, record) => {
                  const editing = isEditing(record as RoleMapping);
                  if (editing) {
                    const inputOptions =
                      col.dataIndex === 'type'
                        ? typeOptionsOfRoleMapping
                        : col.dataIndex === 'role'
                          ? rolesOfRoleMapping.map(r => ({
                              label: r,
                              value: r,
                            }))
                          : users?.map(u => ({
                              label: u.name,
                              value: u.usersId,
                            }));

                    return (
                      <Form.Item
                        name={col.dataIndex}
                        style={{ margin: 0 }}
                        rules={[
                          {
                            required: true,
                            message: `Please select ${col.title}!`,
                          },
                        ]}
                      >
                        <Select
                          options={inputOptions}
                          placeholder={`Select ${col.title}`}
                          showSearch
                        />
                      </Form.Item>
                    );
                  }
                  return text;
                },
              };
            })}
            pagination={false}
            rowKey="id"
          />
        </Form>
      </div>
    </div>
  );
};

export default RoleAndUser;
