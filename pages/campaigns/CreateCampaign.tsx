import CampaignContacts from '@/components/Campaign/CampaignContacts';
import CampaignDetail from '@/components/Campaign/CampaignDetail';
import CampaignPreviewSend from '@/components/Campaign/CampaignPreviewSend';
import CustomStepsModel from '@/components/common/CustomSteps';
import { IconMathGreater } from '@tabler/icons-react';
import { useState } from 'react';

export default function CreateCampaign() {
  const [current, setCurrent] = useState(0);
  const steps = [
    {
      title: 'Campaign Details',
      content: <CampaignDetail setCurrent={setCurrent} current={current} />,
    },
    {
      title: 'Type of Contacts',
      content: <CampaignContacts setCurrent={setCurrent} current={current} />,
    },
    { title: 'Preview and Send', content: <CampaignPreviewSend /> },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center gap-3 mb-6">
        Campaign List <IconMathGreater size={15} /> Campaign
      </div>
      <CustomStepsModel
        currentValue={current}
        setCurrent={setCurrent}
        steps={steps}
      ></CustomStepsModel>
    </div>
  );
}
