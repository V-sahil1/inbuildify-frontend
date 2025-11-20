import { Button } from 'antd';

export const CustomFilterButtons = ({ filterButtons, activeTab, setActiveTab }) => {
  return (
    <div>
      {filterButtons.map(btn => (
        <Button
          className={`${activeTab === btn ? 'bg-primary text-white' : 'text-primary'} rounded-none `}
          onClick={() => setActiveTab(btn)}
        >
          {btn}
        </Button>
      ))}
    </div>
  );
};
