import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import { IconPlus, IconX } from '@tabler/icons-react';
import { Button, Input, Select, message, Form } from 'antd';
import React, { useState } from 'react';
import { QuatationItem } from './QuatationItem';
import { Status } from '@lib/constants/enum';
import { IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { createQuotationAdditionalPricellistThunk } from '@redux/feature/quotation/quotationThunk';
import { UOM_OPTIONS } from '../common/Models/AddMasterPricingItemModel';
import { enumToReadable } from '@lib/utils/enumToRedable';
import { ExtraItem } from '@redux/feature/quotation/IQuotationState';
const { TextArea } = Input;

interface QuatationItemProps {
  onToggleAdd?: (item: IPriceListItem) => void;
  onItemQuantityChange?: (itemId: string, quantity: number) => void;
  form?: any;
  isReadOnly?: boolean;
  quantityRef?: React.RefObject<Record<string, HTMLInputElement | null>>;
  type?: 'item' | 'complimentry' | 'discount' | 'note';
}

export const QuatationExtraItem: React.FC<QuatationItemProps> = React.memo(
  ({ onToggleAdd, onItemQuantityChange, form, isReadOnly, quantityRef, type }) => {
    const [added, setAdded] = useState(false);
    const { priceMaster, status } = useAppSelector((state: RootState) => state.masterPriceList);
    const { selectedFilters, quoteDetails } = useAppSelector((state: RootState) => state.quotation);
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
      setAdded(false);
      try {
        if (newAdded) {
          const payload: ExtraItem = {
            priceListId: values.category_id,
            priceListItemCostType: values.cost_type,
            priceListItemDescription: values.description,
            priceListItemDwellingTypeId: [
              selectedFilters.dwellingType || quoteDetails?.dwellingTypeId,
            ],
            priceListItemRangeId: [selectedFilters.range || quoteDetails?.rangeId],
            priceListItemCost:
              costType === 'Included' || type === 'complimentry' ? undefined : Number(values.cost),
            priceListItemBuilderCost: values.builderCost,
            priceListItemCostTypeText: values.costTypeText,
            priceListItemUom: values.uom,
            extraType: type,
            quantity:
              costType === 'Included' || type !== 'item' ? undefined : Number(values.quantity),
            note: values.notes || undefined,
          };
          const response = await dispatch(
            createQuotationAdditionalPricellistThunk({
              data: payload,
              versionId: quoteDetails?.quotationVersionId,
            })
          ).unwrap();
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
          <div className="table-cell p-3 align-top w-[475px]">
            <div className="font-medium text-[16px]">Extra {enumToReadable(type)}</div>
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
                {type !== 'discount' && (
                  <Form.Item name="cost_type">
                    <Select
                      placeholder="Select Cost Type"
                      style={{ minWidth: '180px' }}
                      options={[
                        { value: 'Included', label: 'Included' },
                        { value: 'Fixed', label: 'Fixed' },
                        { value: 'Variable', label: 'Variable' },
                      ]}
                    />
                  </Form.Item>
                )}

                {/* buildercost */}

                {type !== 'discount' && costType === 'Included' && (
                  <Form.Item name="costTypeText">
                    <Input placeholder="Enter Cost Type Text" />
                  </Form.Item>
                )}

                {type === 'item' &&  costType !== 'Included' &&(
                  <Form.Item name="builderCost">
                    <Input
                      type="number"
                      onWheel={e => e.currentTarget.blur()}
                      placeholder="Enter Builder Cost"
                    />
                  </Form.Item>
                )}
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
          {/* uom */}
          <div className="table-cell text-center p-3 align-middle w-[100px]">
            {type !== 'discount' && (
              <Form.Item name="uom">
                <Select
                  placeholder="Select Unit of Measurement"
                  options={UOM_OPTIONS}
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  allowClear
                  className="!w-[80px]"
                />
              </Form.Item>
            )}
          </div>

          {/* Quantity */}
          <div className="table-cell text-center p-3 align-middle w-[100px]">
            {type !== 'discount' && costType !== 'Included' && (
              <Form.Item name="quantity">
                <Input
                  type="number"
                  onWheel={e => e.currentTarget.blur()}
                  min={1}
                  size="small"
                  className="w-full text-center"
                />
              </Form.Item>
            )}
          </div>

          {/* Price */}
          <div className="table-cell text-center p-3 align-middle w-[100px]">
            {type !== 'complimentry' && costType !== 'Included' && (
              <Form.Item name="cost">
                <Input
                  type="number"
                  onWheel={e => e.currentTarget.blur()}
                  min={1}
                  prefix="$"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            )}
          </div>

          {/* Total */}
          <div className="table-cell text-center p-3 align-middle w-[60px]">
            {type !== 'complimentry' && costType !== 'Included' && (
              <Form.Item name="total">
                <Input disabled />
              </Form.Item>
            )}
          </div>

          {/* Action */}
          <div className="table-cell text-center p-3 align-middle w-[100px]">
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

        {items
          ?.filter(i => i.extraItem)
          ?.map(item => (
            <QuatationItem
              key={item?.priceListItemId}
              item={item}
              disabled={
                isReadOnly
                // ||
                // selectedPackageFromSlice?.categoryItems?.some(
                //   catItem => catItem.id === item.priceListItemId
                // )
              }
              quantityRef={el => (quantityRef.current[item.priceListItemId] = el)}
              onQuantityChange={onItemQuantityChange}
              isSelected={items?.some(
                itemData => itemData.priceListItemId === item.priceListItemId
              )}
              onToggleAdd={onToggleAdd}
            />
          ))}
      </>
    );
  }
);
