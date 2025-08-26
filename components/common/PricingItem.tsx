import { InputNumber } from "antd";
export const PricingItem = ({ item, onItemQuantityChange }: any) => {
     
    return (
        <div
            key={item.categoryItemId}
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 bg-card-color text-font-color"
        >
            <div className="flex-1">
                <div className="font-medium mb-2 ">
                    {item.shortDescription}
                </div>
               
            </div>

            <div className="w-24 flex justify-center">
                <InputNumber
                    min={0}
                    value={item?.quantity}
                    onChange={(value) =>
                        onItemQuantityChange(item.categoryItemId, value || 0)
                    }
                    size="small"
                    className="w-16"
                />
            </div>

            <div className="w-24 text-center font-medium">
                {item?.cost?.toLocaleString()}
            </div>

            <div className="w-24 text-center font-bold">
                {item?.totalCost?.toLocaleString()}
            </div>
        </div>
    )
}