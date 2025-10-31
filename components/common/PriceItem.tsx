import { useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { Tag, InputNumber, Button, Tooltip, Input } from 'antd';
import React, { useState, useEffect } from 'react';
const { TextArea } = Input;
interface QuatationItemProps {
  categoryName: string;
  item: any;
  onQuantityChange: (itemId: string, qty: number) => void;
  onToggleAdd: (itemId: string, price: number) => void;
  isSelected: boolean;
  quantityRef: any;
  disabled?: boolean;
}

export const PriceItem: React.FC<QuatationItemProps> = React.memo(
  ({ categoryName, item, onToggleAdd, isSelected, onQuantityChange, quantityRef, disabled }) => {
    const { items } = useAppSelector((state: RootState) => state.quotation);
    const reduxQuantity = items.find(i => i.itemId === item.categoryItemId)?.quantity ?? 1;
    const [quantity, setQuantity] = useState<number>(reduxQuantity);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isNotesOpen, setIsNotesOpen] = useState(false);
    const [isEditNotesopen, setIsEditNotesOpen] = useState(false);
    const handleNotesEdit = () => {
      setIsEditNotesOpen(true);
      setIsNotesOpen(false);
    };
    const handleNotesDelete = () => {};
    useEffect(() => {
      setQuantity(reduxQuantity);
    }, [reduxQuantity]);

    useEffect(() => {
      onQuantityChange(item.categoryItemId, quantity);
    }, [quantity, item.cost, item.categoryItemId, onQuantityChange]);

    const handleToggle = (itemId: string, price: number) => {
      onToggleAdd(itemId, price);
      setIsEditOpen(!isEditOpen);
    };

    const handleQuantityChange = (value: number | null) => {
      setQuantity(value ?? 1);
    };

    const isIncluded = item.costType === 'INCLUDED';
    return (
      <div className={isSelected ? 'table-row bg-primary-10' : 'table-row hover:bg-card-color'}>
        {/* Item Info */}
        <div className="table-cell p-3 align-top">
          <div className="flex flex-wrap gap-2 mt-1">
            {categoryName && <Tag color="blue">{categoryName}</Tag>}
            {item.costType && <Tag color="yellow">{item.costType}</Tag>}
          </div>
          <div className="font-medium text-[16px] break-all">
            <Tooltip title={item.shortDescription ? item.shortDescription : item.description}>
              {' '}
              <p className="flex items-center">
                <p className="line-clamp-2">
                  {item.shortDescription ? item.shortDescription : item.description}
                </p>
                {isEditOpen && <IconPencil size={15} className="ml-2 text-blue" />}
              </p>
            </Tooltip>
          </div>
          {isEditOpen && (
            <div className="flex gap-1 items-center text-blue text-sm mt-1">
              <div
                className="rounded-full w-4 h-4 text-blue flex items-center justify-center bg-red-50"
                onClick={() => setIsNotesOpen(true)}
              >
                <IconPlus size={12} />
              </div>
              <p className="">Notes</p>
            </div>
          )}
          {isNotesOpen && (
            <div className="bg-card-color p-3 ">
              <TextArea showCount maxLength={500} />
              <div className="flex gap-2 justify-end mt-6">
                <Button size="small" onClick={() => setIsNotesOpen(false)}>
                  Cancel
                </Button>
                <Button size="small" type="primary" onClick={handleNotesEdit}>
                  {' '}
                  OK
                </Button>
                {isEditNotesopen && (
                  <Button type="primary" onClick={handleNotesDelete}>
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
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
            onClick={() => {
              handleToggle(item.categoryItemId, item.cost);
            }}
          />
        </div>
      </div>
    );
  }
);

PriceItem.displayName = 'PriceItem';
