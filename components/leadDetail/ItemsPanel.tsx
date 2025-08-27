import React from "react";
import { Input, Button, Tag, InputNumber } from "antd";
import {IconSearch } from "@tabler/icons-react";
import { Category } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { PricingItem } from "../common/PricingItem";

interface ItemsPanelProps {
  category?: Category;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onItemAdd: (itemId: string) => void;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  category,
  onItemQuantityChange,
  onItemAdd,
}) => {
  if (!category) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="text-gray-500">Select a category to view items</div>
      </div>
    );
  }

  const getTagColor = (tag: string) => {
    const colorMap: Record<string, string> = {
      "Base Price": "cyan",
      Variable: "orange",
      Fixed: "gray",
      Premium: "purple",
      "Single Storey": "green",
      sq: "blue",
      "Site Costs": "geekblue",
      Kitchen: "magenta",
      Electrical: "gold",
      "Pre-Construction": "lime",
      "Retaining Wall": "volcano",
      "Council Requirements": "red",
      "External Structure": "cyan",
    };
    return colorMap[tag] || "default";
  };

  return (
    <div className="flex-1 bg-card-color">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <span className="text-xs">All</span>
            <Input
              placeholder="Search Items..."
              prefix={<IconSearch className="text-gray-400" />}
              className="w-64"
              size="small"
            />
          </div>
          <Button type="primary" size="small" ghost>
            Selected Items{" "}
            <span className="ml-1 bg-blue-500 text-white rounded-full px-2 py-0 text-xs">
              10
            </span>
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm font-medium">
          <div className="flex-1">Item</div>
          <div className="w-24 text-center">Quantity</div>
          <div className="w-24 text-center">Price</div>
          <div className="w-24 text-center">Total ($)</div>
          <div className="w-16 text-center">
            <Button type="primary" size="small" ghost>
              Extra <span className="ml-1">0</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Items List */}
      <div className="p-4">
        <div className="space-y-4">
          {category?.items?.length > 0 ? category?.items?.map((item) => (
             
            // <div
            //   key={item.id}
            //   className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            // >
            //   <div className="flex-1">
            //     <div className="font-medium text-gray-900 mb-2">
            //       {item.name}
            //     </div>
            //     <div className="flex gap-1 flex-wrap">
            //       {item.tags?.map((tag) => (
            //         <Tag key={tag} color={getTagColor(tag)}>
            //           {tag}
            //         </Tag>
            //       ))}
            //     </div>
            //   </div>

            //   <div className="w-24 flex justify-center">
            //     <InputNumber
            //       min={0}
            //       value={item.quantity}
            //       onChange={(value) =>
            //         onItemQuantityChange(item.id, value || 0)
            //       }
            //       size="small"
            //       className="w-16"
            //     />
            //   </div>

            //   <div className="w-24 text-center font-medium">
            //     {item.price.toLocaleString()}
            //   </div>

            //   <div className="w-24 text-center font-bold">
            //     {item.total.toLocaleString()}
            //   </div>

            //   <div className="w-16 flex justify-center">
            //     <Button
            //       type="primary"
            //       size="small"
            //       icon={<IconPlus />}
            //       className="bg-green-500 border-green-500 hover:bg-green-600 hover:border-green-600"
            //       onClick={() => onItemAdd(item.id)}
            //     />
            //   </div>
            // </div>
            <div>
                <PricingItem item={item}/>
            </div>
          )): <div className="flex-1 p-6 flex items-center justify-center">
          <div className="text-gray-500">No items found</div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default ItemsPanel;
