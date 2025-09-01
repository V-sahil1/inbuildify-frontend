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
import { enumToReadable } from "@lib/utils/enumToRedable";
const Leads = () => {
  const { leads, status } = useAppSelector((state) => state.lead);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      await dispatch(createLeadThunk(values)).unwrap();
      message.success("Lead created successfully");
      setOpenLeadCreateModal(false);
    } catch (error) {
      message.error(error || "Failed to create lead");
    }
    finally {
      setLoading(false);
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
            (lead.status === "IN_PROGRESS" || lead.status === "COMPLETED")
              ? router.push(`/leads/${lead.lead_id}?type=opportunity`)
              : router.push(`/leads/${lead.lead_id}`)
          }
          className=" rounded-2xl border border-gray-200 shadow-sm p-6 cursor-pointer 
                     transition-all duration-200 hover:shadow-xl hover:scale-[1.02]"
        >
          {/* Header with Tag on Top Right */}
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold">{lead.name}</h3>
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                lead.status === "IN_PROGRESS"
                  ? "bg-purple-100 text-purple-700"
                  : lead.status === "COMPLETED"
                  ? "bg-green-100 text-green-700"
                  : lead.status === "JOB"
                  ? "bg-fuchsia-300 text-fuchsia-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {enumToReadable(lead.status)}
            </span>
          </div>
        
          {/* Contact Info */}
          <div className="space-y-2 mb-4">
            <p className="flex items-center text-sm ">
              <IconPhone size={16} className="mr-2 text-gray-400" />
              {lead.phone}
            </p>
            <p className="flex items-center text-sm ">
              <IconMail size={16} className="mr-2 text-gray-400" />
              {lead.email}
            </p>
            <p className="text-xs ">Source: {lead.lead_source}</p>
          </div>
        
          {/* Footer with dates */}
          <div className="flex border-t border-gray-100 pt-3 gap-4 text-xs text-gray-400">
            <p
              className="flex-1 truncate"
              title={`Created: ${timeAgo(lead.created_at)}`}
            >
              Created: {timeAgo(lead.created_at)}
            </p>
            <p
              className="flex-1 truncate"
              title={`Updated: ${timeAgo(lead.updated_at)}`}
            >
              Updated: {timeAgo(lead.updated_at)}
            </p>
          </div>
        </div>
        

        ))}
      </div>
      <CreateFormModal
        title="Lead"
        open={openLeadCreateModal}
        loading={loading}
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
