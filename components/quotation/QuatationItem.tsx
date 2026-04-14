import { useAppSelector } from '@hooks/redux';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { RootState } from '@redux/feature/store';
import { IconPencil, IconPlus, IconX, IconAlertTriangle } from '@tabler/icons-react';
import { Tag, InputNumber, Button, Tooltip } from 'antd';
import React, { useState, useEffect } from 'react';
import AddMasterPricingItemModal from '../common/Models/AddMasterPricingItemModel';
import { IPriceList, IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import ChecklistNotesModal from '../construction/ChecklisrNotesModal';
interface QuatationItemProps {
  item: IPriceListItem;
  onQuantityChange: (itemId: string, qty: number) => void;
  onQuantityUpdate?: (itemId: string, quantity: number) => Promise<void>;
  onToggleAdd: (item: IPriceListItem & { notes: string }) => void;
  onNoteUpdate?: (itemId: string, note: string) => Promise<void>;
  isSelected: boolean;
  quantityRef?: any;
  isDiffPrice?: boolean;
  disabled?: boolean;
  category?: IPriceList;
}

export const QuatationItem: React.FC<QuatationItemProps> = React.memo(
  ({
    item,
    onToggleAdd,
    isSelected,
    onQuantityChange,
    onQuantityUpdate,
    quantityRef,
    disabled,
    category,
    isDiffPrice = false,
    onNoteUpdate,
  }) => {
    const { items } = useAppSelector((state: RootState) => state.quotation);
    const priceItem = items.find(i =>
      item?.extraItem
        ? i.quotationVersionItemId === item.quotationVersionItemId
        : i.priceListItemId === item.priceListItemId
    );
    const [quantity, setQuantity] = useState<number>();
    const [isEdited, setIsEdited] = useState({ item: false, extraitem: false });
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [tempNotes, setTempNotes] = useState('');

    useEffect(() => {
      setQuantity(priceItem?.quantity ?? 1);
      setTempNotes(priceItem?.note || '');
    }, [priceItem]);

    const handleToggle = item => {
      onToggleAdd({ ...item, notes: tempNotes });
    };

    const handleQuantityChange = (value: number | null) => {
      setQuantity(value ?? 1);
    };

    const handleQuantityBlur = async () => {
      if (!priceItem?.quotationVersionItemId || !quantity || !onQuantityUpdate) return;

      try {
        await onQuantityUpdate(item.priceListItemId, quantity);
      } catch (error) {
        // Revert to original quantity on error
        setQuantity(Number(priceItem.quantity) || 1);
      }
    };
    const isIncluded = item.costType === 'Included';

    return (
      <div
        className={`${isSelected ? 'table-row bg-primary-10' : 'table-row hover:bg-card-color'}`}
      >
        {/* Item Info */}
        <div className="table-cell p-3 align-top w-[475px]">
          <div className="flex gap-2 items-center font-medium text-[16px] break-all">
            <Tooltip title={item.itemDescription ? item.itemDescription : item.shortDescription}>
              {' '}
              <p className="line-clamp-2">
                {item.itemDescription ? item.itemDescription : item.shortDescription}
              </p>
            </Tooltip>
            {isSelected && (
              <Tooltip title="Edit">
                <IconPencil
                  size={15}
                  className="text-blue cursor-pointer"
                  onClick={() => setIsEdited(prev => ({ ...prev, item: true }))}
                />
              </Tooltip>
            )}
            <div>
              {isSelected && (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setNotesModalVisible(true)}
                >
                  <IconPlus size={16} className="border rounded-full border-primary text-primary" />
                  Notes
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.costType && <Tag color="yellow">{item.costType}</Tag>}
            {item?.dwellingType?.length > 0 && (
              <Tag color="blue">{enumToReadable(item?.dwellingType[0]?.name)}</Tag>
            )}
            {item.costOption && item.costOption !== 'NONE' && (
              <Tag color="red">{enumToReadable(item.costOption).toUpperCase()}</Tag>
            )}
            {item?.extraType && item.extraType && (
              <Tag color="purple">{enumToReadable(item?.extraType)}</Tag>
            )}
            {item.status && <Tag color="green">{enumToReadable(item.status).toUpperCase()}</Tag>}
            {item?.range?.length > 0 && (
              <Tag color="orange">{enumToReadable(item?.range[0]?.name).toUpperCase()}</Tag>
            )}
          </div>
        </div>

        {/* UOM */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">{item?.uom}</div>

        {/* Quantity */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          {!isIncluded && item?.extraType !== 'discount' && (
            <InputNumber
              min={1}
              step={1}
              precision={0}
              value={quantity}
              ref={quantityRef}
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              type="number"
              size="small"
              className="w-full text-center"
              disabled={isIncluded || disabled}
              onWheel={e => e.currentTarget.blur()}
            />
          )}
        </div>

        {/* Price */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          <div className="flex items-center justify-center gap-1">
            {!isIncluded && item?.extraType !== 'complimentry'
              ? `$${Math.abs(Number(priceItem?.priceListItemCost) || item.cost || 0)}`
              : ' '}
            {isDiffPrice && (
              <Tooltip title={`Current price for this item is $${item.cost}`}>
                <IconAlertTriangle size={14} className="text-yellow-500 cursor-help" />
              </Tooltip>
            )}
          </div>
        </div>

        {/* Total */}
        <div className="table-cell text-center p-3 align-middle w-[60px]">
          {!isIncluded && item?.extraType !== 'complimentry'
            ? `$${Math.abs((Number(priceItem?.priceListItemCost) || item.cost || 0) * quantity)}`
            : ' '}
        </div>

        {/* Action */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          <Button
            disabled={isIncluded || disabled}
            type={isSelected ? 'primary' : 'dashed'}
            style={{
              boxShadow: 'none',
            }}
            shape="circle"
            size="small"
            icon={
              isSelected ? (
                <div>
                  <IconX size={16} />
                </div>
              ) : (
                <div>
                  <IconPlus size={16} />
                </div>
              )
            }
            onClick={() => handleToggle(item)}
          />
        </div>
        {isEdited.item && (
          <AddMasterPricingItemModal
            open={isEdited.item}
            onClose={() => {
              setIsEdited(prev => ({ ...prev, item: false }));
            }}
            category={category}
            categoryItem={item}
            extraField={true}
          />
        )}

        {/* Notes Modal */}
        {notesModalVisible && (
          <ChecklistNotesModal
            open={notesModalVisible}
            onCancel={() => setNotesModalVisible(false)}
            onSubmit={value => {
              setTempNotes(value);
              setNotesModalVisible(false);
              if (!!isSelected) {
                onNoteUpdate?.(priceItem?.quotationVersionItemId, value);
              }
            }}
            initialValue={tempNotes}
          />
        )}
      </div>
    );
  }
);

QuatationItem.displayName = 'QuatationItem';
