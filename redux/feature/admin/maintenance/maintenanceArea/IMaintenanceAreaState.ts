import { Status } from "@lib/constants/enum";

export interface MaintenanceArea {
  maintenanceAreaId: number | string;
  name: string;
}

export interface IMaintenanceAreaState {
  maintenanceArea: MaintenanceArea[];
  status: {
    fetch: Status;
    update: Status;
  }
}