import { Steps } from "antd";

type step = {
    title: string;
    content?: string | React.ReactNode
    description?: string | React.ReactNode
}

type CustomStepsPropsType = {
    steps: step[],
    currentValue: number;
    setCurrent: (value) => void
}

const CustomSteps: React.FC<CustomStepsPropsType> = ({ steps, currentValue, setCurrent }) => {

    return (
        <div>
            <div className="mx-[100px]"> <Steps current={currentValue} onChange={(value) => setCurrent(value)} items={steps} ></Steps></div>
            <div>{steps[currentValue].content}</div>
        </div>
    )
}

export default CustomSteps;