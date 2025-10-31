import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { IconBuilding, IconCircleCheck, IconThumbUp } from '@tabler/icons-react';
import { StatusCard } from 'data/types';

dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

export type DateRange = [Dayjs, Dayjs] | null;
export type { Maintenance } from '@redux/feature/maintenance/IMaintenanceState';

export const PROJECT_STATUS_MAP: Record<string, StatusCard> = {
  readyformaintenance: {
    label: 'Ready For Maintenance',
    color: '#fa8c16',
    icon: <IconThumbUp size={24} color="#fa8c16" />,
  },
  undermaintenance: {
    label: 'Under Maintenance',
    color: '#1890ff',
    icon: <IconBuilding size={24} color="#1890ff" />,
  },
  completed: {
    label: 'Completed',
    color: '#52c41a',
    icon: <IconCircleCheck size={24} color="#52c41a" />,
  },
};

export const getStatus = (status: string): StatusCard => {
  return PROJECT_STATUS_MAP[status.toLowerCase()];
};
