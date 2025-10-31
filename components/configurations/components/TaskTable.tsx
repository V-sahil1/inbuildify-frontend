'use client';

import React, { useState } from 'react';
import { Button, Modal, Input, Form, Space, Tooltip, message, Select, InputNumber } from 'antd';
const { Option } = Select;
import { IconPlus, IconEdit, IconTrash, IconArrowRight } from '@tabler/icons-react';
import { PredecessorTable } from './PredecessorTable';

type Task = {
  id: string;
  name: string;
  duration: number;
  assignee: string;
  folder: string;
  sort: number;
  info?: string;
  notify?: boolean;
  milestone?: boolean;
  attachmentMandatory?: boolean;
  predecessorTask?: Predecessor[];
  children?: Subtask[];
};

type Predecessor = {
  id: string;
  name: string;
  sort: number;
};

type Subtask = {
  id: string;
  name: string;
  sort: number;
};

interface TaskTableProps {
  currentStep: string;
}

const INITIAL_TASKS: Task[] = [
  {
    id: 't1',
    name: 'Verify with customer',
    duration: 1,
    assignee: 'My Home Admin',
    folder: 'Sales Folder',
    sort: 1,
    predecessorTask: [{ id: 'p1', name: 'Quotation Approval', sort: 1 }],
    children: [{ id: '1-1', name: 'Call and verify', sort: 1 }],
  },
];

const newId = () => Math.random().toString(36).slice(2, 9);

const sortAndReindexTasks = (arr: Task[]) =>
  arr
    .slice()
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((t, i) => ({ ...t, sort: i + 1 }));

const SAMPLE_ASSIGNEES = ['My Home Admin', 'John Doe', 'Sales Rep'];
const SAMPLE_FOLDERS = ['Sales Folder', 'Marketing', 'Default'];

