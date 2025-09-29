import { Result, Tabs } from "antd";
import ConstructionFrameStage from "./ConstructionFrameStage";

const ConstructionTabs = ({ current_value }) => {
  const items = [
    {
      title: 'Preconstruction',
      children: <div className="bg-card-color">
        <Result
          title="Preconstruction Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      title: 'Base Stage',
      children: <div className="bg-card-color">
        <Result
          title="Base Stage Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      title: 'Frame Stage',
      children: <ConstructionFrameStage />
    },
    {
      title: 'Lockup Stage',
      children: <div className="bg-card-color">
        <Result
          title="Lockup Stage Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      title: 'Fixing Stage',
      children: <div className="bg-card-color">
        <Result
          title="Fixing Stage Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      title: 'Completion Stage',
      children: <div className="bg-card-color">
        <Result
          title="Completion Stage Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    }
  ]
  const steps = [
    {
      key: '1',
      label: items[current_value].title,
      children: items[current_value].children
    },
    {
      key: '2',
      label: 'Documents',
      children: <div className="bg-card-color">
        <Result
          title="Document Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      key: '3',
      label: 'Site Images',
      children: <div className="bg-card-color">
        <Result
          title="Site Images Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      key: '4',
      label: 'Actions',
      children: <div className="bg-card-color">
        <Result
          title="Actions Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      key: '5',
      label: 'Activity',
      children: <div className="bg-card-color">
        <Result
          title="Activity Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
    {
      key: '6',
      label: 'Gantt Chart',
      children: <div className="bg-card-color">
        <Result
          title="Gantt Chart Functionality coming soon"
          subTitle="Please check back later"
        />
      </div>
    },
  ]
  return (
    <div className="mt-4">
      <Tabs tabBarStyle={{ margin: "0px", marginRight: "10px" }}
        tabBarGutter={10} items={steps} type="card" />
    </div>
  )
}
export default ConstructionTabs;