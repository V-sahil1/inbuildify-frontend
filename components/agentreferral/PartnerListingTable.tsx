import React from 'react';
import { Table, Avatar, Tag } from 'antd';
import { IconPencil, IconTrash } from '@tabler/icons-react';
import { Partners } from 'data/agentreferralData';

const getInitials = (name: string) => {
  const split = name.trim().split(" ");
  if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const AgentReferralTable = ({
  partners,
  onEdit,
  onDelete,
  onRowClick, // ✅ added
}: {
  partners: Partners[],
  onEdit: (partner: Partners) => void,
  onDelete: (partner: Partners) => void,
  onRowClick: (partner: Partners) => void // ✅ added
}) => {

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      width:'12%',
      render: (_: any, record: Partners) => (
        <span 
          className="text-blue-600 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRowClick(record); // ✅ navigate on click
          }}
        >
          {record.name}
        </span>
      )
    },
    { title: 'Address', dataIndex: 'address1' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Phone', dataIndex: 'phone' },
    {
      title: 'Reserved',
      dataIndex: 'reserved',
      render: (r: number) => r !== 0 ? <Tag color="blue">{r}</Tag> : ""
    },
    {
      title: 'Packages',
      dataIndex: 'packages',
      render: (r: number) => <Tag color="orange">{r}</Tag>
    },
    {
      title: '',
      render: (_: any, record: Partners) => (
        <Avatar>{getInitials(record.name)}</Avatar>
      )
    },
    {
      title: '',
      render: (_: any, record: Partners) => (
        <div className="flex items-center gap-3">
          <IconPencil
            size={18}
            className="cursor-pointer hover:text-blue"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(record);
            }}
          />
          <IconTrash 
            size={18} 
            className="cursor-pointer hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(record);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={partners}
      rowKey="id"
      pagination={false}
      onRow={(record) => ({
        onClick: () => onRowClick(record),
      })}
    />
  );
};

export default AgentReferralTable;
