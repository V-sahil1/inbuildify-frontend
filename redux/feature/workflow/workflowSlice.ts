import { createSlice } from "@reduxjs/toolkit";
import {
  createWorkflowProcess,
  createWorkflowProcessTask,
  deleteWorkflowProcess,
  deleteWorkflowProcessTask,
  fetchWorkflowProcess,
  fetchWorkflowProcessTasks,
  updateWorkflowProcess,
  updateWorkflowProcessTask,
  updateWorkflowProcessOrder,
} from "./workflowThunk";
import { Status } from "@lib/constants/enum"; 
const workflowSlice = createSlice({
  name: "workflow",
  initialState: {
    status: Status.IDLE,
    workflowProcess: [],
    loading: false,
    selectedFilters: { range: "", dwelling_type: "" },
  },
  reducers: {
    toggleExpandWorkflowProcess(state, action) {
      const workflowProcess = state.workflowProcess.find(
        (c) => c.workflowProcessId === action.payload
      );
      if (workflowProcess) {
        workflowProcess.isExpanded = true;
      }
    },
    resetAllCategoriesIsExpanded(state) {
      state.workflowProcess.forEach(workflowProcess => {
        workflowProcess.isExpanded = false;
      });
    },
    setSelectedFilters(state, action) {
      state.selectedFilters = { ...state.selectedFilters, ...action.payload };
    },
    clearFilters(state) {
      state.selectedFilters = { range: "", dwelling_type: "" };
    },
  },
  extraReducers: (builder) => {
    builder
      // workflow process
      .addCase(fetchWorkflowProcess.pending, (state) => {
        state.status = Status.PENDING;
        state.loading = true;
      })
      .addCase(fetchWorkflowProcess.fulfilled, (state, action) => {
        state.status = Status.SUCCESS;
        state.loading = false;
        state.workflowProcess =  action.payload?.workflowProcesses?.map((w) => ({
          ...w,
          tasks: null,
          isExpanded: false,
          loadingItems: false,
        }));
      })
      .addCase(createWorkflowProcess.fulfilled, (state, action) => {
        state.workflowProcess.unshift({
          ...action.payload,
          tasks: null,
          isExpanded: false,
          loadingItems: false,
        });
      })
      .addCase(updateWorkflowProcess.fulfilled, (state, action) => {
        const category = state.workflowProcess.find(
          (c) => c.workflowProcessId === action.payload.workflowProcessId
        );
        if (category) {
          category.name = action.payload.name;
          category.description = action.payload.description;
        }
      })
      .addCase(deleteWorkflowProcess.fulfilled, (state, action) => {
        state.workflowProcess = state.workflowProcess.filter(
          (c) => c.workflowProcessId !== action.payload.workflowProcessId
        );
      })

      .addCase(updateWorkflowProcessOrder.fulfilled, (state, action) => {
        const updatedOrders = action.payload?.workflowProcesses;  
      
      
        state.workflowProcess = state.workflowProcess.map((cat) => {
          const found = updatedOrders?.find((u) => u?.workflowProcessId === cat?.workflowProcessId);
          return found ? { ...cat, displayOrder: found?.displayOrder } : cat;
        });
       
        state.workflowProcess.sort((a, b) => a?.displayOrder - b?.displayOrder);
      })
      
      // fetch tasks
      .addCase(fetchWorkflowProcessTasks.pending, (state, action) => {
        const category = state.workflowProcess.find(
          (c) => c.workflowProcessId === action.meta.arg.workflowProcessId
        );
        if (category) category.loadingItems = true;
      })
      .addCase(fetchWorkflowProcessTasks.fulfilled, (state, action) => {
        const { workflowProcessId, items } = action.payload;
        const workflowProcess = state.workflowProcess.find(
          (c) => c.workflowProcessId === workflowProcessId
        );
        if (workflowProcess) {
          workflowProcess.tasks = items; 
          workflowProcess.loadingItems = false;
        }
      })

      // create task
      .addCase(createWorkflowProcessTask.fulfilled, (state, action) => {
        const workflowProcess = state.workflowProcess.find(
          (c) => c.workflowProcessId === action.payload.workflowProcessId
        );
        if (workflowProcess) {
          if (!workflowProcess.tasks) {
            workflowProcess.tasks = [];
          }
          workflowProcess.tasks = [action.payload, ...(workflowProcess.tasks || [])];
        }
      })

      //delete task
      .addCase(deleteWorkflowProcessTask.fulfilled, (state, action) => {
        const workflowProcess = state.workflowProcess.find(c => c.workflowProcessId === action.payload.workflowProcessId);
        if (workflowProcess) {
          workflowProcess.tasks = workflowProcess.tasks?.filter(item => item.workflowProcessTaskId !== action.payload.workflowProcessTaskId);
        }
      })

      //update task
      .addCase(updateWorkflowProcessTask.fulfilled, (state, action) => {
        const workflowProcess = state.workflowProcess.find(
          (c) => c.workflowProcessId === action.payload.workflowProcessId
        );
        if (workflowProcess) {
          workflowProcess.tasks = workflowProcess.tasks?.map((item) =>
            item.workflowProcessTaskId === action.payload.workflowProcessTaskId
              ? action.payload
              : item
          );
        }
      });
  },
});

export const { toggleExpandWorkflowProcess, setSelectedFilters, clearFilters, resetAllCategoriesIsExpanded } =
  workflowSlice.actions;
export default workflowSlice.reducer;
