import { Button, Input, Tooltip } from "antd";
import CampaignFilter from "./CampaignFilter";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { data, DataType } from 'data/CampaignContactData'
import { useRouter } from "next/router";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { debounce } from "lodash";
const CampaignContacts = ({ current, setCurrent }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [contact, setContact] = useState(searchParams.get("contact") || "")
    const [activeTab, setActiveTab] = useState('Selected')

    const debouncedUpdateURL = useMemo(
        () =>
            debounce((value: string) => {
                const params = new URLSearchParams(window.location.search);
                if (value) {
                    params.set('contact', value);
                }
                else {
                    params.delete('contact')
                }
                router.replace(`${pathname}?${params.toString()}`);
            }, 500), // 500ms debounce delay
        [pathname, router, searchParams]
    );

    useEffect(() => {
        debouncedUpdateURL(contact);
        return () => {
            debouncedUpdateURL.cancel();
        };
    }, [debouncedUpdateURL, contact]);
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
        },
        {
            title: 'Action',
            dataIndex: "action",
            key: "action",
            width: 150,
            render: () => (
                <div><Tooltip title='Remove this email id from the recipient list'><IconX size={15} /></Tooltip></div>
            )
        },
    ];
    return (<div className="border border-border-color bg-card-color mt-8 p-4 mb-3">
        <div className="flex justify-between mb-4">
            <h1 className="text-xl font-medium">Type of Contacts</h1>
            <div className="gap-2 flex">
                <Button type="primary">Save</Button>
                <Button type="primary" onClick={() => {
                    setCurrent(current + 1)
                    router.replace(`${pathname}`)
                }}>Next</Button>
            </div>
        </div>
        <p className="text-red-500 text-xs mb-3">Contacts those are having email address will be filtered and shown below</p>
        <CampaignFilter />
        <div>
            <div className="flex gap-8 mb-3">
                <Input addonBefore={<IconSearch size={20} />} placeholder="Search Contacts by name,email" style={{ width: '800px' }}
                    value={contact}
                    onChange={(e) =>
                        setContact(e.target.value)
                    } />
                <div className="flex"><Button className={` ${activeTab === "Selected" ? "bg-primary" : "bg-white text-primary"} rounded-none`} type="primary" onClick={() => setActiveTab("Selected")}>Selected</Button>
                    <Button className={` ${activeTab === "UnSelected" ? "bg-primary" : "bg-white text-primary"} rounded-none`} type="primary" onClick={() => setActiveTab("UnSelected")}>UnSelected</Button><p className="ml-1 text-xs">169 contacts</p></div>
            </div>
            <Table columns={columns} dataSource={data} pagination={{pageSize:10}}></Table>
        </div>
    </div>)
}

export default CampaignContacts;