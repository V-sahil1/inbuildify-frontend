"use client";

import React from "react";
import { Tag } from "antd";

type Step = {
  key: string;
  label: string;
  color: string;
  textColor?: string;
  onClick?: (key: string) => void;
};

type StageProgressProps = {
  id: string;
  title: string;
  status: string;
  steps: Step[];
  activeStep?: string;
};

const StageProgress: React.FC<StageProgressProps> = ({
  id,
  title,
  status,
  steps,
  activeStep,
}) => {
  return (
    <div className="flex flex-col gap-2">
      {/* Info */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{title} -</span>
        <a href="#" className="text-blue-500 hover:underline">
          {id}
        </a>
        <Tag color="cyan" className="rounded-md">
          {status}
        </Tag>
      </div>

      {/* Step Progress */}
      <div className="flex w-full">
        {steps.map((step, index) => {
          const isActive = activeStep === step.key;
          const isLast = index === steps.length - 1;

          return (
            <div
              key={step.key}
              onClick={() => step.onClick?.(step.key)}
              className={`
                flex-1 text-center py-2 cursor-pointer select-none
                ${step.color}
                ${isActive && step.textColor ? step.textColor : "text-gray-700"}
                transition-colors
                ${index > 0 ? "-ml-3" : ""}
                relative
              `}
              style={{
                zIndex: steps.length - index,
                clipPath: !isLast
                  ? "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)"
                  : "none",
              }}
            >
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StageProgress;
