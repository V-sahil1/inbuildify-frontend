"use client";
import React, { useState, useRef } from 'react';
import { Steps, Table, Tag, Typography, Dropdown } from 'antd';
import StageProgress from '@/components/common/StageProgress';
import { jobWorkflowTaskFields } from 'components/formFields/jobWorkflowTaskFields';
import { conceptTasks } from 'data/sampleData';

const index = () => {
  const [activeStep] = useState(1);  

  const WorkSteps = [
    { title: 'Deposite' },
    { title: 'Concept' },
    { title: 'Colour Selection' },
    { title: 'Contract Drawing' },
    { title: 'Approval & Contract' },
    { title: 'Permits & Pre Construction' },
  ];

  const currentStepTitle = WorkSteps[activeStep]?.title;

  return (
    <>
    <div className="bg-body-color p-6">
      <div>
        <div className="m-3">
          <StageProgress
            id="MY12F48"
            title="Job Status"
            steps={[]}
            status="In Progress"
            idClassName="text-[#]"
          />
        </div>
        <div className="m-3">
          <Steps current={activeStep} labelPlacement="vertical" items={WorkSteps} />
        </div>
      </div>
      
      <div>
        <Typography.Title className='!text-lg m-10'>
          {currentStepTitle}
        </Typography.Title>
        <div className="overflow-x-auto">
          <Table
            dataSource={conceptTasks}
            columns={jobWorkflowTaskFields}
            pagination={{pageSize:10}}
            rowKey="id"
          />
        </div>
      </div>
    </div>
  </>
  );
};

export default index