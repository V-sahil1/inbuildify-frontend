import { IconCaretDownFilled, IconMessage, IconPlus, IconTruck } from "@tabler/icons-react"
import { Button, Checkbox, DatePicker, Dropdown, Input, MenuProps, Modal, Table, Tag } from "antd"
import { useEffect, useState } from "react";
import InspectionCheckListDrawer from "./InspectionCheckListDrawer";
import MailSendModal from "../common/Models/MailSendModal";

const ConstructionBaseStage = () => {
    const [inspectionOpen, setIsInspectionOpen] = useState(false);
    const [sendEmailOpen, setsendEmailOpen] = useState(false);
    useEffect(() => {
        const fetchConstructionBaseStageData = () => {
            //   call fetch api for fetchConsrructionbase stage data
        }
        fetchConstructionBaseStageData();
    }, [])
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
        { checklistitem: 'Cross over (Check with council if required)', supplier: 'Austral Bricks', start: '14-07-21', finish: '21-07-21', checklistDefect: '', acceptanceDate: '14-07-21', status: 'Pending Acceptance' },
        { checklistitem: 'Chemical Toilet', supplier: 'Building Suppliers', start: '14-07-21', finish: '', checklistDefect: '14-07-21', acceptanceDate: '14-07-21', status: 'Pending Acceptance' },
        { checklistitem: 'Temporary fence/Cage with Lid', supplier: 'Austral Bricks', start: '14-07-21', finish: '21-07-21', checklistDefect: '14-07-21', acceptanceDate: '14-07-21', status: 'Pending Acceptance' }
    ]
    const columns = [
        {
            title: (<div className="flex flex-col gap-1">
                <div>Checklist Items</div>
                <div><Input /></div>
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
            render: (_, record) => {
                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1 text-xs "><Dropdown menu={{ items }} trigger={["click"]}>{record.supplier}</Dropdown><IconCaretDownFilled size={15} /></div>
                        <div className="text-black flex gap-2 "><IconMessage size={20} className="text-blue" /><IconTruck size={20} className="text-blue" /><p>{record.acceptanceDate}
                        </p><Tag color='orange'>  {record.status}</Tag></div>
                    </div>
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div>Start</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'start',
            key: "start",
            render: (_, record) => {
                return (
                    <div className="text-black">{record.start ? record.start : <DatePicker className="!pl-0" variant="borderless" suffixIcon={null} allowClear={true} />}</div>
                )
            }
        },
        {
            title: (<div className="flex flex-col gap-1">
                <div>Finish</div>
                <div><Input /></div>
            </div>),
            dataIndex: 'finish',
            key: "finish",
            render: (_, record) => {
                return (
                    <div className="text-black">{record.finish ? record.finish : <DatePicker className="!pl-0" variant="borderless" suffixIcon={null} allowClear={false} />}</div>
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
            render: (_, record) => {
                return (
                    <div className="flex gap-1">
                        <Checkbox checked={record.checklistDefect} />
                        <p>{record.checklistDefect}</p>
                    </div>
                )
            }
        },
    ]
    return (
        <div className="bg-card-color !mt-0 p-3">
            <div>Private Inspector : Murthy <Button type="primary" size="small" className="text-xs" onClick={() => { setsendEmailOpen(true) }}>Notify me</Button></div>
            <div className="flex items-center justify-end gap-1">
                <p className="text-xs">(Last Claim on:24-03-2022)</p>
                <Button size="small" type="primary" className="text-xs" >Reclaim</Button>
                <Button size="small" type="primary" className="text-xs" >Update Status</Button>
                <Button size="small" type="primary" className="text-xs" onClick={() => { setIsInspectionOpen(true) }}>Inspection</Button>
                <Button size="small" type="primary" className="text-xs">OH&S</Button>
                <Button size="small" type="primary" className="text-xs" >Mark as current stage</Button>
            </div>
            <div>
                <Table columns={columns} dataSource={data}
                    components={{
                        body: {
                            row: (props: any) => (
                                <tr {...props} style={{ backgroundColor: 'var(--success-50)' }} />
                            ),
                        },
                    }}
                />
            </div>
            <InspectionCheckListDrawer open={inspectionOpen} onClose={() => setIsInspectionOpen(false)} />
            <MailSendModal open={sendEmailOpen} onCancel={() => setsendEmailOpen(false)} onSend={() => { }} />

        </div>
    )
}

export default ConstructionBaseStage;