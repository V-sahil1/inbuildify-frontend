import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { EmailScheduler } from '@/components/configurations/components/scheduler/EmailScheduler';
import SchedulerSetting from '@/components/configurations/components/scheduler/SchedulerSetting';

const TABS = [
  {
    id: 'email',
    label: tabsLabel('Email', 'Customize email reminder or report'),
    component: EmailScheduler,
  },
  {
    id: 'schedulerSetting',
    label: tabsLabel('Schedular settings', 'set schedular common settings'),
    component: SchedulerSetting,
  },
];

export default function SchedulerConfig() {
  return <TabLayout tabs={TABS} />;
}
