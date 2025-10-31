export type Status = 'readyforconstruction' | 'underconstruction' | 'completed' | 'onhold';

export interface Construction {
  id: string;
  customerName: string;
  jobAddress: string;
  builderName: string;
  jobType: string;
  currentStage: string;
  dueDate: string;
  siteSupervisor: string;
  status: Status;
}
