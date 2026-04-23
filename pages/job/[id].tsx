'use client';

import StageProgress from '@/components/common/StageProgress';
import WorkflowSteps from '@/components/common/WorkflowSteps';
import JobAction from '@/components/job/jobDetail/JobAction';
import JobInvoicePayment from '@/components/job/jobDetail/Invoice-payment/JobInvoicePayment';
import JobVariationManager from '@/components/job/jobDetail/Variation/JobVariationManager';
import SystemRoutes from '@lib/constants/Routes';
import { Result, Skeleton, Tabs, message } from 'antd';
import router from 'next/router';
import { JobCommission } from '@/components/job/jobDetail/comission/JobCommission';
import JobDetailHeader from '@/components/job/jobDetail/JobDetailHeader';
import JobCustomFields from '@/components/job/jobDetail/JobCustomFields';
import { useEffect, useState } from 'react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';

import ActivityCard from '@/components/common/ActivityCard';
import { EmailData, filterTabs } from 'data/activityData';
import { ConstructionModelFields } from '@/components/formFields/constructionModelFields';
import FileExplorer from '@/components/common/FileExplorer';
import { sdriveRootFolders } from '../../data/sdriveData';
import { usePdf } from '@hooks/usePdf';
import ColorPdf from '@/components/common/pdf/ColorPdf';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { getJobByIdThunk } from '@redux/feature/job/jobThunk';
import { clearCurrentJob } from '@redux/feature/job/jobSlice';
import { Status } from '@lib/constants/enum';

const { TabPane } = Tabs;

