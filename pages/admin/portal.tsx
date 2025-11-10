import TabLayout from '@/components/common/TabLayout';
import { tabsLabel } from '@/components/common/TabLabel';
import { CustomerPortal } from '@/components/configurations/components/portal/customerPortal';
import AgentPortal from '@/components/configurations/components/portal/agentPortal';

const TABS = [
  {
    id: 'Customer-portal',
    label: tabsLabel('Customer Portal', 'Set customer portal common setting'),
    component: CustomerPortal,
  },
  {
    id: 'agent-portal',
    label: tabsLabel('Agent Portal', 'Set agent portal common setting'),
    component: AgentPortal,
  },
];

export default function GeneralConfig() {
  return <TabLayout tabs={TABS} />;
}
