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
  createCategory,
  deleteCategory,
  deleteCategoryItem,
  fetchCategories,
  fetchCategoryItems,
  updateCategory,
  updateCategoryOrder,
} from "@redux/feature/masterPriceList/masterPriceListThunk";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { message, Spin, Empty, Tooltip, Button } from "antd";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { MasterPricingCategoryFields } from "@/components/formFields/MasterPricingCategoryFields";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export const MasterPriceList = () => {
  const dispatch = useAppDispatch();
  const { categories, status } = useAppSelector(
    (state: any) => state.masterPriceList
  );
  const { selectedFilters: mplFilters } = useAppSelector(
    (state: any) => state.masterPriceList
  );

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  useEffect(() => {
    setLocalCategories(categories);
  }, [categories]);

  const [addItemModal, setAddItemModal] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState({
    reset: false,
    save: false,
  });
  const [deleteModal, setDeleteModal] = useState({ open: false, type: "item" });
  const [editing, setEditing] = useState<boolean>(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);

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

  const handleAction = (action: string, categoryItem: any) => {
    setSelectedItem(categoryItem);
    if (action === "edit") {
      openAddItemModal(categoryItem.categoryItemId);
    } else if (action === "delete") {
      setDeleteModal({ open: true, type: "item" });
    }
  };

  const handleCategoryAction = (
    action: "edit" | "delete",
    category: Category
  ) => {
    setSelectedItem(category);
    if (action === "edit") {
      setEditing(true);
      setAddCategoryModal(true);
    } else {
      setDeleteModal({ open: true, type: "category" });
    }
  };

  const handleAddCategorySubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateCategory({
            id: selectedItem.categoryId,
            payload: { name: values.name, description: values.description },
          })
        ).unwrap();
        message.success("Category updated successfully");
      } else {
        await dispatch(
          createCategory({ name: values.name, description: values.description })
        ).unwrap();
        message.success("Category created successfully");
      }
      setAddCategoryModal(false);
    } catch (error: any) {
      message.error(error || "Failed to create category");
    } finally {
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: any) => {
    setLoading(true);
    try {
      if (type === "item") {
        await dispatch(deleteCategoryItem(id)).unwrap();
        message.success("Category item deleted successfully");
      } else {
        await dispatch(deleteCategory(id)).unwrap();
        message.success("Category deleted successfully");
      }
    } catch (error: any) {
      message.error(error || "Failed to delete category item");
    } finally {
      setDeleteModal({ open: false, type });
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    // Keep the old state in case API fails
    const prevCategories = [...localCategories];

    // Clone categories to avoid mutation
    const newLocalCategories = localCategories.map((c) => ({ ...c }));

    // Move the dragged category in the array
    const [movedCategory] = newLocalCategories.splice(fromIndex, 1);
    newLocalCategories.splice(toIndex, 0, movedCategory);

    // Collect affected categories
    const changedCategories: Category[] = [];

    const oldDisplayOrder = movedCategory.displayOrder;

    if (fromIndex < toIndex) {
      // Moving down
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i <= toIndex; i++) {
        const c = { ...newLocalCategories[i] };
        const currentOrder = c?.displayOrder;
        c.displayOrder = previous;
        previous = currentOrder;
        changedCategories.push(c);
        newLocalCategories[i] = c;
      }
    } else if (fromIndex > toIndex) {
      // Moving up
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i >= toIndex; i--) {
        const c = { ...newLocalCategories[i] };
        const currentOrder = c?.displayOrder;
        c.displayOrder = previous;
        previous = currentOrder;
        changedCategories.push(c);
        newLocalCategories[i] = c;
      }
    }
    setLocalCategories(newLocalCategories);
  };

  const isOrderChanged = () => {
    if (localCategories?.length !== categories?.length) return true;
    return localCategories?.some(
      (c, idx) => c?.categoryId !== categories[idx]?.categoryId
    );
  };

  const handleSaveOrder = async () => {
    setOrderLoading((prev) => ({ ...prev, save: true }));
    try {
      const payload =
        localCategories.length > 0
          ? localCategories?.map((c) => ({
              categoryId: c?.categoryId,
              displayOrder: c?.displayOrder,
            }))
          : [];

      if (payload?.length > 0) {
        await dispatch(updateCategoryOrder({ categories: payload })).unwrap();
        message.success("Category order updated successfully");
      }
    } catch (error) {
      setLocalCategories(categories);
      message.error(error || "Failed to update category order");
    } finally {
      setOrderLoading((prev) => ({ ...prev, save: false }));
    }
  };

  const handleResetOrder = () => {
    setOrderLoading((prev) => ({ ...prev, reset: true }));
    setLocalCategories(categories);
    message.success("Category order reset successfully");
    setOrderLoading((prev) => ({ ...prev, reset: false }));
    setResetModalVisible(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Master Price List
        </h2>
        <div className="flex gap-2">
          {isOrderChanged() && (
            <>
              <Button
                onClick={() => {
                  setResetModalVisible(true);
                }}
                disabled={orderLoading.save}
              >
                Reset Order
              </Button>
              <Button onClick={handleSaveOrder} disabled={orderLoading.save}>
                Save Order
              </Button>
            </>
          )}
          {!isOrderChanged() && (
            <Button
              type="primary"
              disabled={
                orderLoading.save ||
                status == Status.PENDING ||
                orderLoading.reset
              }
              onClick={() => {
                setEditing(false);
                setAddCategoryModal(true);
              }}
            >
              Add Category
            </Button>
          )}
        </div>
      </div>

      {status == Status.PENDING || orderLoading.save ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Spin size="large" />
        </div>
      ) : localCategories.length > 0 ? (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="categories">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {localCategories.map((category: Category, index: number) => {
                  const isDropdownOpen =
                    dropDowns[category?.categoryId] || false;
                  const isLoading = loadingItems[category?.categoryId] || false;

                  return (
                    <Draggable
                      key={category?.categoryId}
                      draggableId={String(category?.categoryId)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg"
                        >
                          {/* Header */}
                          <div
                            className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
                            onClick={() =>
                              !isOrderChanged() &&
                              handleExpand(
                                category?.categoryId,
                                category?.isExpanded
                              )
                            }
                          >
                            <div className="flex items-center gap-2 w-full min-w-0">
                              <button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition cursor-grab">
                                <IconGripVertical size={24} />
                              </button>
                              <div className="min-w-0">
                                <h3 className="text-lg font-semibold text-gray-800 break-words">
                                  {category?.name}
                                </h3>
                                {category?.description && (
                                  <Tooltip
                                    title={category?.description}
                                    placement="top"
                                  >
                                    <span className="text-sm text-gray-500 truncate max-w-[200px]">
                                      {category?.description}
                                    </span>
                                  </Tooltip>
                                )}
                              </div>
                            </div>
                            {!isOrderChanged() && (
                              <div className="flex gap-3 flex-shrink-0">
                                <button
                                  className="p-2 rounded-lg hover:bg-green-50 transition"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    openAddItemModal(category?.categoryId);
                                  }}
                                >
                                  <IconPlus
                                    size={18}
                                    className="text-gray-600 hover:text-green-600"
                                  />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-blue-50 transition"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryAction("edit", category);
                                  }}
                                >
                                  <IconEdit
                                    size={18}
                                    className="text-gray-600 hover:text-blue-600"
                                  />
                                </button>
                                <button
                                  className="p-2 rounded-lg hover:bg-red-50 transition"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleCategoryAction("delete", category);
                                  }}
                                >
                                  <IconTrash
                                    size={18}
                                    className="text-gray-600 hover:text-red-600"
                                  />
                                </button>

                                <button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition">
                                  {isDropdownOpen ? (
                                    <IconChevronUp />
                                  ) : (
                                    <IconChevronDown />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Dropdown */}
                          {isDropdownOpen && (
                            <div className="px-4 pb-4">
                              {isLoading ? (
                                <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
                                  <Spin size="large" />
                                </div>
                              ) : category?.items?.length > 0 ? (
                                <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 pr-2">
                                  {category?.items?.map((item: Item) => (
                                    <PricingItem
                                      key={item?.categoryItemId}
                                      item={item}
                                      handleClick={handleAction}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <div className="text-center flex flex-col justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                                  <p className="text-base font-medium">
                                    No items here yet.
                                  </p>
                                  <p className="text-sm">
                                    Click on the + icon to add items.
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">No Master Price found.</span>
          }
          className="py-12"
        />
      )}

      {/* Modals */}
      {addCategoryModal && (
        <CreateFormModal
          title="Master Pricing Category"
          isEditing={editing}
          open={addCategoryModal}
          loading={loading}
          onCancel={() => {
            setSelectedItem(null);
            setAddCategoryModal(false);
          }}
          initialValues={selectedItem}
          onSubmit={handleAddCategorySubmit}
          fields={MasterPricingCategoryFields()}
        />
      )}

      {resetModalVisible && (
        <ConfirmationModal
          open={resetModalVisible}
          onClose={() => {
            setResetModalVisible(false);
            setOrderLoading((prev) => ({ ...prev, reset: false }));
          }}
          onConfirm={handleResetOrder}
          message="Are you sure you want to reset the order?"
          type="danger"
          confirmText="Reset"
          cancelText="Cancel"
          loading={orderLoading.reset}
          maxWidth="sm"
        />
      )}

      {addItemModal && (
        <AddMasterPricingItemModal
          open={addItemModal}
          onClose={() => {
            setSelectedItem(null);
            setAddItemModal(false);
          }}
          categoryId={categoryId}
          categoryItem={selectedItem}
        />
      )}

      {deleteModal.open && (
        <ConfirmationModal
          loading={loading}
          open={deleteModal.open}
          onClose={() =>
            setDeleteModal({ open: false, type: deleteModal.type })
          }
          onConfirm={() =>
            handleDelete(
              deleteModal.type,
              deleteModal.type === "item" ? selectedItem?.categoryItemId : selectedItem?.categoryId
            )
          }
          type="danger"
          title="Confirm Deletion"
          message={
            deleteModal.type === "item"
              ? "Are you sure you want to delete this item? Deleting it will also remove it from any associated packages."
              : "Are you sure you want to delete this category? Deleting it will also remove all the items under it and affect any places where it is used."
          }
        />
      )}
    </div>
  );
};

export default MasterPriceList;
