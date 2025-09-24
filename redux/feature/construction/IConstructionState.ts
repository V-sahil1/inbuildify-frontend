
export type Status = "readyforconstruction" | "underconstruction" | "completed" | "onhold";

export interface Construction {
    id: number;
    customerName: string;
    jobAddress: string;
    builderName: string;
    jobTitle: string;
    currentStage: string;
    dueDate: string;
    siteSupervisor: string;
    status: Status;
}