import React, { useRef } from "react";
import { Input, Button } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { Category } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { QuatationItem } from "../quotation/QuatationItem";
import { QuatationExtraItem } from "../quotation/QuatationExtraItem";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { RootState } from "@redux/feature/store";
import { removeQuotationItem, setQuotationItems, updateQuotationItem } from "@redux/feature/quotation/quotationSlice";

interface ItemsPanelProps {
  category?: Category;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onExtraClick: () => void;
  extraItem: boolean;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  category,
  onExtraClick,
  extraItem,
}) => {
  const dispatch = useAppDispatch();
  const {extraItems, items} = useAppSelector((state: RootState) => state.quotation);
  const quantityRefs = useRef<{[key: string]: HTMLInputElement | null}>({});

  const handleItemAdd = (itemId: string, price: number) => {
    const quantity = quantityRefs.current[itemId]?.value || '1';
    
    if (items.some((item) => item.itemId === itemId)) {
      dispatch(removeQuotationItem(itemId));
    } else {
      dispatch(setQuotationItems({itemId, quantity: Number(quantity), price}));
    }
  };
  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateQuotationItem({ itemId, quantity }));
  };
  
  return (
    <div className="flex-1 bg-card-color flex flex-col overflow-hidden">
      {/* Header (search + actions) */}
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
            <span className="ml-1 bg-blue-500 text-primary rounded-full px-2 py-0 text-xs">
            {(extraItems.length ?? 0) + (items?.length ?? 0)}
            </span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto">
        <div className="table w-full border-collapse">
          {/* Table Head */}
          <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
            <div className="table-row">
              <div className="table-cell text-left p-3">Item</div>
              <div className="table-cell text-center p-3 w-[100px]">
                Quantity
              </div>
              <div className="table-cell text-center p-3 w-[100px]">Price</div>
              <div className="table-cell text-center p-3 w-[100px]">
                Total ($)
              </div>
              <div className="table-cell text-center p-3 w-[60px]">
                <Button type="primary" size="small" ghost onClick={() => {onExtraClick()}}>
                  Extra <span className="ml-1">{(extraItems.length ?? 0)}</span>
                </Button>
              </div>
            </div>
          </div>
      {/* {extraItem && (
            <div className="table-row-group">
             <QuatationExtraItem
              key={"extra-item"}
              onToggleAdd={() => handleItemAdd("extra-item")}/>
            </div>
          )} */}
          {!category && !extraItem &&(
            <div className="table-row">
              <div className="table-cell p-6 text-center col-span-7 text-font-color">
                No items found
              </div>
            </div>
          )}

          {/* Table Body */}
          <div className="table-row-group">
            {category?.items?.length > 0 ? (
              category.items.map((item) => (
                <QuatationItem
                  key={item.categoryItemId}
                  item={item}
                  onQuantityChange={handleItemQuantityChange}
                  quantityRef={(el) => quantityRefs.current[item.categoryItemId] = el}
                  isSelected={items?.some((itemData) => itemData.itemId === item.categoryItemId)}
                  onToggleAdd={handleItemAdd}
                />
              ))
            ) : (
              <div className="table-row">
               {category && <div
                  className="table-cell p-6 text-center col-span-7 text-font-color"

                >
                  No items found
                </div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemsPanel;
