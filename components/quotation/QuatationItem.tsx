import { useAppSelector } from '@hooks/redux';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { RootState } from '@redux/feature/store';
import { IconCheck, IconPencil, IconPlus, IconX } from '@tabler/icons-react';
import { Tag, InputNumber, Button, Tooltip, Input, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import AddMasterPricingItemModal from '../common/Models/AddMasterPricingItemModel';
import { IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import ChecklistNotesModal from '../construction/ChecklisrNotesModal';
const { TextArea } = Input;
interface QuatationItemProps {
  item: IPriceListItem;
  onQuantityChange: (itemId: string, qty: number) => void;
  onToggleAdd: (item: IPriceListItem & { notes: string }) => void;
  isSelected: boolean;
  quantityRef?: any;
  disabled?: boolean;
}

export const QuatationItem: React.FC<QuatationItemProps> = React.memo(
  ({ item, onToggleAdd, isSelected, onQuantityChange, quantityRef, disabled }) => {
    const { items } = useAppSelector((state: RootState) => state.quotation);
    const priceItem = items.find(i => i.priceListItemId === item.priceListItemId);
    const [quantity, setQuantity] = useState<number>();
    const [isEdited, setIsEdited] = useState({ item: false, extraitem: false });
    const [notesModalVisible, setNotesModalVisible] = useState(false);
    const [tempNotes, setTempNotes] = useState('');

    useEffect(() => {
      setQuantity(priceItem?.quantity ?? 1);
      setTempNotes(priceItem?.note || '');
    }, [priceItem]);

    useEffect(() => {
      // onQuantityChange(item.priceListItemId, quantity);
    }, [quantity, item.cost, item.priceListItemId, onQuantityChange]);

    const handleToggle = item => {
      onToggleAdd({ ...item, notes: tempNotes });
    };

    const handleQuantityChange = (value: number | null) => {
      setQuantity(value ?? 1);
    };
    const isIncluded = item.costType === 'Included';
    return (
      <div
        className={`${isSelected ? 'table-row bg-primary-10' : 'table-row hover:bg-card-color'} w-full`}
      >
        {/* Item Info */}
        <div className="table-cell p-3 align-top w-[475px]">
          <div className="flex gap-2 items-center font-medium text-[16px] break-all">
            <Tooltip title={item.shortDescription ? item.shortDescription : item.itemDescription}>
              {' '}
              <p className="line-clamp-2">
                {item.shortDescription ? item.shortDescription : item.itemDescription}
              </p>
            </Tooltip>
            <IconPencil
              size={15}
              className={`text-blue ${isSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              onClick={() => !isSelected && setIsEdited(prev => ({ ...prev, item: true }))}
            />
            <div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setNotesModalVisible(true)}
              >
                <IconPlus size={16} className="border rounded-full border-primary text-primary" />
                Notes
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {item.costType && <Tag color="yellow">{item.costType}</Tag>}
            {item.dwellingType && (
              <Tag color="blue">{enumToReadable(item?.dwellingType[0]?.name)}</Tag>
            )}
            {item.costOption && item.costOption !== 'NONE' && (
              <Tag color="red">{enumToReadable(item.costOption).toUpperCase()}</Tag>
            )}
            {item?.additionalItem && item.additionalItem && (
              <Tag color="yellow">ADDITIONAL ITEM</Tag>
            )}
            {item.status && <Tag color="purple">{enumToReadable(item.status).toUpperCase()}</Tag>}
            {item.range && (
              <Tag color="orange">{enumToReadable(item?.range[0]?.name).toUpperCase()}</Tag>
            )}
            {/* the extraItemType is need to add in backednd there are 4 types  'Additional' | 'Complimentary' | 'Discount' | 'Note' is opening in the click of the extra */}
            {/* {item.extraItemType && <Tag color="yellow">{item.extraItemType}Additional Item</Tag>} */}
          </div>
        </div>

        {/* Quantity */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          <InputNumber
            min={1}
            value={quantity}
            ref={quantityRef}
            onChange={handleQuantityChange}
            type="number"
            size="small"
            className="w-full text-center"
            disabled={isIncluded || disabled || isSelected}
          />
        </div>

        {/* Price */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          {!isIncluded ? `$${item.cost || priceItem?.itemCost || 0}` : ' '}
        </div>

        {/* Total */}
        <div className="table-cell text-center p-3 align-middle w-[100px]">
          {!isIncluded ? `$${(item.cost || priceItem?.itemCost || 0) * quantity}` : ' '}
        </div>

        {/* Action */}
        <div className="table-cell text-center p-3 align-middle w-[60px]">
          <Button
            disabled={isIncluded || disabled}
            type={isSelected ? 'primary' : 'dashed'}
            shape="circle"
            size="small"
            icon={isSelected ? <IconX size={16} /> : <IconPlus size={16} />}
            onClick={() => handleToggle(item)}
          />
        </div>
        {isEdited.item && (
          <AddMasterPricingItemModal
            open={isEdited.item}
            onClose={() => {
              setIsEdited(prev => ({ ...prev, item: false }));
            }}
            categoryId={item?.priceList?.id}
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
            }}
            initialValue={tempNotes}
            isEditable={!isSelected}
          />
        )}
      </div>
    );
  }
);

QuatationItem.displayName = 'QuatationItem';
