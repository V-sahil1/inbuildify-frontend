import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { Setting } from '@/components/configurations/components/job/Setting';
import { JobProcess } from '@/components/configurations/components/job/JobProcess';
import { Colors } from '@/components/configurations/components/job/Colors';
import { Workflow } from '@/components/configurations/components/job/Workflow';
import { Invoice } from '@/components/configurations/components/job/Invoice';
import { Variation } from '@/components/configurations/components/job/Variation';

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
  // {
  //   id: "checklist",
  //   label: tabsLabel("Checklist", "Manage Checklist"),
  //   component: Checklist,
  // },
  // {
  //   id: "role-and-user-mapping",
  //   label: tabsLabel("Role and User Mapping", "set default user each role"),
  //   component: RoleAndUser,
  // },
  // {
  //   id: "password-policy",
  //   label: tabsLabel("Password Policy", "Password privacy settings"),
  //   component: PasswordPolicy,
  // },
];

export default function GeneralConfig() {
  return <TabLayout tabs={TABS} />;
}
