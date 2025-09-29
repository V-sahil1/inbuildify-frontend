import { IconInfoSmall } from "@tabler/icons-react"
import { Button, Tag } from "antd"

const ConstructionDetailHeader = () => {
    return (
        <>
            <div className="grid grid-cols-6 gap-1 text-sm m-3 w-full">
                <div className="col-span-2 border-l-2 pl-2 ">
                    <div className="text-base font-semibold text-blue">Murthy Test</div>
                    <div>Lot 678,23232,VIC,2323</div>
                </div>
                <div className="col-span-1 border-l-2 pl-2">
                    <div>156 days</div>
                    <div className="mt-1"><Tag color="blue" className="flex items-center ">Estimated<IconInfoSmall /></Tag></div>
                </div>
                <div className="col-span-1 border-l-2 pl-2" >
                    <div className="text-red-500">333 days</div>
                    <div className="mt-1"><Tag color="red">Overdue</Tag></div>
                </div>
                <div className="col-span-2 flex pl-2 gap-2 " >
                    <Button size="small" className="text-xs"> Defect <div className="rounded-full w-4 h-4 bg-primary text-white">2</div></Button>
                    <Button size="small" className="text-xs">Show Date</Button>
                </div>
            </div>
        </>
    )
}
export default ConstructionDetailHeader;