import React, { useState } from 'react';
import { Button, Table, Form, Select, Space, Typography, message } from 'antd';
import { IconCheck, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import {
  RoleAndMappingData,
  RoleMapping,
  rolesOfRoleMapping,
} from 'data/configuration/ConfigrationData';
import { useAppDispatch } from '@hooks/redux';
import { fetchRoleTypeById } from '@redux/feature/admin/general/roleAndUserMapping/roleAndMappingThunk';
import { useRoleHook } from '@hooks/useRoleHook';
import { useUsersHook } from '@hooks/useUserHook';

const { Title, Text } = Typography;

const RoleAndUser: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<RoleMapping[]>(RoleAndMappingData);
  const [editingKey, setEditingKey] = useState<string | number>('');
  const [taskManager, setTaskManager] = useState('Murthy Muthuswamy');
  const { userOptions } = useUsersHook();
  const { roleOptions } = useRoleHook();
  const dispatch = useAppDispatch();
  const [typeOptions, setTypeOptions] = useState<Array<{label: string; value: string}>>([]);

  const fetchRoleTypeOptions = async (role: string) => {
    try {
      const response = await dispatch(fetchRoleTypeById(role)).unwrap();
      const options = response.map(r => ({ label: r.typeName, value: r.roleTypeId }));
      setTypeOptions(options);
    } catch (error) {
      message.error('Failed to fetch role type options');
      setTypeOptions([]);
    }
  };

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
      user: userOptions[0]?.value,
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
      title: 'Role',
      dataIndex: 'role',
      onCell: (record: RoleMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'role',
        title: 'Role',
        inputOptions: roleOptions,
      }),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      onCell: (record: RoleMapping) => {
        console.log('Type options in column:', typeOptions);
        return {
        record,
        editing: isEditing(record),
        dataIndex: 'type',
        title: 'Type',
        inputOptions: typeOptions,
        };
      },
      render: text => text || '--',
    },
    {
      title: 'User',
      dataIndex: 'user',
      onCell: (record: RoleMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'user',
        title: 'User',
        inputOptions: userOptions,
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
              options={userOptions}
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
            columns={columns.map((col, index) => {
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
                        ? typeOptions
                        : col.dataIndex === 'role'
                          ? roleOptions
                          : userOptions;

                    return (
                      <Form.Item
                        key={index}
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
                          onChange={(value) => {
                            if (col.dataIndex === 'role') {
                              // When role changes, fetch types for that role
                              fetchRoleTypeOptions(value);
                              // Clear the type field when role changes
                              form.setFieldValue('type', undefined);
                            }
                          }}
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
