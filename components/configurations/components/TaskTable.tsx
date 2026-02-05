'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Form,
  Input,
  Select,
  Space,
  Tooltip,
  Modal,
  InputNumber,
  Checkbox,
  message,
  Popconfirm,
} from 'antd';
import { IconPlus, IconEdit, IconTrash, IconArrowRight } from '@tabler/icons-react';
import { PredecessorTable } from './PredecessorTable';
import { useUsersHook } from '@hooks/useUserHook';
import { useAppDispatch, useAppSelector } from '@hooks/redux';

import { Status } from '@lib/constants/enum';
import {
  fetchJobPredecessorTask,
  fetchJobProcessSubStageTasks,
  createJobProcessTasks,
  updateJobProcessTasks,
  deleteJobProcessTasks,
  createJobProcessSubTasks,
  updateJobProcessSubTasks,
  deleteJobProcessSubTasks,
} from '@redux/feature/admin/job/jobProcess/jobProcessThunk';
import {
  JobPredecessorTask,
  JobProcessTask,
} from '@redux/feature/admin/job/jobProcess/IJobProcessState';

interface PredecessorWithId extends JobPredecessorTask {
  id: string;
}

interface TaskTableProps {
  currentStep: string;
  subStageId: string;
}

const SAMPLE_FOLDERS = ['Sales Folder', 'Marketing', 'Default'];

