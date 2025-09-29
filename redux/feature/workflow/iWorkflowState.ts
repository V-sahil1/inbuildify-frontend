export interface Task {
  workflowProcessTaskId: string;
  workflowProcessId: string;
  name: string;
  description: string;
  attachment: string;
  timespent: number; 
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowProcess {
  workflowProcessId: string;
  name: string;
  description: string;
  displayOrder?: number;
  createdAt: string;
  updatedAt: string;
  image?: string;
  tasks: Task[] | null;
  isExpanded: boolean;
  loadingItems: boolean;
} 

export interface RequestTask {
  workflowProcessId: string;
  description: string;
  sort_order?: number;
  range?: string; 
}
