import { PricingItem } from '@/components/common/PricingItem';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { Status } from '@lib/constants/enum';
import { Item } from '@redux/feature/masterPriceList/iMasterPriceListState';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { message, Spin, Empty, Tooltip, Button } from 'antd';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { CreateFormModal } from '@/components/common/Models/CreateFormModel';
import { MasterPricingCategoryFields } from '@/components/formFields/MasterPricingCategoryFields';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { WorkflowProcessTaskFields } from '@/components/formFields/WorkflowProcessTaskFields';
import {
  createWorkflowProcess,
  createWorkflowProcessTask,
  deleteWorkflowProcess,
  deleteWorkflowProcessTask,
  fetchWorkflowProcess,
  fetchWorkflowProcessTasks,
  updateWorkflowProcess,
  updateWorkflowProcessOrder,
  updateWorkflowProcessTask,
} from '@redux/feature/workflow/workflowThunk';
import { WorkflowProcess } from '@redux/feature/workflow/iWorkflowState';
import { toggleExpandWorkflowProcess } from '@redux/feature/workflow/workflowSlice';
import { formDataGenerator } from '@lib/utils/formDataGenerator';

export const WorkflowProcessPage = () => {
  const dispatch = useAppDispatch();
  const { workflowProcess, status } = useAppSelector((state: any) => state.workflow);
  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(fetchWorkflowProcess());
    }
  }, [dispatch, status]);

  const [localWorkflowProcess, setLocalWorkflowProcess] = useState<WorkflowProcess[]>([]);
  useEffect(() => {
    setLocalWorkflowProcess(workflowProcess);
  }, [workflowProcess]);

  const [workflowProcessId, setWorkflowProcessId] = useState('');
  const [addWorkflowProcessModal, setAddWorkflowProcessModal] = useState(false);
  const [addWorkflowProcessTaskModal, setAddWorkflowProcessTaskModal] = useState(false);
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState({
    reset: false,
    save: false,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: 'workflowProcessTask' });
  const [editing, setEditing] = useState<boolean>(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);

  const openAddWorkflowProcessTaskModal = (workflowProcessId: string) => {
    setAddWorkflowProcessTaskModal(true);
    setWorkflowProcessId(workflowProcessId);
  };

  const handleExpand = async (workflowProcessId: string, isExpanded: boolean) => {
    setDropDowns(prev => ({
      ...prev,
      [workflowProcessId]: !prev[workflowProcessId],
    }));

    if (!isExpanded) {
      try {
        setLoadingItems(prev => ({ ...prev, [workflowProcessId]: true }));
        dispatch(toggleExpandWorkflowProcess(workflowProcessId));

        await dispatch(
          fetchWorkflowProcessTasks({
            workflowProcessId,
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch workflow process tasks');
      } finally {
        setLoadingItems(prev => ({ ...prev, [workflowProcessId]: false }));
      }
    }
  };

  const handleWorkflowProcessTaskAction = (action: string, workflowProcessTask: any) => {
    setSelectedItem(workflowProcessTask);
    if (action === 'edit') {
      setEditing(true);
      openAddWorkflowProcessTaskModal(workflowProcessTask.workflowProcessTaskId);
    } else if (action === 'delete') {
      setDeleteModal({ open: true, type: 'workflowProcessTask' });
    }
  };

  const handleWorkflowProcessAction = (
    action: 'edit' | 'delete',
    workflowProcess: WorkflowProcess
  ) => {
    setSelectedItem(workflowProcess);
    if (action === 'edit') {
      setEditing(true);
      setAddWorkflowProcessModal(true);
    } else {
      setDeleteModal({ open: true, type: 'workflowProcess' });
    }
  };

  const handleAddWorkflowProcessSubmit = async (values: { name: string; description: string }) => {
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateWorkflowProcess({
            id: selectedItem.workflowProcessId,
            payload: { name: values.name, description: values.description },
          })
        ).unwrap();
        setEditing(false);
        message.success('Workflow process updated successfully');
      } else {
        await dispatch(
          createWorkflowProcess({
            name: values.name,
            description: values.description,
          })
        ).unwrap();
        message.success('Workflow process created successfully');
      }
      setAddWorkflowProcessModal(false);
    } catch (error: any) {
      message.error(error || 'Failed to create workflow process');
    } finally {
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleAddWorkflowProcessTaskSubmit = async values => {
    let image = null;
    if (!editing) {
      values.workflow_process_id = workflowProcessId;
    }
    if (values?.image?.length > 0 && values.image[0]?.originFileObj) {
      image = values.image[0].originFileObj;
    }
    const formData = formDataGenerator({ ...values, image });
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateWorkflowProcessTask({
            id: selectedItem.workflowProcessTaskId,
            data: formData,
          })
        ).unwrap();
        message.success('Workflow process updated successfully');
        setEditing(false);
      } else {
        await dispatch(createWorkflowProcessTask(formData)).unwrap();
        message.success('Workflow process task created successfully');
      }
      setAddWorkflowProcessTaskModal(false);
    } catch (error: any) {
      message.error(error || 'Failed to create workflow process task');
    } finally {
      setSelectedItem(null);
      setLoading(false);
    }
  };
  const handleDelete = async (type: string, id: any) => {
    setLoading(true);
    try {
      if (type === 'workflowProcessTask') {
        await dispatch(deleteWorkflowProcessTask({ workflowProcessTaskId: id })).unwrap();
        message.success('Workflow process item deleted successfully');
      } else {
        await dispatch(deleteWorkflowProcess(id)).unwrap();
        message.success('Workflow process deleted successfully');
      }
    } catch (error: any) {
      message.error(error || 'Failed to delete workflow process');
    } finally {
      setDeleteModal({ open: false, type });
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    // Clone categories to avoid mutation
    const newLocalWorkflowProcess = localWorkflowProcess.map(c => ({ ...c }));

    // Move the dragged category in the array
    const [movedCategory] = newLocalWorkflowProcess.splice(fromIndex, 1);
    newLocalWorkflowProcess.splice(toIndex, 0, movedCategory);

    // Collect affected categories
    const changedWorkflowProcess: WorkflowProcess[] = [];

    const oldDisplayOrder = movedCategory.displayOrder;

    if (fromIndex < toIndex) {
      // Moving down
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i <= toIndex; i++) {
        const c = { ...newLocalWorkflowProcess[i] };
        const currentOrder = c?.displayOrder;
        c.displayOrder = previous;
        previous = currentOrder;
        changedWorkflowProcess.push(c);
        newLocalWorkflowProcess[i] = c;
      }
    } else if (fromIndex > toIndex) {
      // Moving up
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i >= toIndex; i--) {
        const c = { ...newLocalWorkflowProcess[i] };
        const currentOrder = c?.displayOrder;
        c.displayOrder = previous;
        previous = currentOrder;
        changedWorkflowProcess.push(c);
        newLocalWorkflowProcess[i] = c;
      }
    }
    setLocalWorkflowProcess(newLocalWorkflowProcess);
  };

  const isOrderChanged = () => {
    if (localWorkflowProcess?.length !== workflowProcess?.length) return true;
    return localWorkflowProcess?.some(
      (c, idx) => c?.workflowProcessId !== workflowProcess[idx]?.workflowProcessId
    );
  };

  const handleSaveOrder = async () => {
    setOrderLoading(prev => ({ ...prev, save: true }));
    try {
      const payload =
        localWorkflowProcess.length > 0
          ? localWorkflowProcess?.map(w => ({
              workflowProcessId: w?.workflowProcessId,
              displayOrder: w?.displayOrder,
            }))
          : [];

      if (payload?.length > 0) {
        await dispatch(updateWorkflowProcessOrder({ workflowProcesses: payload })).unwrap();
        message.success('Workflow Process order updated successfully');
      }
    } catch (error) {
      setLocalWorkflowProcess(workflowProcess);
      message.error(error || 'Failed to update workflow process order');
    } finally {
      setOrderLoading(prev => ({ ...prev, save: false }));
    }
  };

  const handleResetOrder = () => {
    setOrderLoading(prev => ({ ...prev, reset: true }));
    setLocalWorkflowProcess(workflowProcess);
    message.success('Workflow Process order reset successfully');
    setOrderLoading(prev => ({ ...prev, reset: false }));
    setResetModalVisible(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Workflow Process List
        </h2>
        <div className="flex gap-2">
          {isOrderChanged() && (
            <>
              <Button
                onClick={() => {
                  setResetModalVisible(true);
                }}
                disabled={orderLoading.save}
              >
                Reset Order
              </Button>
              <Button onClick={handleSaveOrder} disabled={orderLoading.save}>
                Save Order
              </Button>
            </>
          )}
          {!isOrderChanged() && (
            <Button
              type="primary"
              disabled={orderLoading.save || status == Status.PENDING || orderLoading.reset}
              onClick={() => {
                setEditing(false);
                setAddWorkflowProcessModal(true);
              }}
            >
              Add Workflow
            </Button>
          )}
        </div>
      </div>

      {status == Status.PENDING || orderLoading.save ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : localWorkflowProcess.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {provided => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {localWorkflowProcess.map((workflowProcess: WorkflowProcess, index: number) => {
                  const isDropdownOpen = dropDowns[workflowProcess?.workflowProcessId] || false;
                  const isLoading = loadingItems[workflowProcess?.workflowProcessId] || false;

                  return (
                    <Draggable
                      key={workflowProcess?.workflowProcessId}
                      draggableId={String(workflowProcess?.workflowProcessId)}
                      index={index}
                    >
                      {provided => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg"
                        >
                          {/* Header */}
                          <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
                            onClick={() =>
                              !isOrderChanged() &&
                              handleExpand(
                                workflowProcess?.workflowProcessId,
                                workflowProcess?.isExpanded
                              )
                            }
                          >
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition cursor-grab">
                                <IconGripVertical size={24} />
                              </button>
                              <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-gray-800 break-words">
                                  {workflowProcess?.name}
                                </h3>
                                {workflowProcess?.description && (
                                  <Tooltip title={workflowProcess?.description} placement="top">
                                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                      {workflowProcess?.description}
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            {!isOrderChanged() && (
                              <div className="flex gap-3 flex-shrink-0">
                                <button
                                  className="p-2 rounded-lg hover:bg-green-50 transition"
                                  onClick={e => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openAddWorkflowProcessTaskModal(
                                      workflowProcess?.workflowProcessId
                                    );
                                  }}
                                >
                                  <IconPlus
                                    size={18}
                                    className="text-gray-600 hover:text-green-600"
                                  />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-blue-50 transition"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleWorkflowProcessAction('edit', workflowProcess);
                                  }}
                                >
                                  <IconEdit
                                    size={18}
                                    className="text-gray-600 hover:text-blue-600"
                                  />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-red-50 transition"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleWorkflowProcessAction('delete', workflowProcess);
                                  }}
                                >
                                  <IconTrash
                                    size={18}
                                    className="text-gray-600 hover:text-red-600"
                                  />
                                </button>

                                <button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition">
                                  {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Dropdown */}
                          {isDropdownOpen && (
                            <div className="px-4 pb-4">
                              {isLoading ? (
                                <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
                                  <Spin size="large" />
                                </div>
                              ) : workflowProcess?.tasks?.length > 0 ? (
                                <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                  {workflowProcess?.tasks?.map((item: Item) => (
                                    <PricingItem
                                      key={item?.categoryItemId}
                                      item={item}
                                      handleClick={handleWorkflowProcessTaskAction}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center flex flex-col justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                  <p className="text-base font-medium">No Task here yet.</p>
                                  <p className="text-sm">Click on the + icon to add Task.</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Empty
          description={<span className="text-gray-500">No Workflow Process found.</span>}
          className="py-12"
        />
      )}

      {/* Modals */}
      {addWorkflowProcessModal && (
        <CreateFormModal
          title="Workflow Process"
          isEditing={editing}
          open={addWorkflowProcessModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddWorkflowProcessModal(false);
          }}
          initialValues={selectedItem}
          onSubmit={handleAddWorkflowProcessSubmit}
          fields={MasterPricingCategoryFields()}
        />
      )}

      {resetModalVisible && (
        <ConfirmationModal
          open={resetModalVisible}
          onClose={() => {
            setResetModalVisible(false);
            setOrderLoading(prev => ({ ...prev, reset: false }));
          }}
          onConfirm={handleResetOrder}
          message="Are you sure you want to reset the order?"
          type="danger"
          confirmText="Reset"
          cancelText="Cancel"
          loading={orderLoading.reset}
          maxWidth="sm"
        />
      )}

      {addWorkflowProcessTaskModal && (
        <CreateFormModal
          title="Workflow Process Task"
          isEditing={editing}
          open={addWorkflowProcessTaskModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddWorkflowProcessTaskModal(false);
          }}
          initialValues={{ ...selectedItem, logo: selectedItem?.attachment }}
          onSubmit={handleAddWorkflowProcessTaskSubmit}
          fields={WorkflowProcessTaskFields()}
        />
      )}

      {deleteModal.open && (
        <ConfirmationModal
          loading={loading}
          open={deleteModal.open}
          onClose={() => setDeleteModal({ open: false, type: deleteModal.type })}
          onConfirm={() =>
            handleDelete(
              deleteModal.type,
              deleteModal.type === 'workflowProcessTask'
                ? selectedItem?.workflowProcessTaskId
                : selectedItem?.workflowProcessId
            )
          }
          type="danger"
          title="Confirm Deletion"
          message={
            deleteModal.type === 'workflowProcessTask'
              ? 'Are you sure you want to delete this Process Task? Deleting it will also remove it from any associated packages.'
              : 'Are you sure you want to delete this Workflow Process? Deleting it will also remove all the tasks under it and affect any places where it is used.'
          }
        />
      )}
    </div>
  );
};

export default WorkflowProcessPage;
