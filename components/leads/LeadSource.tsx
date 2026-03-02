'use client';
import { Button, Divider, message } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createBusinessContactThunk,
  deleteBusinessContactThunk,
  updateBusinessContactThunk,
  updateLeadThunk,
} from '@redux/feature/lead/leadThunk';
import { Status } from '@lib/constants/enum';
import { RootState } from '@redux/feature/store';
import LeadUpdateDetail from '../leadDetail/LeadUpdateDetail';
import EditableField from './EditableField';
import { notesRules, leadSourceRules } from '@lib/constants/formInputValidations';
import { mapToOptions } from '@lib/utils/rangeAndDwellingObjToOptions';
import { IconCirclePlus, IconTrash } from '@tabler/icons-react';
import HouseLandPopover from '../common/HLPopover';
import LeadSourceDetailsDrawer from '../common/LeadSourceDetailDrawer';
import { PurposeOptions, RatingOptions, YesNoOptions } from 'data/options';
import { BusinessContact, Lead } from '@redux/feature/lead/ILeadState';
import { fetchAllleadSource } from '@redux/feature/admin/sales/leadSource/leadSourceThunk';
import { useClientTypeHook } from '@hooks/useClientTypeHook';
import { useStateHook } from '@hooks/useStateHook';

export const LeadSource = () => {
  const dispatch = useAppDispatch();
  const { leadDetail } = useAppSelector((state: RootState) => state.lead);
  const { leadSource, status } = useAppSelector((state: RootState) => state.sales.leadSource);
  const updateLeadStatusState = useAppSelector(
    (state: RootState) => state.lead.status.updateLeadSource
  );
  const { clientTypeOptions } = useClientTypeHook();
  const { stateOptions } = useStateHook();
  const [isLeadEditing, setIsLeadEditing] = useState({
    leadSource: false,
    notes: false,
    rating: false,
    land: false,
    finance: false,
    faceToFace: false,
    purpose: false,
    clientTypeId: false,
    forcastClose: false,
    buildBudget: false,
    regionId: false,
    prelimAgreement: false,
    clientProfile: false,
    hLBudget: false,
  });
  const LeadSourceOptions = mapToOptions(leadSource, 'name', 'leadSourceId');
  const [drawerOpen, setDrawerOpen] = useState<
    'company' | 'conveyancer' | 'mortgage_broker' | 'financer' | null
  >(null);
  const [editingContact, setEditingContact] = useState<BusinessContact | null>(null);

  useEffect(() => {
    async function fetchLeadSource() {
      if (status.fetch === Status.IDLE) {
        try {
          await dispatch(fetchAllleadSource({})).unwrap();
        } catch (error) {
          message.error(error || 'Failed to fetch lead sources');
        }
      }
    }
    fetchLeadSource();
  }, [status.fetch, dispatch]);

  const handleLeadSourceEdit = async (values: Partial<Lead>) => {
    try {
      await dispatch(
        updateLeadThunk({
          id: leadDetail.lead.leadsId,
          details: values,
        })
      ).unwrap();
      message.success('Lead updated successfully');
      setIsLeadEditing(prev => {
        const updated = { ...prev };
        Object.keys(values).forEach(key => (updated[key] = false));
        return updated;
      });
    } catch (error) {
      message.error(error || 'Failed to update lead');
    }
  };

  const handleDataSave = async (values: BusinessContact) => {
    try {
      if (editingContact) {
        await dispatch(
          updateBusinessContactThunk({ id: editingContact?.businessContactId, payload: values })
        ).unwrap();
        message.success('Lead details updated successfully');
      } else {
        await dispatch(
          createBusinessContactThunk({
            ...values,
            leadsId: leadDetail.lead.leadsId,
            contactType: drawerOpen,
          })
        ).unwrap();
        message.success(`lead details saved!`);
      }
      setEditingContact(null);
      setDrawerOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save lead source details');
    }
  };

  const handleDeleteData = async record => {
    try {
      await dispatch(
        deleteBusinessContactThunk({
          leadsId: record?.leadsId,
          id: record?.businessContactId,
          contactType: record?.contactType,
        })
      ).unwrap();
      message.success('Item deleted successfully');
    } catch (error) {
      message.error(error || 'Failed to delete data');
    }
  };

  return (
    <div className="flex flex-col md:flex-row lg:flex-col m-3 p-1">
      <div className="flex-1">
        <div className="text-md font-bold lg:mt-6">
          <p>More Info</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <EditableField
          label="Lead Source"
          name="leadSourceId"
          value={leadDetail.lead?.leadSourceId}
          rules={leadSourceRules}
          isleadEditing={isLeadEditing.leadSource}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          options={LeadSourceOptions}
          initialValues={{ leadSource: leadDetail.lead?.leadSourceId || '' }}
          type="Select"
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Notes"
          name="notes"
          value={leadDetail.lead?.notes}
          rules={notesRules}
          isleadEditing={isLeadEditing.notes}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ notes: leadDetail.lead?.notes || '' }}
          type="TextArea"
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Rating"
          name="rating"
          value={leadDetail.lead?.rating}
          type="Select"
          options={RatingOptions}
          isleadEditing={isLeadEditing.rating}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ rating: leadDetail.lead?.rating || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Land"
          name="land"
          value={leadDetail?.lead?.land}
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.land}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ land: leadDetail.lead?.land || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Finance"
          name="finance"
          value={leadDetail?.lead?.finance}
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.finance}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ finance: leadDetail.lead?.finance || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Face to Face"
          name="faceToFace"
          value={leadDetail?.lead?.faceToFace}
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.faceToFace}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ faceToFace: leadDetail.lead?.faceToFace || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Purpose"
          name="purpose"
          value={leadDetail?.lead?.purpose}
          type="Select"
          options={PurposeOptions}
          isleadEditing={isLeadEditing.purpose}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ purpose: leadDetail.lead?.purpose || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Client Type"
          name="clientTypeId"
          value={leadDetail?.lead?.clientTypeId}
          type="Select"
          options={clientTypeOptions}
          isleadEditing={isLeadEditing.clientTypeId}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ clientTypeId: leadDetail.lead?.clientTypeId || '' }}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Forecast Close"
          name="forcastClose"
          value={leadDetail?.lead?.forcastClose}
          type="Date"
          isleadEditing={isLeadEditing.forcastClose}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          initialValues={{ forcastClose: leadDetail.lead?.forcastClose || '' }}
          onSave={handleLeadSourceEdit}
        />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md lg:mt-6 flex flex-col gap-1 text-primary">
          <div>
            <HouseLandPopover onSave={handleLeadSourceEdit}>
              <button className="flex items-center gap-2 hover:text-blue-800">
                <IconCirclePlus /> House and Land Package
              </button>
            </HouseLandPopover>
            <p className="text-sm text-font-color">{leadDetail?.lead?.houseLandPackageId}</p>
          </div>

          <div>
            <button className="flex gap-2" onClick={() => setDrawerOpen('company')}>
              <IconCirclePlus /> Company Details
            </button>
            {leadDetail?.lead?.company && (
              <div className="flex items-center gap-2 justify-between text-sm text-font-color">
                <p
                  className="cursor-pointer"
                  onClick={() => {
                    setDrawerOpen('company');
                    setEditingContact(leadDetail?.lead?.company);
                  }}
                >
                  {leadDetail?.lead?.company.name}
                </p>
                <Button
                  type="text"
                  size="small"
                  icon={<IconTrash size={16} color="red" />}
                  onClick={() => {
                    handleDeleteData(leadDetail?.lead?.company);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <button className="flex gap-2" onClick={() => setDrawerOpen('conveyancer')}>
              <IconCirclePlus /> Conveyancer / Solicitor
            </button>
            {leadDetail?.lead?.conveyancer && (
              <div className="flex items-center gap-2 justify-between text-sm text-font-color">
                <p
                  onClick={() => {
                    setDrawerOpen('conveyancer');
                    setEditingContact(leadDetail?.lead?.conveyancer);
                  }}
                >
                  {leadDetail?.lead?.conveyancer.name}
                </p>
                <Button
                  type="text"
                  size="small"
                  icon={<IconTrash size={16} color="red" />}
                  onClick={() => {
                    handleDeleteData(leadDetail?.lead?.conveyancer);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <button className="flex gap-2" onClick={() => setDrawerOpen('mortgage_broker')}>
              <IconCirclePlus /> Mortgage Broker
            </button>
            {leadDetail?.lead?.mortgageBroker && (
              <div className="flex items-center gap-2 justify-between text-sm text-font-color">
                <p
                  onClick={() => {
                    setDrawerOpen('mortgage_broker');
                    setEditingContact(leadDetail?.lead?.mortgageBroker);
                  }}
                >
                  {leadDetail?.lead?.mortgageBroker.name}
                </p>
                <Button
                  type="text"
                  size="small"
                  icon={<IconTrash size={16} color="red" />}
                  onClick={() => {
                    handleDeleteData(leadDetail?.lead?.mortgageBroker);
                  }}
                />
              </div>
            )}
          </div>
          <div>
            <button className="flex gap-2" onClick={() => setDrawerOpen('financer')}>
              <IconCirclePlus /> Bank / Financer
            </button>
            {leadDetail?.lead?.financer && (
              <div className="flex items-center gap-2 justify-between text-sm text-font-color">
                <p
                  onClick={() => {
                    setDrawerOpen('financer');
                    setEditingContact(leadDetail?.lead?.financer);
                  }}
                >
                  {leadDetail?.lead?.financer.name}
                </p>
                <Button
                  type="text"
                  size="small"
                  icon={<IconTrash size={16} color="red" />}
                  onClick={() => {
                    handleDeleteData(leadDetail?.lead?.financer);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold lg:mt-6">
          <p>Custom Fields</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <EditableField
          label="Budget (Build)"
          name="buildBudget"
          value={leadDetail?.lead?.buildBudget}
          type="InputNumber"
          isleadEditing={isLeadEditing.buildBudget}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Region"
          name="regionId"
          value={leadDetail?.lead?.regionId}
          type="Select"
          options={stateOptions}
          isleadEditing={isLeadEditing.regionId}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Prelim Agreement Signed"
          name="prelimAgreement"
          value={leadDetail?.lead?.prelimAgreement}
          type="Date"
          isleadEditing={isLeadEditing.prelimAgreement}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Client Profile"
          name="clientProfile"
          value={leadDetail?.lead?.clientProfile}
          type="TextArea"
          isleadEditing={isLeadEditing.clientProfile}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Budget (H&L)"
          name="hLBudget"
          value={leadDetail?.lead?.hLBudget}
          type="InputNumber"
          isleadEditing={isLeadEditing.hLBudget}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleLeadSourceEdit}
        />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold">
          <p>People</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <LeadUpdateDetail label="Assignee" value={leadDetail.lead?.assigneeName} />
        <LeadUpdateDetail label="Created by" value={leadDetail.lead?.createdByName} />
        <LeadUpdateDetail label="Updated by" value={leadDetail.lead?.updatedByName} />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold">
          <p>Dates</p>
        </div>
        <Divider className="bg-border-color my-3" />
        <LeadUpdateDetail
          label="Created"
          value={new Date(leadDetail.lead?.createdAt).toLocaleDateString()}
        />
        <LeadUpdateDetail
          label="Updated"
          value={new Date(leadDetail.lead?.updatedAt).toLocaleDateString()}
        />
      </div>

      {drawerOpen && (
        <LeadSourceDetailsDrawer
          isOpen={!!drawerOpen}
          onClose={() => setDrawerOpen(null)}
          onSave={handleDataSave}
          title={
            drawerOpen === 'company'
              ? 'Company Details'
              : drawerOpen === 'conveyancer'
                ? 'Conveyancer / Solicitor'
                : drawerOpen === 'mortgage_broker'
                  ? 'Mortgage Broker'
                  : drawerOpen === 'financer'
                    ? 'Bank / Financer'
                    : ''
          }
          isABNACNShow={drawerOpen === 'company'}
          isEditing={!!editingContact}
          initialValue={editingContact}
        />
      )}
    </div>
  );
};
