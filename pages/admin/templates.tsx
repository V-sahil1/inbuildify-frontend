import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { OptionalSettings } from '@/components/configurations/components/Integration/OptionalSetting';
import { Website } from '@/components/configurations/components/Integration/Website';
import { Xero } from '@/components/configurations/components/Integration/Xero';
import { EmailTemplate } from '@/components/configurations/components/template/EmailTemplate';

const TABS = [
  {
    id: 'email',
    label: tabsLabel('Email', 'Customize your own email content'),
    component: EmailTemplate,
  },
  {
    id: 'emailSignature',
    label: tabsLabel('Email Signature', 'Customize your own email signature'),
    component: OptionalSettings,
  },
  {
    id: 'notes',
    label: tabsLabel('Notes', 'Customize your own notes contents'),
    component: Website,
  },
  {
    id: 'pdf',
    label: tabsLabel('PDF', 'Configure the header,footer and more'),
    component: Xero,
  },
];

export default function TemplateConfig() {
  return <TabLayout tabs={TABS} />;
}
