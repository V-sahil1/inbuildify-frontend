import AddMasterPricingItemModal from "@/components/common/Models/AddMasterPricingItemModel";
import { PricingItem } from "@/components/common/PricingItem";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import {
  Category,
  Item,
} from "@redux/feature/masterPriceList/iMasterPriceListState";
import { toggleExpand } from "@redux/feature/masterPriceList/masterPriceListSlice";
import {
  fetchCategories,
  fetchCategoryItems,
} from "@redux/feature/masterPriceList/masterPriceListThunk";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { message, Spin,Empty } from "antd";

export const MasterPriceList = () => {
    const dispatch = useAppDispatch();
    const { categories ,status} = useAppSelector((state: any) => state.masterPriceList);
    const { selectedFilters: mplFilters } = useAppSelector((state: any) => state.masterPriceList);
    console.log(categories)
    useEffect(() => {
        if(status === Status.IDLE){
            dispatch(fetchCategories())
        }
    }, [dispatch]);

  const [addItemModal, setAddItemModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({}); 

  const openAddItemModal = (categoryId: string) => {
    setAddItemModal(true);
    setCategoryId(categoryId);
  };

  const handleExpand = async (categoryId: string, isExpanded: boolean) => {
    setDropDowns((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));

    if (!isExpanded) {
      try {
        setLoadingItems((prev) => ({ ...prev, [categoryId]: true }));
    
        dispatch(toggleExpand(categoryId));
    
        await dispatch(
          fetchCategoryItems({
            categoryId,
            filters: {
              range: mplFilters?.range || undefined,
              dwelling_type: mplFilters?.dwelling_type || undefined,
            },
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || "Failed to fetch category items");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [categoryId]: false }));
      }
    }    
  };

  return (
    <div>
      <h2 className="text-[24px]/[30px] font-black my-4 text-var(--font-color-bl)">
        Master Price List
      </h2>
      {status == Status.PENDING ? 
       (<div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>) 
      :
      categories.length > 0 ? 
      <div>
        {categories.map((category: Category) => {
          const isDropdownOpen = dropDowns[category.categoryId] || false;
          const isLoading = loadingItems[category.categoryId] || false; 

          return (
            <div key={category.categoryId} className="mb-4">
              <div className="flex items-center justify-between">
                {/* Expand/Collapse Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleExpand(category.categoryId, category.isExpanded)
                    }
                  >
                    {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                  </button>
                  <h3 className="text-[19px] font-bold">{category.name}</h3>
                </div>

                {/* Add Item */}
                <button
                  className="btn btn-primary"
                  onClick={() => openAddItemModal(category.categoryId)}
                >
                  Add Item
                </button>
              </div>

              {isDropdownOpen && (
                <div
                  className="mt-2 flex gap-2 flex-col"
                  id={category.categoryId}
                >
                  {isLoading ? (
                    <div 
                    className="flex justify-center items-center py-10 gap-4 p-4 border border-gray-200 rounded-lg bg-card-color text-font-color h-[85px]"
                    >
                      <Spin size="large" />
                    </div>
                  ) : category?.items?.length > 0 ? (
                    category.items.map((item: Item) => (
                      <PricingItem key={item.categoryItemId} item={item} />
                    ))
                  ) : (
                    <div 
                    className="text-center items-center gap-4 p-4 border border-gray-200 rounded-lg bg-card-color text-font-color h-[85px]"
                    >
                      <p className="text-lg font-medium text-font-color">
                        No items here yet.
                      </p>
                      <p className="text-sm text-font-color-400">
                        To add item click on Add item button.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Modal */}
        <AddMasterPricingItemModal
          open={addItemModal}
          onClose={() => setAddItemModal(false)}
          categoryId={categoryId}
        />
      </div>
        :
       <Empty description={
            <span className="text-gray-500">No Master Price found.</span>
          }
          className="py-12"
        />
      }
    
    </div>
  );
};

export default MasterPriceList;
