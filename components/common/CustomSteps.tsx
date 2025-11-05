import { Steps } from 'antd';

type step = {
  title: string | React.ReactNode;
  content?: string | React.ReactNode;
  description?: string | React.ReactNode;
};

type CustomStepsPropsType = {
  steps: step[];
  currentValue: number;
  setCurrent: (value) => void;
  titlePlacement?: 'horizontal' | 'vertical';
  status?: "wait" | "process" | "finish" | "error";
};

export const CustomSteps: React.FC<CustomStepsPropsType> = ({
  steps,
  currentValue,
  setCurrent,
  titlePlacement = 'vertical',
  status
}) => {
  return (
    <div>
      <div>
        <Steps
          labelPlacement={titlePlacement}
          current={currentValue}
          onChange={value => setCurrent(value)}
          status={status}
          items={steps}
        />
      </div>
      <div>{steps[currentValue]?.content}</div>
    </div>
  );
};


