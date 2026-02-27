'use client';
import { Drawer, Switch, Tag, Popconfirm, message } from 'antd';
import { useState, useCallback, useEffect } from 'react';
import { IconEdit, IconPinned, IconPlus, IconTrash } from '@tabler/icons-react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { CommissionStage, JobCommission } from '@redux/feature/admin/job/jobCommission/IJobCommissionState';
import { Status } from '@lib/constants/enum';
import { createCommissionStage, createOutgoingCommission, deleteCommissionStage, fetchAllCommissionStage, fetchAllOutgoingCommission, updateCommissionStage, updateOutgoingCommission } from '@redux/feature/admin/job/jobCommission/jobCommissionThunk';
import { getChildFields, getParentFields } from '@/components/formFields/comissionSettingFields';
import { HLPackageCommission } from '@redux/feature/land/ILandState';
interface CommissionDrawerProps {
  openDrawer: boolean;
  setOpenDrawer: (open: boolean) => void;
  partners: HLPackageCommission[];
  setPartners: (id: string) => void;
  disabledPartners: string[];
  setDisabledPartners: (id: string) => void;
}

export const CommissionDrawer = ({
  openDrawer,
  setOpenDrawer,
  partners,
  setPartners,
  disabledPartners,
  setDisabledPartners,
}: CommissionDrawerProps) => {
  const [modalOpen, setModalOpen] = useState<'partner' | 'stage' | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<JobCommission | null>(null)
  const [selectedStage, setSelectedStage] = useState<CommissionStage | null>(null)

  const dispatch = useAppDispatch();
  const { outgoingCommission, outgoingCommissionStatus, commissionStageStatus } = useAppSelector(state => state.job.jobCommission);

  useEffect(() => {
    if (outgoingCommissionStatus.fetch === Status.IDLE) {
      fetchOutgoingCommissionData();
    }
    if (outgoingCommission)
      fetchCommissionStageData()
  }, [outgoingCommissionStatus.fetch])

  const fetchOutgoingCommissionData = async () => {
    try {
      await dispatch(fetchAllOutgoingCommission({ commission_type: 'outgoing' })).unwrap();
    }
    catch (error) {
      message.error(error || 'Failed to fetch outgoing commission')
    }
  }

  const fetchCommissionStageData = async () => {
    try {
      outgoingCommission?.map(async i =>
        await dispatch(fetchAllCommissionStage(i.jobCommissionId)).unwrap()
      )
    }
    catch (error) {
      message.error(error || 'Failed to fetch outgoing commission')
    }
  }

  const handleSaveParent = async values => {
    try {
      if (selectedPartner) {
        await dispatch(
          updateOutgoingCommission({
            data: values,
            id: selectedPartner.jobCommissionId,
            commissionType: 'outgoing',
          })
        ).unwrap();
        message.success('Outgoing commission updated successfully');
      } else {
        await dispatch(
          createOutgoingCommission({ ...values, commissionType: 'outgoing' })
        ).unwrap();
        message.success('Outgoing commission created successfully');
      }
      setSelectedPartner(null)
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save outgoing commission');
    }
  };

  const handleSaveChild = async values => {
    try {
      if (selectedStage) {
        await dispatch(
          updateCommissionStage({
            data: values,
            id: selectedStage.jobCommissionSubStageId,
            commissionId: selectedPartner?.jobCommissionId,
          })
        ).unwrap();
        message.success('Outgoing commission stage updated successfully');
      } else {
        await dispatch(
          createCommissionStage({ ...values, jobCommissionId: selectedPartner?.jobCommissionId })
        ).unwrap();
        message.success('Outgoing commission stage created successfully');
      }
      setSelectedStage(null)
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save outgoing commission stage');
    }
  };
  const handleDeleteChild = async (parentId: string, stageId: string) => {
    try {
      await dispatch(deleteCommissionStage({ id: stageId, commissionId: parentId })).unwrap();
      message.success('Stage deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete stage');
    }
  };

  const togglePartnerEnabled = (partnerId: string, checked: boolean) => {
    if (checked) {
      setPartners(partnerId);
    }
    else {
      setDisabledPartners(partnerId);
    }
  };

  const PartnerRow = useCallback(
    (partner: JobCommission) => {
      const partnerTypeDisplay = partner.recipient;
      const isEnabled = partners?.map((i) => i?.jobCommissionId).includes(partner.jobCommissionId);
      const item = partners?.find(i => i?.jobCommissionId === partner?.jobCommissionId)
      const DisplayRow = (
        <div className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-white font-semibold flex-wrap">
          <div className="flex items-center gap-2 col-span-2 lg:col-span-1">
            <Switch
              checked={isEnabled}
              onChange={checked => togglePartnerEnabled(checked ? partner.jobCommissionId : item.id, checked)}
            />
            <span>{partner.name}</span>
          </div>
          <div className="hidden lg:block lg:col-span-1">
            <Tag color="blue">{partnerTypeDisplay}</Tag>
          </div>
          <div className="col-span-1">${partner.commissionValue.toLocaleString()}</div>
          <div className="hidden lg:block lg:col-span-1 ml-12">{partner.sortOrder}</div>
          <div className="col-span-1 flex justify-end gap-2">
            <button
              className="text-green-600 hover:text-green-800"
              onClick={() => {
                setModalOpen('stage')
              }}
            >
              <IconPlus size={18} />
            </button>
            <button
              className="text-gray-600 hover:text-blue-500"
              onClick={() => {
                setModalOpen('partner')
                setSelectedPartner(partner)
              }}
            >
              <IconEdit size={18} />
            </button>
          </div>
        </div>
      );

      const StageRows =
        isEnabled &&
        partner?.stages?.map((stage, idx) => {
          return (
            <div
              key={idx}
              className="grid grid-cols-2 lg:grid-cols-5 items-center p-2 bg-gray-50 text-sm border-b border-gray-100"
            >
              <div className="col-span-2 lg:col-span-1 pl-6 flex items-center gap-2"></div>
              <div className="col-span-2 lg:col-span-1 pl-6 flex items-center gap-2">
                <IconPinned size={14} className="mr-1 hidden lg:block" />
                <span>{stage.name}</span>
              </div>
              <div className="col-span-1 flex items-center gap-2">
                <span className="lg:hidden">Value:</span> ${stage.commissionValue.toLocaleString()}{' '}
                {stage?.commissionValue > 0 && <Tag color="green">{stage.commissionValue}%</Tag>}
              </div>
              <div className="hidden lg:block lg:col-span-1 ml-12">{idx + 1}</div>
              <div className="col-span-1 flex justify-end gap-2">

                <>
                  <button
                    className="text-gray-600 hover:text-blue"
                    onClick={() => {
                      setModalOpen('stage')
                      setSelectedStage(stage)
                    }}
                  >
                    <IconEdit size={18} />
                  </button>
                  <Popconfirm
                    title={`Are you sure you want to delete ${stage.name}?`}
                    onConfirm={() => handleDeleteChild(partner.jobCommissionId, stage.jobCommissionSubStageId)}
                    okText="Yes, Delete"
                    cancelText="No"
                  >
                    <button className="text-gray-600 hover:text-red-500">
                      <IconTrash size={18} />
                    </button>
                  </Popconfirm>
                </>

              </div>
            </div>
          );
        });

      return (
        <div
          key={partner.jobCommissionId}
          className={`border-b border-gray-200 ${!isEnabled ? 'bg-gray-100 opacity-50' : ''}`}
        >
          {DisplayRow}
          {StageRows}
        </div>
      );
    },
    [
      disabledPartners,
      togglePartnerEnabled,

    ]
  );

  return (
    <Drawer
      width="50%"
      open={openDrawer}
      title="Capture Commission"
      onClose={() => setOpenDrawer(false)}
      maskClosable
      size='large'
    >
      <h2 className="text-lg font-bold mb-4">Outgoing Commission</h2>

      <div className="grid grid-cols-2 lg:grid-cols-5 font-bold items-center p-2 bg-gray-100 border-b">
        <div className="col-span-2 lg:col-span-1">Name</div>
        <div className="hidden lg:block lg:col-span-1">Recipient</div>
        <div className="col-span-1">Commission Value</div>
        <div className="hidden lg:block lg:col-span-1 ml-12">Sort</div>
        <div className="col-span-1 text-right">
          <button
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 ml-auto"
            onClick={() => {
              setModalOpen('partner')
            }}
          >
            <IconPlus size={16} /> New
          </button>
        </div>
      </div>


      {outgoingCommission.map(item => PartnerRow(item))}

      {modalOpen === 'partner' && (
        <ActionDialogmodel
          title={!!selectedPartner ? 'Edit Commission Setting' : 'Add Commission Setting'}
          open={modalOpen === 'partner'}
          onCancel={() => setModalOpen(null)}
          isEditing={!!selectedPartner}
          onSubmit={handleSaveParent}
          fields={getParentFields()}
          initialValues={selectedPartner || {}}
          submitButtonText={!!selectedPartner ? 'Update' : 'Create'}
          loading={outgoingCommissionStatus.update === Status.PENDING}
        />
      )}

      {modalOpen === 'stage' && (
        <ActionDialogmodel
          title={!!selectedStage ? 'Edit Stage' : 'Add Stage'}
          open={modalOpen === 'stage'}
          onCancel={() => setModalOpen(null)}
          isEditing={!!selectedStage}
          onSubmit={handleSaveChild}
          fields={getChildFields()}
          initialValues={selectedStage || {}}
          submitButtonText={selectedStage ? 'Update' : 'Create'}
          loading={commissionStageStatus.update === Status.PENDING}
        />
      )}
    </Drawer>
  );
};
