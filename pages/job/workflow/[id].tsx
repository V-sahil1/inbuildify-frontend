"use client";
import React, { useEffect, useState } from "react";
import { message, Steps, Table, Typography } from "antd";
import StageProgress from "@/components/common/StageProgress";
import { jobWorkflowChecklistFields } from "@/components/formFields/jobWorkflowChecklistFields";
import TimelineActionsBar,{FilterOption} from "@/components/common/TimeLineComponents/TimelineActionsBar";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import {
  fetchWorkflowProcess,
  fetchWorkflowProcessTasksForJob,
} from "@redux/feature/workflow/workflowThunk";
import router from "next/router";
import { JobWorkFlowChecklist } from "data/types";
import Loading from "@/components/common/Loading";
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
  const { id } = router.query as { id: string };
  const [activeStep, setActiveStep] = useState(0);
  const [activeTab, setActiveTab] = useState("Own");
  const [finishedSteps, setFinishedSteps] = useState<number[]>([]);
  const [workflowProcessTasks, setWorkflowProcessTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { workflowProcess, status } = useAppSelector((state) => state.workflow);
  const dispatch = useAppDispatch();
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleUpdateRow = (updatedRecord: JobWorkFlowChecklist) => {
    setWorkflowProcessTasks((prev) =>
      prev.map((r) =>
        r.actionId === updatedRecord.actionId ? updatedRecord : r
      )
    );
  };

  const handleDeleteRow = (deleteRecord: JobWorkFlowChecklist) => {
    setWorkflowProcessTasks((prev) =>
      prev.filter((r) => r.actionId !== deleteRecord.actionId)
    );
  };
  const fetchWorkflow = async () => {
    try {
      await dispatch(fetchWorkflowProcess());
    } catch (error) {
      message.error(error);
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) fetchWorkflow();
  }, [status]);
  const handleStepClick = (index: number) => {
    setActiveStep(index);

    if (index > Math.max(-1, ...finishedSteps)) {
      const newFinished = Array.from({ length: index + 1 }, (_, i) => i);
      setFinishedSteps(newFinished);
    } else {
      if (!finishedSteps.includes(index)) {
        setFinishedSteps([...finishedSteps, index]);
      }
    }
  };

  const currentStepTitle = workflowProcess[activeStep]?.name;
  const currentStepId = workflowProcess[activeStep]?.workflowProcessId;
  const fetchWorkflowProcessTasks = async () => {
    setLoading(true);
    try {
      const response = await dispatch(
        fetchWorkflowProcessTasksForJob({
          leadId: id,
          workflowProcessId: currentStepId,
        })
      ).unwrap();
      setWorkflowProcessTasks(response);
    } catch (error) {
      message.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (currentStepId) fetchWorkflowProcessTasks();
  }, [currentStepId]);

  const tabs: FilterOption[] = [
    { type: "Own", label: "Own", count: 5 },
    { type: "All", label: "All", count: 12 },
  ];

  return (
    <div className="bg-body-color p-6">
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
        <div className="flex w-[78%] justify-between items-center">
          <div className="p-3">
            <h6 className="text-secondary">Murthy</h6>
            <p>Lot 300 Tallis Road, VIC, 3030</p>
          </div>
          <div className="flex items-center">
            <TimelineActionsBar
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              isActionShow={false}
              isCountShow={true}
            />
          </div>
        </div>
      </div>

        <div className="m-3">
          <Steps current={activeStep} labelPlacement="vertical">
            {workflowProcess.map((step, index) => {
              const status = finishedSteps.includes(index)
                ? "finish"
                : index === activeStep
                ? "process"
                : "wait";

            return (
              <Steps.Step
                key={index}
                status={status}
                title={
                  <ClickableStep
                    title={step.name}
                    isCurrent={activeStep === index}
                    onClick={() => handleStepClick(index)}
                  />
                }
              />
            );
          })}
        </Steps>
      </div>

      <div>
        <Typography.Title className="!text-lg m-10">
          {currentStepTitle}
        </Typography.Title>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-[200px]">
              <Loading type="primary" />
            </div>
          ) : (
          <Table
            dataSource={workflowProcessTasks}
            columns={jobWorkflowChecklistFields(handleUpdateRow,handleDeleteRow)}
            pagination={{ pageSize: 10 }}
            rowKey="actionId"
          />
          )}
        </div>
      </div>
    </div>
  );
};

export default index;
