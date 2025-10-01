"use client";

import StageProgress from "@/components/common/StageProgress";
import WorkflowSteps from "@/components/common/WorkflowSteps";
import JobAction from "@/components/job/jobDetail/JobAction";
import JobInvoicePayment from "@/components/job/jobDetail/Invoice-payment/JobInvoicePayment";
import JobVariationManager from "@/components/job/jobDetail/Variation/JobVariationManager";
import SystemRoutes from "@lib/constants/Routes";
import { Result, Tabs } from "antd";
import router from "next/router";
import { JobCommission } from "@/components/job/jobDetail/comission/JobCommission";
const { TabPane } = Tabs;



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
];

export default function JobDetail() {
  const {id} = router.query;
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
      onClick: () => { router.push(`/${SystemRoutes.JOB_WORKFLOW}/${id}`) }
    },
    {
      key: 'Color',
      label: 'Color',
      status: 'Started',
      color: 'bg-cyan-500',
      icon: 'MM',
      date: '12/03/2025',
      onClick: () => { router.push(`/${SystemRoutes.JOB}/colour/${id}`) }
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
            <JobInvoicePayment />
          </TabPane>
          <TabPane tab="Commission" key="Commission">
            <JobCommission />
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