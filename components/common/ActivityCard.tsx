'use client';
import React, { useState } from 'react';
import { Card, Typography, Tag, Input, Button } from 'antd';
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

export interface EmailItem {
  id: string;
  date: string;
  time: string;
  sender: string;
  status: 'Sent' | 'Delivered';
  subject: string;
  body: string;
  recipient: string;
  attachment: boolean;
}

interface ActivityCardProps {
  data: EmailItem[];
  tabs?: FilterOption[];
}

const getStatusTag = (status: 'Sent' | 'Delivered') => {
  const color = status === 'Delivered' ? 'green' : 'blue';
  return (
    <Tag color={color} className="flex items-center w-fit">
      {status}
    </Tag>
  );
};

const ActivityCard: React.FC<ActivityCardProps> = ({ data, tabs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = data.filter(
    item =>
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.recipient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card className="w-full overflow-hidden">
      {tabs && (
        <div className="flex sm:flex-row justify-between sm:items-center gap-3 mb-4">
          <TimelineActionsBar
            tabs={tabs}
            onTabChange={tab => console.log(tab)}
            isActionShow={false}
            isCountShow={true}
          />

          <div className="flex items-center gap-2">
            <Input
              prefix={<IconSearch size={16} />}
              placeholder="Search by type, subject, sender & recipient..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px] lg:w-[400px]"
            />
            <Button icon={<IconFilter size={20} />} />
          </div>
        </div>
      )}

      <div className="flex flex-col relative">
        <div className="absolute top-1 bottom-0 left-[140px] w-0.5 bg-primary-10 z-0 m-0.5" />

        {filteredData.map(item => (
          <div key={item.id} className="relative flex items-start mb-8 group">
            <div className="flex flex-col items-end w-36 pr-8 flex-shrink-0">
              <Title level={5} className="text-sm !m-0 !mb-1">
                {item.date}
              </Title>
              <Title level={5} className="text-sm !m-0">
                {item.time}
              </Title>
            </div>

            <div className="flex-shrink-0 w-8 flex justify-center mt-1 z-10">
              <div className="relative transform -translate-x-1/2">
                <IconMail
                  className="text-primary border rounded-full p-1 bg-orange-100"
                  size={35}
                />
              </div>
            </div>

            <div className="flex-grow pl-5 -mt-1">
              <Card size="small" className="shadow-sm bg-card-color hover:bg-body-color">
                <div className="flex justify-between mb-2 mr-[40%]">
                  <div>
                    <Title level={5} className="!m-0 !mb-1 text-base font-medium text-gray-800">
                      {item.subject}
                    </Title>
                    <Text className="text-gray-500 text-sm">{item.body}</Text>
                  </div>
                  <div className="flex gap-3 items-start justify-center">
                    <Text className="text-sm text-gray-500">{item.sender}</Text>
                    <div className="text-left">{getStatusTag(item.status)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-gray-500">{item.recipient}</Text>
                  <div className="flex gap-2 invisible group-hover:visible">
                    <button>
                      <IconShare3 size={22} className="text-primary" />
                    </button>

                    {item.attachment && (
                      <button>
                        <IconPaperclip size={22} className="text-primary" />
                      </button>
                    )}
                    <button>
                      <IconArrowsDiagonal size={22} className="text-primary" />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        ))}

        {filteredData.length === 0 && (
          <div className="text-center text-gray-500 py-10">No matching records found.</div>
        )}
      </div>
    </Card>
  );
};

export default ActivityCard;
