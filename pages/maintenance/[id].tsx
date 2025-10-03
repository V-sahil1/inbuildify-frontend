"use client";

import StageProgress from "@/components/common/StageProgress";
import { Result, Tabs } from "antd";
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
        />
        </div>      
      </div>
      <div className="m-3">
        <Tabs
          defaultActiveKey="action"
          type="card"
          tabBarStyle={{ margin: "0px", marginRight: "10px" }}
          tabBarGutter={10}
          size="large"
        >
          {/* Action Tab */}
          <TabPane tab="Request" key="request" className="border border-t-0">
            <div className="bg-card-color"><Result title="Request Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Documents" key="Documents">
            <div className="bg-card-color"><Result title="Document Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Site image" key="siteimage">
            <div className="bg-card-color"><Result title="Site image Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Report" key="report">
            <div className="bg-card-color"><Result title="Report Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Action" key="action">
               <div className="bg-card-color"><Result title="Action Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Activity" key="activity">
            <div className="bg-card-color"><Result title="Activity Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>

        </Tabs>
      </div>
    </>
  );
}
export default Index;