export default function JobDetail() {
  const { id } = router.query;
  const dispatch = useAppDispatch();
  const { currentJob, status } = useAppSelector(state => state.jobList);
  const isLoading = status.detail === Status.PENDING;

  const [isConstructionModelOpen, setConstructionModelOpen] = useState(false);
  const [constructionReady, setConstructionReady] = useState(false);
  const { previewPdf } = usePdf(ColorPdf);

  // ── Fetch job detail on mount / id change ────────────────────────────────
  useEffect(() => {
    if (!id) return;
    
    const fetchJobData = async () => {
      try {
        await dispatch(getJobByIdThunk(id as string)).unwrap();
      } catch (error) {
        console.error('Failed to fetch job:', error);
        // Handle invalid job ID
        if (error?.includes('not found') || error?.includes('404') || error?.includes('invalid')) {
          // Redirect to jobs page with error message
          router.push('/job');
          message.error('Job not found or invalid job ID');
        } else {
          message.error(error || 'Failed to fetch job details');
        }
      }
    };

    fetchJobData();
    
    return () => {
      dispatch(clearCurrentJob());
    };
  }, [id, dispatch]);

  // ── Workflow steps ────────────────────────────────────────────────────────
  const [workFlowSteps, setWorkflowSteps] = useState([
    {
      key: 'Sales',
      label: 'Sales',
      status: 'Closed',
      color: 'bg-cyan-500',
      icon: 'MM',
      date: '',
      onClick: () => {
        handleWorkflowStepsStatus('Sales');
        router.push(`${SystemRoutes.LEADS}/${id}`);
      },
      options: [
        { key: 'facade', label: 'Preview Facade' },
        { key: 'floorplan', label: 'Preview Facade' },
      ],
    },
    {
      key: 'Preconstruction',
      label: 'Preconstruction',
      status: 'Completed',
      color: 'bg-cyan-500',
      icon: '2',
      date: '',
      onClick: () => {
        handleWorkflowStepsStatus('Preconstruction');
        router.push(`${SystemRoutes.JOB_PRECONSTRUCTION}/${id}`);
      },
      options: [{ key: 'skip', label: 'Skip' }],
    },
    {
      key: 'Color',
      label: 'Color',
      status: 'Started',
      color: 'bg-cyan-500',
      icon: 'MM',
      date: '',
      onClick: () => {
        handleWorkflowStepsStatus('Color');
        router.push(`${SystemRoutes.JOB}/colour/${id}`);
      },
      options: [
        { key: 'colors', label: 'Switch to External Colours' },
        { key: 'pdf', label: 'Preview PDF', onClick: () => previewPdf({}) },
        { key: 'document', label: 'Generate Colors Document', onClick: () => router.push(`${SystemRoutes.COLOR_GENERATE_DOCUMENT}`) },
        { key: 'delete', label: 'Delete' },
        { key: 'skip', label: 'Skip' },
      ],
    },
    {
      key: 'Construction',
      label: 'Construction',
      status: constructionReady ? 'Ready for Construction' : 'Under Construction',
      color: 'bg-cyan-500',
      icon: '4',
      date: '',
      onClick: () => {
        handleWorkflowStepsStatus('Construction');
        constructionReady
          ? router.push(`/${SystemRoutes.CONSTRUCTION}/${id}`)
          : setConstructionModelOpen(true);
      },
    },
    {
      key: 'Maintenance',
      label: 'Maintenance',
      status: '',
      color: 'bg-cyan-500',
      icon: '5',
      date: '',
      onClick: () => {
        handleWorkflowStepsStatus('Maintenance');
      },
    },
  ]);

  function handleWorkflowStepsStatus(key) {
    setWorkflowSteps(prev =>
      prev.map(step =>
        step.key === key ? { ...step, status: 'completed', color: 'bg-green-600' } : step
      )
    );
  }

  function handleSubmit(values) {
    setConstructionReady(true);
    setConstructionModelOpen(false);
    console.log('constructionmodel', values);
  }

  // ── StageProgress data derived from job detail ───────────────────────────
  const stageData = {
    builder: currentJob?.builderName ?? '',
    leadSource: currentJob?.leadSourceName ?? '',
    assignedTask: currentJob?.consultantName
      ? [
          {
            label: 'Consultant',
            value: currentJob.consultantName,
            status: 'Active' as const,
          },
        ]
      : [],
  };

  if (status.detail === Status.ERROR) {
    return (
      <Result
        status="404"
        title="Job not found"
        subTitle="The job you are looking for does not exist or you do not have access."
      />
    );
  }

  return (
    <>
      <div className="m-3">
        <Skeleton loading={isLoading} active paragraph={{ rows: 2 }}>
          <div className="flex justify-between">
            <StageProgress
              id={currentJob?.referenceNumber ?? ''}
              title="Job"
              status={currentJob?.status ?? ''}
              steps={[]}
              data={stageData}
            />
            <JobDetailHeader jobDetail={currentJob} />
          </div>
        </Skeleton>
        <WorkflowSteps steps={workFlowSteps} />
      </div>
      <div className="m-3">
        <Tabs
          defaultActiveKey="action"
          type="card"
          tabBarStyle={{ margin: '0px', marginRight: '10px' }}
          tabBarGutter={10}
          size="large"
        >
          {/* Action Tab */}
          <TabPane tab="Action" key="action" className="border border-t-0">
            <JobAction />
          </TabPane>
          <TabPane tab="Documents" key="Documents">
            <div className="w-full">
              <FileExplorer
                rootFolders={sdriveRootFolders}
                enableSearch={true}
                onSearchChange={(query) => console.log('Search:', query)}
                enableMultiSelect={true}
                onDelete={(items) => console.log('Delete items:', items)}
                enableAddFolder={true}
                onAddFolder={(parentId) => console.log('Add folder to parent:', parentId)}
                enableAddFile={true}
                onAddFile={(parentId) => console.log('Add file to parent:', parentId)}
                enableShare={true}
                onShare={(items) => console.log('Share items:', items)}
                enableExport={true}
                onExport={(items) => console.log('Export items:', items)}
              />
            </div>
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
            <JobCustomFields />
          </TabPane>
          <TabPane tab="Activity" key="Activity">
            <ActivityCard data={EmailData} tabs={filterTabs} />
          </TabPane>
        </Tabs>
      </div>
      <ActionDialogmodel
        title="Ready for Construction"
        open={isConstructionModelOpen}
        onCancel={() => {
          setConstructionModelOpen(false);
        }}
        onSubmit={handleSubmit}
        fields={ConstructionModelFields()}
      />
    </>
  );
}
