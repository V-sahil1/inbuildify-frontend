import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { SettingPage } from '@/components/configurations/components/maintenance/Setting';
import { MaintenanceArea } from '@/components/configurations/components/maintenance/MaintenanceArea';

const TABS = [
  {
    id: 'setting',
    label: tabsLabel('Maintenance Setting', 'manage Maintenance duration'),
    component: SettingPage,
  },
  {
    //note::  here need to add condition for this section to be visible it will be visible only if in the setting area property is true
    id: 'maintenance-area',
    label: tabsLabel('Maintenance Area', 'add new area'),
    component: MaintenanceArea,
  },
];

export default function MaintenanceConfig() {
  return <TabLayout tabs={TABS} />;
}
