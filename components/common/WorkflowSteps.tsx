import { IconDotsVertical } from '@tabler/icons-react';
import { Button, Dropdown } from 'antd';

type Steps = {
  key: string;
  label: string;
  status?: string;
  color: string;
  icon: string;
  date?: string;
  onClick?: () => void;
  options?: { key: string; label: string }[];
};

type WorkflowStepsProps = {
  steps: Steps[];
};

const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ steps }) => {
  return (
    <div className="flex overflow-x-auto">
      {steps.map((item, index) => {
        const isLast = index === steps.length - 1;
        return (
          <div
            className="flex flex-1 "
            onClick={e => {
              e.preventDefault();
              item?.onClick();
            }}
          >
            <div
              className={`flex-1 flex-col text-center py-2  cursor-pointer  justify-center ${item.color}
                                          ${index > 0 ? '-ml-40' : ''} z-[${steps.length - index}]
                                          ${index == 0 ? 'rounded-tl-lg rounded-bl-lg' : isLast ? 'rounded-tr-lg rounded-br-lg' : ''} `}
              style={{
                clipPath:
                  index == 0
                    ? 'polygon( 0% 0%, 76% 0%,100% 50%,76% 100%, 0% 100%,0% 50%)'
                    : isLast
                      ? 'polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 20% 50%)'
                      : 'polygon( 0% 0%, 80% 0%,100% 50%,80% 100%, 0% 100%,20% 50%)',
              }}
            >
              <div
                className={`md:pr-[40px] md:pl-[20px]  ${index == 0 ? 'pr-[20px]' : isLast ? 'pl-[25px]' : ' sm:px-[26px] px-[32px]'}`}
              >
                <div className="flex justify-center">
                  <div
                    className={`flex items-center justify-center border-[2px] border-white rounded-full w-30 h-30 ${item.color} text-white my-2 p-2 text-xs`}
                  >
                    {item.icon}
                  </div>
                </div>
                <Button type="link">{item.label}</Button>
                <div className="text-xs flex justify-between px-2">
                  <p>
                    {item?.status} {item.date && 'on'} {item?.date}
                  </p>
                  <Dropdown menu={{ items: item.options }}>
                    <IconDotsVertical size={15} className="text-blue" />
                  </Dropdown>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default WorkflowSteps;
