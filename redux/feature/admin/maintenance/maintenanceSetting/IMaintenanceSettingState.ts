import { Status } from "@lib/constants/enum";

export interface MaintenanceSettings {
  areaEnabled: boolean;
  supplierEnabled: boolean;
  allowCompletionWithoutSupplierResponse: boolean;
  requestDateEnabled: boolean;
  taskDateEnabled: boolean;
  repairCostEnabled: boolean;
  hoursSpentEnabled: boolean;

  maintenanceStartDate: string | null;
  handoverDate: string | null;

  maintenancePeriodDays: number | null;
  maintenanceDurationDays: number | null;

  supervisorRoles: string[];
}

export interface IMaintenanceSettingState {
  maintenanceSetting: MaintenanceSettings | null;
  status: {
    fetch: Status;
    update: Status;
  }
}