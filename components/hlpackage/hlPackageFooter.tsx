import { IconDots } from "@tabler/icons-react"
import { Button } from "antd"

export const HlPackageFooter = ({ setEditOpen, hasChanges, isSaving, onSave, packageDetails }) => {
    const footerButtons = [
        { label: 'Custom Section', onClick: () => setEditOpen(prev => ({ ...prev, custom: true })) },
        { label: 'Modify', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
        { label: 'Preview', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
        { label: 'email', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
        { label: 'Publish', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
        { label: 'Mark and Sold', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
        { label: 'Price List', onClick: () => setEditOpen(prev => ({ ...prev, priceList: true })) },
    ]
    return (
        <div className="flex justify-between m-2">
            <div className="flex gap-1">
                <Button icon={<IconDots size={20} />}> </Button>
                {footerButtons.map((button, index) => (
                    <Button key={index} type="primary" onClick={button.onClick}>
                        {button.label}
                    </Button>
                ))}
            </div>
            <div className="flex items-center gap-4">
                {hasChanges && (
                    <Button
                        type="primary"
                        onClick={onSave}
                        loading={isSaving}

                    >
                        Save Changes
                    </Button>
                )}
                <h1 className="text-lg font-bold">Total : ${packageDetails?.totalPrice}</h1>
            </div>
        </div>
    )
}