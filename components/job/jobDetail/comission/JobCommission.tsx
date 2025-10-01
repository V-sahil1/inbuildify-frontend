"use client";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Divider, Drawer } from "antd";
import { useState } from "react";
import { Input } from "antd";
const {TextArea} = Input;

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

export const JobCommission = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "1",
      type: "",
      name: "",
      stages: [
        { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 2000 },
        { name: "Base Stage", total: 5000, toBePaid: 5000, paid: 0 },
        { name: "Lockup Stage", total: 5000, toBePaid: 5000, paid: 0 },
      ],
    },
    {
      id: "2",
      type: "Sales Person",
      name: "Murthy Muthuswamy",
      stages: [
        { name: "5% Deposit", total: 5000, toBePaid: 5000, paid: 5000 },
        { name: "Base Stage", total: 5000, toBePaid: 5000, paid: 2000 },
        { name: "Lockup", total: 10000, toBePaid: 10000, paid: 0 },
      ],
    },
  ]);
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
    const parsedValue = Number(newValue); // ensure numeric

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
  const totalCommission = partners.reduce(
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
      <button className="flex items-center gap-2 items-end w-full justify-end">
        <IconEdit />
        Modify
      </button>
      <h1 className="text-lg font-bold mb-4">Commission</h1>

      {/* Table header */}
      <div className="grid grid-cols-4 font-bold border-b pb-2">
        <div>Description</div>
        <div>Total ($)</div>
        <div>To be paid ($)</div>
        <div>Paid ($)</div>
      </div>

      {/* Partners */}
      {partners.map((partner) => (
        <div key={partner.id} className="border-b py-2">
          <div className="font-semibold flex flex-col">
            <div>
              {partner.type.trim().length > 0
                ? partner.type
                : "Referral Partner"}
              :{" "}
            </div>
            <div className="flex items-center">
              {partner.type.trim().length > 0 ? (
                <span className="flex items-center gap-2 cursor-pointer">
                  {partner.name} <IconTrash size={20} />{" "}
                </span>
              ) : (
                <div className="cursor-pointer flex ">
                  <IconPlus size={20} />
                  <p>Referral Partner</p>
                </div>
              )}
            </div>
          </div>
          {partner.stages.map((stage, idx) => (
            <div
              key={idx}
              className="grid grid-cols-4 items-center py-1 text-sm"
            >
              <div>📌 {stage.name}</div>
              <div className="cursor-pointer text-blue-600 hover:underline">
                {stage.total.toLocaleString()}
              </div>
              <div className="cursor-pointer text-blue-600 hover:underline">
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
        </div>
      ))}

      {/* Totals */}
      <div className="bg-yellow-100 grid grid-cols-4 font-bold p-2 mt-2">
        <div>Total Commission</div>
        <div>${totalCommission.total.toLocaleString()}</div>
        <div></div>
        <div>${totalCommission.paid.toLocaleString()}</div>
      </div>

      <div className="text-right text-red-600 font-semibold mt-2">
        Remaining To Be Paid: ${remaining.toLocaleString()}
      </div>

      {!openNotes ? (
        <div
          className="flex items-center gap-2 cursor-pointer mt-2"
          onClick={() => setOpenNotes(true)}
        >
          <IconPlus size={20} />
          <span>Add Notes</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2  items-end cursor-pointer mt-2" onClick={() => setOpenNotes(false)}>
          <IconTrash size={20} />
         <TextArea rows={4} />
        </div>
      )}
      <Drawer open={openNotes} width="60%" onClose={() => setOpenNotes(false)}>
        <TextArea rows={4} />
      </Drawer>

      {/* CreFormModal for editing */}
      {isModalOpen && editData && (
        <CreateFormModal
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          title={`${editData.field}`}
          isEditing={true}
          initialValues={{ value: editData.value }}
          fields={[
            {
              name: "value",
              label: editData.field,
              type: "number",
              placeholder: `Enter ${editData.field}`,
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
