import { Switch, Tag, Button, Space } from 'antd';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import type { ColumnsType } from 'antd/es/table';
import { StructuralEngineer } from '@redux/feature/structuralengg/IStructuralEnggState';

export type { StructuralEngineer };

export const useStructuralEngineerColumns = (onEdit?: (record: StructuralEngineer) => void, onDelete?: (record: StructuralEngineer) => void) => {
  const columns: ColumnsType<StructuralEngineer> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Inactive'}
        </Tag>
      ),
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record: StructuralEngineer) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            icon={<IconEdit size={16} />}
            onClick={(e) => {e.stopPropagation(); onEdit?.(record)}}
            style={{ color: '#1890ff' }}
          />
          <Button
            type="text"
            size="small"
            icon={<IconTrash size={16} />}
            onClick={(e) => {e.stopPropagation(); onDelete?.(record)}}
            style={{ color: '#ff4d4f' }}
          />
        </Space>
      ),
    },
  ];

  // TODO: Replace with actual API call
  // Example: const { data: structuralEngineers } = useAppSelector(state => state.structuralEngineer.engineers);
  const data: StructuralEngineer[] = [];

  return { columns, data };
};
