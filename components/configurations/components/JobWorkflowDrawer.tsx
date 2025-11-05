'use client';
import React, { useState } from 'react';
import { Drawer, Button } from 'antd';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { TaskTable } from './TaskTable';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { CustomSteps } from '@/components/common/CustomSteps';

interface JobWorkflowDrawerProps {
  open: boolean;
  onClose: () => void;
  record: any | null;
}

export const JobWorkflowDrawer: React.FC<JobWorkflowDrawerProps> = ({ open, onClose, record }) => {
  const [stageModal, setStageModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [existingJobModal, setExistingJobModal] = useState(false);
  const [openModal, setOpenModal] = useState({
    edit: false,
    delete: false,
    stageName: '',
    sortOrder: 0,
  });
  const steps = [
    {
      key: 'deposit',
      title: 'Deposit',
      sortOrder: 1,
    },
    {
      key: 'concept',
      title: 'Concept',
      sortOrder: 2,
    },
    {
      key: 'color',
      title: 'Color Selection',
      sortOrder: 3,
    },
    {
      key: 'approvals',
      title: 'Approvals and Contract',
      sortOrder: 4,
    },
    {
      key: 'production',
      title: 'Production',
      sortOrder: 5,
    },
    {
      key: 'permits',
      title: 'Permits and Pre Construction',
      sortOrder: 6,
    },
    {
      key: 'contract',
      title: 'Contract Drawing',
      sortOrder: 7,
    },
  ];

  const handleProcessAcess = (
    key: string,
    action: 'edit' | 'delete',
    stageName: string,
    sortOrder: number
  ) => {
    setOpenModal({
      edit: action === 'edit',
      delete: action === 'delete',
      stageName,
      sortOrder,
    });
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
              onClick={() => setStageModal(true)}
              icon={<IconPlus size={16} />}
              type="default"
              className="text-sm font-semibold"
            >
              New Stage
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
        steps={steps.map(step => ({
          title: (
            <div className="group relative flex flex-col items-center justify-center">
              <span className="text-sm text-gray-800 relative z-20">{step.title}</span>

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
                    handleProcessAcess(step.key, 'edit', step.title, step.sortOrder);
                  }}
                  aria-label="Edit campaign"
                  className="p-1 rounded hover:bg-gray-100   focus:ring-blue-400"
                >
                  <IconEdit size={18} className="text-blue-600" />
                </Button>

                <Button
                  onClick={() => {
                    handleProcessAcess(step.key, 'delete', step.title, step.sortOrder);
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
      <div className="w-full mt-2 overflow-x-auto overflow-x-hidden">
        <TaskTable currentStep={steps[currentStep].title} />
      </div>
      {openModal.delete && (
        <ConfirmationModal
          open={openModal.delete}
          type="danger"
          onClose={() => {
            setOpenModal(prev => ({ ...prev, delete: false }));
          }}
          onConfirm={() => { }}
          message={`Are you sure you want to delete this ${openModal.stageName}?`}
        />
      )}

      {(openModal.edit || stageModal) && (
        <ActionDialogmodel
          open={openModal.edit || stageModal}
          title={openModal.edit ? 'Edit Stage' : 'New Stage'}
          onCancel={() => {
            setOpenModal(prev => ({ ...prev, edit: false }));
            setStageModal(false);
          }}
          onSubmit={() => {
            setOpenModal(prev => ({ ...prev, edit: false }));
            setStageModal(false);
          }}
          fields={[
            {
              label: 'Stage Name',
              name: 'stageName',
              type: 'text',
              placeholder: 'Enter stage name',
              initialValue: openModal.edit ? openModal.stageName : '',
            },
            {
              label: 'Sort Order',
              name: 'sortOrder',
              type: 'number',
              placeholder: 'Enter sort order',
              initialValue: openModal.edit ? openModal.sortOrder : '',
            },
          ]}
        />
      )}
      {existingJobModal && (
        <ConfirmationContentModal
          content={
            <div>
              This is a dummy message here what will are the changes are made and what things will
              effect on saving list of all things come here as a worning
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
    </Drawer>
  );
};
