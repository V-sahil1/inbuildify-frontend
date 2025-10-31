import { useAppSelector } from '@hooks/redux';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { RootState } from '@redux/feature/store';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Tag, InputNumber, Button, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';

interface QuatationItemProps {
  item: any;
  onQuantityChange: (itemId: string, qty: number) => void;
  onToggleAdd: (itemId: string, price: number) => void;
  isSelected: boolean;
  quantityRef: any;
  disabled?: boolean;
}

export const QuatationItem: React.FC<QuatationItemProps> = React.memo(
  ({ item, onToggleAdd, isSelected, onQuantityChange, quantityRef, disabled }) => {
    const { items } = useAppSelector((state: RootState) => state.quotation);

    const reduxQuantity = items.find(i => i.itemId === item.categoryItemId)?.quantity ?? 1;

    const [quantity, setQuantity] = useState<number>(reduxQuantity);

    useEffect(() => {
      setQuantity(reduxQuantity);
    }, [reduxQuantity]);

    useEffect(() => {
      onQuantityChange(item.categoryItemId, quantity);
    }, [quantity, item.cost, item.categoryItemId, onQuantityChange]);

    const handleToggle = (itemId: string, price: number) => {
      onToggleAdd(itemId, price);
    };

    const handleQuantityChange = (value: number | null) => {
      setQuantity(value ?? 1);
    };

    const isIncluded = item.costType === 'INCLUDED';
    return (
      <div className={isSelected ? 'table-row bg-primary-10' : 'table-row hover:bg-card-color'}>
        {/* Item Info */}
        <div className="table-cell p-3 align-top">
          <div className="font-medium text-[16px] break-all">
            <Tooltip title={item.shortDescription ? item.shortDescription : item.description}>
              {' '}
              <p className="line-clamp-2">
                {item.shortDescription ? item.shortDescription : item.description}
              </p>
            </Tooltip>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.costType && <Tag color="yellow">{item.costType}</Tag>}
            {item.dwellingTypeName && item.dwellingTypeName !== 'NONE' && (
              <Tag color="blue">{enumToReadable(item.dwellingTypeName).toUpperCase()}</Tag>
            )}
            {item.costOption && item.costOption !== 'NONE' && (
              <Tag color="red">{enumToReadable(item.costOption).toUpperCase()}</Tag>
            )}
            {item.status && item.status !== 'NONE' && (
              <Tag color="purple">{enumToReadable(item.status).toUpperCase()}</Tag>
            )}
            {item.rangeName && item.rangeName !== 'NONE' && (
              <Tag color="orange">{enumToReadable(item.rangeName).toUpperCase()}</Tag>
            )}
          </div>
        </div>

        {/* Quantity */}
        <div className="table-cell text-center p-3 align-middle">
          <InputNumber
            min={1}
            value={quantity}
            ref={quantityRef}
            onChange={handleQuantityChange}
            type="number"
            size="small"
            className="w-full text-center"
            disabled={isIncluded || disabled}
          />
        </div>

        {/* Price */}
        <div className="table-cell text-center p-3 align-middle">
          {!isIncluded ? `$${item.cost ?? 0}` : ' '}
        </div>

        {/* Total */}
        <div className="table-cell text-center p-3 align-middle">
          {!isIncluded ? `$${(item.cost ?? 0) * quantity}` : ' '}
        </div>

        {/* Action */}
        <div className="table-cell text-center p-3 align-middle">
          <Button
            disabled={isIncluded || disabled}
            type={isSelected ? 'primary' : 'dashed'}
            shape="circle"
            size="small"
            icon={isSelected ? <IconX size={16} /> : <IconPlus size={16} />}
            onClick={() => handleToggle(item.categoryItemId, item.cost)}
          />
        </div>
      </div>
    );
  }
);

QuatationItem.displayName = 'QuatationItem';
