import { Status } from "@lib/constants/enum";

export interface JobWorkflow {
  showAllTasksToAllRoles: boolean;
  includeWeekendDate: boolean;
  includeHolidayDate: boolean;
  recalculateEstimatedEndDatesFutureTasks: boolean;
  recalculateEstimatedDatesBasedOnActualChanges: boolean;
}

export interface IJobWorkflowState {
  jobWorkflow: JobWorkflow | null;
  status: {
    fetch: Status;
    update: Status;
  }
}