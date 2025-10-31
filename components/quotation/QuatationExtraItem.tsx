import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { CostType } from '@lib/constants/enum';
import { createCategoryItem } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { setQuotationExtraItems } from '@redux/feature/quotation/quotationSlice';
import { RootState } from '@redux/feature/store';
import { IconPlus, IconX } from '@tabler/icons-react';
import { InputNumber, Button, Input, Select, message } from 'antd';
import React, { useState, useMemo } from 'react';
import { PricingItem } from '../common/PricingItem';
const { TextArea } = Input;

const { Option } = Select;

interface QuatationItemProps {
  onQuantityChange: (value: number) => void;
  onToggleAdd: () => void;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onItemAdd: (itemId: string, price: number) => void;
}

export const QuatationExtraItem: React.FC<QuatationItemProps> = React.memo(
  ({ onQuantityChange, onToggleAdd, onItemQuantityChange, onItemAdd }) => {
    const [added, setAdded] = useState(false);
    const { categories } = useAppSelector((state: RootState) => state.masterPriceList);
    const dispatch = useAppDispatch();
    const { extraItems } = useAppSelector((state: RootState) => state.quotation);

    // Local form state
    const [formData, setFormData] = useState({
      category_id: undefined as string | undefined,
      cost_type: undefined as string | undefined,
      description: '',
      quantity: 1,
      cost: 0,
    });

    // Total calculation
    const total = useMemo(
      () => (formData.cost || 0) * (formData.quantity || 0),
      [formData.cost, formData.quantity]
    );

    const handleToggle = async () => {
      const newAdded = !added;
      setAdded(newAdded);
      //   onToggleAdd();
      try {
        if (
          formData.category_id === undefined ||
          formData.cost_type === undefined ||
          formData.description === '' ||
          formData.quantity === 1 ||
          formData.cost === 0
        ) {
          message.error('Please fill all the fields');
          return;
        }
        if (newAdded) {
          const response = await dispatch(
            createCategoryItem({
              category_id: formData.category_id,
              cost_type: formData.cost_type,
              description: formData.description,
              cost: total,
              // it will come from the quatation slice below two only
              dwelling: 'SINGLE_STOREY',
              range: 'PREMIUM',
            })
          ).unwrap();
          dispatch(setQuotationExtraItems(response));
          setFormData({
            category_id: undefined,
            cost_type: undefined,
            description: '',
            quantity: 1,
            cost: 0,
          });
        }
      } catch (error) {
        message.error(error);
      }
    };

    const handleQuantityChange = (value: number | null) => {
      const qty = value ?? 0;
      setFormData(prev => ({ ...prev, quantity: qty }));
      // onQuantityChange(qty);
    };

    return (
      <>
        <div className="table-row hover:bg-card-color">
          {/* Item */}
          <div className="table-cell p-3 align-top">
            <div className="font-medium text-[16px]">Extra Item</div>
            <div className="flex flex-col flex-wrap gap-5 mt-1">
              <div className="flex gap-5">
                {/* Category Select */}
                <Select
                  size="large"
                  placeholder="Select Category"
                  value={formData.category_id}
                  onChange={val => setFormData(prev => ({ ...prev, category_id: val }))}
                  style={{ minWidth: '180px' }}
                >
                  {categories?.map(category => (
                    <Option key={category.categoryId} value={category.categoryId}>
                      {category.name}
                    </Option>
                  ))}
                </Select>

                {/* Cost Type Select */}
                <Select
                  size="large"
                  placeholder="Select Cost Type"
                  value={formData.cost_type}
                  onChange={val => setFormData(prev => ({ ...prev, cost_type: val }))}
                  style={{ minWidth: '180px' }}
                >
                  {CostType?.map(costType => (
                    <Option key={costType.value} value={costType.value}>
                      {costType.label}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Description */}
              <div className="flex gap-5">
                <TextArea
                  showCount
                  maxLength={500}
                  rows={4}
                  placeholder="Enter item description"
                  value={formData.description}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
            </div>
          </div>

          {/* Quantity */}
          <div className="table-cell text-center p-3 align-middle">
            <InputNumber
              min={1}
              value={formData.quantity}
              onChange={handleQuantityChange}
              size="small"
              className="w-full text-center"
            />
          </div>

          {/* Price */}
          <div className="table-cell text-center p-3 align-middle">
            <Input
              type="number"
              min={0.1}
              prefix="$"
              value={formData.cost}
              onChange={e =>
                setFormData(prev => ({
                  ...prev,
                  cost: Number(e.target.value) || 0,
                }))
              }
              style={{ width: '100%' }}
            />
          </div>

          {/* Total */}
          <div className="table-cell text-center p-3 align-middle">
            <span className="font-medium">${total.toFixed(2)}</span>
          </div>

          {/* Action */}
          <div className="table-cell text-center p-3 align-middle">
            <Button
              type={added ? 'primary' : 'dashed'}
              shape="circle"
              size="small"
              icon={added ? <IconX size={16} /> : <IconPlus size={16} />}
              onClick={handleToggle}
            />
          </div>
        </div>
        {/* {extraItems?.map((item) => (
                    <PricingItem
                        item={item}
                        onQuantityChange={onQuantityChange}
                        onToggleAdd={onToggleAdd}
                    />
                ))} */}
      </>
    );
  }
);
