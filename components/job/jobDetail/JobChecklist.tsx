import { Button, Drawer, Input, Select, Switch } from "antd";
import CheckList from "./Checklist";
import { useState } from "react";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
const {TextArea} = Input

const JobChecklist = ({open,onClose}:{open:boolean,onClose:()=>void} ) =>{
    const [isnewChecklistOpen,setNewchecklistopen]=useState(false)
    const data =[
        {title:'Internet -NBM Opticum',type:'dropdown'},
        {title:'Water recycled or rainwater tank or solar hot water',type:'dropdown'},
        {title:'Eaves-450 or 300 and eaves retuen',type:'checkbox'},
        {title:'Roof pitch (what pitches developer allow)',type:'dropdown'},
        {title:'Roof low profile tiles)',type:'dropdown'},
    ]
    return(<>
    <Drawer 
    title='DA Checklist'
    placement="right"
    size="large"
    onClose={onClose}
    open={open}
    >
    <div>
        <div className="flex justify-between">
            <div className="flex gap-2 border border-border-color rounded-3xl p-1 items-center">
                <Button type="primary" className="flex gap-2  rounded-3xl p-1 items-center">
                 <p>ALL</p><div className="rounded-full w-6 h-6 bg-white text-primary text-center">8</div>
                 </Button>
                <Button type="primary" className="flex gap-2  rounded-3xl p-1 items-center">
                    <p>Pending</p> <div className="rounded-full w-6 h-6 bg-white text-primary text-center">8</div>
                    </Button>
               <Button type="primary" className="flex gap-2  rounded-3xl p-1 items-center">
                <p>Completed</p> <div className="rounded-full w-6 h-6 bg-white text-primary text-center">8</div>
                </Button>
            </div>
            <div className="flex items-center text-primary gap-2" onClick={()=>setNewchecklistopen(true)}>
                <div className="rounded-full text-sm w-4 h-4 border border-primary"> <IconPlus size={15} /> </div>
                <div >Checklist</div>
            </div>
        </div>
        {isnewChecklistOpen && 
            <div className="flex gap-3 justify-between items-center text-xs p-4 m-2 bg-body-color">
                <div>
                    <p>Description</p>
                    <TextArea rows={1}/>
                </div>
                <div>
                    <p>Notes</p>
                    <Switch></Switch>
                </div>
                 <div>
                    <p>Required</p>
                    <Switch></Switch>
                </div>
                <div>
                    <p>Type</p>
                    <Select defaultValue='checkbox' options={[{value:'checkbox',label:'Checkbox'},
                        {value:'dropdown',label:'Dropdown'}
                    ]}></Select>
                </div>
                <div className="flex gap-2">
                    <div><Button type="text" icon={<IconCheck />}></Button></div>
                 <div onClick={()=>setNewchecklistopen(false)}>
                    <Button type="text" icon={<IconX />}></Button></div>
                </div>  
            </div>
                }
       {data.map((obj)=>(
        <>
        <CheckList title={obj.title} type={obj.type} />
        </>
       ))}        
    </div>
</Drawer>
</>)
}

export default JobChecklist;