export const TaskTable: React.FC<TaskTableProps> = ({ currentStep, subStageId }) => {
  const dispatch = useAppDispatch();
  const { jobProcessTask, jobPredecessorTask, status } = useAppSelector(
    state => state.job.jobProcess
  );

  const [tasks, setTasks] = useState<JobProcessTask[]>([]);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm] = Form.useForm();
  const [predecessors, setPredecessors] = useState<PredecessorWithId[]>([]);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const { userOptions } = useUsersHook();

  useEffect(() => {
    if (subStageId) {
      dispatch(fetchJobProcessSubStageTasks(subStageId)).unwrap();
    }
  }, [subStageId]);

  useEffect(() => {
    if (status.fetchbPredecessorTask === Status.IDLE) {
      dispatch(fetchJobPredecessorTask()).unwrap();
    }
  }, [status.fetchbPredecessorTask, dispatch]);

  useEffect(() => {
    setTasks(jobProcessTask || []);
  }, [jobProcessTask]);

  const openTaskModal = (task?: JobProcessTask) => {
    if (task) {
      setEditingTaskId(task.jobProcessTaskId);
      const predecessorsWithId = (task.dependencies || []).map(dep => ({
        id: dep.taskId,
        taskId: dep.taskId,
        name: dep.name,
      }));
      setPredecessors(predecessorsWithId);
      taskForm.setFieldsValue({
        ...task,
        assignee: task.assignee?.id,
      });
    } else {
      setEditingTaskId(null);
      taskForm.resetFields();
      setPredecessors([]);
    }
    setTaskModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    dispatch(deleteJobProcessTasks(taskId))
      .unwrap()
      .then(() => {
        message.success('Task deleted successfully');
      })
      .catch(() => {
        message.error('Failed to delete task');
      });
  };

  const handleAddSubTask = (taskId: string) => {
    setSelectedTaskId(taskId);
    form.resetFields();
    setEditingSubId(null);
    setIsModalOpen(true);
  };

  const handleEditSubTask = (taskId: string, subTaskId: string) => {
    const task = tasks.find(t => t.jobProcessTaskId === taskId);
    const subTask = task?.subTasks?.find(c => c.subTaskId === subTaskId);

    if (subTask) {
      setSelectedTaskId(taskId);
      setEditingSubId(subTaskId);
      form.setFieldsValue({
        name: subTask.name,
        sortOrder: subTask.sortOrder,
      });
      setIsModalOpen(true);
    }
  };

  const handleDeleteSubTask = (taskId: string, subTaskId: string) => {
    dispatch(deleteJobProcessSubTasks({ subTaskId, taskId }))
      .unwrap()
      .then(() => {
        message.success('Sub-task deleted successfully');
      })
      .catch(() => {
        message.error('Failed to delete sub-task');
      });
  };

  const handleSaveSubTask = async () => {
    try {
      const values = await form.validateFields();

      if (editingSubId) {
        // Update existing sub-task
        await dispatch(
          updateJobProcessSubTasks({
            subTaskId: editingSubId,
            data: {
              name: values.name,
              sortOrder: values.sortOrder || 1,
            },
          })
        ).unwrap();
        message.success('Sub-task updated successfully');
      } else {
        // Create new sub-task
        await dispatch(
          createJobProcessSubTasks({
            taskId: selectedTaskId,
            data: {
              name: values.name,
              sortOrder: values.sortOrder || 1,
            },
          })
        ).unwrap();
        message.success('Sub-task created successfully');
      }

      setIsModalOpen(false);
      setEditingSubId(null);
      setSelectedTaskId(null);
      form.resetFields();
    } catch (error) {
      message.error(error || 'Failed to save sub-task');
    }
  };

  const handleAddPredecessor = values => {
    const selectedPredecessor = jobPredecessorTask.find(p => p.taskId === values.task);
    if (selectedPredecessor) {
      const newPredecessor: PredecessorWithId = {
        id: selectedPredecessor.taskId,
        taskId: selectedPredecessor.taskId,
        name: selectedPredecessor.name,
      };
      setPredecessors(prev => [...prev, newPredecessor]);
    }
  };

  const handleEditPredecessor = (id: string, updates: Partial<PredecessorWithId>) => {
    setPredecessors(prev => prev.map(pred => (pred.id === id ? { ...pred, ...updates } : pred)));
  };

  const handleDeletePredecessor = (id: string) => {
    setPredecessors(prev => prev.filter(pred => pred.id !== id));
  };

  const handleTaskSave = async () => {
    try {
      const values = await taskForm.validateFields();
      const name = (values.name || '').trim();
      if (!name) {
        message.error('Task name is required');
        return;
      }

      const taskData = {
        name: values.name,
        description: values.description || '',
        sortOrder: values.sortOrder || 1,
        noOfDays: values.noOfDays || 1,
        assigneeId: values.assignee || '',
        notify: values.notify || false,
        milestone: values.milestone || false,
        attachmentMandatory: values.attachmentMandatory || false,
        predecessorTaskIds: predecessors.map(p => p.taskId) || [],
      };

      if (editingTaskId) {
        await dispatch(
          updateJobProcessTasks({
            taskId: editingTaskId,
            data: taskData,
          })
        ).unwrap();
        message.success('Task updated successfully');
      } else {
        await dispatch(
          createJobProcessTasks({
            stageId: subStageId,
            data: taskData,
          })
        ).unwrap();
        message.success('Task created successfully');
      }

      setTaskModalOpen(false);
      setEditingTaskId(null);
      taskForm.resetFields();
      setPredecessors([]);
    } catch (error) {
      message.error(error || 'Failed to save task');
    }
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button type="primary" onClick={() => openTaskModal()}>
          New Task
        </Button>
      </div>

      {/* Table Wrapper */}
      <div className="rounded-md overflow-hidden w-full ant-table-wrapper overflow-x-auto custom-scrollbar">
        <div className="ant-table ant-table-small">
          <div className="ant-table-container">
            <div className="ant-table-content">
              <table className="w-full table-fixed">
                <thead className="ant-table-thead">
                  <tr>
                    <th style={{ width: '25%' }}>Task Name</th>
                    <th style={{ width: '10%' }}>Duration</th>
                    <th style={{ width: '30%' }}>Predecessor Task</th>
                    <th style={{ width: '20%' }}>Assignee</th>
                    <th style={{ width: '8%' }}>Sort</th>
                    <th style={{ width: '10%' }} className="text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="ant-table-tbody">
                  {tasks.map(task => (
                    <React.Fragment key={task.jobProcessTaskId}>
                      {/* Parent Row */}
                      <tr className="hover:bg-font-color-400">
                        <td className="font-medium pl-2">{task.name}</td>
                        <td className="text-center">{task.noOfDays}</td>
                        <td>{task.dependencies?.map(p => p.name).join(', ') || '-'}</td>
                        <td>{task.assignee.name}</td>
                        <td className="text-center">{task.sortOrder}</td>
                        <td className="text-right pr-2">
                          <Space>
                            <Tooltip title="Add Sub Task">
                              <Button
                                type="text"
                                icon={<IconPlus size={16} />}
                                onClick={() => {
                                  handleAddSubTask(task.jobProcessTaskId);
                                }}
                              />
                            </Tooltip>
                            <Tooltip title="Edit">
                              <Button
                                type="text"
                                icon={<IconEdit size={16} />}
                                onClick={() => openTaskModal(task)}
                              />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Popconfirm
                                overlayStyle={{ width: 400 }}
                                title={
                                  <>
                                    <p>
                                      This task will be deleted only if confirmation and
                                      verification with the customer are incomplete.
                                    </p>
                                    <div className="ml-3 my-3">
                                      <p>All sub-tasks under this task will be deleted.</p>
                                      <p>
                                        All trigger actions mapped to this task will be deleted.
                                      </p>
                                    </div>
                                    <p>Are you sure you want to delete this task?</p>
                                  </>
                                }
                                onConfirm={() => handleDeleteTask(task.jobProcessTaskId)}
                                okText="Yes"
                                cancelText="No"
                              >
                                <Button type="text" icon={<IconTrash size={16} color="red" />} />
                              </Popconfirm>
                            </Tooltip>
                          </Space>
                        </td>
                      </tr>

                      {task.subTasks?.map(subTask => (
                        <tr
                          key={subTask.subTaskId}
                          className="bg-body-color border-t border-border-color"
                        >
                          <td className="pl-8 flex items-center gap-2">
                            <IconArrowRight size={16} />
                            <span className="font-medium text-font-color-100">{subTask.name}</span>
                          </td>
                          <td className="text-center">{subTask.sortOrder}</td>
                          <td colSpan={2}></td>
                          <td></td>
                          <td className="text-right pr-2">
                            <Space>
                              <Tooltip title="Edit">
                                <Button
                                  type="text"
                                  icon={<IconEdit size={16} />}
                                  onClick={() =>
                                    handleEditSubTask(task.jobProcessTaskId, subTask.subTaskId)
                                  }
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Popconfirm
                                  title="Are you sure you want to delete this sub-task?"
                                  description="This action cannot be undone."
                                  onConfirm={() =>
                                    handleDeleteSubTask(task.jobProcessTaskId, subTask.subTaskId)
                                  }
                                  okText="Yes"
                                  cancelText="No"
                                >
                                  <Button type="text" icon={<IconTrash size={16} color="red" />} />
                                </Popconfirm>
                              </Tooltip>
                            </Space>
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal
          title={`${editingSubId ? 'Edit Sub Task' : 'Add Sub Task'}`}
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          onOk={handleSaveSubTask}
          okText="Save"
          centered
        >
          <Form form={form} layout="vertical" initialValues={{ name: '', sortOrder: 1 }}>
            <Form.Item
              name="name"
              label="Sub Task Name"
              rules={[{ required: true, message: 'Please enter sub task name' }]}
            >
              <Input placeholder="Enter sub task name" />
            </Form.Item>
            <Form.Item
              name="sortOrder"
              label="Sort Order"
              rules={[{ required: true, message: 'Please enter sort order' }]}
            >
              <InputNumber min={1} placeholder="Enter sort order" style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>

        <Modal
          open={taskModalOpen}
          onCancel={() => {
            setTaskModalOpen(false);
            setEditingTaskId(null);
            taskForm.resetFields();
            setPredecessors([]);
          }}
          title={editingTaskId ? 'Edit Task' : 'New Task'}
          width={800}
          okText="Save"
          onOk={handleTaskSave}
          centered
        >
          <Form layout="vertical" form={taskForm}>
            <Form.Item
              label="Task Name"
              name="name"
              rules={[{ required: true, message: 'Please enter task name' }]}
            >
              <Input placeholder="Enter task name" />
            </Form.Item>

            <Form.Item label="Description" name="description">
              <Input.TextArea placeholder="Enter task description" rows={3} />
            </Form.Item>

            <div className="grid grid-cols-3 gap-4">
              <Form.Item label="Assignee" name="assignee">
                <Select placeholder="Select Assignee" options={userOptions} />
              </Form.Item>

              <Form.Item label="Sort Order" name="sortOrder">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
              {/* <Form.Item label="Folder Name" name="folder">
                <Select placeholder="Select Folder">
                  {SAMPLE_FOLDERS.map(f => (
                    <Option value={f} key={f}>
                      {f}
                    </Option>
                  ))}
                </Select>
              </Form.Item> */}

              <Form.Item label="No of Days" name="noOfDays">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <Form.Item>
              <Space>
                <Form.Item name="notify" valuePropName="checked" noStyle>
                  <Checkbox />
                </Form.Item>
                <span className="text-font-color-100">Notify</span>

                <Form.Item name="milestone" valuePropName="checked" noStyle>
                  <Checkbox />
                </Form.Item>
                <span className="text-font-color-100">Milestone</span>

                <Form.Item name="attachmentMandatory" valuePropName="checked" noStyle>
                  <Checkbox />
                </Form.Item>
                <span className="text-font-color-100">Attachment Mandatory</span>
              </Space>
            </Form.Item>
            <PredecessorTable
              predecessors={predecessors}
              onAdd={handleAddPredecessor}
              onEdit={handleEditPredecessor}
              onDelete={handleDeletePredecessor}
            />
          </Form>
        </Modal>
      </div>
    </>
  );
};
