import TimelineActionsBar from '@/components/common/TimeLineComponents/TimelineActionsBar';

export const EmailTemplate = () => {
  const filterOptions = [
    { type: 'All', label: 'All', count: 1 },
    { type: 'Standard', label: 'Standard', count: 2 },
    { type: 'Customized', label: 'Customized', count: 5 },
  ];

  const handleFilterChange = (tab: string) => {
    console.log('Selected filter:', tab);
  };

  return (
    <div>
      <TimelineActionsBar
        tabs={filterOptions}
        onTabChange={handleFilterChange}
        isActionShow={false}
        isCountShow={true}
      />
    </div>
  );
};
