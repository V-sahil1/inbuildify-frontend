import React, { useEffect, useRef } from 'react';
import { Input, message, Select } from 'antd';
import { Category, Item } from '@redux/feature/masterPriceList/iMasterPriceListState';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { RootState } from '@redux/feature/store';
import {
  removeQuotationItem,
  setQuotationItems,
  updateQuotationItem,
} from '@redux/feature/quotation/quotationSlice';
import Loading from '../common/Loading';
import { IconSearch } from '@tabler/icons-react';
import { fetchCategoryItems } from '@redux/feature/masterPriceList/masterPriceListThunk';
import { QuatationItem } from '../quotation/QuatationItem';
import { toggleExpand } from '@redux/feature/masterPriceList/masterPriceListSlice';
interface PriceListItemsPanelProps {
  categories?: Category[];
  itemsLoading: boolean;
}

const PriceListItemPanel: React.FC<PriceListItemsPanelProps> = ({ categories, itemsLoading }) => {
  const dispatch = useAppDispatch();
  const { items, package: selectedPackageFromSlice } = useAppSelector(
    (state: RootState) => state.quotation
  );
  const quantityRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const handleItemAdd = (item: Item) => {
    const quantity = quantityRefs.current[item.categoryItemId]?.value || '1';

    if (items.some(i => i.categoryItemId === item.categoryItemId)) {
      dispatch(removeQuotationItem(item.categoryItemId));
    } else {
      dispatch(setQuotationItems({ ...item, quantity: Number(quantity) }));
    }
  };
  const handleItemQuantityChange = (itemId: string, quantity: number) => {
    dispatch(updateQuotationItem({ itemId, quantity }));
  };
  useEffect(() => {
    const fetchCategoryitems = async () => {
      try {
        const responses = await Promise.all(
          categories.map(async cat => {
            if (!cat.isExpanded) {
              dispatch(toggleExpand(cat.categoryId));
            }
            return dispatch(
              fetchCategoryItems({
                categoryId: cat.categoryId,
              })
            ).unwrap();
          })
        );

        // ✅ Step 2: After fetching, auto-add INCLUDED items
        {
          responses &&
            responses.forEach(res => {
              res.items?.forEach((item: any) => {
                if (item?.costType === 'INCLUDED') {
                  // only add if not already in quotation
                  const alreadyAdded = items.some(i => i.categoryItemId === item.categoryItemId);
                  if (!alreadyAdded) {
                    dispatch(setQuotationItems({ ...item, quantity: 1 }));
                  }
                }
              });
            });
        }
      } catch (error) {
        message.error('Failed to fetch category items');
      }
    };
    fetchCategoryitems();
  }, []);
  return (
    <div className="w-full bg-card-color flex flex-col">
      {/* Table */}
      <div className="w-full overflow-y-auto  ">
        <div className="table w-full border-collapse">
          {/* Table Head */}
          <div className="table-header-group bg-card-color text-sm font-medium text-font-color border-b border-gray-200">
            <div className="table-row">
              <div className="table-cell text-left  p-3">
                <div className="flex gap-1">
                  <Select defaultValue="All" className="!rounded-none" />
                  <Input addonBefore={<IconSearch size={15} />} placeholder="Search Items..." />
                </div>
              </div>
              <div className="table-cell text-center p-3 w-[100px]">Quantity</div>
              <div className="table-cell text-center p-3 w-[100px]">Price</div>
              <div className="table-cell text-center p-3 w-[100px]">Total ($)</div>
            </div>
          </div>
          {!categories && (
            <div className="table-row">
              <div className="table-cell p-6 text-center col-span-4 text-font-color">
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
            <div className="table-row-group overflow-y-auto">
              {categories?.length > 0 ? (
                categories.map(category =>
                  category?.items?.map(item => (
                    <QuatationItem
                      key={item?.categoryItemId}
                      item={item}
                      disabled={selectedPackageFromSlice?.categoryItems?.some(
                        catItem => catItem.id === item.categoryItemId
                      )}
                      onQuantityChange={handleItemQuantityChange}
                      quantityRef={el => (quantityRefs.current[item.categoryItemId] = el)}
                      isSelected={items?.some(
                        itemData => itemData.categoryItemId === item.categoryItemId
                      )}
                      onToggleAdd={handleItemAdd}
                    />
                  ))
                )
              ) : (
                <div className="table-row">
                  {categories && (
                    <div className="table-cell p-6 text-center col-span-7 text-font-color">
                      No category items found
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default PriceListItemPanel;
