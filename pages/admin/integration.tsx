import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { IntegrationArea } from '@/components/configurations/components/Integration/IntegrationArea';
import { OptionalSettings } from '@/components/configurations/components/Integration/OptionalSetting';
import { Website } from '@/components/configurations/components/Integration/Website';
import { Xero } from '@/components/configurations/components/Integration/Xero';
import { Facebook } from '@/components/configurations/components/Integration/Facebook';
import { SMS } from '@/components/configurations/components/Integration/SMS';
import { ESign } from '@/components/configurations/components/Integration/ESign';

const TABS = [
  {
    id: 'integrationArea',
    label: tabsLabel('Integration Area', 'Website and system integration'),
    component: IntegrationArea,
  },
  {
    id: 'optionalSettings',
    label: tabsLabel('Optional settings', 'Lead related common settings'),
    component: OptionalSettings,
  },
  {
    id: 'website',
    label: tabsLabel('Website', 'Website related settings'),
    component: Website,
  },
  {
    id: 'xero',
    label: tabsLabel('Xero', 'Xero related settings'),
    component: Xero,
  },
  {
    id: 'facebook',
    label: tabsLabel('Facebook', 'Facebook related settings'),
    component: Facebook,
  },
  {
    id: 'sms',
    label: tabsLabel('Sms', 'Sms related settings'),
    component: SMS,
  },
  {
    id: 'eSign',
    label: tabsLabel('eSign', 'eSign related settings'),
    component: ESign,
  },
];

export default function IntegrationConfig() {
  return <TabLayout tabs={TABS} />;
}
