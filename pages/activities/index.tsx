'use client';
import React from 'react';
import ActivityCard from '@/components/common/ActivityCard';
import { EmailData } from 'data/activityData';
import { Button, Input } from 'antd';
import { IconFilter, IconInfoSquareRoundedFilled, IconSearch } from '@tabler/icons-react';

const EmailActivity: React.FC = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="my-4 flex gap-4 items-center justify-between">
        <h1 className="text-2xl font-semibold">Email Activities</h1>
        <Input
          prefix={<IconSearch size={20} />}
          placeholder="Search by type, subject, sender & recipient..."
          className="w-full sm:w-[300px] lg:w-[800px]"
          size="large"
        />
        <div className="flex flex-col border-l-4 px-3">
          <span className="text-primary text-sm">All</span>
          <span className="text-font-color text-sm flex gap-1">
            Email activity <IconInfoSquareRoundedFilled size={20} className="text-primary" />
          </span>
        </div>
        <Button icon={<IconFilter size={20} />} />
      </div>
      <ActivityCard data={EmailData} />
    </div>
  );
};

export default EmailActivity;
