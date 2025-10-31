import { Steps, Tag } from 'antd';

type DescriptionProps = {
  est_date: string;
  act_date?: string;
  est_days: string;
  act_days: string;
};

const DescriptionTab: React.FC<DescriptionProps> = ({ est_date, est_days, act_date, act_days }) => {
  return (
    <div className="w-full block ">
      <div className="gap-2 flex flex-col bg-card-color border border-gray-300 p-3 text-[10px] !max-w-[200px]">
        <div className="flex justify-between gap-1">
          <div>Est End</div>
          <div className="text-primary">{est_date}</div>
          <div>
            <Tag color="blue" className="text-[10px]">
              {est_days}
            </Tag>
          </div>
        </div>
        <div className="flex justify-between">
          <div>Act End</div>
          <div className="text-primary">{act_date}</div>
          <div>
            <Tag color="red" className="text-[10px]">
              {act_days}
            </Tag>
          </div>
        </div>
      </div>
    </div>
  );
};

const ConstructionTimeline = ({ current_value, setCurrent, steps }) => {
  const handleChange = value => {
    setCurrent(value);
  };
  return (
    <div className="mt-3">
      <div>
        <Steps
          current={current_value}
          direction="horizontal"
          labelPlacement="vertical"
          items={steps}
          onChange={handleChange}
        />
      </div>
      <div className="flex justify-between">
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
        <DescriptionTab
          est_date="13-04-2022"
          est_days="1 days"
          act_date="13-04-2022"
          act_days="1 days"
        />
      </div>
    </div>
  );
};
export default ConstructionTimeline;
