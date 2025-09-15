"use client";

import StageProgress from "@/components/common/StageProgress";
import WorkflowSteps from "@/components/common/WorkflowSteps";
import JobAction from "@/components/job/jobDetail/JobAction";
import JobVariationManager from "@/components/job/jobDetail/Variation/JobVariationManager";
import SystemRoutes from "@lib/constants/Routes";
import { Result, Tabs } from "antd";
import router from "next/router";
const { TabPane } = Tabs;

const workFlowSteps = [
  {
    key: 'Sales',
    label: 'Sales',
    status: 'Closed',
    color: 'bg-green-600',
    icon: 'MM',
    date: '12/03/2025',
    onClick: () => { }
  },
  {
    key: 'WorkFlow',
    label: 'WorkFlow',
    status: 'Completed',
    color: 'bg-green-300',
    icon: '2',
    date: '12/03/2025',
    onClick: () => { router.push(`/${SystemRoutes.JOB}/status`) }
  },
  {
    key: 'Color',
    label: 'Color',
    status: 'Started',
    color: 'bg-cyan-500',
    icon: 'MM',
    date: '12/03/2025',
    onClick: () => { router.push(`/${SystemRoutes.JOB}/colour`) }
  },
  {
    key: 'Construction',
    label: 'Construction',
    status: 'Under Construction',
    color: 'bg-cyan-300',
    icon: '4',
    date: '',
    onClick: () => { }
  },
  {
    key: 'Maintenance',
    label: 'Maintenance',
    status: '',
    color: 'bg-gray-200',
    icon: '5',
    date: '',
    onClick: () => { }
  },
]

export default function JobDetail() {


  return (
    <>
      <div className="m-3">
        <StageProgress
          id="MH-001"
          title="Job"
          status="Pending"
          steps={[]}
        />
        <WorkflowSteps steps={workFlowSteps} />
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
          <TabPane tab="Action" key="action" className="border border-t-0">
            <JobAction />
          </TabPane>
          <TabPane tab="Documents" key="Documents">
            <div className="bg-card-color"><Result title="Document Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Variations" key="Variations">
            <JobVariationManager />
          </TabPane>
          <TabPane tab="Invoices & Payments" key="Invoices & Payments">
            <div className="bg-card-color"><Result title="Invoices & Payments Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Commission" key="Commission">
            <div className="bg-card-color"><Result title="Commission Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Custom Fields" key="Custom Fields">
            <div className="bg-card-color"><Result title="Custom Fields Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>
          <TabPane tab="Activity" key="Activity">
            <div className="bg-card-color"><Result title="Activity Functionality coming soon" subTitle="Please check back later" /></div>
          </TabPane>

        </Tabs>
      </div>
    </>
  );
}