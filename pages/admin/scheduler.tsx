import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { IntegrationArea } from '@/components/configurations/components/Integration/IntegrationArea';
import { OptionalSettings } from '@/components/configurations/components/Integration/OptionalSetting';

const TABS = [
  {
    id: 'email',
    label: tabsLabel('Email', 'Customize email reminder or report'),
    component: IntegrationArea,
  },
  {
    id: 'emailSignature',
    label: tabsLabel('Schedular settings', 'set schedular common settings'),
    component: OptionalSettings,
  },
];

export default function SchedulerConfig() {
  return <TabLayout tabs={TABS} />;
}
