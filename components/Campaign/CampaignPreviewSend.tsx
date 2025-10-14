import { Button, Input } from "antd"
import CampaignFilter from "./CampaignFilter"
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { data, DataType } from 'data/CampaignContactData'

const CampaignPreviewSend = () => {
    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: "name",
            key: "name",
            width: 150,
        },
        {
            title: 'Email',
            dataIndex: "email",
            key: "email",
            width: 150,
        },
        {
            title: 'Address',
            dataIndex: "address",
            key: "address",
            width: 150,
        }
    ];

    const fields = [
        { label: 'Campaign Name', value: 'new' },
        { label: 'Subject', value: '[ContactName]' },
        { label: 'Attachment', value: 'No Attachment' },
        { label: 'Message', value: 'Preview' },

    ]
    return (<div className="border border-border-color bg-card-color mt-8 p-4 mb-3">
        <div className="flex justify-between mb-4">
            <h1 className="text-xl font-medium">Preview and Send</h1>
            <div className="gap-2 flex">
                <Button type="primary">Send</Button>
            </div>
        </div>
        <div>
            <div className="flex justify-between mb-3 text-sm">
                <div className="flex flex-col gap-2">
                    {fields.map((field) => (
                        <div className="flex">
                            <p className="w-[300px]">{field.label}</p>
                            <p>{field.value}</p>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col gap-2 border border-border-color p-3">
                    <p>Send to (Add , if you use multiple email id)</p>
                    <Input />
                    <Button>Send Test Email</Button>
                </div>
            </div>
            <div>
                <h1 className="text-sm mb-3">Type of Contacts</h1>
                <CampaignFilter />
                <p className="my-3">Contact Details</p>
                <Table columns={columns} dataSource={data} pagination={{pageSize:10}} />
            </div>
        </div>
    </div>)
}

export default CampaignPreviewSend