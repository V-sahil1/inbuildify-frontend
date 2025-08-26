import AddMasterPricingItemModal from "@/components/common/Models/AddMasterPricingItemModel";
import { PricingItem } from "@/components/common/PricingItem";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import { Category } from "@redux/feature/masterPriceList/iMasterPriceListState";
import { toggleExpand } from "@redux/feature/masterPriceList/masterPriceListSlice";
import {
  fetchCategories,
  fetchCategoryItems,
} from "@redux/feature/masterPriceList/masterPriceListThunk";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const MasterPriceList = () => {
    const dispatch = useAppDispatch();
    const { categories ,status} = useAppSelector((state: any) => state.masterPriceList);
    console.log(categories)
    useEffect(() => {
        if(status === Status.IDLE){
            dispatch(fetchCategories())
        }
    }, [dispatch]);

  const [addItemModal, setAddItemModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");

  // independent dropdown state per category
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});

  const openAddItemModal = (categoryId: string) => {
    setAddItemModal(true);
    setCategoryId(categoryId);
  };

  const handleExpand = (categoryId: string, isExpanded: boolean) => {
    // toggle UI dropdown
    setDropDowns((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));

    // API fetch logic (only first time if not expanded)
    if (!isExpanded) {
      dispatch(toggleExpand(categoryId));
      dispatch(fetchCategoryItems(categoryId))
        .unwrap()
        .then((response) => {
          console.log(response);
        });
    }
  };

  return (
    <div>
      <h2 className="text-[24px]/[30px] font-medium my-2">Master Price List</h2>
      <div>
        {categories.map((category: Category) => {
          const isDropdownOpen = dropDowns[category.categoryId] || false;

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
                  <h3>{category.name}</h3>
                </div>

                {/* Add Item */}
                <button
                  className="btn btn-primary"
                  onClick={() => openAddItemModal(category.categoryId)}
                >
                  Add Item
                </button>
              </div>

              {/* Items Dropdown */}
              {isDropdownOpen && (
                <div className="mt-2 flex gap-2 flex-col" id={category.categoryId}>
                  {category?.items?.map((item: any) => (
                    <PricingItem key={item.categoryItemId} item={item} />
                  ))}
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
    </div>
  );
};

export default MasterPriceList;
