import StageProgress from '@/components/common/StageProgress';
import BuildingContractForm from '@/components/job/jobDetail/joboptions/BuildingContractDetailForm';
import ChecklistForm from '@/components/job/jobDetail/joboptions/BuildingContractForm';
import { IconUserSquareRounded } from '@tabler/icons-react';
import { Tag } from 'antd';

export default function BuildingContract() {
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-card-color p-6">
        <StageProgress title="Contract Details" status="In progress" steps={[]} />
        <div className="border-l-2 pl-2">
          <div className="flex gap-2 items-center text-base font-semibold text-blue">
            Murthy <IconUserSquareRounded color="var(--blue)" size={20} />
          </div>
          <div className="flex items-center gap-1">
            Lot 300 Tallis Cct,Tarneit,VIC,5345<Tag color="green">Titled</Tag>
          </div>
        </div>
      </div>
      <ChecklistForm />
      <BuildingContractForm />
    </div>
  );
}
