import React, { useState } from "react";
import {
  IconCheck,
  IconChevronDown,
  IconPencil,
  IconSettings,
} from "@tabler/icons-react";
import { Button, Dropdown, Tag } from "antd";

// Types
type StepStatus = "disabled" | "active" | "completed";

type StepAction = {
  label: string;
  type: "edit" | "approve" | "esign" | "sendInvoice" | "sendNotice" | "skip" | "upload" | "yes" | "no";
};

type Step = {
  id: number;
  title: string;
  actions: StepAction[];
  status: StepStatus;
};

const JobVariationStatusTracker = () => {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Create Variation",
      actions: [{ label: "Approve", type: "approve" }],
      status: "active",
    },
    {
      id: 2,
      title: "Approval Variation",
      actions: [{ label: "Approve", type: "approve" }],
      status: "disabled",
    },
    {
      id: 3,
      title: "Send Variation to Customer",
      actions: [
        { label: "eSign", type: "esign" },
        { label: "Send", type: "sendInvoice" },
        { label: "Skip Sending", type: "skip" },
      ],
      status: "disabled",
    },
    {
      id: 4,
      title: "Upload Signed Variation",
      actions: [
        { label: "Upload", type: "upload" },
      ],
      status: "disabled",
    },
    {
      id: 5,
      title: "Price Included in contract ?",
      actions: [
        { label: "Yes", type: "yes" },
        { label: "No", type: "no" },
      ],
      status: "disabled",
    },
    {
      id: 6,
      title: "Send Invoice to Customer",
      actions: [
        { label: "Send Invoice", type: "sendInvoice" },
      ],
      status: "disabled",
    },
    {
      id: 7,
      title: "Send Extension Notice to Customer",
      actions: [
        { label: "Send Notice", type: "sendNotice" },
      ],
      status: "disabled",
    },
  ]);

  const handleAction = (stepId: number, actionType: StepAction["type"]) => {
    setSteps((prev) => {
      const updated = [...prev];
      const currentStepIndex = updated.findIndex((s) => s.id === stepId);
      if (currentStepIndex === -1) return prev;

      const currentStep = updated[currentStepIndex];

      // Log the action being handled
      console.log(`Action handled: ${actionType} on step ${stepId}`);

      switch (currentStep.id) {
        case 1:
          if (actionType === "approve") {
            currentStep.status = "completed";
            currentStep.actions = [{ label: "Edit Variation", type: "edit" }];
            if (updated[currentStepIndex + 1]) updated[currentStepIndex + 1].status = "active";
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, newStatus: "completed", nextStep: updated[currentStepIndex + 1].title });
          } else if (actionType === "edit") {
            console.log("Payload:", { step: currentStep.title, action: "edit" });
          }
          break;

        case 2:
          if (actionType === "approve") {
            currentStep.status = "completed";
            currentStep.actions = [];
            if (updated[currentStepIndex + 1]) updated[currentStepIndex + 1].status = "active";
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, newStatus: "completed", nextStep: updated[currentStepIndex + 1].title });
          }
          break;

        case 3:
          if (actionType === "esign" || actionType === "sendInvoice" || actionType === "skip") {
            currentStep.status = "completed";
            currentStep.actions = [];
            if (updated[currentStepIndex + 1]) updated[currentStepIndex + 1].status = "active";
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, action: actionType, newStatus: "completed", nextStep: updated[currentStepIndex + 1].title });
          }
          break;

        case 4:
          if (actionType === "upload") {
            currentStep.status = "completed";
            currentStep.actions = [];
            if (updated[currentStepIndex + 1]) updated[currentStepIndex + 1].status = "active";
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, newStatus: "completed", nextStep: updated[currentStepIndex + 1].title });
          }
          break;

        case 5:
          currentStep.status = "completed";
          currentStep.actions = [];
          if (actionType === "yes") {
            const step6Index = updated.findIndex((s) => s.id === 6);
            if (step6Index !== -1) {
              updated[step6Index].status = "active";
              // Businedd Logic for api call
              console.log("Payload:", { step: currentStep.title, action: "yes", nextStep: updated[step6Index].title });
            }
          } else if (actionType === "no") {
            const step7Index = updated.findIndex((s) => s.id === 7);
            if (step7Index !== -1) {
              updated[step7Index].status = "active";
              // Businedd Logic for api call
              console.log("Payload:", { step: currentStep.title, action: "no", nextStep: updated[step7Index].title });
            }
          }
          break;

        case 6:
          if (actionType === "sendInvoice") {
            currentStep.status = "completed";
            currentStep.actions = [];
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, newStatus: "completed" });
          }
          break;

        case 7:
          if (actionType === "sendNotice") {
            currentStep.status = "completed";
            currentStep.actions = [];
            // Businedd Logic for api call
            console.log("Payload:", { step: currentStep.title, newStatus: "completed" });
          }
          break;

        default:
          break;
      }

      return updated;
    });
  };

  return (
    <div className="p-3 bg-card-color">
      <div className="flex justify-between border-b-2 p-3 ">
        <div className="flex gap-2">Variation Name<IconPencil size={20} /></div>
        <div className="flex gap-2">
          <Button type="primary" className="text-sm">Create Another Variation</Button>
          <Dropdown menu={{ items: [] }}><Button className="text-sm">More Activities<IconChevronDown /></Button></Dropdown>
          <Button className="pt-1" icon={<IconSettings />}></Button>
        </div>
      </div>

      <div className="mt-20 space-y-2">
        <div className="flex justify-between">
          <div className="text-xs font-bold">STATUS</div>
          <div className="text-xs font-bold">AMOUNT</div>
        </div>
        <div className="flex justify-between">
          <div> <Tag color='green'>Approved</Tag></div>
          <div className="text-lg font-extrabold flex">$ 15000</div>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-10 flex flex-col gap-[20px] relative">
        {/* The single vertical line for the entire timeline */}
        <div className="absolute left-9 top-10 bottom-10 w-0.5 bg-gray-200"></div>
        {steps.map((step, index) => (
          <div className={`z-[2] bg-body-color relative rounded-xl border ${step.status === "active" ? "shadow-lg" : "shadow-sm"}`} key={step.id}>
            <div className={`flex items-center justify-between  px-3 py-1 w-full h-16 ${step.status === "disabled" ? "opacity-50 pointer-events-none" : ""}`}>
              {/* Left - Number */}
              {step.status === "completed" ? (
                <div className="px-2 py-2 ml-1 font-semibold bg-green-500 text-font-color text-center rounded-full">
                  <IconCheck />
                </div>
              ) : (
                <div className="px-4 py-2 ml-1 font-semibold text-gray-700 border text-center rounded-full">
                  {index + 1}
                </div>
              )}

              {/* Center - Content */}
              <div className="flex-1 px-4 text-gray-800">{step.title}</div>

              {/* Right - Buttons */}
              <div className="flex gap-2">
                {(step.status === "active" || step.status === "completed") &&
                  step.actions.map((action) => (
                    <Button
                      key={action.type}
                      size="small"
                      type={
                        action.type === "approve" || action.type === "yes" || action.type === "upload" || action.type === "sendInvoice"
                          ? "primary"
                          : "default"
                      }
                      danger={action.type === "skip" || action.type === "no"}
                      onClick={() => handleAction(step.id, action.type)}
                    >
                      {action.label}
                    </Button>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobVariationStatusTracker;