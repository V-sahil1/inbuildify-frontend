import React, { useState } from 'react';
import { useRouter } from 'next/router';
import StageProgress from '@/components/common/StageProgress';
import ConstructionDetailHeader from '@/components/construction/ConstructionDetailHeader';
import ConstructionTimeline from '@/components/construction/ConstructionTimeline';
import ConstructionTabs from '@/components/construction/ConstructionTab';

const index = () => {
  const router = useRouter();
  const { id } = router.query;
  const normalizedId = Array.isArray(id) ? id[0] : id;
  const [current, setCurrent] = useState(0);
  const steps = [
    { title: 'Preconstruction' },
    { title: 'Base Stage' },
    { title: 'Frame Stage' },
    { title: 'Lockup Stage' },
    { title: 'Fixing Stage' },
    { title: 'Preconstruction' },
  ];
  return (
    <div className="p-3">
      <div className="flex gap-3">
        <StageProgress id={normalizedId} title="Construction" steps={[]} status="In Progress" />
        <ConstructionDetailHeader />
      </div>
      <ConstructionTimeline current_value={current} setCurrent={setCurrent} steps={steps} />
      <ConstructionTabs current_value={current} setCurrent={setCurrent} />
    </div>
  );
};

export default index;
