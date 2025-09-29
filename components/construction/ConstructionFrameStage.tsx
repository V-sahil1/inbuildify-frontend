import { IconCaretDownFilled, IconDotsVertical, IconMessage, IconPlus } from "@tabler/icons-react"
import { Button, Checkbox, Input, Table, Dropdown, MenuProps, DatePicker } from "antd"
import InspectionCheckListDrawer from "./InspectionCheckListDrawer";
import { useState } from "react";

const ConstructionFrameStage = () => {
    const [openDrawer, setOpenDrawer] = useState(false);
    const items: MenuProps['items'] = [
        {
            key: '1',
            label: '1st menu item'
        },
        {
            key: '2',
            label: '2nd menu item'
        }];
    const data = [
        { checklistitem: 'Site measure by car penter' },
        { checklistitem: 'Car measurement from truss company' },
        { checklistitem: 'Delivery of bricks' }
    ]
    const columns = [
        {
            title: (<div className="flex flex-col gap-1">
                <div>Checklist Items</div>
                <div><Input></Input></div>
            </div>),
            dataIndex: 'checklistitems',
            key: "checklistitems",
            render: (_, record) => {
                return (
                    <div>
                        <p className="text-black">{record.checklistitem}</p>
                        <p className="flex items-center gap-1 text-xs text-blue"> <div className="rounded-full w-3 h-3 bg-blue text-white"><IconPlus size={12} /></div>Notes</p>
                    </div>
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div>Supplier</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'supplier',
            key: "supplier",
            render: () => {
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs text-blue"><Dropdown menu={{ items }} trigger={["click"]}>Assign Supplier</Dropdown><IconCaretDownFilled size={15} /></div>
                        <div className="text-blue"><IconMessage size={20} /></div>
                    </div>
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div>Start</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'Start',
            key: "Start",
            render: () => {
                return (
                    <DatePicker variant="borderless" suffixIcon={null} />
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div>Finish</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'Finish',
            key: "Finish",
            render: () => {
                return (
                    <DatePicker variant="borderless" suffixIcon={null} />
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div className="flex gap-1"><Checkbox></Checkbox>Complete</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'Complete',
            key: "Complete",
            render: () => {
                return (
                    <div><Checkbox /></div>
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div className="flex items-center gap-1 text-blue"><div className="rounded-full w-3 h-3 bg-blue text-white"><IconPlus size={12} /></div>Checklist</div>
                <div className="flex items-center gap-1 text-blue"><div className="rounded-full w-3 h-3 bg-blue text-white"><IconPlus size={12} /></div>Defects</div>
            </div>),
            dataIndex: 'operation',
            key: "operation",
            render: () => {
                return (
                    <div className="text-blue"><Dropdown menu={{
                        items: [
                            {
                                key: "edit",
                                label: "Edit",
                                onClick: () => {

                                },
                            },
                            {
                                key: "delete",
                                label: "Delete",
                                onClick: () => { },
                            },
                        ],
                    }} trigger={["click"]}><IconDotsVertical size={15} /></Dropdown></div>
                )
            }
        },
    ]


    return (
        <div className="bg-card-color !mt-0 p-3">
            <div className="flex justify-end gap-1">
                <Button size="small" type="primary" className="text-xs" >Update Status</Button>
                <Button size="small" type="primary" className="text-xs" onClick={() => setOpenDrawer(true)}>Inspection</Button>
                <Button size="small" type="primary" className="text-xs">OH&S</Button>
            </div>
            <div>
                <Table columns={columns} dataSource={data} />
            </div>
            <InspectionCheckListDrawer open={openDrawer} onClose={() => setOpenDrawer(false)} />
        </div>
    )
}

export default ConstructionFrameStage;