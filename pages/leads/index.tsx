import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { createLeadThunk, getLeadThunk } from "@redux/feature/lead/leadThunk";
import { message, Tag, Typography } from "antd";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { LeadSource, Status } from "@lib/constants/enum";
import {
  emailRules,
  leadSourceRules,
  nameRules,
  phoneRules,
} from "@lib/constants/formInputValidations";
import { useRouter } from "next/navigation";
import { ILead } from "@redux/feature/lead/ILeadState";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { timeAgo } from "@lib/utils/timeAgo";

const Leads = () => {
  const { leads, status } = useAppSelector((state) => state.lead);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (status === Status.IDLE) {
        await dispatch(getLeadThunk()).unwrap();
      }
    }
    fetchData();
  }, [dispatch, status]);

  const handleSubmit = async (values: any) => {
    try {
      await dispatch(createLeadThunk(values)).unwrap();
      message.success("Lead created successfully");
      setOpenLeadCreateModal(false);
    } catch (error) {
      message.error("Failed to create lead");
    }
  };
  const handleOpenModal = () => {
    setOpenLeadCreateModal(true);
  };
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Typography.Title
          level={4}
          style={{ margin: 0, color: "var(--font-color)" }}
        >
          Leads
        </Typography.Title>
        <button
          className="btn large bg-[var(--primary)] cursor-pointer text-white"
          onClick={handleOpenModal}
        >
          Create Lead
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {leads.map((lead: ILead) => (
          <div
            key={lead.lead_id}
            onClick={() =>
              lead.status === "IN_PROGRESS"
                ? router.push(`/leads/${lead.lead_id}?type=opportunity`)
                : router.push(`/leads/${lead.lead_id}`)
            }
            className="bg-card-color shadow-lg rounded-lg p-10 border border-border-color hover:shadow-xl transition 
                        hover:bg-font-color-600 hover:font-bold"
          >
            <h3 className="text-lg text-font-color mb-2 flex">{lead.name}</h3>
            <p className="text-sm text-font-color-100 flex">
              <IconPhone size={17} className="mr-4" />
              {lead.phone}
            </p>
            <p className="text-sm text-font-color-100 flex mb-1">
              <IconMail size={17} className="mr-4" />
              {lead.email}
            </p>
            <p className="text-sm text-font-color-100">
              source: {lead.lead_source}
            </p>
            <section className="flex justify-between items-end">
              <Tag color="purple" className="mt-3">
                {lead.status}
              </Tag>
              <p className="text-xs text-font-color-100 mt-2">
                Created: {timeAgo(lead.created_at)}
              </p>
              <p className="text-xs text-font-color-100 mt-2">
                Updated: {timeAgo(lead.updated_at)}
              </p>
            </section>
          </div>
        ))}
      </div>
      <CreateFormModal
        title="Create Lead"
        open={openLeadCreateModal}
        onCancel={() => setOpenLeadCreateModal(false)}
        onSubmit={handleSubmit}
        fields={[
          {
            label: "Full Name",
            name: "name",
            placeholder: "John Doe",
            rules: nameRules,
          },
          {
            label: "Email",
            name: "email",
            placeholder: "john@example.com",
            type: "email",
            rules: emailRules,
          },
          {
            label: "Phone",
            name: "phone",
            placeholder: "+1 555 0100",
            type: "phone",
            rules: phoneRules,
          },
          {
            label: "Lead Source",
            name: "leadSource",
            placeholder: "e.g. Social Media, Referral, etc.",
            type: "select",
            options: LeadSource,
            rules: leadSourceRules,
          },
        ]}
      />
    </div>
  );
};

export default Leads;
