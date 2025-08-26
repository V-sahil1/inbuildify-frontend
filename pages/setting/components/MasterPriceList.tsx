import AddMasterPricingItemModal from "@/components/common/Models/AddMasterPricingItemModel";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { toggleExpand } from "@redux/feature/masterPriceList/masterPriceListSlice";
import { fetchCategories, fetchCategoryItems } from "@redux/feature/masterPriceList/masterPriceListThunk";
import { IconChevronDown, IconChevronUp } from "@tabler/icons-react";
import { useEffect, useState } from "react";

export const MasterPriceList = () => {
    const dispatch = useAppDispatch();
    const { categories } = useAppSelector((state: any) => state.masterPriceList);
    console.log(categories)
    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch]);

    const [addItemModal, setAddItemModal] = useState(false);
    const [categoryId, setCategoryId] = useState('');
    const openAddItemModal = (categoryId: string) => {
        setAddItemModal(true);
        setCategoryId(categoryId);
    }
    const handleExpand = (categoryId: string, isExpanded: boolean) => {
        dispatch(toggleExpand(categoryId));
        if (!isExpanded) {
            dispatch(fetchCategoryItems(categoryId));
        }
    }
    return (
        <div>
            <h2 className="text-[24px]/[30px] font-medium my-2">Master Price List</h2>
            <div>
                {categories.map((category: any) => (
                    <div key={category.categoryId} className="mb-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2"><button onClick={() => handleExpand(category.categoryId, category.isExpanded)}>
                                {category.isExpanded ? <IconChevronUp /> : <IconChevronDown />}
                            </button>
                                <h3>{category.name}</h3>
                            </div>
                            <button className="btn btn-primary" onClick={() => openAddItemModal(category.categoryId)}>Add Item</button>
                        </div>
                        {category.isExpanded && (
                            <div className="mt-2">
                                <p>hello</p>
                                {/* {category.items.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between">
                                        <h4>{item.name}</h4>
                                        <p>{item.price}</p>
                                        <button className="btn btn-primary">Edit</button>
                                    </div>
                                ))} */}
                            </div>
                        )}
                    </div>
                ))}
                <AddMasterPricingItemModal open={addItemModal} onClose={() => setAddItemModal(false)} categoryId={categoryId} />
            </div>
        </div>
    )
}

export default MasterPriceList  