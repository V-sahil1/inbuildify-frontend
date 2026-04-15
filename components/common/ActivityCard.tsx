'use client';
import React, { useState } from 'react';
import { Card, Typography, Tag, Input, Button, Spin } from 'antd';
import { useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  IconMail,
  IconSearch,
  IconFilter,
  IconArrowsDiagonal,
  IconPaperclip,
  IconShare3,
} from '@tabler/icons-react';
import TimelineActionsBar, {
  FilterOption,
} from '@/components/common/TimeLineComponents/TimelineActionsBar';

const { Text, Title } = Typography;

export interface ActivityItem {
  activityId: string;
  activityType: string;
  description: string;
  createdAt: string;
  leadId: string;
  userId?: string;
  metadata?: Record<string, any>;
  // Additional fields from API response
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  propertyName?: string;
  propertyAddress?: string;
}

interface ActivityCardProps {
  data: ActivityItem[];
  tabs?: FilterOption[];
  loading?: boolean;
  setParams?: (val: Record<string, string>) => void;
  filters?: Record<string, string>;
}

const getStatusTag = (status: 'Sent' | 'Delivered') => {
  const color = status === 'Delivered' ? 'green' : 'blue';
  return (
    <Tag color={color} className="flex items-center w-fit">
      {status}
    </Tag>
  );
};

const ActivityCard: React.FC<ActivityCardProps> = ({ data, tabs, loading, setParams, filters }) => {
  const [activeTab, setActiveTab] = useState('all');
  
  // Get current user ID from Redux state
  const { user } = useAppSelector(state => state.auth);
  const currentUserId = user?.usersId;

  const formatDateTime = (createdAt: string) => {
    const date = new Date(createdAt);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType?.toLowerCase()) {
      case 'email':
        return <IconMail className="text-primary border rounded-full p-1 bg-blue-100" size={35} />;
      case 'note':
        return <IconPaperclip className="text-primary border rounded-full p-1 bg-green-100" size={35} />;
      default:
        return <IconMail className="text-primary border rounded-full p-1 bg-orange-100" size={35} />;
    }
  };

  return (
    <div className="w-full overflow-hidden p-4 bg-card-color border border-t-0 border-border-color">
      {tabs && (
        <div className="flex sm:flex-row justify-end sm:items-center gap-3 mb-4">
          {/* <TimelineActionsBar
            tabs={tabs}
            onTabChange={setActiveTab}
            isActionShow={false}
            isCountShow={true}
          /> */}

          <div className="flex items-center gap-2">
            <Input
              prefix={<IconSearch size={16} />}
              placeholder="Search by type, description, user, or property..."
              value={filters?.search}
              onChange={e => setParams({ search: e.target.value })}
              className="w-full sm:w-[300px] lg:w-[400px]"
            />
            {/* <Button icon={<IconFilter size={20} />} /> */}
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="Loading activities..." />
        </div>
      ) : (
        <>
          <div className="flex flex-col relative">
            <div className="absolute top-1 bottom-0 left-[140px] w-0.5 bg-primary-10 z-0 m-0.5" />

            {data.map(item => {
              const { date, time } = formatDateTime(item.createdAt);
              return (
                <div key={item.activityId} className="relative flex items-start mb-8 group">
                  <div className="flex flex-col items-end w-36 pr-8 flex-shrink-0">
                    <Title level={5} className="text-sm !m-0 !mb-1">
                      {date}
                    </Title>
                    <Title level={5} className="text-sm !m-0">
                      {time}
                    </Title>
                  </div>

                  <div className="flex-shrink-0 w-8 flex justify-center mt-1 z-10">
                    <div className="relative transform -translate-x-1/2">
                      {getActivityIcon(item.activityType)}
                    </div>
                  </div>

                  <div className="flex-grow pl-5 -mt-1">
                    <Card size="small" className="shadow-sm bg-card-color hover:bg-body-color">
                      <div className="flex justify-between mb-2">
                        <div>
                          <Title level={5} className="!m-0 !mb-1 text-base font-medium text-gray-800">
                            {item.activityType}
                          </Title>
                          <Text className="text-gray-500 text-sm">{item.description}</Text>
                          {/* {item.userName && (
                            <Text className="text-gray-400 text-xs block mt-1">
                              By: {item.userName}
                            </Text>
                          )} */}
                          {item.propertyName && (
                            <Text className="text-gray-400 text-xs block">
                              Property: {item.propertyName}
                            </Text>
                          )}
                          {item.propertyAddress && (
                            <Text className="text-gray-400 text-xs block">
                              {item.propertyAddress}
                            </Text>
                          )}
                        </div>
                        <div className="flex gap-3 items-start justify-end">
                          {/* {item.activityType && (
                            <Tag color="blue" className="flex items-center w-fit">
                              {item.activityType}
                            </Tag>
                          )} */}
                          {item.userName && (
                            <Text className="text-gray-400 text-xs block mt-1">
                              By: {item.userName}
                            </Text>
                          )}
                        </div>
                      </div>
                      {/* <div className="flex justify-between items-center">
                        <Text className="text-gray-500">Activity ID: {item.activityId}</Text>
                        <div className="flex gap-2 invisible group-hover:visible">
                          <button>
                            <IconShare3 size={22} className="text-primary" />
                          </button>
                          <button>
                            <IconArrowsDiagonal size={22} className="text-primary" />
                          </button>
                        </div>
                      </div> */}
                    </Card>
                  </div>
                </div>
              );
            })}

            {data.length === 0 && !loading && (
              <div className="text-center text-gray-500 py-10">No matching records found.</div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ActivityCard;
