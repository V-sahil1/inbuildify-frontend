import TabLayout from '@/components/common/TabLayout';
import RoleAndUser from '@/components/configurations/components/general/RoleAndUser';
import { tabsLabel } from '@/components/common/TabLabel';
import { SettingPage } from '@/components/configurations/components/construction/Setting';
import { Options } from '@/components/configurations/components/construction/Options';
import { Types } from '@/components/configurations/components/construction/Types';
import { Stages } from '@/components/configurations/components/construction/Stages';
import { Checklist } from '@/components/configurations/components/construction/Checklist';
import { InspectionChecklist } from '@/components/configurations/components/construction/InspectionChecklist';
import { OHList } from '@/components/configurations/components/construction/OHList';
import { ETSRecharge } from '@/components/configurations/components/construction/ETSRecharge';

const TABS = [
  {
    id: 'settings',
    label: tabsLabel('Construction Settings', 'set construction Common Settings'),
    component: SettingPage,
  },
  {
    id: 'options',
    label: tabsLabel('Options', 'Add new or edit options'),
    component: Options,
  },
  {
    id: 'types',
    label: tabsLabel('Types', 'Add new or edit construction types'),
    component: Types,
  },
  {
    id: 'stages',
    label: tabsLabel('Stages', 'Manage stages'),
    component: Stages,
  },
  {
    id: 'checklist',
    label: tabsLabel('Checklist', 'Manage construction checklist'),
    component: Checklist,
  },
  {
    id: 'inspection-checklist',
    label: tabsLabel('Inspection Checklist', 'manage Inspection Checklist'),
    component: InspectionChecklist,
  },
  {
    id: 'ohs-list',
    label: tabsLabel('OH&S List', 'Manage OH&S List'),
    component: OHList,
  },
  {
    id: 'role-and-user-mapping',
    label: tabsLabel('ETS & Recharge', 'Manage ETS & Recharge'),
    component: ETSRecharge,
  },
];

export default function ConstructionConfig() {
  return <TabLayout tabs={TABS} />;
}
