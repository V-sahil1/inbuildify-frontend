import { IconUserSquareRounded } from "@tabler/icons-react"
import { Modal, Tag } from "antd"
import { useState } from "react";

const JobDetailHeader = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleClose = () => {
        setIsModalOpen(false)
    }
    const summaryItems = {
        costItems: [
            { key: 'Quotation', value: '450280.00' },
            { key: 'Colors', value: '' },
            { key: 'Contract Cost', value: '450280.00' }
        ],
        paymentItems: [
            { key: 'MYH0046-I1 Initial Deposit', value: '5000.00' },
            { key: 'MYH0046-I3 Returns', value: '-50000.00' },
        ]
    }
    return (
        <>
            <div className="w-full pr-[100px]">
                <div className="flex justify-between w-full text-sm m-3">
                    <div className="border-l-2 pl-2">
                        <div className="flex gap-2 items-center text-base font-semibold text-blue">Murthy <IconUserSquareRounded color="var(--blue)" size={20} /></div>
                        <div className="flex items-center gap-1">Lot 300 Tallis Cct,Tarneit,VIC,5345<Tag color="green">Titled</Tag></div>
                    </div>
                    <div className="border-l-2 pl-2">
                        <div className="text-base font-semibold flex items-center">My Home</div>
                        <div className="mt-1">Builder</div>
                    </div>
                    <div className="border-l-2 pl-2 cursor-pointer" onClick={() => setIsModalOpen(true)}>
                        <div className="flex text-base font-semibold text-blue">$ 495,280.00</div>
                        <div>Balance to be paid</div>
                    </div>
                </div>
                <Modal
                    title={"Cost Summary"}
                    onOk={handleClose}
                    onCancel={handleClose}
                    cancelButtonProps={{ style: { display: 'none' } }}
                    open={isModalOpen}
                >
                    <div>
                        <div className="grid grid-cols-2 gap-6  text-xs">
                            <div className="flex flex-col">
                                <div className="flex justify-between mb-4 mt-3 font-medium"><div>Cost Item</div><div>Amount $</div></div>
                                {summaryItems.costItems?.map((item) => (
                                    <div className="flex justify-between my-2"><div>{item.key}</div><div>{item.value}</div></div>
                                ))}
                                <div className="flex justify-between  my-2"><div>Total Cost</div><div className="font-medium">450280.00</div></div>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex justify-between mb-4 mt-3 font-medium"><div>Payments</div><div>Amount $</div></div>
                                {summaryItems.paymentItems?.map((item) => (
                                    <div className="flex justify-between my-2"><div>{item.key}</div><div>{item.value}</div></div>
                                ))}
                                <div className="flex justify-between mt-40"><div>Total Paid</div><div className="font-medium">450280.00</div></div>
                            </div>
                        </div>
                        <div className="border-t-2 border-b-2 border-border-color text-red-600 flex justify-end gap-9 py-15 mt-3 font-semibold   ">
                            <div>Balanced To Be Paid</div>
                            <div>$ 450280.0</div>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    )
}
export default JobDetailHeader;