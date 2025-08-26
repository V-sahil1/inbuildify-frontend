import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import {  createLeadThunk, getLeadByIdThunk, getLeadThunk } from "@redux/feature/lead/leadThunk";
import { message, Typography } from "antd";
import { DetailModal } from "@/components/common/DetailModal";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { LeadSource } from "@lib/constants/enum";
import { emailRules, leadSourceRules, nameRules, phoneRules } from "@lib/constants/formInputValidations";
import { useRouter } from "next/navigation";

const Leads = () => {
    const { leads } = useAppSelector((state) => state.lead);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [openLeadModal, setOpenLeadModal] = useState(false);
    const [loadingLead, setLoadingLead] = useState(false);
    const [selectedLead, setSelectedLead] = useState<any>(null);
    const [openLeadCreateModal, setOpenLeadCreateModal] = useState(false);

    useEffect(() => {
        async function fetchData() {
          await dispatch(getLeadThunk()).unwrap();
        }
        fetchData();
    }, [dispatch]);

    const handleSubmit = async (values: any) => {
        try {
            setLoadingLead(true);
            await dispatch(createLeadThunk(values)).unwrap();
            message.success("Lead created successfully");
            setOpenLeadModal(false);
            setOpenLeadCreateModal(false);
        } catch (error) {
            message.error("Failed to create lead");
        } finally {
            setLoadingLead(false);
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
    // const handleLeadClickModel = async (leadId: string) => {
    //     const response = await dispatch(getLeadByIdThunk(leadId)).unwrap();
    //     setOpenLeadModal(true);
    //     setSelectedLead(response);
    // };
    return (
        <div className="p-4">
            <div className="flex items-center justify-between mb-4">
                <Typography.Title level={4} style={{ margin: 0, color: "var(--font-color)" }}>
                    Leads
                </Typography.Title>
                <button className="btn large bg-[#4c3575] cursor-pointer text-white" onClick={handleOpenModal}>
                    Create Lead
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {leads.map((lead) => (
                    <div
                        key={lead.lead_id}
                        onClick={() => router.push(`/leads/${lead.lead_id}`)}
                        className="bg-card-color shadow-lg rounded-lg p-10 border border-border-color hover:shadow-xl transition"
                    >
                        <h3 className="text-lg font-bold text-font-color">{lead.name}</h3>
                        <p className="text-sm text-font-color-100">phone: {lead.phone}</p>
                        <p className="text-sm text-font-color-100">email: {lead.email}</p>
                        <p className="text-sm text-font-color-100">source: {lead.lead_source}</p>
                        <p className="text-xs text-font-color-100 mt-2">
                            Created: {formatDate(lead.created_at)}
                        </p>
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

            {/* <DetailModal
                title="Lead Details"
                open={openLeadModal}
                loading={loadingLead}
                onCancel={() => setOpenLeadModal(false)}
                data={selectedLead}
                fields={[
                    { label: "Full Name", key: "name" },
                    { label: "Email", key: "email", isLink: "email" },
                    { label: "Phone", key: "phone", isLink: "phone" },
                    { label: "Source", key: "lead_source" },
                    { label: "Created At", key: "created_at" },
                ]}
            /> */}
        </div>
    );

};

export default Leads;
