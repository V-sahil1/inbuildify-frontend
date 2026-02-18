'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Tag, Tooltip, TableProps, message, Popconfirm } from 'antd';
import { IconPencil, IconTrash, IconPlus, IconJumpRope } from '@tabler/icons-react';
import { JobWorkflowDrawer } from '../JobWorkflowDrawer';
import { useJobProcess } from '../../hooks/useJobProcess';
import { JobProcessStage } from '@redux/feature/admin/job/jobProcess/IJobProcessState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { jobProcessStageFields } from '@/components/formFields/jobProcessStageFields';
import {
  createJobProcessStages,
  deleteJobProcessStage,
  updateJobProcessStages,
} from '@redux/feature/admin/job/jobProcess/jobProcessThunk';
import { Status } from '@lib/constants/enum';

export const JobProcess: React.FC = () => {
  const [modal, setModal] = useState<{ type: string; stage: Partial<JobProcessStage> }>(null);
  const [workflowModal, setWorkflowModal] = useState<JobProcessStage>(null);
  const { jobProcessFunctionalityOptions } = useJobProcess();
  const { jobProcessStage = [], status } = useAppSelector(state => state.job.jobProcess);
  const dispatch = useAppDispatch();
  const loading = status.stage.create === Status.PENDING || status.stage.update === Status.PENDING;
  const renderFuncTag = (f: string) => {
    return <Tag style={{ fontWeight: 600 }}>{f}</Tag>;
  };

  const handleModal = (type: string, value?: Partial<JobProcessStage>) => {
    setModal({ type: type, stage: value });
  };

  const handleSubmitStage = async (values: Partial<JobProcessStage>) => {
    try {
      if (modal.type === 'create') {
        await dispatch(createJobProcessStages(values)).unwrap();
      } else if (modal.type === 'edit') {
        await dispatch(
          updateJobProcessStages({ data: values, jobStageId: modal.stage.stageId })
        ).unwrap();
      }
      setModal(null);
    } catch (error) {
      message.error(error);
    }
  };

  const handleDelete = async (stageId: string) => {
    try {
      await dispatch(deleteJobProcessStage(stageId)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to delete stage');
    }
  };

  const columns: TableProps<JobProcessStage>['columns'] = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      width: 70,
      render: (_, __: JobProcessStage, index: number) => index + 1,
    },
    {
      title: 'Stage Name',
      dataIndex: 'name',
    },
    {
      title: 'Functionality',
      dataIndex: 'functionality',
      render: (_, row: JobProcessStage) => {
        return renderFuncTag(row.functionality.name);
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      width: 120,
    },
    {
      title: '',
      width: 160,
      render: (_, row: JobProcessStage) => {
        return (
          <div style={{ textAlign: 'right' }}>
            <Space>
              {row.isWorkflow && (
                <Tooltip title="Job workflow">
                  <Button
                    type="text"
                    icon={<IconJumpRope size={16} />}
                    onClick={() => setWorkflowModal(row)}
                  />
                </Tooltip>
              )}
              <Tooltip title="Edit">
                <Button
                  type="text"
                  icon={<IconPencil size={18} />}
                  onClick={() => handleModal('edit', row)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Popconfirm
                  title="Are you sure you want to delete this stage?"
                  description="This action cannot be undone."
                  onConfirm={() => handleDelete(row.stageId)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" icon={<IconTrash size={16} color="red" />} />
                </Popconfirm>
              </Tooltip>
            </Space>
          </div>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="text-lg font-semibold m-0">Configure Job Stages</h3>
          <div className="text-sm text-gray-500">
            Admins can set up fully customizable job progress.
          </div>
        </div>

        <Button type="primary" icon={<IconPlus size={16} />} onClick={() => handleModal('create')}>
          New
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={jobProcessStage}
        loading={status.stage.fetch === Status.IDLE}
        pagination={false}
        size="middle"
      />
      {modal && (
        <ActionDialogmodel
          title="Job Stage"
          open={modal.type === 'create' || modal.type === 'edit'}
          onCancel={() => setModal(null)}
          loading={loading}
          onSubmit={handleSubmitStage}
          fields={jobProcessStageFields(jobProcessFunctionalityOptions)}
          initialValues={{
            ...modal.stage,
            functionalityId: modal.stage?.functionality?.id,
          }}
          isEditing={modal.type === 'edit'}
        />
      )}

      {workflowModal && (
        <JobWorkflowDrawer
          open={!!workflowModal}
          onClose={() => setWorkflowModal(null)}
          record={workflowModal}
        />
      )}
    </div>
  );
};
