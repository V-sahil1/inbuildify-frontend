import TabLayout from '@/components/common/TabLayout';
import NotesTag from '@/components/configurations/components/general/NotesTag';
import RoleAndUser from '@/components/configurations/components/general/RoleAndUser';
import { PasswordPolicy } from '@/components/configurations/components/general/PasswordPolicy';
import { tabsLabel } from '@/components/common/TabLabel';
import { SettingPage } from '@/components/configurations/components/construction/Setting';
import { Options } from '@/components/configurations/components/construction/Options';
import { Types } from '@/components/configurations/components/construction/Types';
import { Stages } from '@/components/configurations/components/construction/Stages';
import { Checklist } from '@/components/configurations/components/construction/Checklist';

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
    id: 'notes-tag',
    label: tabsLabel('Notes Tag', 'Add tags to category the notes'),
    component: NotesTag,
  },
  {
    id: 'checklist',
    label: tabsLabel('Checklist', 'Manage Checklist'),
    component: Checklist,
  },
  {
    id: 'role-and-user-mapping',
    label: tabsLabel('Role and User Mapping', 'set default user each role'),
    component: RoleAndUser,
  },
  {
    id: 'password-policy',
    label: tabsLabel('Password Policy', 'Password privacy settings'),
    component: PasswordPolicy,
  },
];

export default function ConstructionConfig() {
  return <TabLayout tabs={TABS} />;
}
