import { IconDots, IconMail, IconMapPin, IconPencil, IconPhone, IconSearch, IconTable } from "@tabler/icons-react";
import { Button, Checkbox, Input, Radio, Select, Switch, Tag } from "antd";

const HLPackageDetail = () => {
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">House & Land Package <Tag color="blue">Available</Tag></h1>
                <div>
                    <div className="grid grid-cols-3 gap-8 text-primary"><p>Deluxe</p><p>Double Storey</p> <p>Template 1</p></div>
                    <div className="grid grid-cols-3 gap-8 text-xs"><p>Range</p><p>Dwelling Type</p><p>Template</p></div>
                </div>
                <div className="text-primary border border-primary p-1 rounded-lg"> <IconTable /></div>
            </div>
            <div className="grid grid-rows-2">
                <div className="grid grid-cols-2">
                    <div className="flex">
                        <div className="flex-1">
                            <div className="relative border rounded-md p-3 m-2 bg-card-color ">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Title </Tag>
                                <p className="p-4 text-sm">new</p>
                            </div>
                            <div className="relative border rounded-md p-3 m-2 bg-card-color mt-9">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Lot </Tag>
                                <div className="p-4 text-sm">
                                    <div className="flex gap-2 items-center mb-2"><IconMapPin size={20} /><p>LOT 507 Stirling, Tarneit, 3002</p></div>
                                    <div className="flex mb-2"> <p>Estate : </p><p>Ambervue</p></div>
                                    <div className="flex mb-2"> <p>Stage : </p><p>Stage 1</p></div>
                                    <div className="flex mb-2"> <p>Type : </p><p>Regular</p></div>
                                    <div className="flex gap-1">
                                        <div className="flex"> <p>W : </p><p>16.00</p></div>
                                        <div className="flex"> <p>D : </p><p>28.00</p></div>
                                        <div className="flex"> <p>Total : </p><p>448.00</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative border rounded-md p-3 m-2 bg-card-color">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Contact </Tag>
                                <div className="p-4 text-sm">
                                    <p className="mb-2">Kishan</p>
                                    <div className="flex gap-2 items-center mb-2"><IconMail size={20} /><p>kishan@gmail.com</p></div>
                                    <div className="flex gap-4 mb-2"><div className="flex gap-2 items-center"><IconPhone size={20} /><p>123467898</p></div><div className="flex gap-2 items-center"><Switch size="small" /><p>Show in pdf</p></div></div>
                                </div>
                            </div>
                            <div className="relative border rounded-md p-3 m-2 bg-card-color mt-4 ">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Price </Tag>
                                <div className="p-3 text-sm">
                                    <div className="flex gap-6 items-center mb-2"><p>Type</p><Radio.Group block options={[{ label: 'Estimate', value: 'estimate' }, { label: 'Fixed', value: 'fixed' }]} /></div>
                                    <div className="flex gap-4 mb-2"><p>House</p><p>$ 35,000.00</p></div>
                                    <div className="flex gap-2">
                                        <div className="flex gap-2"><p>Land</p><p>$ 50000.00</p></div>
                                        <div className="flex gap-2"><p>Comm</p><p className="text-blue">$ 50000</p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="grid grid-cols-2  h-full">
                            <div className="relative border rounded-md p-3 m-2 bg-card-color">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Floor Plan </Tag>
                                <p className="p-4 text-center ">Choose Floor Plan</p>
                            </div>
                            <div className="relative border rounded-md p-3 m-2 bg-card-color">
                                <Tag className="absolute -top-2 left-3 " color="orange" > Facade </Tag>
                                <p className="p-4 text-center">Choose Facade</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2">
                    <div className="bg-card-color p-4 m-2" >
                        <div className="flex justify-between">
                            <div className="flex gap-2 items-center"><p>This Package inclusions: </p><IconPencil size={20} /></div>
                            <div className="flex justify-between gap-3"><div>All</div><div>Selected</div><div>UnSelected</div></div>
                            <div className="text-blue"><IconTable size={20} /></div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4 mt-3">
                            <Input addonBefore={<IconSearch size={20} />} placeholder="Search Inclusions" size="small" />
                            <div><p className="text-primary">Turkey Inclusions</p><p className="text-xs">Group</p></div>
                        </div>
                        <div>
                            <div className="flex gap-2 items-center mb-2"><Checkbox /> Select All</div>
                            <div className="flex items-start gap-2 mb-2">
                                <Checkbox checked />
                                <div>
                                    <p>Tiles/Laminate flooring in living areas</p>
                                    <Tag color="blue">Turkey Inclusions</Tag>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 mb-2">
                                <Checkbox checked />
                                <div>
                                    <p>Tiles/Laminate flooring in living areas</p>
                                    <Tag color="blue">Turkey Inclusions</Tag>
                                </div>
                            </div>
                            <div className="flex items-start gap-2 mb-2">
                                <Checkbox checked />
                                <div>
                                    <p>Tiles/Laminate flooring in living areas</p>
                                    <Tag color="blue">Turkey Inclusions</Tag>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="p-4 m-2 bg-card-color">
                            <div className="flex justify-between my-2">
                                <p>House Features</p>
                                <div className="text-blue"><IconTable size={20} /></div>
                            </div>
                            <Input addonBefore={<IconSearch size={20} />} placeholder="Search Feature.." size="small" />
                            <div className="mt-2">
                                <div className="flex gap-2"><Checkbox /><p>Select All</p></div>
                                <div className="flex gap-2"><Checkbox /><p>new</p></div>
                            </div>
                        </div>
                        <div className="p-4 m-2 bg-card-color">
                            <div className="flex justify-between my-1">
                                <p>Disclaimer</p>
                                <div className="text-blue"><IconTable size={20} /></div>
                            </div>
                            <Select size="small" defaultValue="validity" style={{ width: '100%' }} />
                            <div className="w-full h-full p-3 border mt-2">
                                Valid for 60 days only
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-between m-2">
                <div className="flex gap-1">
                    <Button icon={<IconDots size={20} />}> </Button>
                    <Button type='primary'>Custom Section</Button>
                    <Button type='primary'>Price List</Button>
                </div>
                <h1 className="text-lg font-bold">Total : $53,000.00</h1>
            </div>
        </div>
    )
}

export default HLPackageDetail;