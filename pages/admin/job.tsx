import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { Setting } from '@/components/configurations/components/job/Setting';
import { JobProcess } from '@/components/configurations/components/job/JobProcess';
import { Colors } from '@/components/configurations/components/job/Colors';
import { Workflow } from '@/components/configurations/components/job/Workflow';
import { Invoice } from '@/components/configurations/components/job/Invoice';
import { Variation } from '@/components/configurations/components/job/Variation';
import { Comission } from '@/components/configurations/components/job/Comission';

const TABS = [
  {
    id: 'settings',
    label: tabsLabel('Settings', 'Job Settings'),
    component: Setting,
  },
  {
    id: 'job-process',
    label: tabsLabel('Job Process', 'Configure job Stages'),
    component: JobProcess,
  },
  {
    id: 'colors',
    label: tabsLabel('Colors', 'Manage color Selection'),
    component: Colors,
  },
  {
    id: 'workflow',
    label: tabsLabel('Workflow', 'Manage Workflow'),
    component: Workflow,
  },
  {
    id: 'invoice',
    label: tabsLabel('Invoice', 'Manage Invoice and stage payments'),
    component: Invoice,
  },
  {
    id: 'variation',
    label: tabsLabel('Variation', 'Manage variation'),
    component: Variation,
  },
  {
    id: 'comission',
    label: tabsLabel('Comission', 'Manage Comission settings'),
    component: Comission,
  },
];

export default function GeneralConfig() {
  return <TabLayout tabs={TABS} />;
}
