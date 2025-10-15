"use client";
import { Divider, message } from "antd";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {
  getLeadSourcesThunk,
  updateLeadThunk,
} from "@redux/feature/lead/leadThunk";
import { Status } from "@lib/constants/enum";
import { RootState } from "@redux/feature/store";
import LeadUpdateDetail from "../leadDetail/LeadUpdateDetail";
import EditableField from "./EditableField";
import {
  notesRules,
  leadSourceRules,
} from "@lib/constants/formInputValidations";
import { mapToOptions } from "@lib/utils/rangeAndDwellingObjToOptions";
import { IconCirclePlus } from "@tabler/icons-react";
import HouseLandPopover from "../common/HLPopover";
import LeadSourceDetailsDrawer from "../common/LeadSourceDetailDrawer";
import { ClientTypeOptions, PurposeOptions, RatingOptions, RegionOptions, YesNoOptions } from "data/options";

export const LeadSource = () => {
  const dispatch = useAppDispatch();
  const { leadDetail, leadSources } = useAppSelector(
    (state: RootState) => state.lead
  );
  const updateLeadStatusState = useAppSelector(
    (state: RootState) => state.lead.status.updateLeadSource
  );

  const [isLeadEditing, setIsLeadEditing] = useState({
    leadSource: false,
    notes: false,
    rating: false,
    land: false,
    finance: false,
    faceToFace: false,
    purpose: false,
    clientType: false,
    forecastClose: false,
    budgetBuild: false,
    region: false,
    agreementDate: false,
    clientProfile: false,
    budgetHL: false,
  });

  const getLeadSourceStatus = useAppSelector(
    (state: RootState) => state.lead.status.leadSources
  );

  const LeadSourceOptions = mapToOptions(leadSources);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDrawerOpenwithAbnAcn, setIsDrawerOpenwithAbnAcn] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");

  useEffect(() => {
    async function fetchLeadSource() {
      if (getLeadSourceStatus === Status.IDLE) {
        try {
          await dispatch(getLeadSourcesThunk()).unwrap();
        } catch (error) {
          message.error(error || "Failed to fetch lead sources");
        }
      }
    }
    fetchLeadSource();
  }, [getLeadSourceStatus, dispatch]);

  const handleSave = (values: any) => {
    message.success("Field saved successfully!");
    setIsLeadEditing((prev) => {
      const reset: typeof prev = {} as typeof prev;
      for (const key in prev) reset[key] = false;
      return reset;
    });
  };

  const handleLeadSourceEdit = async (values: any) => {
    try {
      await dispatch(
        updateLeadThunk({
          id: leadDetail.lead.leadId,
          details: {
            lead_source: values.leadSource,
            notes: values?.notes?.trim(),
          },
        })
      ).unwrap();
      message.success("Lead updated successfully");
      setIsLeadEditing((prev) => ({
        ...prev,
        leadSource: false,
        notes: false,
      }));
    } catch (error) {
      message.error(error || "Failed to update lead");
    }
  };

  

  const openDrawer = (title: string) => {
    setDrawerTitle(title);
    setIsDrawerOpen(true);
  };
  const openDrawerWithAbnAcn = (title: string) => {
    setDrawerTitle(title);
    setIsDrawerOpenwithAbnAcn(true);
  };
  
  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsDrawerOpenwithAbnAcn(false);
  };

  const handleDataSave = (values: any) => {
    console.log(`Saved ${drawerTitle} Details:`, values);
    message.success(`${drawerTitle} details saved!`);
    closeDrawer();
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
          name="leadSource"
          value={leadDetail.lead?.leadSource}
          rules={leadSourceRules}
          isleadEditing={isLeadEditing.leadSource}
          setIsLeadEditing={setIsLeadEditing}
          loading={updateLeadStatusState === Status.PENDING}
          options={LeadSourceOptions}
          initialValues={{ leadSource: leadDetail.lead?.leadSource || "" }}
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
          initialValues={{ notes: leadDetail.lead?.notes || "" }}
          type="TextArea"
          onSave={handleLeadSourceEdit}
        />

        <EditableField
          label="Rating"
          name="rating"
          value=""
          type="Select"
          options={RatingOptions}
          isleadEditing={isLeadEditing.rating}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Land"
          name="land"
          value=""
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.land}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Finance"
          name="finance"
          value=""
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.finance}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Face to Face"
          name="faceToFace"
          value=""
          type="Select"
          options={YesNoOptions}
          isleadEditing={isLeadEditing.faceToFace}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Purpose"
          name="purpose"
          value=""
          type="Select"
          options={PurposeOptions}
          isleadEditing={isLeadEditing.purpose}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Client Type"
          name="clientType"
          value=""
          type="Select"
          options={ClientTypeOptions}
          isleadEditing={isLeadEditing.clientType}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Forecast Close"
          name="forecastClose"
          value=""
          type="Date"
          isleadEditing={isLeadEditing.forecastClose}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md lg:mt-6 flex flex-col gap-1 text-primary">
          <HouseLandPopover>
            <button className="flex items-center gap-2 hover:text-blue-800">
              <IconCirclePlus /> House and Land Package
            </button>
          </HouseLandPopover>
          <button
            className="flex gap-2"
            onClick={() => openDrawerWithAbnAcn("Company Details")}
          >
            <IconCirclePlus /> Company Details
          </button>
          <button
            className="flex gap-2"
            onClick={() => openDrawer("Conveyancer / Solicitor")}
          >
            <IconCirclePlus /> Conveyancer / Solicitor
          </button>
          <button
            className="flex gap-2"
            onClick={() => openDrawer("Mortgage Broker")}
          >
            <IconCirclePlus /> Mortgage Broker
          </button>
          <button
            className="flex gap-2"
            onClick={() => openDrawer("Bank / Financer")}
          >
            <IconCirclePlus /> Bank / Financer
          </button>
        </div>
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold lg:mt-6">
          <p>Custom Fields</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <EditableField
          label="Budget (Build)"
          name="budgetBuild"
          value=""
          type="InputNumber"
          isleadEditing={isLeadEditing.budgetBuild}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Region"
          name="region"
          value=""
          type="Select"
          options={RegionOptions}
          isleadEditing={isLeadEditing.region}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Prelim Agreement Signed"
          name="agreementDate"
          value=""
          type="Date"
          isleadEditing={isLeadEditing.agreementDate}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Client Profile"
          name="clientProfile"
          value=""
          type="TextArea"
          isleadEditing={isLeadEditing.clientProfile}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />

        <EditableField
          label="Budget (H&L)"
          name="budgetHL"
          value=""
          type="InputNumber"
          isleadEditing={isLeadEditing.budgetHL}
          setIsLeadEditing={setIsLeadEditing}
          onSave={handleSave}
        />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold">
          <p>People</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <LeadUpdateDetail
          label="Assignee"
          value={leadDetail.lead?.assignee?.name}
        />
        <LeadUpdateDetail
          label="Created by"
          value={leadDetail.lead?.createdBy?.name}
        />
        <LeadUpdateDetail
          label="Updated by"
          value={leadDetail.lead?.updatedBy?.name}
        />
      </div>

      <div className="flex-1 md:mt-[0px] lg:mt-7">
        <div className="text-md font-bold">
          <p>Dates</p>
        </div>
        <Divider className="bg-border-color my-3" />

        <LeadUpdateDetail
          label="Created"
          value={new Date(
            leadDetail.lead?.createdAt
          ).toLocaleDateString()}
        />
        <LeadUpdateDetail
          label="Updated"
          value={new Date(
            leadDetail.lead?.updatedAt
          ).toLocaleDateString()}
        />
      </div>

      {isDrawerOpen && (
        <LeadSourceDetailsDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          onSave={handleDataSave}
          title={drawerTitle}
        />
      )}
      {isDrawerOpenwithAbnAcn && (
        <LeadSourceDetailsDrawer
          isOpen={isDrawerOpenwithAbnAcn}
          onClose={closeDrawer}
          onSave={handleDataSave}
          title={drawerTitle}
          isABNACNShow={true}
        />
      )}
    </div>
  );
};