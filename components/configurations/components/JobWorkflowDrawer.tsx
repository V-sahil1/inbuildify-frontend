'use client';
import React, { useEffect, useState } from 'react';
import { Drawer, Button, message, Tag } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { TaskTable } from './TaskTable';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { CustomSteps } from '@/components/common/CustomSteps';
import {
  JobProcessStage,
  JobProcessSubStage,
} from '@redux/feature/admin/job/jobProcess/IJobProcessState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  fetchJobProcessSubStages,
  createJobProcessSubStages,
  updateJobProcessSubStages,
  deleteJobProcessSubStages,
} from '@redux/feature/admin/job/jobProcess/jobProcessThunk';
import { Status } from '@lib/constants/enum';
import { JobStageDeleteDrawer } from './JobStageDeleteDrawer';

interface JobWorkflowDrawerProps {
  open: boolean;
  onClose: () => void;
  record: JobProcessStage | null;
}

export const JobWorkflowDrawer: React.FC<JobWorkflowDrawerProps> = ({ open, onClose, record }) => {
  const dispatch = useAppDispatch();
  const { jobProcessSubStage = [], status } = useAppSelector(state => state.job.jobProcess);
  const [modal, setModal] = useState<{ type: string; subStage: JobProcessSubStage }>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [existingJobModal, setExistingJobModal] = useState(false);
  const loading =
    status.subStage.create === Status.PENDING || status.subStage.update === Status.PENDING;

  const fetchJobProcessSubStageData = async () => {
    try {
      await dispatch(fetchJobProcessSubStages(record.stageId)).unwrap();
    } catch (error) {
      onClose();
      message.error(error || 'Failed fetch Sub Stages');
    }
  };

  useEffect(() => {
    if (status.subStage.fetch === Status.IDLE) fetchJobProcessSubStageData();
  }, [status.subStage.fetch]);

  const handleModal = (type: string, value?: JobProcessSubStage) => {
    setModal({ type: type, subStage: value });
  };

  const handleSubmitSubStage = async (values: JobProcessSubStage) => {
    try {
      if (modal.type === 'create') {
        await dispatch(
          createJobProcessSubStages({
            stageId: record.stageId,
            data: values,
          })
        ).unwrap();
      } else if (modal.type === 'edit') {
        await dispatch(
          updateJobProcessSubStages({
            subStageId: modal.subStage.subStageId,
            data: values,
          })
        ).unwrap();
      }
      setModal(null);
    } catch (error) {
      message.error(error || 'Failed to save sub stage');
    }
  };

  const handleDeleteSubStage = async (subStageId: string) => {
    try {
      await dispatch(deleteJobProcessSubStages(subStageId)).unwrap();
      setModal(null);
    } catch (error) {
      message.error(error || 'Failed to delete sub stage');
    }
  };

  const handleProcessAcess = (subStage: JobProcessSubStage, action: 'edit' | 'delete') => {
    if (action === 'edit') {
      handleModal('edit', subStage);
    } else {
      handleModal('delete', subStage);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-extrabold tracking-tight">{record?.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button
              icon={<IconPlus size={16} />}
              type="primary"
              className="text-sm font-semibold"
              onClick={() => setExistingJobModal(true)}
            >
              Apply to Existing Jobs
            </Button>
            <Button
              onClick={() => handleModal('create')}
              icon={<IconPlus size={16} />}
              type="primary"
              className="text-sm font-semibold"
            >
              Add Sub Stage
            </Button>
          </div>
        </div>
      }
      placement="right"
      width={'60%'}
      onClose={onClose}
      open={open}
    >
      <CustomSteps
        titlePlacement="vertical"
        steps={jobProcessSubStage.map(step => ({
          title: (
            <div className="group relative flex flex-col items-center justify-center">
              <span className="text-sm text-font-color-100 relative z-20">{step.name}</span>

              <div
                className="flex items-center gap-2 mt-4
               opacity-0 pointer-events-none transition-opacity duration-150
               group-hover:opacity-100 group-hover:pointer-events-auto
               group-focus:opacity-100 group-focus:pointer-events-auto
               z-10 bg-white/80 backdrop-blur-sm"
                aria-hidden={false}
              >
                <Button
                  onClick={() => {
                    handleProcessAcess(step, 'edit');
                  }}
                  aria-label="Edit campaign"
                  className="p-1 rounded hover:bg-gray-100   focus:ring-blue-400"
                >
                  <IconEdit size={18} className="text-blue-600" />
                </Button>

                <Button
                  onClick={() => {
                    handleProcessAcess(step, 'delete');
                  }}
                  aria-label="Delete campaign"
                  className="p-1 rounded hover:bg-red-50 focus:ring-red-400"
                >
                  <IconTrash size={18} className="text-red-600" />
                </Button>
              </div>
            </div>
          ),
        }))}
        currentValue={currentStep}
        setCurrent={value => {
          setCurrentStep(value);
        }}
      />
      <div className="w-full mt-2 overflow-x-hidden overflow-x-scroll custom-scrollbar ">
        <TaskTable
          currentStep={jobProcessSubStage[currentStep]?.name || ''}
          subStageId={jobProcessSubStage[currentStep]?.subStageId || ''}
        />
      </div>
      {modal && (
        <ActionDialogmodel
          open={modal.type === 'edit' || modal.type === 'create'}
          title={modal.type === 'edit' ? 'Edit Sub Stage' : 'New Sub Stage'}
          onCancel={() => setModal(null)}
          onSubmit={handleSubmitSubStage}
          loading={loading}
          fields={[
            {
              label: 'Sub Stage Name',
              name: 'name',
              type: 'text',
              placeholder: 'Enter sub stage name',
            },
            {
              label: 'Sort Order',
              name: 'sortOrder',
              type: 'number',
              placeholder: 'Enter sort order',
            },
          ]}
          initialValues={modal.subStage || {}}
          isEditing={modal.type === 'edit'}
        />
      )}
      {existingJobModal && (
        <ConfirmationContentModal
          content={
            <div>
              <p>The following tasks have been modified and will be updated:</p>
              <div className="ml-3 my-3 space-y-2">
                <p>
                  Request Working Drawing <Tag>Contract Drawing</Tag>
                </p>
                <p>
                  Verify with Customer <Tag>Confirmation</Tag>
                </p>
                <p>
                  Update Changes Based on Customer Requests <Tag>Confirmation</Tag>
                </p>
              </div>
            </div>
          }
          open={existingJobModal}
          onClose={() => {
            setExistingJobModal(false);
          }}
          onSubmit={() => {
            console.log('Submitted');
          }}
          okText="Apply"
          title="Confirmation"
        />
      )}
      {modal?.type === 'delete' && (
        <JobStageDeleteDrawer
          open={modal.type === 'delete'}
          onClose={() => setModal(null)}
          onSubmit={() => handleDeleteSubStage(modal?.subStage?.subStageId)}
        />
      )}
    </Drawer>
  );
};
