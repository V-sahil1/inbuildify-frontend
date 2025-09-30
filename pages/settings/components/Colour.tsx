"use client";
import { useAppDispatch, useAppSelector } from "@hooks/redux";
import { Status } from "@lib/constants/enum";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { message,Empty, Tooltip, Button } from "antd";
import ConfirmationModal from "@/components/common/ConfirmationModal";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { MasterPricingCategoryFields } from "@/components/formFields/MasterPricingCategoryFields";

import {
  createColourCategory,
  createColourSubCategory,
  deleteColourCategory,
  deleteColourSubCategory,
  deleteColourSubCategoryItem,
  fetchColourCategory,
  fetchColourSubCategory,
  fetchColourSubCategoryItems,
  updateColourCategory,
  updateColourSubCategory,
} from "@redux/feature/color/colorThunk";
import { ColorCategory, SubCategory } from "@redux/feature/color/iColourState";
import {
  toggleExpandColourCategory,
  toggleExpandColourCategoryItem,
} from "@redux/feature/color/ColourSlice";
import { NestedItem } from "@/components/common/NestedItem";
import ColorCategoryItemModel from "@/components/common/Models/ColorCategoryItemModel";
import Loading from "@/components/common/Loading";

export const ColourCategoryPage = () => {
  const dispatch = useAppDispatch();
  const { ColorCategory, status } = useAppSelector((state) => state.colour);
  const fetchColourCategoryData = async () => {
    try {
      await dispatch(fetchColourCategory()).unwrap();
    } catch (error) {
      message.error(error || "Failed to fetch colour category");
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchColourCategoryData();
    }
  }, [status]);

  const [colorCategoryId, setColorCategoryId] = useState("");
  const [addColourCategoryModal, setAddColourCategoryModal] = useState(false);
  const [addColourSubCategoryModal, setAddColourSubCategoryModal] =
    useState(false);
  const [addColourSubCategoryItemModal, setAddColourSubCategoryItemModal] =
    useState(false);
  const [colorSubCategoryId, setColorSubCategoryId] = useState("");
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: "subCategory",
  });
  const [editing, setEditing] = useState<boolean>(false);

  const openAddColourSubCategoryModal = (colorCategoryId: string) => {
    setAddColourSubCategoryModal(true);
    setColorCategoryId(colorCategoryId);
  };

  const openAddColourSubCategoryItemModal = (colorSubCategoryId: string) => {
    setAddColourSubCategoryItemModal(true);
    setColorSubCategoryId(colorSubCategoryId);
  };
  const handleColorCategoryExpand = async (
    colorCategoryId: string,
    isExpanded: boolean
  ) => {
    setDropDowns((prev) => ({
      ...prev,
      [colorCategoryId]: !prev[colorCategoryId],
    }));

    if (!isExpanded) {
      try {
        setLoadingItems((prev) => ({ ...prev, [colorCategoryId]: true }));
        dispatch(toggleExpandColourCategory(colorCategoryId));

        await dispatch(fetchColourSubCategory(colorCategoryId)).unwrap();
      } catch (error: any) {
        message.error(error || "Failed to fetch colour sub category");
      } finally {
        setLoadingItems((prev) => ({ ...prev, [colorCategoryId]: false }));
      }
    }
  };

  const handleSubCategoryExpand = async (item: SubCategory) => {
    setDropDowns((prev) => ({
      ...prev,
      [item.colorSubCategoryId]: !prev[item.colorSubCategoryId],
    }));

    if (!item.isExpanded) {
      try {
        setLoadingItems((prev) => ({
          ...prev,
          [item.colorSubCategoryId]: true,
        }));
        dispatch(
          toggleExpandColourCategoryItem({
            colorSubCategoryId: item.colorSubCategoryId,
            colorCategoryId: item.colorCategoryId,
          })
        );

        await dispatch(
          fetchColourSubCategoryItems({
            colorSubCategoryId: item.colorSubCategoryId,
            colorCategoryId: item.colorCategoryId,
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || "Failed to fetch colour sub category");
      } finally {
        setLoadingItems((prev) => ({
          ...prev,
          [item.colorSubCategoryId]: false,
        }));
      }
    }
  };
  const handleColourSubCategoryAction = (
    action: string,
    subCategory: any,
    actionType?: string
  ) => {
    setSelectedItem(subCategory);
    if (actionType === "subCategoryItem") {
      if (action === "edit") {
        setEditing(true);
        openAddColourSubCategoryItemModal(subCategory.colorItemId);
      } else if (action === "delete") {
        setDeleteModal({ open: true, type: "subCategoryItem" });
      }
    } else {
      if (action === "edit") {
        setEditing(true);
        openAddColourSubCategoryModal(subCategory.colorSubCategoryId);
      } else if (action === "delete") {
        setDeleteModal({ open: true, type: "subCategory" });
      }
    }
  };

  const handleColourCategoryAction = (
    action: "edit" | "delete",
    colorCategory: ColorCategory
  ) => {
    setSelectedItem(colorCategory);
    if (action === "edit") {
      setEditing(true);
      setAddColourCategoryModal(true);
    } else if (action === "delete"){
      setDeleteModal({ open: true, type: "colorCategory" });
    }
  };

  const handleAddColourCategorySubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateColourCategory({
            id: selectedItem.colorCategoryId,
            payload: { name: values.name, description: values.description },
          })
        ).unwrap();
        message.success("Workflow process updated successfully");
      } else {
        await dispatch(createColourCategory(values)).unwrap();
        message.success("Workflow process created successfully");
      }
      setAddColourCategoryModal(false);
    } catch (error) {
      message.error(error || "Failed to create workflow process");
    } finally {
      setEditing(false);
      setSelectedItem(null);
      setLoading(false);
    }
  };
  const handleAddColourSubCategorySubmit = async (values: {
    name: string;
    description: string;
  }) => {
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateColourSubCategory({
            name: values.name,
            description: values.description,
            colorSubCategoryId: selectedItem.colorSubCategoryId,
          })
        ).unwrap();
        message.success("Workflow process updated successfully");
      } else {
        await dispatch(
          createColourSubCategory({ ...values, colorCategoryId })
        ).unwrap();
        message.success("Workflow process task created successfully");
      }
      setAddColourSubCategoryModal(false);
    } catch (error) {
      message.error(error || "Failed to create workflow process task");
    } finally {
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: any) => {
    setLoading(true);
    try {
      if (type === "subCategoryItem") {
        await dispatch(
          deleteColourSubCategoryItem({ workflowProcessTaskId: id })
        ).unwrap();
        message.success("Sub Category Item deleted successfully");
      } else if (type === "subCategory") {
        await dispatch(
          deleteColourSubCategory({ colorSubCategoryId: id })
        ).unwrap();
        message.success("Sub Category deleted successfully");
      } else if (type === "colorCategory") {
        await dispatch(deleteColourCategory(id)).unwrap();
        message.success("Color category deleted successfully");
      }
    } catch (error) {
      message.error(error || "Failed to delete workflow process");
    } finally {
      setDeleteModal({ open: false, type });
      setSelectedItem(null);
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Colour Category List
        </h2>
        <div className="flex gap-2">
          <Button
            type="primary"
            disabled={status == Status.PENDING}
            onClick={() => {
              setEditing(false);
              setAddColourCategoryModal(true);
            }}
          >
            Add Category
          </Button>
        </div>
      </div>

      {status == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Loading type="primary" />
        </div>
      ) : ColorCategory.length > 0 ? (
        <div className="space-y-4">
          {ColorCategory?.map((colorCategory: ColorCategory) => {
            const isDropdownOpen =
              dropDowns[colorCategory?.colorCategoryId] || false;
            const isLoading =
              loadingItems[colorCategory?.colorCategoryId] || false;
            return (
              <div
                key={colorCategory?.colorCategoryId}
                className="bg-white shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg"
              >
                {/* color category */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
                  onClick={() =>
                    handleColorCategoryExpand(
                      colorCategory?.colorCategoryId,
                      colorCategory?.isExpanded
                    )
                  }
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 break-words">
                        {colorCategory?.name}
                      </h3>
                      {colorCategory?.description && (
                        <Tooltip
                          title={colorCategory?.description}
                          placement="top"
                        >
                          <span className="text-sm text-gray-500 truncate max-w-[200px]">
                            {colorCategory?.description}
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <button
                      className="p-2 rounded-lg hover:bg-green-50 transition"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAddColourSubCategoryModal(
                          colorCategory?.colorCategoryId
                        );
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
                        handleColourCategoryAction("edit", colorCategory);
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
                        handleColourCategoryAction("delete", colorCategory);
                      }}
                    >
                      <IconTrash
                        size={18}
                        className="text-gray-600 hover:text-red-600"
                      />
                    </button>

                    <button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition">
                      {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                    </button>
                  </div>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="px-4 pb-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
                        <Loading type="primary" />
                      </div>
                    ) : colorCategory?.subCategories?.length > 0 ? (
                      <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {colorCategory?.subCategories?.map(
                          (item: SubCategory) => ( 
                            <NestedItem
                              key={item?.colorSubCategoryId}
                              item={item}
                              subItems={item?.items || []}
                              onAdd={() =>
                                openAddColourSubCategoryItemModal(
                                  item.colorSubCategoryId
                                )
                              }
                              handleClick={handleColourSubCategoryAction}
                              onToggleDropdown={handleSubCategoryExpand}
                              isLoading={loadingItems[item.colorSubCategoryId]}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-center flex flex-col justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        <p className="text-base font-medium">
                          No Task here yet.
                        </p>
                        <p className="text-sm">
                          Click on the + icon to add Task.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <Empty
          description={
            <span className="text-gray-500">No Workflow Process found.</span>
          }
          className="py-12"
        />
      )}

      {/* Modals */}
      {addColourCategoryModal && (
        <CreateFormModal
          title="Colour Category"
          isEditing={editing}
          open={addColourCategoryModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddColourCategoryModal(false);
          }}
          initialValues={selectedItem}
          onSubmit={handleAddColourCategorySubmit}
          fields={MasterPricingCategoryFields()}
        />
      )}

      {addColourSubCategoryModal && (
        <CreateFormModal
          title="Colour Sub Category"
          isEditing={editing}
          open={addColourSubCategoryModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddColourSubCategoryModal(false);
          }}
          initialValues={{ ...selectedItem, logo: selectedItem?.attachment }}
          onSubmit={handleAddColourSubCategorySubmit}
          fields={MasterPricingCategoryFields()}
        />
      )}

      {addColourSubCategoryItemModal && (
        <ColorCategoryItemModel
          open={addColourSubCategoryItemModal}
          onClose={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddColourSubCategoryItemModal(false);
          }}
          selectedColorSubCategoryId={colorSubCategoryId}
          categoryItem={selectedItem}
        />
      )}

      {deleteModal.open && (
        <ConfirmationModal
          loading={loading}
          open={deleteModal.open}
          onClose={() =>{
            setSelectedItem(null);
            setDeleteModal({ open: false, type: deleteModal.type })
          }}
          onConfirm={() =>
            handleDelete(
              deleteModal.type,
              deleteModal.type === "subCategoryItem"
                ? selectedItem?.colorItemId
                : deleteModal.type === "subCategory"
                ? selectedItem?.colorSubCategoryId
                : selectedItem?.colorCategoryId
            )
          }
          type="danger"
          title="Confirm Deletion"
          message={
            deleteModal.type === "subCategoryItem"
              ? "Are you sure you want to delete this Sub Category Item? Deleting it will also remove it from any associated subcategory."
              : deleteModal.type === "subCategory"
              ? "Are you sure you want to delete this Sub Category? Deleting it will also remove it from any associated Color category."
              : "Are you sure you want to delete this Category? Deleting it will also remove all the subcategories and subcategory items under it and affect any places where it is used."
          }
        />
      )}
    </div>
  );
};

export default ColourCategoryPage;
