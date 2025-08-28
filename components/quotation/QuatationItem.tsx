import { enumToReadable } from "@lib/utils/enumToRedable";
import { IconPlus, IconX } from "@tabler/icons-react";
import { Tag, InputNumber, Button, Input } from "antd";
import React, { useState } from "react";

interface QuatationItemProps {
  item: any;
  onQuantityChange: (value: number) => void;
  onToggleAdd: () => void;
  isSelected: boolean;
}

export const QuatationItem: React.FC<QuatationItemProps> = React.memo(
  ({ item, onQuantityChange, onToggleAdd,isSelected}) => {
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState<number>(1);
    const handleToggle = () => {
      setAdded((prev) => !prev);
      onToggleAdd();
    };

    const handleQuantityChange = (value: number | null) => {
      const qty = value ?? 0;
      setQuantity(qty);
      onQuantityChange(qty);
    };

    return (
      <div className={isSelected ? "table-row  bg-primary-10" : "table-row hover:bg-card-color"}>
        {/* Item */}
        <div className="table-cell p-3 align-top">
          <div className="font-medium text-[16px]">{item.shortDescription}</div>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.costType && <Tag color="yellow">{item.costType}</Tag>}
            {item.dwellingTypeName && item.dwellingTypeName !== "NONE" && (
              <Tag color="blue">
                {enumToReadable(item.dwellingTypeName).toUpperCase()}
              </Tag>
            )}
            {item.costOption && item.costOption !== "NONE" && (
              <Tag color="red">
                {enumToReadable(item.costOption).toUpperCase()}
              </Tag>
            )}
            {item.status && item.status !== "NONE" && (
              <Tag color="purple">
                {enumToReadable(item.status).toUpperCase()}
              </Tag>
            )}
            {item.rangeName && item.rangeName !== "NONE" && (
              <Tag color="orange">
                {enumToReadable(item.rangeName).toUpperCase()}
              </Tag>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="table-cell text-center p-3 align-middle">
          <InputNumber
            min={1}
            value={quantity}
            onChange={handleQuantityChange}
            type="number" 
            size="small"
            className="w-full text-center"
          />
        </div>

        {/* Price */}
        <div className="table-cell text-center p-3 align-middle">
          ${item.price ?? 0}
        </div>

        {/* Total */}
        <div className="table-cell text-center p-3 align-middle">
          ${(item.price ?? 0) * quantity}
        </div>

        {/* Action */}
        <div className="table-cell text-center p-3 align-middle">
          <Button
            type={isSelected ? "primary" : "dashed"}
            shape="circle"
            size="small"
            icon={isSelected ? <IconX size={16} /> : <IconPlus size={16} />}
            onClick={handleToggle}
          />
        </div>
      </div>
    );
  }
);

QuatationItem.displayName = "QuatationItem";
