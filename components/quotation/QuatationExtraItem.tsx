import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createCategoryItem } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { setQuotationExtraItems } from '@redux/feature/quotation/quotationSlice';
import { RootState } from '@redux/feature/store';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Button, Input, Select, message, Form } from 'antd';
import React, { useState } from 'react';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { QuatationItem } from './QuatationItem';
import { Status } from '@lib/constants/enum';
import { IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
const { TextArea } = Input;

interface QuatationItemProps {
  onToggleAdd?: (item: IPriceListItem) => void;
  onItemQuantityChange?: (itemId: string, quantity: number) => void;
  form?: any;
  isReadOnly?: boolean;
  quantityRef?: React.RefObject<Record<string, HTMLInputElement | null>>;
}

export const QuatationExtraItem: React.FC<QuatationItemProps> = React.memo(
  ({ onToggleAdd, onItemQuantityChange, form, isReadOnly, quantityRef }) => {
    const [added, setAdded] = useState(false);
    const { priceMaster, status } = useAppSelector((state: RootState) => state.masterPriceList);
    const { selectedFilters } = useAppSelector((state: RootState) => state.quotation);
    const dispatch = useAppDispatch();
    const costType = Form.useWatch('cost_type', form);
    const {
      extraItems,
      items,
      package: selectedPackageFromSlice,
    } = useAppSelector((state: RootState) => state.quotation);

    const handleToggle = async () => {
      const values = await form.validateFields();
      const newAdded = !added;
      console.log('values', values);
      setAdded(false);
      try {
        if (newAdded) {
          const payload: IPriceListItem = {
            priceListId: values.category_id,
            costType: values.cost_type,
            itemDescription: values.description,
            dwellingTypeId: selectedFilters.dwelling_type,
            rangeId: selectedFilters.range,
            cost: costType === 'Included' ? null : values.cost,
            costTypeText: enumToReadable(values.cost_type),
            status: 'active',
          };
          const response = await dispatch(createCategoryItem(payload)).unwrap();

          dispatch(
            setQuotationExtraItems({
              ...response,
              quantity: values.quantity,
              price: costType === 'Included' ? 0 : parseFloat(values.cost) || 0,
            })
          );
          form.resetFields();
        }
      } catch (error) {
        message.error(error);
      }
    };
    return (
      <>
        <div className="table-row hover:bg-card-color overflow-y-auto">
          {/* Item */}
          <div className="table-cell p-3 align-top">
            <div className="font-medium text-[16px]">Extra Item</div>
            <div className="flex flex-col flex-wrap gap-5 mt-1">
              <div className="flex gap-5">
                {/* Category Select */}
                <Form.Item name="category_id">
                  <Select
                    placeholder="Select Category"
                    style={{ minWidth: '180px' }}
                    options={priceMaster.map(category => ({
                      label: category.name,
                      value: category.priceListId,
                    }))}
                  />
                </Form.Item>

                {/* Cost Type Select */}
                <Form.Item name="cost_type">
                  <Select
                    placeholder="Select Cost Type"
                    style={{ minWidth: '180px' }}
                    options={[
                      { value: 'INCLUDED', label: 'Included' },
                      { value: 'FIXED', label: 'Fixed' },
                      { value: 'VARIABLE', label: 'Variable' },
                    ]}
                  />
                </Form.Item>

                {/* buildercost */}
                <Form.Item name="builderCost">
                  <Input type="number" placeholder="Enter Builder Cost" />
                </Form.Item>
              </div>

              {/* Description */}
              <div>
                <Form.Item name="description">
                  <TextArea
                    showCount
                    maxLength={500}
                    rows={4}
                    placeholder="Enter item description"
                    style={{ resize: 'none' }}
                  />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="table-cell text-center p-3 align-middle">
            {costType !== 'INCLUDED' && (
              <Form.Item name="quantity">
                <Input type="number" min={1} size="small" className="w-full text-center" />
              </Form.Item>
            )}
          </div>

          {/* Price */}
          <div className="table-cell text-center p-3 align-middle">
            {costType !== 'INCLUDED' && (
              <Form.Item name="cost">
                <Input type="number" min={1} prefix="$" style={{ width: '100%' }} />
              </Form.Item>
            )}
          </div>

          {/* Total */}
          <div className="table-cell text-center p-3 align-middle">
            {costType !== 'INCLUDED' && (
              <Form.Item name="total">
                <Input disabled />
              </Form.Item>
            )}
          </div>

          {/* Action */}
          <div className="table-cell text-center p-3 align-middle">
            <Button
              loading={status.priceListItem.create === Status.PENDING}
              type={added ? 'primary' : 'dashed'}
              shape="circle"
              size="small"
              icon={added ? <IconX size={16} /> : <IconPlus size={16} />}
              onClick={handleToggle}
              htmlType="submit"
            />
          </div>
        </div>

        {extraItems?.map(item => (
          <QuatationItem
            key={item?.priceListItemId}
            item={item}
            disabled={
              isReadOnly ||
              selectedPackageFromSlice?.categoryItems?.some(
                catItem => catItem.id === item.priceListItemId
              )
            }
            quantityRef={el => (quantityRef.current[item.priceListItemId] = el)}
            onQuantityChange={onItemQuantityChange}
            isSelected={items?.some(itemData => itemData.priceListItemId === item.priceListItemId)}
            onToggleAdd={onToggleAdd}
          />
        ))}
      </>
    );
  }
);
