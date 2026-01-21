import React, { useState, useEffect } from 'react';
import { Button, Table, Form, Select, Space, Typography, message } from 'antd';
import { IconCheck, IconEdit, IconPlus, IconX } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchRoleTypeById,
  fetchRoleAndUsersMapping,
  createRoleAndUserMapping,
  updateRoleAndUserMapping,
} from '@redux/feature/admin/general/roleAndUserMapping/roleAndMappingThunk';
import { useRoleHook } from '@hooks/useRoleHook';
import { useUsersHook } from '@hooks/useUserHook';
import {
  RoleAndUserMapping,
  RoleAndUserMappingCreatePayload,
} from '@redux/feature/admin/general/roleAndUserMapping/IRoleAndUserMappingState';
import { Status } from '@lib/constants/enum';
import { addRoleMapping } from '@redux/feature/admin/general/roleAndUserMapping/roleAndMappingSlice';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

const { Title, Text } = Typography;

const RoleAndUser: React.FC = () => {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<string>('');
  const { userOptions } = useUsersHook();
  const { roleOptions } = useRoleHook();
  const { userRoleMapping, status } = useAppSelector(state => state.general.roleAndUserMapping);
  const dispatch = useAppDispatch();
  const [typeOptions, setTypeOptions] = useState<Array<{ label: string; value: string }>>([]);

  const fetchRoleData = async (assignedBy: string | undefined) => {
    try {
      await dispatch(fetchRoleAndUsersMapping(assignedBy)).unwrap();
    } catch (error) {
      message.error('Failed to fetch role mapping');
    }
  };

  useEffect(() => {
    if (status.fetch === Status.IDLE) fetchRoleData(undefined);
  }, [dispatch, status.fetch]);

  const handleTaskManagerChange = (value: string | undefined) => {
    fetchRoleData(value);
  };

  const fetchRoleTypeOptions = async (role: string) => {
    try {
      const response = await dispatch(fetchRoleTypeById(role)).unwrap();
      const options = response?.map(r => ({ label: r.typeName, value: r.roleTypeId }));
      setTypeOptions(options);
    } catch (error) {
      message.error('Failed to fetch role type options');
      setTypeOptions([]);
    }
  };

  const isEditing = (record: RoleAndUserMapping) => record.userRoleMappingId === editingKey;

  const handleAdd = () => {
    if (editingKey) {
      message.warning('Please save or cancel current edit first.');
      return;
    }

    const newKey = Date.now().toString();
    const newRow: RoleAndUserMapping = {
      userRoleMappingId: newKey,
      roleType: { id: '', name: '' },
      user: { id: '', name: '' },
      role: { id: '', name: '' },
      assignedBy: { id: '', name: '' },
      assignedAt: '',
      isNew: true,
    };

    dispatch(addRoleMapping(newRow));
    setEditingKey(newKey);
    form.setFieldsValue({
      role: undefined,
      type: undefined,
      user: undefined,
    });
  };

  const handleEdit = (record: RoleAndUserMapping) => {
    if (editingKey) {
      message.warning('Please save or cancel the current edit first.');
      return;
    }
    // Fetch role types for the selected role
    if (record.role?.id) {
      fetchRoleTypeOptions(record.role.id);
    }

    setEditingKey(record.userRoleMappingId);
    form.setFieldsValue({
      ...record,
      role: record.role?.id,
      type: record.roleType?.id,
      user: record.user?.id,
    });
  };

  const handleSave = async (key: string) => {
    try {
      const row = (await form.validateFields()) as {
        role: string;
        type: string;
        user: string;
      };

      const item = userRoleMapping.find(i => i.userRoleMappingId === key);

      if (item && item.isNew) {
        const payload: RoleAndUserMappingCreatePayload = {
          roleId: row.role,
          roleTypeId: row.type,
          userId: row.user,
          assignedBy: row.user,
        };
        await dispatch(createRoleAndUserMapping(payload)).unwrap();
        message.success('Role mapping created successfully.');
        setEditingKey('');
      } else if (item) {
        const initialValues = {
          role: item.role?.id,
          type: item.roleType?.id,
          user: item.user?.id,
        };
        const { isUpdated, updatedFields } = getUpdatedFields(row, initialValues);

        if (!isUpdated) {
          message.info('Updated successfully');
          setEditingKey('');
          return;
        }

        const payload: Partial<RoleAndUserMappingCreatePayload> = {};
        if (updatedFields.role) payload.roleId = updatedFields.role;
        if (updatedFields.type) payload.roleTypeId = updatedFields.type;
        if (updatedFields.user) {
          payload.userId = updatedFields.user;
          payload.assignedBy = updatedFields.user;
        }

        await dispatch(updateRoleAndUserMapping({ id: key, data: payload })).unwrap();
        message.success('Role mapping updated successfully.');
        setEditingKey('');
      }
    } catch (error) {
      console.error(error);
      message.error(error || 'Failed to save role mapping');
    }
  };

  const handleCancel = () => {
    const item = userRoleMapping.find(i => i.userRoleMappingId === editingKey);
    if (item && item.isNew) {
      setEditingKey('');
      form.resetFields();
    } else {
      setEditingKey('');
      form.resetFields();
    }
  };

  const isActionLoading = status.create === Status.PENDING || status.update === Status.PENDING;

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'userRoleMappingId',
      width: 70,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      onCell: (record: RoleAndUserMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'role',
        title: 'Role',
        inputOptions: roleOptions,
      }),
      render: (_, record: RoleAndUserMapping) => record.role?.name || '--',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      onCell: (record: RoleAndUserMapping) => {
        return {
          record,
          editing: isEditing(record),
          dataIndex: 'type',
          title: 'Type',
          inputOptions: typeOptions,
        };
      },
      render: (_, record: RoleAndUserMapping) => record.roleType?.name || '--',
    },
    {
      title: 'User',
      dataIndex: 'user',
      onCell: (record: RoleAndUserMapping) => ({
        record,
        editing: isEditing(record),
        dataIndex: 'user',
        title: 'User',
        inputOptions: userOptions,
      }),
      render: (_, record: RoleAndUserMapping) => record.user?.name || '--',
    },
    {
      title: 'Action',
      key: 'actions',
      align: 'right' as const,
      width: 100,
      render: (_, record: RoleAndUserMapping) => {
        const editing = isEditing(record);
        return editing ? (
          <Space size="small">
            <Button
              loading={isActionLoading}
              icon={<IconCheck />}
              type="primary"
              size="small"
              onClick={() => handleSave(record.userRoleMappingId)}
            />
            <Button
              disabled={isActionLoading}
              icon={<IconX />}
              danger
              size="small"
              onClick={handleCancel}
            />
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
    <>
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
              allowClear
              onChange={handleTaskManagerChange}
              options={userOptions}
              className="w-full"
              placeholder="Select a Task Manager"
            />
          </div>
        </div>
      </div>

      <div className="p-4 border rounded-lg bg-white shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <Title level={4} style={{ margin: 0 }}>
            Assign User for Role Mapping
          </Title>
          <Button type="primary" icon={<IconPlus />} onClick={handleAdd} disabled={!!editingKey}>
            Create
          </Button>
        </div>

        <Form form={form} component={false}>
          <Table
            dataSource={userRoleMapping}
            columns={columns.map((col, index) => {
              if (!col.onCell) {
                return col;
              }

              return {
                ...col,
                render: (text, record, index) => {
                  const editing = isEditing(record as RoleAndUserMapping);
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
                            message:
                              col.dataIndex === 'user'
                                ? 'Please select User!'
                                : `Please select ${col.title}!`,
                          },
                        ]}
                      >
                        <Select
                          options={inputOptions}
                          placeholder={`Select ${col.title}`}
                          showSearch
                          onChange={value => {
                            if (col.dataIndex === 'role') {
                              fetchRoleTypeOptions(value);
                              form.setFieldValue('type', undefined);
                            }
                          }}
                        />
                      </Form.Item>
                    );
                  }
                  return col.render ? col.render(text, record, index) : text;
                },
              };
            })}
            pagination={false}
            rowKey="id"
          />
        </Form>
      </div>
    </>
  );
};

export default RoleAndUser;
