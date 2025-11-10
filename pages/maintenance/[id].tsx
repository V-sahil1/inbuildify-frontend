'use client';

import ActivityCard from '@/components/common/ActivityCard';
import StageProgress from '@/components/common/StageProgress';
import RequestList from '@/components/maintenance/maintenanceDetails/maintananceRequest/maintenanceRequest';
import { Result, Tabs } from 'antd';
import { EmailData, filterTabs } from 'data/activityData';
const { TabPane } = Tabs;

const Index = () => {
  return (
    <>
      <div className="m-3">
        <div className="flex justify-between">
          <StageProgress
            id="MH-001"
            title="Maintenance"
            status="Pending"
            steps={[]}
            data={{
              builder: 'xyz',
              leadSource: 'website',
              assignedTask: [
                { label: 'Accounts', value: 'Accounts Myhome', status: 'Inactive' },
                { label: 'Color Consultant', value: 'Color Consultant', status: 'Inactive' },
                {
                  label: 'Construction Manager - MH',
                  value: 'Manasa Gummuluru',
                  status: 'Inactive',
                },
                { label: 'My Home - Company Admin', value: 'Manasa Gummuluru', status: 'Inactive' },
              ],
            }}
          />
        </div>
      </div>
      <div className="m-3">
        <Tabs
          defaultActiveKey="request"
          type="card"
          tabBarStyle={{ margin: '0px', marginRight: '10px' }}
          tabBarGutter={10}
          size="large"
        >
          {/* Action Tab */}
          <TabPane tab="Request" key="request" className="border border-t-0">
            <RequestList />
          </TabPane>
          <TabPane tab="Documents" key="Documents">
            <div className="bg-card-color">
              <Result
                title="Document Functionality coming soon"
                subTitle="Please check back later"
              />
            </div>
          </TabPane>
          <TabPane tab="Site image" key="siteimage">
            <div className="bg-card-color">
              <Result
                title="Site image Functionality coming soon"
                subTitle="Please check back later"
              />
            </div>
          </TabPane>
          <TabPane tab="Report" key="report">
            <div className="bg-card-color">
              <Result title="Report Functionality coming soon" subTitle="Please check back later" />
            </div>
          </TabPane>
          <TabPane tab="Action" key="action">
            <div className="bg-card-color">
              <Result title="Action Functionality coming soon" subTitle="Please check back later" />
            </div>
          </TabPane>
          <TabPane tab="Activity" key="activity">
            <ActivityCard data={EmailData} tabs={filterTabs} />
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};
export default Index;
