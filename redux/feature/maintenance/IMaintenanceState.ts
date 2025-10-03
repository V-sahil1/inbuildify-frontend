
export type Status = "readyformaintenance" | "undermaintenance" | "completed" ;

export interface Maintenance {
    id: string;
    customerName: string;
    jobAddress: string;
    startDate:string;
    endDate:string;
    Supervisor: string;
    status :Status;
}