export const TaskTable: React.FC<TaskTableProps> = ({ currentStep }) => {
  const [tasks, setTasks] = useState<Task[]>(sortAndReindexTasks(INITIAL_TASKS));

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskForm] = Form.useForm();
  const [predecessors, setPredecessors] = useState<Predecessor[]>([]);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [form] = Form.useForm();

  const openTaskModal = (task?: Task) => {
    if (task) {
      setEditingTaskId(task.id);
      taskForm.setFieldsValue({
        name: task.name,
        duration: task.duration,
        assignee: task.assignee,
        folder: task.folder,
        sort: task.sort,
        info: task.info,
        notify: task.notify,
        milestone: task.milestone,
        attachmentMandatory: task.attachmentMandatory,
      });
      setPredecessors(task.predecessorTask ? [...task.predecessorTask] : []);
    } else {
      setEditingTaskId(null);
      taskForm.resetFields();
      setPredecessors([]);
      taskForm.setFieldsValue({ sort: tasks.length + 1, duration: 1 });
    }
    setTaskModalOpen(true);
  };

  const handleTaskSave = async () => {
    try {
      const values = await taskForm.validateFields();
      const name = (values.name || '').trim();
      if (!name) {
        message.error('Task name is required');
        return;
      }

      // normalize desired sort
      let desiredSort = Number(values.sort ?? NaN);
      if (!Number.isFinite(desiredSort) || desiredSort < 1) desiredSort = 1;

      // Count active tasks (all in local)
      const activeCount = tasks.length + (editingTaskId ? 0 : 0);

      if (desiredSort > activeCount) desiredSort = activeCount + (editingTaskId ? 0 : 1);

      if (!editingTaskId) {
        // create
        const newTask: Task = {
          id: newId(),
          name,
          duration: Number(values.duration ?? 1),
          assignee: values.assignee || SAMPLE_ASSIGNEES[0],
          folder: values.folder || SAMPLE_FOLDERS[0],
          sort: desiredSort,
          info: values.info,
          notify: !!values.notify,
          milestone: !!values.milestone,
          attachmentMandatory: !!values.attachmentMandatory,
          predecessorTask: predecessors.map((p, i) => ({ ...p, sort: i + 1 })),
          children: [],
        };

        // insert at desiredSort position; reindex all sorts
        setTasks(prev => {
          const list = prev.slice().sort((a, b) => a.sort - b.sort);
          const pos = Math.max(1, Math.min(desiredSort, list.length + 1));
          const newList = [...list.slice(0, pos - 1), newTask, ...list.slice(pos - 1)];
          return sortAndReindexTasks(newList);
        });

        message.success('Task created');
      } else {
        // update existing
        setTasks(prev => {
          // update fields and move to new position if sort changed
          const list = prev.slice().sort((a, b) => a.sort - b.sort);
          const idx = list.findIndex(t => t.id === editingTaskId);
          if (idx === -1) return prev;
          const updated: Task = {
            ...list[idx],
            name,
            duration: Number(values.duration ?? list[idx].duration),
            assignee: values.assignee || list[idx].assignee,
            folder: values.folder || list[idx].folder,
            info: values.info,
            notify: !!values.notify,
            milestone: !!values.milestone,
            attachmentMandatory: !!values.attachmentMandatory,
            predecessorTask: predecessors.map((p, i) => ({
              ...p,
              sort: i + 1,
            })),
          };

          // remove the item
          const others = list.filter((_, i) => i !== idx);
          const pos = Math.max(1, Math.min(desiredSort, others.length + 1));
          const newList = [...others.slice(0, pos - 1), updated, ...others.slice(pos - 1)];
          return sortAndReindexTasks(newList);
        });

        message.success('Task updated');
      }

      // close modal & reset
      setTaskModalOpen(false);
      setEditingTaskId(null);
      taskForm.resetFields();
      setPredecessors([]);
    } catch (err) {
      // validation errors are shown by antd
    }
  };

  const handleAddPredecessor = (values: { name: string; sort: number }) => {
    const newPredecessor: Predecessor = {
      id: newId(),
      name: values.name,
      sort: values.sort,
    };
    setPredecessors(prev => [...prev, newPredecessor]);
  };

  const handleEditPredecessor = (id: string, updates: Partial<Predecessor>) => {
    setPredecessors(prev => prev.map(pred => (pred.id === id ? { ...pred, ...updates } : pred)));
  };

  const handleDeletePredecessor = (id: string) => {
    setPredecessors(prev => prev.filter(pred => pred.id !== id));
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => {
      const filtered = prev.filter(t => t.id !== id);
      return sortAndReindexTasks(filtered);
    });
    message.success('Task deleted');
  };

  const handleAddChild = (taskId: string) => {
    setSelectedTaskId(taskId);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEditChild = (taskId: string, childId: string) => {
    const task = tasks.find(t => t.id === taskId);
    const subTask = task?.children?.find(c => c.id === childId);

    if (subTask) {
      setSelectedTaskId(taskId);
      setEditingSubId(childId);
      form.setFieldsValue({
        name: subTask.name,
        sort: subTask.sort,
      });
      setIsModalOpen(true);
    }
  };

  const handleSaveChild = () => {
    form.validateFields().then(values => {
      setTasks(prev =>
        prev.map(task => {
          if (task.id !== selectedTaskId) return task;

          const updatedChildren = task.children ? [...task.children] : [];

          if (editingSubId) {
            // Update existing sub-task
            const index = updatedChildren.findIndex(c => c.id === editingSubId);
            if (index !== -1) {
              updatedChildren[index] = {
                ...updatedChildren[index],
                ...values,
              };
            }
          } else {
            // Add new sub-task
            updatedChildren.push({
              id: Math.random().toString(36).slice(2),
              ...values,
            });
          }

          return {
            ...task,
            children: updatedChildren,
          };
        })
      );

      form.resetFields();
      setIsModalOpen(false);
      setEditingSubId(null);
    });
  };

  const handleDeleteChild = (parentId: string, childId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === parentId
          ? {
              ...task,
              children: task.children?.filter(c => c.id !== childId),
            }
          : task
      )
    );
  };

  return (
    <>
      <div className="flex justify-end mb-2">
        <Button type="primary" onClick={() => openTaskModal()}>
          New Task
        </Button>
      </div>

      {/* Table Wrapper */}
      <div className="border rounded-md overflow-hidden w-full ant-table-wrapper overflow-x-auto overflow-x-hidden">
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
                    <React.Fragment key={task.id}>
                      {/* Parent Row */}
                      <tr className="hover:bg-gray-50">
                        <td className="font-medium pl-2">{task.name}</td>
                        <td className="text-center">{task.duration}</td>
                        <td>{task.predecessorTask?.map(p => p.name).join(', ') || '-'}</td>
                        <td>{task.assignee}</td>
                        <td className="text-center">{task.sort}</td>
                        <td className="text-right pr-2">
                          <Space>
                            <Tooltip title="Add Sub Task">
                              <Button
                                type="text"
                                icon={<IconPlus size={18} />}
                                onClick={() => handleAddChild(task.id)}
                              />
                            </Tooltip>
                            <Tooltip title="Edit">
                              <Button
                                type="text"
                                icon={<IconEdit size={18} />}
                                onClick={() => openTaskModal(task)}
                              />
                            </Tooltip>
                            <Tooltip title="Delete">
                              <Button
                                type="text"
                                icon={<IconTrash size={18} />}
                                onClick={() => handleDeleteTask(task.id)}
                              />
                            </Tooltip>
                          </Space>
                        </td>
                      </tr>

                      {task.children?.map(child => (
                        <tr key={child.id} className="bg-gray-100 border-t border-gray-200">
                          <td className="pl-8 flex items-center gap-2">
                            <IconArrowRight size={16} />
                            <span className="font-medium text-gray-700">{child.name}</span>
                          </td>
                          <td className="text-center">{child.sort}</td>
                          <td colSpan={2}></td>
                          <td></td>
                          <td className="text-right pr-2">
                            <Space>
                              <Tooltip title="Edit">
                                <Button
                                  type="text"
                                  icon={<IconEdit size={18} />}
                                  onClick={() => handleEditChild(task.id, child.id)}
                                />
                              </Tooltip>
                              <Tooltip title="Delete">
                                <Button
                                  type="text"
                                  icon={<IconTrash size={18} />}
                                  onClick={() => handleDeleteChild(task.id, child.id)}
                                />
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
          onOk={handleSaveChild}
          okText="Save"
          centered
        >
          <Form form={form} layout="vertical" initialValues={{ name: '', sort: 1 }}>
            <Form.Item
              name="name"
              label="Task Name"
              rules={[{ required: true, message: 'Please enter sub task name' }]}
            >
              <Input placeholder="Enter sub task name" />
            </Form.Item>
            <Form.Item
              name="sort"
              label="Sort"
              rules={[{ required: true, message: 'Please enter sort number' }]}
            >
              <Input type="number" min={1} />
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

            <div className="grid grid-cols-3 gap-4">
              <Form.Item label="Assignee" name="assignee">
                <Select placeholder="Select Assignee">
                  {SAMPLE_ASSIGNEES.map(a => (
                    <Option value={a} key={a}>
                      {a}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Folder Name" name="folder">
                <Select placeholder="Select Folder">
                  {SAMPLE_FOLDERS.map(f => (
                    <Option value={f} key={f}>
                      {f}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Sort" name="sort">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="No of Days" name="duration">
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item label="Info" name="info">
                <Input />
              </Form.Item>
            </div>

            <Form.Item>
              <Space>
                <Form.Item name="notify" valuePropName="checked" noStyle>
                  <input type="checkbox" />
                </Form.Item>
                <span>Notify</span>

                <Form.Item name="milestone" valuePropName="checked" noStyle>
                  <input type="checkbox" />
                </Form.Item>
                <span>Milestone</span>

                <Form.Item name="attachmentMandatory" valuePropName="checked" noStyle>
                  <input type="checkbox" />
                </Form.Item>
                <span>Attachment Mandatory</span>
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
