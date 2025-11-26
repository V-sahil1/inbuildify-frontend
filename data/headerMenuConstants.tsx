import SystemRoutes from '@lib/constants/Routes';
import {
  IconAddressBook,
  IconBeach,
  IconBriefcase2,
  IconBuildingEstate,
  IconCalendarFilled,
  IconChecklist,
  IconClipboardList,
  IconCoins,
  IconColorPicker,
  IconDatabase,
  IconFileCertificate,
  IconFileDescription,
  IconHome,
  IconLayout2,
  IconListCheck,
  IconPackage,
  IconPalette,
  IconReceipt,
  IconSettings,
  IconTruck,
  IconUser,
  IconUsers,
  IconUsersGroup,
} from '@tabler/icons-react';

export interface MenuItem {
  id: number;
  key?: string;
  icon: React.ReactNode;
  label: string;
  href?: string;
}

export const gridMenuItems: MenuItem[] = [
  {
    id: 1,
    icon: <IconUser className="w-4 h-4 mr-3" />,
    label: 'User',
    href: `${SystemRoutes.USERS}`,
  },
  {
    id: 2,
    icon: <IconAddressBook className="w-4 h-4 mr-3" />,
    label: 'Contact',
    href: `${SystemRoutes.CONTACTS}`,
  },
  {
    id: 3,
    icon: <IconUsersGroup className="w-4 h-4 mr-3" />,
    label: 'User Group',
    href: '#',
  },
  {
    id: 4,
    icon: <IconCalendarFilled className="w-4 h-4 mr-3" />,
    label: 'Appointment',
    href: `${SystemRoutes.APPOINTMENT}`,
  },
  {
    id: 5,
    icon: <IconChecklist className="w-4 h-4 mr-3" />,
    label: 'Task',
    href: `${SystemRoutes.TASKS}`,
  },
  {
    id: 6,
    icon: <IconListCheck className="w-4 h-4 mr-3" />,
    label: 'Todo',
    href: `${SystemRoutes.TODO}`,
  },
  {
    id: 7,
    icon: <IconUsers className="w-4 h-4 mr-3" />,
    label: 'Agent/Referral',
    href: `${SystemRoutes.AGENT_REFERRAL}`,
  },
];

export const gridMenuItems2: MenuItem[] = [
  {
    id: 1,
    icon: <IconSettings className="w-4 h-4 mr-3" />,
    label: 'Admin',
    href: `${SystemRoutes.ADMIN}/general`,
  },
  {
    id: 2,
    icon: <IconDatabase className="w-4 h-4 mr-3" />,
    label: 'Master Collections',
    href: `${SystemRoutes.MASTER_COLLECTION}`,
  },
  {
    id: 3,
    icon: <IconReceipt className="w-4 h-4 mr-3" />,
    label: 'Price List',
    href: `${SystemRoutes.PRICELIST}`,
  },
  {
    id: 4,
    icon: <IconHome className="w-4 h-4 mr-3" />,
    label: 'Facade',
    href: `${SystemRoutes.FACADE}`,
  },
  {
    id: 5,
    icon: <IconLayout2 className="w-4 h-4 mr-3" />,
    label: 'Floor Plan',
    href: `${SystemRoutes.FLOORPLAN}`,
  },
  {
    id: 6,
    icon: <IconPackage className="w-4 h-4 mr-3" />,
    label: 'Package',
    href: `${SystemRoutes.PACKAGE}`,
  },

  {
    id: 7,
    icon: <IconPalette className="w-4 h-4 mr-3" />,
    label: 'Color',
    href: `${SystemRoutes.COLOR}`,
  },
  {
    id: 8,
    icon: <IconColorPicker className="w-4 h-4 mr-3" />,
    label: 'Color Group',
    href: `${SystemRoutes.COLOR_GROUP}`,
  },
  {
    id: 9,
    icon: <IconTruck className="w-4 h-4 mr-3" />,
    label: 'Supplier',
    href: `${SystemRoutes.SUPPLIER}`,
  },

  {
    id: 10,
    icon: <IconBeach className="w-4 h-4 mr-3" />,
    label: 'Holiday',
    href: `${SystemRoutes.HOLIDAY_MASTER}`,
  },
  {
    id: 11,
    icon: <IconFileDescription className="w-4 h-4 mr-3" />,
    label: 'Quotation Format',
    href: '#',
  },
  {
    id: 12,
    icon: <IconClipboardList className="w-4 h-4 mr-3" />,
    label: 'Survey Template',
    href: `${SystemRoutes.SURVEY_TEMPLATE}`,
  },

  {
    id: 13,
    icon: <IconBuildingEstate className="w-4 h-4 mr-3" />,
    label: 'Estate',
    href: `${SystemRoutes.ESTATE}`,
  },
  {
    id: 14,
    icon: <IconCoins className="w-4 h-4 mr-3" />,
    label: 'Cost Center',
    href: `${SystemRoutes.COST_CENTER}`,
  },
  {
    id: 15,
    icon: <IconFileCertificate className="w-4 h-4 mr-3" />,
    label: 'Contract Document Format',
    href: `${SystemRoutes.CONTRACT}`,
  },
];

export const createMenuGridItems: MenuItem[] = [
  {
    id: 1,
    key: 'lead',
    label: 'Lead',
    icon: <IconUser className="w-4 h-4" />,
  },
  {
    id: 2,
    key: 'job',
    label: 'Job',
    icon: <IconBriefcase2 className="w-4 h-4" />,
  },
  {
    id: 3,
    key: 'task',
    label: 'Task',
    icon: <IconChecklist className="w-4 h-4" />,
  },
  {
    id: 4,
    key: 'appointment',
    label: 'Appointment',
    icon: <IconCalendarFilled className="w-4 h-4" />,
  },
];
