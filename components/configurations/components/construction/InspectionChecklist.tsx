'use client';
import React, { useEffect, useState } from 'react';
import { Table, Button, message, Dropdown, Switch, Popconfirm } from 'antd';
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { inspectionChecklistSettingFields } from '@/components/formFields/InspectionChecklistSettingFields';
import { ChecklistHeader } from '../ChecklistHeader';
import { ConfirmationContentModal } from '@/components/common/ConfirmationContentModal';
import { toggleExpand } from '@redux/feature/admin/construction/InspectionChecklist/InspectionchecklistSlice';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createInspectionChecklist,
  deleteInspectionChecklist,
  fetchAllInspectionChecklist,
  fetchAllInspectionSection,
  updateInspectionChecklist,
} from '@redux/feature/admin/construction/InspectionChecklist/InspectionChecklistThunk';
import { Status } from '@lib/constants/enum';

import { fetchAllConstructionOption } from '@redux/feature/admin/construction/constructionOption/constructionOptionThunk';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';
import { InspectionChecklistType } from '@redux/feature/admin/construction/InspectionChecklist/InspectionChecklistState';

export const InspectionChecklist: React.FC = () => {
  const dispatch = useAppDispatch();
  const { inspectionSection, status } = useAppSelector(
    state => state.construction.inspectionChecklist
  );
  const [editing, setEditing] = useState<InspectionChecklistType | null>(null);
  const [editedChecklist, setEditedChecklist] = useState<InspectionChecklistType | null>(null);

  const [modalopen, setModalopen] = useState<
    'checklist' | 'section' | 'deleteChecklist' | 'deleteSection' | null
  >(null);
  const [onExistingJob, setExistingJob] = useState<{
    checklist: boolean;
    section: boolean;
  }>({ checklist: false, section: false });
  const [headerData, setHeaderData] = useState({
    builder: null,
    constructionType: null,
    constructionStage: null,
  });
  const { constructionOption, status: optionStatus } = useAppSelector(
    state => state.construction.constructionOption
  );

  const options =
    constructionOption &&
    constructionOption.map(i => ({ label: i.optionName, value: i.constructionOptionId }));

  const sectionOptions =
    inspectionSection &&
    inspectionSection.map(i => ({
      label: i.description,
      value: i.constructionInspectionChecklistId,
    }));

  const fetchInspectionSectionData = async () => {
    try {
      await dispatch(fetchAllInspectionSection()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch section data');
    }
  };

  const fetchConstrucctionOptionData = async () => {
    try {
      await dispatch(fetchAllConstructionOption()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch construction option');
    }
  };

  useEffect(() => {
    if (status.sectionStatus.fetch === Status.IDLE) {
      fetchInspectionSectionData();
    }

    if (optionStatus.fetch === Status.IDLE) {
      fetchConstrucctionOptionData();
    }
  }, [status.sectionStatus.fetch, optionStatus.fetch]);

  const handleDelete = async () => {
    try {
      await dispatch(
        deleteInspectionChecklist({
          sectionId: editing.constructionInspectionChecklistId,
          fieldName: 'section',
          id: null,
          allowExistingJob: onExistingJob.section,
        })
      ).unwrap();
      message.success('section deleted successfully');
      setEditing(null);
      setModalopen(null);
    } catch (error) {
      message.error(error || 'Failed to delete section');
    }
  };

  const handleDeleteChecklist = async () => {
    try {
      await dispatch(
        deleteInspectionChecklist({
          sectionId: editedChecklist.sectionId,
          fieldName: 'checklist',
          id: editedChecklist.constructionInspectionChecklistId,
          allowExistingJob: onExistingJob.checklist,
        })
      ).unwrap();
      message.success('checklist deleted successfully');
      setEditedChecklist(null);
      setModalopen(null);
    } catch (error) {
      message.error(error || 'Failed to delete checklist');
    }
  };

  const handleChecklistSubmit = async values => {
    try {
      if (editedChecklist) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editedChecklist);
        if (!isUpdated) {
          setEditedChecklist(null);
          setModalopen(null);
          return;
        }
        await dispatch(
          updateInspectionChecklist({
            data: updatedFields,
            id: editedChecklist.constructionInspectionChecklistId,
            sectionId: editedChecklist.sectionId,
          })
        ).unwrap();
        message.success('checklist update successfully');
      } else {
        await dispatch(
          createInspectionChecklist({
            ...values,
            fieldName: 'checklist',
          })
        ).unwrap();
        message.success('checklist create successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save section');
    }
  };

  const handleSectionSubmit = async values => {
    try {
      if (editing) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editing);
        if (!isUpdated) {
          setEditing(null);
          setModalopen(null);
          return;
        }
        await dispatch(
          updateInspectionChecklist({
            data: updatedFields,
            id: editing.constructionInspectionChecklistId,
          })
        ).unwrap();
        message.success('section update successfully');
      } else {
        await dispatch(
          createInspectionChecklist({
            ...values,
            fieldName: 'section',
            builder: headerData.builder,
            constructionStageId: headerData.constructionStage,
            constructionTypeId: headerData.constructionType,
          })
        ).unwrap();
        message.success('section create successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to save section');
    }
  };

  const columns = [
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Sort',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      align: 'center' as const,
    },
    {
      title: '',
      key: 'actions',
      width: 120,
      align: 'center' as const,
      render: (_, record: InspectionChecklistType) => (
        <div className="flex justify-center gap-4">
          <IconPencil
            className="text-blue-600 cursor-pointer hover:scale-110 transition"
            onClick={() => {
              setEditing(record);
              setExistingJob(prev => ({ ...prev, section: record.addAllExistingJobs }));
              setModalopen('section');
            }}
          />

          <IconTrash
            className="text-red-600 cursor-pointer hover:scale-110 transition"
            onClick={() => {
              setEditing(record);
              setExistingJob(prev => ({ ...prev, section: record.addAllExistingJobs }));
              setModalopen('deleteSection');
            }}
          />
        </div>
      ),
    },
  ];

  const getChecklistData = async record => {
    if (!record.isExpanded) {
      dispatch(toggleExpand(record.constructionInspectionChecklistId));
      try {
        await dispatch(
          fetchAllInspectionChecklist(record.constructionInspectionChecklistId)
        ).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch stage data');
      }
    }
  };
  const expandedRowRender = record => {
    getChecklistData(record);
    const checklistColumn = [
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: 'Sort',
        dataIndex: 'sortOrder',
        key: 'sortOrder',
        width: 100,
        align: 'center' as const,
      },
      {
        title: '',
        key: 'actions',
        width: 120,
        align: 'center' as const,
        render: (_, record) => (
          <div className="flex justify-center gap-4">
            <IconPencil
              className="text-blue-600 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setEditedChecklist(record);
                setExistingJob(prev => ({ ...prev, checklist: record.addAllExistingJobs }));
                setModalopen('checklist');
              }}
            />
            <IconTrash
              className="text-red-600 cursor-pointer hover:scale-110 transition"
              onClick={() => {
                setEditedChecklist(record);
                setExistingJob(prev => ({ ...prev, checklist: record.addAllExistingJobs }));
                setModalopen('deleteChecklist');
              }}
            />
          </div>
        ),
      },
    ];
    return (
      <Table
        columns={checklistColumn}
        dataSource={record.checklist}
        pagination={false}
        rowKey="constructionInspectionChecklistId"
        size="small"
      />
    );
  };
  return (
    <div className="p-6 bg-white rounded shadow-md">
      <ChecklistHeader onChange={setHeaderData} data={headerData} />
      <div className="flex justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Checklist Table</h2>
        <Dropdown
          menu={{
            items: [
              {
                key: 'checklist',
                label: 'New checklist',
                onClick: () => setModalopen('checklist'),
              },
              {
                key: 'section',
                label: 'New Section',
                onClick: () => setModalopen('section'),
              },
            ],
          }}
        >
          <Button type="primary" icon={<IconPlus />}>
            New
          </Button>
        </Dropdown>
      </div>

      <Table
        columns={columns}
        dataSource={inspectionSection}
        pagination={false}
        bordered
        expandable={{ expandedRowRender }}
        rowClassName={record => (record.children ? 'bg-gray-50' : '')}
        rowKey="constructionInspectionChecklistId"
      />
      {['checklist', 'section'].includes(modalopen) && (
        <ActionDialogmodel
          open={['checklist', 'section'].includes(modalopen)}
          title={modalopen === 'checklist' ? 'New checklist' : 'New section'}
          initialValues={modalopen === 'checklist' ? editedChecklist : editing}
          isEditing={modalopen === 'checklist' ? !!editedChecklist : !!editing}
          onCancel={() => {
            setModalopen(null);
            setEditing(null);
            setEditedChecklist(null);
          }}
          onSubmit={values => {
            modalopen === 'checklist' ? handleChecklistSubmit(values) : handleSectionSubmit(values);
            setModalopen(null);
            setEditing(null);
            setEditedChecklist(null);
          }}
          fields={inspectionChecklistSettingFields(modalopen, sectionOptions, options,onExistingJob,setExistingJob)}
        />
      )}

      {/* this is the delete model we have to manage according to the stage and the checklist deletion */}
      {['deleteChecklist', 'deleteSection'].includes(modalopen) && (
        <ConfirmationContentModal
          open={['deleteChecklist', 'deleteSection'].includes(modalopen)}
          onClose={() => {
            setEditedChecklist(null);
            setEditing(null);
            setModalopen(null);
          }}
          onSubmit={modalopen === 'deleteChecklist' ? handleDeleteChecklist : handleDelete}
          title="Delete"
          content={
            <div className="space-y-4">
              <p>Are you sure you want to delete the inspection?</p>
              <div className="flex gap-2 ">
                <Switch
                  checked={
                    modalopen === 'deleteChecklist'
                      ? onExistingJob.checklist
                      : onExistingJob.section
                  }
                  onChange={val =>
                    setExistingJob(prev => ({
                      ...prev,
                      [modalopen === 'deleteChecklist' ? 'checklist' : 'section']: val,
                    }))
                  }
                />
                <p>
                  Delete The inspection from all existing jobs. There is a defect created for this
                  inspection checklist, deleting{' '}
                  {modalopen === 'deleteChecklist' ? 'this checklist' : 'this stage'} will also
                  delete the defect.
                </p>
              </div>
            </div>
          }
          okText="Delete"
          cancelText="Cancel"
        />
      )}
    </div>
  );
};
