'use client';
import { Row, message } from 'antd';
import { ChecklistSettingForm } from '../ChecklistSettingForm';
import { useEffect, useState } from 'react';
import { ChecklistHeader } from '../ChecklistHeader';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createConstructionChecklist,
  deleteConstructionChecklist,
  fetchAllConstructionChecklist,
  updateConstructionChecklist,
} from '@redux/feature/admin/construction/constructionChecklist/constructionChecklistThunk';
import { Status } from '@lib/constants/enum';
import { ChecklistField } from '@/components/common/ChecklistField';
import { ChecklistTableHeader } from '@/components/common/ChecklistTableHeader';
import { ConstructionChecklistType } from '@redux/feature/admin/construction/constructionChecklist/IConstructionChecklistState';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { getUpdatedFields } from '@lib/utils/getUpdatedFields';

export function Checklist() {
  const dispatch = useAppDispatch();
  const { checklist, status } = useAppSelector(state => state.construction.constructionChecklist);
  const [editing, setEditing] = useState<ConstructionChecklistType | null>(null);
  const [modalOpen, setModalOpen] = useState<'create' | 'delete' | null>(null);

  const [headerData, setHeaderData] = useState({
    builder: null,
    constructionType: null,
    constructionStage: null,
  });

  const checklistOptions =
    checklist &&
    checklist.map(i => ({
      label: i.constructionStage?.name + ' - ' + i.name,
      value: i.constructionChecklistId,
    }));

  const fetchChecklist = async () => {
    try {
      await dispatch(fetchAllConstructionChecklist({})).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch checklist');
    }
  };

  useEffect(() => {
    if (status.checklistStatus.fetch === Status.IDLE) {
      fetchChecklist();
    }
  }, [status.checklistStatus.fetch]);

  const hanleSubmit = async values => {
    try {
      if (editing) {
        const { isUpdated, updatedFields } = getUpdatedFields(values, editing);
        if (!isUpdated) {
          setEditing(null);
          setModalOpen(null);
          return;
        }
        await dispatch(
          updateConstructionChecklist({
            id: editing.constructionChecklistId,
            data: updatedFields,
          })
        ).unwrap();
        message.success('Checklist updated successfully');
      } else {
        await dispatch(
          createConstructionChecklist({
            ...values,
            builder: headerData.builder,
            constructionTypeId: headerData.constructionType,
            constructionStageId: headerData.constructionStage,
          })
        ).unwrap();
        message.success('Checklist created successfully');
      }
      setEditing(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save checklist');
    }
  };

  const handleDeleteChecklist = async () => {
    try {
      await dispatch(deleteConstructionChecklist(editing?.constructionChecklistId)).unwrap();
      message.success('Checklist deleted successfully');
      setModalOpen(null);
      setEditing(null);
    } catch (error) {
      message.error(error || 'Failed to delete checklist');
    }
  };

  return (
    <div className="p-6 bg-card-color rounded-lg shadow">
      <ChecklistHeader onChange={setHeaderData} data={headerData} />

      {/* Table Header */}
      <ChecklistTableHeader setModalOpen={setModalOpen} />

      {modalOpen === 'create' && (
        <Row gutter={8} className="  border-gray-200 py-1">
          <ChecklistSettingForm
            setModalOpen={setModalOpen}
            setEditing={setEditing}
            handleSubmit={hanleSubmit}
            checklistOptions={checklistOptions}
          />
        </Row>
      )}

      {checklist.map((item: ConstructionChecklistType, index: number) =>
        editing?.constructionChecklistId === item.constructionChecklistId && !modalOpen ? (
          <ChecklistSettingForm
            key={index}
            setModalOpen={setModalOpen}
            setEditing={setEditing}
            handleSubmit={hanleSubmit}
            checklistOptions={checklistOptions}
            isEditing={!!editing}
            initialValue={
              editing && {
                ...editing,
                supplierTypeId: editing.supplierType.id,
                costCenterId: editing.costCenter?.map(i => i.id),
                constructionOptionId: editing.constructionOption?.map(i => i.id),
                complianceTypeId: editing.complianceType.id,
                poFolderId: editing?.poFolderId,
                jobDocumentsFolderId: editing?.jobDocumentsFolderId,
              }
            }
          />
        ) : (
          <Row gutter={8} className=" border-gray-200 py-1">
            <ChecklistField
              data={item}
              key={index}
              setEditing={setEditing}
              setChecklistModalOpen={setModalOpen}
            />
          </Row>
        )
      )}
      {modalOpen === 'delete' && (
        <ConfirmationModal
          open={modalOpen === 'delete'}
          onClose={() => setModalOpen(null)}
          onConfirm={() => handleDeleteChecklist()}
          message="Are you sure you want to delete this?"
        />
      )}
    </div>
  );
}
