import { Button, Input } from 'antd';
import ConstructionActivityCard from './ConstructionActivityCard';
import { IconFilter, IconFilterEdit } from '@tabler/icons-react';
import { useState } from 'react';

const ConstructionActivity = () => {
  const [activeTab, setActiveTab] = useState('Own');
  const activityData = [
    {
      title: 'Book Supplier',
      address: 'Lot 89, 09 In numquam proident , Ex qui quia aut aute - new list',
      email: 'sales@mailinator.com',
      status: 'sent',
      date: '01/10/25',
      time: '8:14 am',
      isAttachment: false,
    },
    {
      title: 'Book Supplier',
      address: 'Lot 89, 09 In numquam proident , Ex qui quia aut aute - new list',
      email: 'sales@mailinator.com',
      status: 'sent',
      date: '01/10/25',
      time: '8:14 am',
      isAttachment: true,
    },
    {
      title: 'Book Supplier',
      address: 'Lot 89, 09 In numquam proident , Ex qui quia aut aute - new list',
      email: 'sales@mailinator.com',
      status: 'sent',
      date: '01/10/25',
      time: '8:14 am',
      isAttachment: false,
    },
  ];

  return (
    <div className="bg-card-color p-2 ">
      <div className=" flex gap-4 p-3">
        <div className="rounded-xl flex gap-2 p-1 border border-primary">
          <Button
            className={`rounded-xl text-xs ${activeTab === 'Own' ? 'bg-primary' : 'bg-white text-primary'} `}
            type="primary"
            size="small"
            onClick={() => setActiveTab('Own')}
          >
            Own
          </Button>
          <Button
            className={`rounded-xl text-xs ${activeTab === 'All' ? 'bg-primary' : 'bg-white text-primary'} `}
            type="primary"
            size="small"
            onClick={() => setActiveTab('All')}
          >
            All
          </Button>
        </div>
        <div className="items-center flex w-full">
          <Input placeholder="Search by type,subject,sender & recipient email ID's" />
        </div>
        <div className="flex justify-end w-full text-primary">
          <IconFilter size={20} />
        </div>
      </div>
      <div className="relative m-3">
        <div className="absolute top-0 bottom-0 left-[97px] border border-border-color z-2"></div>
        <div>
          {activityData.map(activity => (
            <ConstructionActivityCard activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default ConstructionActivity;
