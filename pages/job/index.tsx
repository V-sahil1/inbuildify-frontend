"use client";

import StageProgress from "@/components/common/StageProgress";
import WorkflowSteps from "@/components/common/WorkflowSteps";
import JobAction from "@/components/job/jobDetail/JobAction";
import JobVariation from "@/components/job/jobDetail/JobVariation";
import { Result, Tabs } from "antd";
import router from "next/router";
const { TabPane } = Tabs;

const steps = [
  {
    key: "contact",
    label: "Contact",
    onClick: () => { },
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    key: "property",
    label: "Property",
    onClick: () => { },
    color: "bg-blue-500",
    textColor: "text-white",
  },
  {
    key: "plan",
    label: "Plan",
    onClick: () => { },
    color: "bg-blue-500",
    textColor: "text-white",
  }
];

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
    onClick: () => { router.push(`/job/status`) }
  },
  {
    key: 'Color',
    label: 'Color',
    status: 'Started',
    color: 'bg-cyan-500',
    icon: 'MM',
    date: '12/03/2025',
    onClick: () => { router.push(`/job/colour`) }
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

const JobVariationData = [
  {
    ReferenceID: 'MYH00486-V1',
    Amount: 7000.00,
    RequestedBy: 'Aman',
    DelayedBy: 'Hiren',
    DrawingChanges: "Yes",
    Created: { user: 'MM', date: "1/1/2002" },
    Approved: { user: 'MM', date: "1/1/2002" },
    Status: 'Approved',
    Invoice: 'invoice',
    Profile: 'MM'
  },
  {
    ReferenceID: 'MYH00486-V2',
    Amount: 7000.00,
    RequestedBy: 'Aman',
    DelayedBy: 'Hiren',
    DrawingChanges: "No",
    Created: { user: 'MM', date: "1/1/2002" },
    Approved: { user: 'MM', date: "1/1/2002" },
    Status: 'Approved',
    Invoice: 'invoice',
    Profile: 'A'
  },
  {
    ReferenceID: 'MYH00486-V3',
    Amount: 7000.00,
    RequestedBy: 'Aman',
    DelayedBy: 'Hiren',
    DrawingChanges: "Yes",
    Created: { user: 'MM', date: "1/1/2002" },
    Approved: { user: 'MM', date: "1/1/2002" },
    Status: 'Draft',
    Invoice: 'invoice',
    Profile: 'A'
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
            <JobVariation data={JobVariationData} />
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