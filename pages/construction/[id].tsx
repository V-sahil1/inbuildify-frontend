import React, { useState } from 'react';
import { useRouter } from 'next/router';
import StageProgress from '@/components/common/StageProgress';
import ConstructionDetailHeader from '@/components/construction/ConstructionDetailHeader';
import ConstructionBaseStage from '@/components/construction/ConstructionBaseStage';
import { Result, Tabs } from 'antd';
import LeadActions from '@/components/leadDetail/LeadActions';
import { EmailData, filterTabs } from 'data/activityData';
import ActivityCard from '@/components/common/ActivityCard';
import { CustomSteps } from '@/components/common/CustomSteps';
import { GanttChart } from '@/components/common/charts/GanttChart';
import FileExplorer from '@/components/common/FileExplorer';
import { sdriveRootFolders } from 'data/sdriveData';

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const [current, setCurrent] = useState(0);

  const items = [
    {
      title: 'Preconstruction',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="preconstruction" />,
    },
    {
      title: 'Base Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="base" />,
    },
    {
      title: 'Frame Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="frame" />,
    },
    {
      title: 'Lockup Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="lockup" />,
    },
    {
      title: 'Fixing Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="fixing" />,
    },
    {
      title: 'Completion Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} id="completion" />,
    },
  ];
  const steps = [
    {
      key: '1',
      label: items[current].title,
      children: items[current].children,
    },
    {
      key: '2',
      label: 'Documents',
      children: (
        <div className="bg-card-color">
          <div className="w-full">
            <FileExplorer
              rootFolders={sdriveRootFolders}
              enableSearch={true}
              onSearchChange={query => console.log('Search:', query)}
              enableMultiSelect={true}
              onDelete={items => console.log('Delete items:', items)}
              enableAddFolder={true}
              onAddFolder={parentId => console.log('Add folder to parent:', parentId)}
              enableAddFile={true}
              onAddFile={parentId => console.log('Add file to parent:', parentId)}
              enableShare={true}
              onShare={items => console.log('Share items:', items)}
              enableExport={true}
              onExport={items => console.log('Export items:', items)}
            />
          </div>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Site Images',
      children: (
        <div className="bg-card-color">
          <Result
            title="Site Images Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Actions',
      children: <LeadActions leadId="MK102CH2DSF" />,
    },
    {
      key: '5',
      label: 'Activity',
      children: <ActivityCard data={EmailData} tabs={filterTabs} />,
    },
    {
      key: '6',
      label: 'Gantt Chart',
      children: <GanttChart />,
    },
  ];
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <StageProgress
          id={normalizedId}
          title="Construction"
          steps={[]}
          status="In Progress"
          data={{
            builder: 'xyz',
            leadSource: 'website',
            assignedTask: [
              { label: 'Accounts', value: 'Accounts Myhome', status: 'Inactive' },
              { label: 'Color Consultant', value: 'Color Consultant', status: 'Inactive' },
              { label: 'Construction Manager - MH', value: 'Manasa Gummuluru', status: 'Inactive' },
              { label: 'My Home - Company Admin', value: 'Manasa Gummuluru', status: 'Inactive' },
            ],
          }}
        />
        <ConstructionDetailHeader />
      </div>
      <CustomSteps
        steps={items}
        currentValue={current}
        setCurrent={setCurrent}
        titlePlacement="vertical"
      />
      <div className="mt-4">
        <Tabs
          tabBarStyle={{ margin: '0px', marginRight: '10px' }}
          tabBarGutter={10}
          items={steps}
          type="card"
        />
      </div>
    </div>
  );
};

export default index;
