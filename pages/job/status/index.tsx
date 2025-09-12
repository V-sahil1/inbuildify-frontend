"use client";
import React, { useState } from "react";
import { Steps, Table, Typography } from "antd";
import StageProgress from "@/components/common/StageProgress";
import { jobWorkflowChecklistFields } from "@/components/formFields/jobWorkflowChecklistFields";
import { WorkStepsChecklist } from "data/sampleData";
import TimelineActionsBar from "@/components/common/TimeLineComponents/TimelineActionsBar";

const ClickableStep = ({ title, isCurrent, onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        cursor: "pointer",
        fontWeight: isCurrent ? "bold" : "normal",
      }}
    >
      <h3>{title}</h3>
    </div>
  );
};
const index = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("Own");
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const currentStepTitle = WorkStepsChecklist[activeStep]?.title;
  const currentStepChecklist = WorkStepsChecklist[activeStep]?.checklist || [];
  return (
    <div className="bg-body-color p-6">
      <div>
        <div className="flex gap-4">
          <div className="m-3">
            <StageProgress
              id="MY12F48"
              title="Job Status"
              steps={[]}
              status="In Progress"
              idClassName="text-[#]"
            />
          </div>
          <div className="flex w-[78%] justify-between">
            <div className="p-3">
              <h6 className="text-secondary">Murthy</h6>
              <p>Lot 300 Tallis Road, VIC , 3030</p>
            </div>
            <div className="flex align-middle">
              <TimelineActionsBar
                tabs={["Own", "test 2", "test 3"]}
                activeTab={activeTab}
                onTabChange={handleTabChange}
                actionItems={null}
                isActionShow={false}
              />
            </div>
          </div>
        </div>

        <div className="m-3">
          <Steps current={activeStep} labelPlacement="vertical">
            {WorkStepsChecklist.map((step, index) => (
              <Steps.Step
                key={index}
                title={
                  <ClickableStep
                    title={step.title}
                    isCurrent={activeStep === index}
                    onClick={() => handleStepClick(index)}
                  />
                }
              />
            ))}
          </Steps>
        </div>
      </div>

      <div>
        <Typography.Title className="!text-lg m-10">
          {currentStepTitle}
        </Typography.Title>
        <div className="overflow-x-auto">
          <Table
            dataSource={currentStepChecklist}
            columns={jobWorkflowChecklistFields}
            pagination={{ pageSize: 10 }}
            rowKey="id"
          />
        </div>
      </div>
    </div>
  );
};

export default index;
