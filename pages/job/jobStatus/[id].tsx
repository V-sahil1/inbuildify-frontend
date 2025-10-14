import React, { useState } from 'react';
import { Collapse, Button, Tag, Space, Checkbox, Tooltip, Popconfirm, message } from 'antd';
import { IconPlus, IconPaperclip, IconMessage, IconDotsVertical, IconInfoSmall } from '@tabler/icons-react';
import AssignSupervisorDropdown from '@/components/construction/assignSupervisorModal';
import StageProgress from '@/components/common/StageProgress';
import { INITIAL_STAGES_DATA, jobStatusStage, jobStatusTask } from 'data/jobStatusTaskData';
import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';
import { CreateTaskModal } from '@/components/common/Models/CreatetaskModel';

const { Panel } = Collapse;

const JobStatusTaskManager = () => {
  const [stagesData, setStagesData] = useState<jobStatusStage[]>(INITIAL_STAGES_DATA);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  const isAllTasksCompleted = (tasks: jobStatusTask[]) =>
    tasks.length > 0 && tasks.every(task => task.status === 'completed');
  const isSomeTasksCompleted = (tasks: jobStatusTask[]) =>
    tasks.some(task => task.status === 'completed') && !isAllTasksCompleted(tasks);

  const confirmHeaderChange = (stageId: string, checked: boolean) => {
    setStagesData(prev =>
      prev.map(stage =>
        stage.id === stageId
          ? { ...stage, tasks: stage.tasks.map(task => ({ ...task, status: checked ? 'completed' : 'pending' })) }
          : stage
      )
    );
    message.success(`Stage tasks marked as ${checked ? 'completed' : 'pending'}`);
  };

  const handleTaskCheckboxChange = (stageId: string, taskId: string, checked: boolean) => {
    setStagesData(prev =>
      prev.map(stage =>
        stage.id === stageId
          ? { ...stage, tasks: stage.tasks.map(task => task.id === taskId ? { ...task, status: checked ? 'completed' : 'pending' } : task) }
          : stage
      )
    );
  };

  const handleSupervisorAssign = (taskId: string, newSupervisor: string) => {
    setStagesData(prev =>
      prev.map(stage => ({
        ...stage,
        tasks: stage.tasks.map(task => task.id === taskId ? { ...task, supervisor: newSupervisor } : task)
      }))
    );
  };

  const handleOpenTaskModal = (stage: jobStatusStage) => {
    setSelectedRecord({ stageId: stage.id });
    setShowEditModal(true);
  };

  const handleAddTask = () => {
    setLoading(true);
  };

  const allTasks = stagesData.flatMap(stage => stage.tasks);
  const pendingCount = allTasks.filter(t => t.status === "pending").length;
  const completedCount = allTasks.filter(t => t.status === "completed").length;
  const notApplicableCount = allTasks.filter(t => t.status === "notapplicable").length;

  const tabs = [
    { type: "All", label: "All", count: allTasks.length },
    { type: "Pending", label: "Pending", count: pendingCount },
    { type: "Completed", label: "Completed", count: completedCount },
    { type: "Not Applicable", label: "Not Applicable", count: notApplicableCount },
  ];

  const TaskRow = ({ task, stage }: { task: jobStatusTask; stage: jobStatusStage }) => (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 px-4 sm:px-6 py-4 border-b border-gray-200 text-font-color
      ${task.status === 'completed' ? 'bg-primary-10' : 'bg-card-color'}
      ${!stage.included ? 'opacity-50 pointer-events-none bg-gray-200' : ''}`}
    >
      <div className="flex-1 w-full sm:w-auto">
        <span className="font-normal text-sm">{task.task}</span>
      </div>
      <div className="sm:w-44 w-full flex justify-between sm:justify-center">
        <Tag color="orange" className="rounded">{task.assignee}</Tag>
      </div>
      <div className="sm:w-32 w-full text-left sm:text-center">
        <span className="text-sm">{task.estimated}</span>
      </div>
      <div className="sm:w-16 w-full flex justify-start sm:justify-center">
        <Checkbox
          checked={task.status === 'completed'}
          disabled={!stage.included}
          onChange={e => handleTaskCheckboxChange(stage.id, task.id, e.target.checked)}
        />
      </div>
      <div className="sm:w-32 w-full text-left sm:text-center">
        {/* Only show Actual if task is completed */}
        <span className={`text-sm ${task.status === 'completed' && task.actual ? 'text-red-500' : ''}`}>
          {task.status === 'completed' ? task.actual : ''}
        </span>
      </div>
      <div className="sm:w-16 w-full text-left sm:text-center">
        <AssignSupervisorDropdown
          assignedSupervisor={task.supervisor}
          onAssign={newSupervisor => handleSupervisorAssign(task.id, newSupervisor)}
        />
      </div>
      <div className="sm:w-32 w-full flex justify-start sm:justify-center">
        <Space size="small">
          <Tooltip title="Attach files">
            <Button type="text" icon={<IconPaperclip size={22} />} disabled={!stage.included} />
          </Tooltip>
          <Tooltip title="Comments">
            <Button type="text" icon={<IconMessage size={22} />} disabled={!stage.included} />
          </Tooltip>
          <Tooltip title="Other Options">
            <Button type="text" icon={<IconDotsVertical size={22} />} disabled={!stage.included} />
          </Tooltip>
        </Space>
      </div>
    </div>
  );

  const panelHeader = (stage: jobStatusStage) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
      <div className="flex items-center gap-2 flex-1">
        <span className="font-medium text-base">{stage.title}</span>

        {!stage.included ? (
          <Popconfirm
            title="Do you want to include permits and pre construction stage?"
            onConfirm={e => {
              e?.stopPropagation();
              setStagesData(prev =>
                prev.map(s => s.id === stage.id ? { ...s, included: true } : s)
              );
              message.success("Stage included successfully!");
            }}
            okText="Yes"
            cancelText="No"
            placement="bottom"
          >
            <Button size="small" type='primary' onClick={e => e.stopPropagation()}>Include<IconInfoSmall /></Button>
          </Popconfirm>
        ) : (
          <Button size="small" type='primary' onClick={e => e.stopPropagation()}>Skip Stage</Button>
        )}
      </div>

      <div className="hidden sm:block sm:w-44"></div>
      <div className="sm:w-32 text-left sm:text-center">
        <span className="text-sm font-medium text-gray-700">Estimated</span>
      </div>
      <div className="sm:w-12 flex justify-start sm:justify-center">
        <Popconfirm
          title={<div className='flex flex-col gap-4'>
            <span>Are you sure you want to update the stage?</span>
            <span>Note: this will mark all tasks as completed <br /> and move the job to the next page.</span>
          </div>}
          onConfirm={(e) => {
            e.stopPropagation();
            confirmHeaderChange(stage.id, !isAllTasksCompleted(stage.tasks));
          }}
          okText="Yes"
          cancelText="No"
          placement="bottom"
        >
          <Checkbox
            checked={isAllTasksCompleted(stage.tasks)}
            indeterminate={isSomeTasksCompleted(stage.tasks)}
            disabled={stage.tasks.length === 0 || !stage.included}
            onClick={e => e.stopPropagation()}
          />
        </Popconfirm>
      </div>
      <div className="sm:w-32 text-left sm:text-center">
        <span className="text-sm font-medium text-gray-700">Actual</span>
      </div>
      <div className="hidden sm:block sm:w-24"></div>
      <div className="sm:w-32 flex justify-start sm:justify-center mt-2 sm:mt-0">
        <Button
          type="primary"
          icon={<IconPlus size={16} />}
          className="rounded"
          disabled={!stage.included}
          onClick={e => {
            e.stopPropagation();
            handleOpenTaskModal(stage);
          }}
        >
          Task
        </Button>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col gap-7 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="m-3">
          <StageProgress
            id="MY12F48"
            title="Job Status"
            steps={[]}
            status="In Progress"
            idClassName="text-[#]"
          />
        </div>
        <div className="flex w-full md:w-[78%] justify-between">
          <div className="p-3">
            <h6 className="text-secondary">Murthy</h6>
            <p>Lot 300 Tallis Road, VIC , 3030</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:ml-[35%]">
        <TimelineActionsBar
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isActionShow={false}
          isCountShow={true}
        />
      </div>

      <Collapse
        expandIconPosition="start"
        className="bg-transparent border-none"
      >
        {stagesData.map(stage => (
          <Panel
            header={panelHeader(stage)}
            key={stage.id}
            className="mb-4 bg-body-color rounded-lg border-none overflow-hidden shadow-sm"
          >
            <div>
              {stage.tasks.length > 0 ? (
                stage.tasks.map(task => <TaskRow key={task.id} task={task} stage={stage} />)
              ) : (
                <div className="px-6 py-8 text-center text-gray-500">No tasks added yet</div>
              )}
            </div>
          </Panel>
        ))}
      </Collapse>

      <CreateTaskModal
        open={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedRecord(null);
        }}
        title="Create Task"
        loading={loading}
        onSubmit={handleAddTask}
        initialData={selectedRecord}
      />
    </div>
  );
};

export default JobStatusTaskManager;
