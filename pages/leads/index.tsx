import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { createLeadThunk, getLeadThunk } from "@redux/feature/lead/leadThunk";
import { message, Typography, Empty, Spin } from "antd";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { Status } from "@lib/constants/enum";
import { useRouter } from "next/navigation";
import { ILead } from "@redux/feature/lead/ILeadState";
import { IconMail, IconPhone } from "@tabler/icons-react";
import { timeAgo } from "@lib/utils/timeAgo";
import { enumToReadable } from "@lib/utils/enumToRedable";
import leadCreateFields from "@/components/formFields/LeadCreateFields";
import SystemRoutes from "@lib/constants/Routes";
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
      const payload = {
        lead_source: values.leadSource,
        notes: values.notes,
        contact: {
          name: values.name,
          ...(values.email && { email: values.email }),
          ...(values.phone && { phone: values.phone }),
        },
      };
      await dispatch(createLeadThunk(payload)).unwrap();
      message.success("Lead created successfully");
      setOpenLeadCreateModal(false);
    } catch (error) {
      message.error(error || "Failed to create lead");
    } finally {
      setLoading(false);
    }
  };
  const handleOpenModal = () => {
    setOpenLeadCreateModal(true);
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
      {status === Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : leads.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {leads.map((lead: ILead) => (
            <div
              key={lead.leadId}
              onClick={() => {
                if (lead.status === "CANCELLED") return;
                lead.status === "IN_PROGRESS" || lead.status === "COMPLETED"
                  ? router.push(
                      `${SystemRoutes.LEADS}/${lead.leadId}?type=opportunity`
                    )
                  : lead.status === "JOB"
                  ? router.push(SystemRoutes.JOB)
                  : router.push(`${SystemRoutes.LEADS}/${lead.leadId}`);
              }}
              className={`rounded-2xl border flex flex-col border-border-color shadow-sm p-6 ${
                lead.status === "CANCELLED"
                  ? "opacity-60 cursor-not-allowed"
                  : "cursor-pointer hover:shadow-xl hover:scale-[1.02]"
              } 
                transition-all duration-200 bg-card-color`}
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
              <div className="space-y-2 mb-4 flex-1">
                {lead.address1 ||
                  (lead.address2 && (
                    <p className="flex items-center text-sm ">
                      <IconPhone size={16} className="mr-2 text-gray-400" />
                      {lead?.address1 + ", " + lead?.address2}
                    </p>
                  ))}
                {lead.phone && (
                  <p className="flex items-center text-sm ">
                    <IconPhone size={16} className="mr-2 text-gray-400" />
                    {lead.phone}
                  </p>
                )}
                {lead.email && (
                  <p className="flex items-center text-sm ">
                    <IconMail size={16} className="mr-2 text-gray-400" />
                    {lead.email}
                  </p>
                )}
                <p className="text-xs ">Source: {lead.leadSource}</p>
              </div>

              {/* Footer with dates */}
              <div className="flex border-t border-gray-100 pt-3 gap-4 text-xs text-gray-400">
                <p
                  className="flex-1 truncate"
                  title={`Created: ${timeAgo(lead.createdAt)}`}
                >
                  Created: {timeAgo(lead.createdAt)}
                </p>
                <p
                  className="flex-1 truncate"
                  title={`Updated: ${timeAgo(lead.updatedAt)}`}
                >
                  Updated: {timeAgo(lead.updatedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">
              No Leads found. Create your first Lead to get started.
            </span>
          }
          className="pt-100"
        />
      )}

      <CreateFormModal
        title="Lead"
        open={openLeadCreateModal}
        loading={loading}
        onCancel={() => setOpenLeadCreateModal(false)}
        onSubmit={handleSubmit}
        fields={leadCreateFields({ isEmailDisable: false })}
      />
    </div>
  );
};

export default Leads;
