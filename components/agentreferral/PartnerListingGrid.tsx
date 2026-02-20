import React from 'react';
import { Avatar, Tag } from 'antd';
import {
  IconPhone,
  IconMail,
  IconPencil,
  IconTrash,
  IconKey,
  IconLock,
  IconLockOpen,
} from '@tabler/icons-react';
import { IAgentReferralPartner } from '@redux/feature/agentReferral/IAgentReferralState';
import TooltipButton from '../common/TooltipButton';

const getInitials = (name: string) => {
  const split = name?.trim().split(' ');
  if (split?.length >= 2) return (split[0][0] + split[1][0]).toUpperCase();
  return name?.substring(0, 2).toUpperCase();
};

const AgentReferralGrid = ({
  partners,
  onEdit,
  onDelete,
  onLock,
  onResetPassword,
  onViewDetails,
}: {
  partners?: IAgentReferralPartner[];
  onEdit: (partner: IAgentReferralPartner) => void;
  onDelete: (partner: IAgentReferralPartner) => void;
  onLock: (partner: IAgentReferralPartner) => void;
  onResetPassword: (partner: IAgentReferralPartner) => void;
  onViewDetails: (partner: IAgentReferralPartner) => void;
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {partners?.map(p => {
        const isLocked = p.user.isLocked ?? false;
        const hasLogin = !!p.user?.loginId;

        return (
          <div
            key={p.agentReferralPartnerId}
            onClick={() => onViewDetails(p)}
            className="rounded-2xl border border-border-color shadow-sm p-6 cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-200 bg-card-color flex flex-col"
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-blue-600">{p?.user?.name}</h3>
              <Avatar>{getInitials(p?.user?.name)}</Avatar>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600 mb-2">{p?.addressLine1}</p>
              <TooltipButton
                type="text"
                title="Edit"
                icon={<IconPencil size={18} className="cursor-pointer hover:text-blue" />}
                onClick={e => {
                  e.stopPropagation();
                  onEdit(p);
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="flex items-center text-sm">
                <IconPhone size={16} className="mr-2 text-gray-400" />
                {p?.user?.phone}
              </p>
              <TooltipButton
                type="text"
                title="Delete"
                icon={<IconTrash size={18} className="cursor-pointer hover:text-red-500" />}
                onClick={e => {
                  e.stopPropagation();
                  onDelete(p);
                }}
              />
            </div>

            <div className="flex justify-between items-center">
              <p className="flex items-center text-sm mb-2">
                <IconMail size={16} className="mr-2 text-gray-400" />
                {p?.user?.email}
              </p>

              {hasLogin && (
                <TooltipButton
                  type="text"
                  title="Reset Password"
                  icon={<IconKey size={18} className="cursor-pointer hover:text-blue" />}
                  onClick={e => {
                    e.stopPropagation();
                    onResetPassword(p);
                  }}
                />
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-2">
                {p.reserved !== 0 && <Tag color="blue"> Reserved : {p.reserved} </Tag>}
                <Tag color="orange"> Packages : {p.packages} </Tag>
              </div>

              {hasLogin && (
                <TooltipButton
                  type="text"
                  title={isLocked ? 'Unlock' : 'Lock'}
                  icon={
                    isLocked ? (
                      <IconLock
                        size={20}
                        className="cursor-pointer text-red-600 hover:text-red-700"
                      />
                    ) : (
                      <IconLockOpen
                        size={20}
                        className="cursor-pointer text-blue-600 hover:text-blue-400"
                      />
                    )
                  }
                  onClick={e => {
                    e.stopPropagation();
                    onLock(p);
                  }}
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgentReferralGrid;
