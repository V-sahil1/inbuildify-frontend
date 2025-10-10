"use client";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { IconEdit, IconPlus, IconTrash, IconPinned } from "@tabler/icons-react";
import { Divider, Input } from "antd";
import { useState } from "react";
import { CommissionDrawer } from "./commissionDrawer";

const { TextArea } = Input;

interface Stage {
  name: string;
  total: number;
  toBePaid: number;
  paid: number;
}

interface Partner {
  id: string;
  type: "Referral Partner" | "Sales Person" | "";
  name: string;
  stages: Stage[];
}
const initialPartners: Partner[] = [
  {
    id: "1", type: "Sales Person", name: "Murthy Muthuswamy", stages: [
      { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 5000 },
      { name: "Base Stage", total: 5000, toBePaid: 3000, paid: 2000 },
      { name: "Lockup", total: 10000, toBePaid: 10000, paid: 0 },
    ]
  },
  {
    id: "2", type: "Referral Partner", name: "Referral Partner", stages: [
      { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 2000 },
      { name: "Base Stage", total: 5000, toBePaid: 5000, paid: 0 },
      { name: "Lockup Stage", total: 5000, toBePaid: 5000, paid: 0 },
    ]
  },
];

export const JobCommission = () => {
  const [partners, setPartners] = useState<Partner[]>(initialPartners);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [disabledPartners, setDisabledPartners] = useState<string[]>([]);

  const [openNotes, setOpenNotes] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    partnerId: string;
    stageIdx: number;
    field: keyof Stage;
    value: number;
  } | null>(null);

  const openModal = (
    partnerId: string,
    stageIdx: number,
    field: keyof Stage,
    value: number
  ) => {
    setEditData({ partnerId, stageIdx, field, value });
    setIsModalOpen(true);
  };

  const handleSave = (newValue: number | string) => {
    if (!editData) return;
    const { partnerId, stageIdx, field } = editData;
    const parsedValue = Number(newValue);

    setPartners((prev) =>
      prev.map((p) =>
        p.id === partnerId
          ? {
            ...p,
            stages: p.stages.map((s, i) => {
              if (i !== stageIdx) return s;
              if (field === "paid") {
                const updatedPaid = parsedValue;
                const updatedToBePaid = Math.max(s.total - updatedPaid, 0);
                return { ...s, paid: updatedPaid, toBePaid: updatedToBePaid };
              }
              return { ...s, [field]: parsedValue };
            }),
          }
          : p
      )
    );

    setIsModalOpen(false);
    setEditData(null);
  };

  const enabledPartners = partners.filter(p => !disabledPartners.includes(p.id));

  const totalCommission = enabledPartners.reduce(
    (acc, p) => {
      acc.total += p.stages.reduce((sum, s) => sum + Number(s.total), 0);
      acc.paid += p.stages.reduce((sum, s) => sum + Number(s.paid), 0);
      return acc;
    },
    { total: 0, paid: 0 }
  );

  const remaining = totalCommission.total - totalCommission.paid;
  return (
    <div className="border rounded-lg p-4 bg-white shadow-md">
      <button className="flex gap-2 items-end w-full justify-end" onClick={() => setOpenDrawer(true)}>
        <IconEdit />
        Modify
      </button>
      <h1 className="text-lg font-bold mb-4">Commission</h1>

      <div className="grid grid-cols-4 font-bold text-gray-600 border-b pb-2 mb-2">
        <div>Description</div>
        <div>Total ($)</div>
        <div>To be paid ($)</div>
        <div>Paid ($)</div>
      </div>

      {enabledPartners.map((partner) => {

        const isUnnamedPartner = partner.type === "Referral Partner" && partner.name === "Referral Partner";

        return (
          <div key={partner.id} className="mb-4">

            <div className="text-sm font-semibold mb-1">
              {partner.type}:
              <div className="flex items-center mt-1">
                {isUnnamedPartner ? (
                  <div className="cursor-pointer flex items-center text-blue-600 hover:text-blue-800">
                    <IconPlus size={16} className="mr-1" />
                    <span>Referral Partner</span>
                  </div>
                ) : (
                  <span className="flex items-center gap-2 cursor-pointer">
                    {partner.name}
                    <IconTrash size={18} className="text-gray-400 hover:text-red-500" />
                  </span>
                )}
              </div>
            </div>

            {partner.stages.map((stage, idx) => (
              <div
                key={idx}
                className="grid grid-cols-4 items-center py-1 text-sm text-gray-800"
              >
                <div className="flex items-center pl-4">
                  <IconPinned size={14} className="mr-2" />
                  {stage.name}
                </div>

                <div>
                  {stage.total.toLocaleString()}
                </div>

                <div>
                  {stage.toBePaid.toLocaleString()}
                </div>

                <div
                  className="cursor-pointer text-blue-600 hover:underline"
                  onClick={() => openModal(partner.id, idx, "paid", stage.paid)}
                >
                  {stage.paid.toLocaleString()}
                </div>
              </div>
            ))}
            <Divider/>
          </div>
        )
      })}

      <div className="bg-yellow-100 grid grid-cols-4 font-bold p-2 mt-2">
        <div>Total Commission</div>
        <div>{totalCommission.total.toLocaleString()}</div>
        <div>{remaining.toLocaleString()}</div>
        <div>{totalCommission.paid.toLocaleString()}</div>
      </div>

      <div className="text-right text-red-600 font-semibold mt-2">
        Remaining To Be Paid: ${remaining.toLocaleString()}
      </div>

      {!openNotes ? (
        <div
          className="flex items-center gap-2 cursor-pointer mt-2 text-gray-600 hover:text-blue-600"
          onClick={() => setOpenNotes(true)}
        >
          <IconPlus size={20} />
          <span>Add Notes</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-end">
            <button
              className="text-red-500 hover:text-red-700"
              onClick={() => setOpenNotes(false)}
            >
              <IconTrash size={20} />
            </button>
          </div>
          <TextArea rows={4} placeholder="Enter commission notes here..." />
        </div>
      )}

      <CommissionDrawer
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
        partners={partners}
        setPartners={setPartners}
        disabledPartners={disabledPartners}
        setDisabledPartners={setDisabledPartners}
      />

      {isModalOpen && editData && (
        <CreateFormModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          title={`Edit Paid Amount`}
          isEditing={true}
          initialValues={{ value: editData.value }}
          fields={[
            {
              name: "value",
              label: "Paid Amount",
              type: "number",
              placeholder: `Enter paid amount`,
              rules: [{ required: true, message: "Value is required" }],
            },
          ]}
          onSubmit={(values: { value: number }) => handleSave(values.value)}
          submitButtonText="Save"
        />
      )}
    </div>
  );
};