import React from 'react';
import { Table, Avatar, Tag } from 'antd';
import { IconKey, IconLock, IconLockOpen, IconPencil, IconTrash } from '@tabler/icons-react';
import { IAgentReferralPartner } from '@redux/feature/agentReferral/IAgentReferralState';
import TooltipButton from '../common/TooltipButton';

const getInitials = (name: string) => {
  const split = name.trim().split(' ');
  if (split.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const AgentReferralTable = ({
  partners,
  onEdit,
  onDelete,
  onRowClick,
  onResetPassword,
  onLock,
}: {
  partners?: IAgentReferralPartner[];
  onEdit: (partner: IAgentReferralPartner) => void;
  onDelete: (partner: IAgentReferralPartner) => void;
  onRowClick: (partner: IAgentReferralPartner) => void;
  onResetPassword: (partner: IAgentReferralPartner) => void;
  onLock: (partner: IAgentReferralPartner) => void;
}) => {
  const columns = [
    {
      title: 'Name',
      dataIndex: 'user',
      width: '12%',
      render: (_, record: IAgentReferralPartner) => record?.user?.name,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      render: address => address?.addressLine1,
    },
    { title: 'Email', dataIndex: 'user', render: user => user?.email },
    { title: 'Phone', dataIndex: 'user', render: user => user?.phone },
    {
      title: 'Reserved',
      dataIndex: 'reserved',
      render: (r: number) => (r !== 0 ? <Tag color="blue">{r}</Tag> : ''),
    },
    {
      title: 'Packages',
      dataIndex: 'packages',
      render: (r: number) => <Tag color="orange">{r}</Tag>,
    },
    {
      title: '',
      render: (_, record: IAgentReferralPartner) => (
        <Avatar>{getInitials(record?.user?.name)}</Avatar>
      ),
    },
    {
      title: '',
      render: (_, record: IAgentReferralPartner) => (
        <div className="flex items-center gap-3">
          <TooltipButton
            title="Edit"
            type="text"
            icon={<IconPencil size={18} className="cursor-pointer hover:text-blue" />}
            onClick={e => {
              e.stopPropagation();
              onEdit(record);
            }}
          />
          <TooltipButton
            title="Delete"
            type="text"
            icon={<IconTrash size={18} className="cursor-pointer hover:text-red-500" />}
            onClick={e => {
              e.stopPropagation();
              onDelete(record);
            }}
          />

          {!!record.user?.loginId && (
            <TooltipButton
              type="text"
              title="Reset Password"
              icon={<IconKey size={18} className="cursor-pointer hover:text-blue" />}
              onClick={e => {
                e.stopPropagation();
                onResetPassword(record);
              }}
            />
          )}
          {!!record.user?.loginId && (
            <TooltipButton
              type="text"
              title={record.user.isLocked ? 'Unlock' : 'Lock'}
              icon={
                record.user.isLocked ? (
                  <IconLock size={20} className="cursor-pointer text-red-600 hover:text-red-700" />
                ) : (
                  <IconLockOpen
                    size={20}
                    className="cursor-pointer text-blue-600 hover:text-blue-400"
                  />
                )
              }
              onClick={e => {
                e.stopPropagation();
                onLock(record);
              }}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={partners}
      rowKey="agentReferralPartnerId"
      pagination={false}
      onRow={record => ({
        onClick: () => onRowClick(record),
      })}
    />
  );
};

export default AgentReferralTable;
