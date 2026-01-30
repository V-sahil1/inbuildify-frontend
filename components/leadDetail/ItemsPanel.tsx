import React, { useRef, useState } from 'react';
import { Button, Dropdown, Form } from 'antd';
import { IPriceList, IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { QuatationItem } from '../quotation/QuatationItem';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  removeQuotationItem,
  setQuotationItems,
  updateQuotationItem,
} from '@redux/feature/quotation/quotationSlice';
import Loading from '../common/Loading';
import { QuatationExtraItem } from '../quotation/QuatationExtraItem';

interface ItemsPanelProps {
  category?: IPriceList;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onExtraClick: () => void;
  extraItem: boolean;
  isReadOnly: boolean;
  itemsLoading: boolean;
  select?: boolean;
  setSelect?: React.Dispatch<React.SetStateAction<boolean>>;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  category,
  onExtraClick,
  extraItem,
  isReadOnly,
  itemsLoading,
  select,
  setSelect,
}) => {
  const dispatch = useAppDispatch();
  const {
    extraItems,
    items,
    package: selectedPackageFromSlice,
  } = useAppSelector((state: RootState) => state.quotation);
  const [form] = Form.useForm();
  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const menuItems = [
    { key: 'additionalItem', label: 'Additional Items' },
    { key: 'complimentary', label: 'Complimentary' },
    { key: 'discount', label: 'Discount' },
    { key: 'note', label: 'Note' },
  ];
  const handleItemAdd = (item: IPriceListItem) => {
    const quantity = quantityRefs.current[item.priceListItemId]?.value || '1';

    if (items.some(i => i.priceListItemId === item.priceListItemId)) {
      dispatch(removeQuotationItem(item.priceListItemId));
    } else {
      dispatch(
        setQuotationItems({
          ...item,
          quantity: Number(quantity),
          price: parseFloat(item.cost || '0') || 0,
        })
      );
    }
  };
  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateQuotationItem({ itemId, quantity }));
  };
  return (
    <div className="w-full bg-card-color flex flex-col">
      {/* Header (search + actions) */}
      <div className="p-4 border-b border-gray-200">
        <div className="text-end w-full ">
          {/* <div className="flex items-center gap-4">
            <span className="text-xs">All</span>
            <Input
              placeholder="Search Items..."
              prefix={<IconSearch className="text-gray-400" />}
              className="w-64"
              size="small"
            />
          </div> */}
          <Button type="primary" size="small" onClick={() => setSelect(!select)} ghost>
            Selected Items{' '}
            <span className="ml-1 bg-blue-500 text-primary rounded-full px-2 py-0 text-xs">
              {items?.length ?? 0}
            </span>
          </Button>
        </div>
      </div>
      <Form
        form={form}
        onValuesChange={(changed, all) => {
          const total = (all.quantity | 0) * (all.cost | 0);
          form.setFieldValue('total', total);
        }}
      >
        {/* Table */}
        <div className="w-full overflow-y-auto max-h-[300px] custom-scrollbar">
          <div className="table w-full border-collapse ">
            {/* Table Head */}
            <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200 sticky">
              <div className="table-row">
                <div className="table-cell text-left p-3">Item</div>
                <div className="table-cell text-center p-3 w-[100px]">Quantity</div>
                <div className="table-cell text-center p-3 w-[100px]">Price</div>
                <div className="table-cell text-center p-3 w-[100px]">Total ($)</div>
                <div className="table-cell text-center p-3 w-[60px]">
                  <Dropdown
                    menu={{
                      items: menuItems,
                      onClick: e => {
                        if (e.key === 'additionalItem') {
                          setSelect(false);
                          onExtraClick();
                        }
                      },
                    }}
                  >
                    <Button type="primary" size="small" ghost>
                      Extra <span className="ml-1">{extraItems.length ?? 0}</span>
                    </Button>
                  </Dropdown>
                </div>
              </div>
            </div>
            {extraItem && !select && (
              <div className="table-row-group">
                <QuatationExtraItem
                  key={'extra-item'}
                  onToggleAdd={handleItemAdd}
                  onItemQuantityChange={handleItemQuantityChange}
                  form={form}
                  isReadOnly={isReadOnly}
                  quantityRef={quantityRefs}
                />
              </div>
            )}
            {!category && !extraItem && (items.length <= 0 || !select) && (
              <div className="table-row">
                <div className="table-cell p-6 text-center col-span-7 text-font-color">
                  No items found
                </div>
              </div>
            )}

            {/* Table Body */}
            {itemsLoading ? (
              <div className="table-cell p-6 text-center col-span-7 text-font-color">
                <Loading type="primary" />
              </div>
            ) : (
              <div className="table-row-group overflow-y-auto ">
                {(select ? items : category?.items)?.length > 0 ? (
                  (select ? items : category.items).map(item => (
                    <QuatationItem
                      key={item?.priceListItemId}
                      item={item}
                      disabled={
                        isReadOnly ||
                        selectedPackageFromSlice?.categoryItems?.some(
                          catItem => catItem.id === item.priceListItemId
                        )
                      }
                      onQuantityChange={handleItemQuantityChange}
                      quantityRef={el => (quantityRefs.current[item.priceListItemId] = el)}
                      isSelected={items?.some(
                        itemData => itemData.priceListItemId === item.priceListItemId
                      )}
                      onToggleAdd={handleItemAdd}
                    />
                  ))
                ) : (
                  <div className="table-row">
                    {category && (
                      <div className="table-cell p-6 text-center col-span-7 text-font-color">
                        No items found
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ItemsPanel;
