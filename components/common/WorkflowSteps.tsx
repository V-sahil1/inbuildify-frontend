import { Button } from "antd";
import Link from "next/link";

type Steps = {
    key: string
    label: string,
    status?: string,
    color: string,
    icon: string,
    date?: string,
    onClick?: () => void;
}

type WorkflowStepsProps = {
    steps: Steps[],
}


const WorkflowSteps: React.FC<WorkflowStepsProps> = ({ steps }) => {

    return (
        <div >
            <div className="flex rounded-lg">

                {steps.map((item, index) => {
                    const isLast = index === steps.length - 1;
                    return (

                        <Link href='#' onClick={() => item?.onClick()} className="flex-1">
                            <div className={`flex-col text-center py-2 cursor-pointer justify-center ${item.color}
                                          ${index > 0 ? " sm:-ml-40 -ml-20" : ""}  `}
                                style={{
                                    zIndex: steps.length - index,
                                    clipPath: index == 0 ? "polygon( 0% 0%, 80% 0%,100% 50%,80% 100%, 0% 100%,0% 50%)"
                                        : isLast ? "polygon(0% 0%, 100% 0%, 100% 100%, 100% 100%, 0% 100%, 20% 50%)"
                                            : "polygon( 0% 0%, 80% 0%,100% 50%,80% 100%, 0% 100%,20% 50%)"
                                }}>
                                <div className="flex justify-center"><div className={`flex items-center justify-center border-[2px] border-white rounded-full w-30 h-30 ${item.color} text-white my-2 p-2 text-xs`}>{item.icon}</div></div>
                                <Button type="link" >{item.label}</Button>
                                <div className="text-xs "><p>{item?.status} {item.date && 'on'} {item?.date}</p></div>

                            </div>

                        </Link>


                    )
                })}
            </div>

        </div>
    )
}
export default WorkflowSteps;