import React from "react";
import { Input, Button } from "antd";
import { IconSearch } from "@tabler/icons-react";
import { Category } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { QuatationItem } from "../quotation/QuatationItem";
import { QuatationExtraItem } from "../quotation/QuatationExtraItem";
import { useAppSelector } from "@hooks/redux";
import { RootState } from "@redux/feature/store";

interface ItemsPanelProps {
  category?: Category;
  onItemQuantityChange: (itemId: string, quantity: number) => void;
  onItemAdd: (itemId: string) => void;
  onExtraClick: () => void;
  extraItem: boolean;
}

const ItemsPanel: React.FC<ItemsPanelProps> = ({
  category,
  onItemQuantityChange,
  onItemAdd,
  onExtraClick,
  extraItem,
}) => {
  const {extraItems, items} = useAppSelector((state: RootState) => state.quotation);
  // if (!category) {
  //   return (
  //     <div className="flex-1 p-6 flex items-center justify-center">
  //       <div className="text-gray-500">Select a category to view items</div>
  //     </div>
  //   );
  // }

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
          {extraItem && (
            <div className="table-row-group">
             <QuatationExtraItem 
              key={"extra-item"}
              onQuantityChange={(qty) =>
                onItemQuantityChange("extra-item", qty)
              }
              onToggleAdd={() => onItemAdd("extra-item")}/>
            </div>
          )}
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
                  isSelected={items?.some((itemData) => itemData === item.categoryItemId)}
                  onQuantityChange={(qty) =>
                    onItemQuantityChange(item.categoryItemId, qty)
                  }
                  onToggleAdd={() => onItemAdd(item.categoryItemId)}
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
