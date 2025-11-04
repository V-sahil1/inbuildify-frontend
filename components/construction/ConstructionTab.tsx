import { Result, Tabs } from 'antd';
import ConstructionFrameStage from './ConstructionFrameStage';
import ConstructionBaseStage from './ConstructionBaseStage';
import LeadActions from '../leadDetail/LeadActions';
import ActivityCard from '../common/ActivityCard';
import { EmailData, filterTabs } from 'data/activityData';

const ConstructionTabs = ({ current_value, setCurrent }) => {
  const items = [
    {
      title: 'Preconstruction',
      children: (
        <div className="bg-card-color">
          <Result
            title="Preconstruction Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
    {
      title: 'Base Stage',
      children: <ConstructionBaseStage setCurrent={setCurrent} />,
    },
    {
      title: 'Frame Stage',
      children: <ConstructionFrameStage />,
    },
    {
      title: 'Lockup Stage',
      children: (
        <div className="bg-card-color">
          <Result
            title="Lockup Stage Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
    {
      title: 'Fixing Stage',
      children: (
        <div className="bg-card-color">
          <Result
            title="Fixing Stage Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
    {
      title: 'Completion Stage',
      children: (
        <div className="bg-card-color">
          <Result
            title="Completion Stage Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
  ];
  const steps = [
    {
      key: '1',
      label: items[current_value].title,
      children: items[current_value].children,
    },
    {
      key: '2',
      label: 'Documents',
      children: (
        <div className="bg-card-color">
          <Result title="Document Functionality coming soon" subTitle="Please check back later" />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Site Images',
      children: (
        <div className="bg-card-color">
          <Result
            title="Site Images Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
    {
      key: '4',
      label: 'Actions',
      children: <LeadActions leadId="MK102CH2DSF" />,
    },
    {
      key: '5',
      label: 'Activity',
      children: <ActivityCard data={EmailData} tabs={filterTabs} />,
    },
    {
      key: '6',
      label: 'Gantt Chart',
      children: (
        <div className="bg-card-color">
          <Result
            title="Gantt Chart Functionality coming soon"
            subTitle="Please check back later"
          />
        </div>
      ),
    },
  ];
  return (
    <div className="mt-4">
      <Tabs
        tabBarStyle={{ margin: '0px', marginRight: '10px' }}
        tabBarGutter={10}
        items={steps}
        type="card"
      />
    </div>
  );
};
export default ConstructionTabs;
