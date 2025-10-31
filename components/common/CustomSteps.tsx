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
};

const CustomSteps: React.FC<CustomStepsPropsType> = ({
  steps,
  currentValue,
  setCurrent,
  titlePlacement = 'horizontal',
}) => {
  return (
    <div>
      <div>
        <Steps
          labelPlacement={titlePlacement}
          current={currentValue}
          onChange={value => setCurrent(value)}
          items={steps}
        />
      </div>
      <div>{steps[currentValue].content}</div>
    </div>
  );
};

export default CustomSteps;
