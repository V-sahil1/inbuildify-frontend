import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import { createColourCategory, createColourSubCategory, deleteColourCategory, deleteColourSubCategory, deleteColourSubCategoryItem, fetchColourCategory, fetchColourGroups, fetchColourSubCategory, fetchColourSubCategoryItems, updateColourCategory, updateColourSubCategory } from '@redux/feature/color/colorThunk';
import { message, Empty, Tooltip, Button, Input } from 'antd';
import { IconChevronDown, IconChevronUp, IconCopy, IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { Status } from '@lib/constants/enum';
import { toggleExpandColourCategory, toggleExpandColourCategoryItem } from '@redux/feature/color/ColourSlice';
import { Color, Category } from '@redux/feature/color/iColourState';
import Loading from '@/components/common/Loading';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import ColorCategoryItemModel from '@/components/common/Models/ColorCategoryItemModel';
import NestedItem from '@/components/common/NestedItem';
import { ColorMasterCategoryFields } from '@/components/formFields/colorCategoryFields';
import { ColorSubCategoryFields } from '@/components/formFields/colorSubCategoryFields';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { buildCopyFields as getBuildCopyFields } from '@/components/formFields/copyColorcategories';
import { CopyType } from 'types/common.types';
import { fetchAllSuppliers } from '@redux/feature/supplier/supplierThunk';
import TooltipButton from '@/components/common/TooltipButton';

// add the popover  on the delete button if the status ia active and make it inactive , if ie is inactive then  delte it with conformation modaltype CopyType = 'category' | 'subcategory' | 'subcategoryitem';  
interface ColorViewProps {
  showSearchBar?: boolean;
}

const ColorView = ({ showSearchBar = true }: ColorViewProps) => {
  let isActive = true;
  const dispatch = useAppDispatch();
  const { ColorGroup, Color, status } = useAppSelector(state => state.colour);
  const { suppliers } = useAppSelector(state => state.supplier);

  const fetchColourCategoryData = async () => {
    try {
      await dispatch(fetchColourCategory()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch colour category');
    }
  };

  const fetchSupplierData = async () => {
    try {
      await dispatch(fetchAllSuppliers()).unwrap();
      await dispatch(fetchColourGroups()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch suppliers');
    }
  };
  useEffect(() => {
    if (status === Status.IDLE) {
      fetchColourCategoryData();
      fetchSupplierData();
    }
  }, [status]);

  const [colorId, setColorId] = useState('');
  const [addColourModal, setAddColourModal] = useState(false);
  const [addColourCategoryModal, setAddColourCategoryModal] = useState(false);
  const [addColourSubCategoryItemModal, setAddColourSubCategoryItemModal] = useState(false);
  const [colorSubCategoryId, setColorSubCategoryId] = useState('');
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    type: 'subCategory',
  });

  const [copyModal, setCopyModal] = useState<{ open: boolean, type: CopyType }>({
    open: false,
    type: 'category',
  });
  const [copySelectedCategoryId, setCopySelectedCategoryId] = useState<string>('');
  const [copySubCategoryList, setCopySubCategoryList] = useState<Array<{ value: string; label: string }>>([]);
  const [copyInitialValues, setCopyInitialValues] = useState<any>({});
  const [editing, setEditing] = useState<boolean>(false);

  const { setParams } = debouncedURL({
    filtersKey: ["search"], 
    delay: 500,                 
    shouldSyncURL: true
  });

  const handleFilterChange = (filters: any) => {
    setParams(filters);
  };


  const openAddColourSubCategoryModal = (colorCategoryId: string) => {
    setColorId(colorCategoryId);
    setAddColourCategoryModal(true);
  };

  const openAddColourSubCategoryItemModal = (colorSubCategoryId: string) => {
    setAddColourSubCategoryItemModal(true);
    setColorSubCategoryId(colorSubCategoryId);
  };
  const handleColorCategoryExpand = async (colorCategoryId: string, isExpanded: boolean) => {
    const currentDropdownState = dropDowns[colorCategoryId] || false;
    
    // Only toggle the dropdown state
    setDropDowns(prev => ({
      ...prev,
      [colorCategoryId]: !currentDropdownState,
    }));

    // Only call API if we're expanding (current state is false, new state will be true)
    if (!currentDropdownState) {
      try {
        setLoadingItems(prev => ({ ...prev, [colorCategoryId]: true }));
        dispatch(toggleExpandColourCategory(colorCategoryId));

        await dispatch(fetchColourSubCategory(colorCategoryId)).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch colour sub category');
      } finally {
        setLoadingItems(prev => ({ ...prev, [colorCategoryId]: false }));
      }
    }
  };

  const handleSubCategoryExpand = async (item: Category) => {
    const currentDropdownState = dropDowns[item.colorCategoryId] || false;
    
    // Only toggle the dropdown state
    setDropDowns(prev => ({
      ...prev,
      [item.colorCategoryId]: !currentDropdownState,
    }));

    // Only call API if we're expanding (current state is false, new state will be true)
    if (!currentDropdownState) {
      try {
        setLoadingItems(prev => ({
          ...prev,
          [item.colorCategoryId]: true,
        }));
        dispatch(
          toggleExpandColourCategoryItem({
            colorSubCategoryId: item.colorCategoryId,
            colorId: item.colorId,
          })
        );

        await dispatch(
          fetchColourSubCategoryItems({
            colorSubCategoryId: item.colorCategoryId,
            colorCategoryId: item.colorId,
          })
        ).unwrap();
      } catch (error: any) {
        message.error(error || 'Failed to fetch colour sub category');
      } finally {
        setLoadingItems(prev => ({
          ...prev,
          [item.colorCategoryId]: false,
        }));
      }
    }
  };
  const handleColourSubCategoryAction = (action: string, subCategory: any, actionType?: string) => {
    setSelectedItem(subCategory);
    if (actionType === 'subCategoryItem') {
      if (action === 'edit') {
        setEditing(true);
        openAddColourSubCategoryItemModal(subCategory.colorItemId);
      } else if (action === 'delete') {
        setDeleteModal({ open: true, type: 'subCategoryItem' });
      }
    } else {
      if (action === 'edit') {
        setEditing(true);
        openAddColourSubCategoryModal(subCategory.colorSubCategoryId);
      } else if (action === 'delete') {
        setDeleteModal({ open: true, type: 'subCategory' });
      }
    }
  };

  const handleColourCategoryAction = (action: 'edit' | 'delete', colorCategory: Color) => {
    setSelectedItem(colorCategory);
    if (action === 'edit') {
      setEditing(true);
      setAddColourModal(true);
    } else if (action === 'delete') {
      setDeleteModal({ open: true, type: 'colorCategory' });
    }
  };
  //copy category model open
  const handleCategoryCopyModelOpen = ({ colorCategory, type }: { colorCategory: Color; type: CopyType }) => {
    setSelectedItem(colorCategory);
    setCopyInitialValues({
      categoryName: `${colorCategory.colorName} (Copy)`,
      sortOrder: (Color?.length || 0) + 1,
    });
    setCopyModal({ open: true, type: type });
    setCopySelectedCategoryId('');
    setCopySubCategoryList([]);
  };

  const handleSubCategoryCopyModelOpen = (data: Category, type: CopyType) => {
    if (type === "subcategory") {
      setSelectedItem(data);
      // find parent category id for the subcategory
      const parent = Color.find(cat =>
        cat.colorCategories?.some((sc: Category) => sc.colorCategoryId === data.colorCategoryId)
      );
      const categoryId = parent?.colorId ?? '';

      setCopyInitialValues({
        categoryId: categoryId,
        subCategoryName: `${data.categoryName} (Copy)`,
        sortOrder: data?.sortOrder ? data.sortOrder + 1 : 1,
      });
      setCopyModal({ open: true, type });
      setCopySelectedCategoryId(categoryId);

      // fetch subcategories of that category so UI shows them (if needed)
      if (categoryId) {
        fetchSubcategoriesForCopy(categoryId);
      } else {
        setCopySubCategoryList([]);
      }
    } else if (type === "subcategoryitem") {
      setSelectedItem(data);
      // find parent category id from subCategoryId inside the item
      const parentCategory = Color.find(cat =>
        cat.colorCategories?.some((sc: Category) => sc.colorCategoryId === data.colorCategoryId)
      );
      const categoryId = parentCategory?.colorId ?? '';

      setCopyInitialValues({
        categoryId: categoryId,
        subCategoryId: data.colorCategoryId,
        subCategoryItemName: `${data.categoryName} (Copy)`,
        sortOrder: data?.sortOrder ? data.sortOrder + 1 : 1,
      });
      setCopyModal({ open: true, type });
      setCopySelectedCategoryId(categoryId);

      if (categoryId) {
        fetchSubcategoriesForCopy(categoryId);
      } else {
        setCopySubCategoryList([]);
      }

    }

  }

  const fetchSubcategoriesForCopy = async (categoryId: string) => {
    try {
      const res = await dispatch(fetchColourSubCategory(categoryId)).unwrap();
      const mapped = res.data.map((it: any) => ({ value: it.colorSubCategoryId, label: it.name }));
      setCopySubCategoryList(mapped);
    } catch (err) {
      message.error('Failed to fetch subcategories for copy');
      setCopySubCategoryList([]);
    }
  };

  const handleAddColourCategorySubmit = async (values: { colorName: string; status: string; sortOrder?: number}) => {
    try {
      setLoading(true);
      // Ensure sortOrder is within valid range (1 to total categories + 1)
      const maxSortOrder = Color?.length ? Color.length + 1 : 1;
      const sortOrder = values.sortOrder ? Math.min(Math.max(1, values.sortOrder), maxSortOrder) : maxSortOrder;

      const payload = {
        ...values,
        status: values?.status === 'active',
        sortOrder
      };

      if (editing) {
        await dispatch(
          updateColourCategory({
            id: selectedItem.colorId,
            payload: payload,
          })
        ).unwrap();
        message.success('Color category updated successfully');
      } else {
        await dispatch(createColourCategory(payload)).unwrap();
        message.success('Color category created successfully');
      }
      setAddColourModal(false);
    } catch (error) {
      message.error(error?.message || 'Failed to process color category');
    } finally {
      setEditing(false);
      setSelectedItem(null);
      setLoading(false);
    }
  };
  const handleAddColourSubCategorySubmit = async (values) => {
    try {
      setLoading(true);
      if (editing) {
        await dispatch(
          updateColourSubCategory({
            data: {...values, status : values.status === 'active'},
            colorCategoryId: selectedItem.colorCategoryId,
          })
        ).unwrap();
        message.success('Workflow process updated successfully');
      } else {
        await dispatch(createColourSubCategory({ ...values , status : values.status === 'active' ,colorId: colorId })).unwrap();
        message.success('Workflow process task created successfully');
      }
      setAddColourCategoryModal(false);
    } catch (error) {
      message.error(error || 'Failed to create workflow process task');
    } finally {
      setSelectedItem(null);
      setLoading(false);
    }
  };

  const handleDelete = async (type: string, id: any) => {
    setLoading(true);
    try {
      if (type === 'subCategoryItem') {
        await dispatch(deleteColourSubCategoryItem({ workflowProcessTaskId: id })).unwrap();
        message.success('Sub Category Item deleted successfully');
      } else if (type === 'subCategory') {
        await dispatch(deleteColourSubCategory({ colorCategoryId: id })).unwrap();
        message.success('Sub Category deleted successfully');
      } else if (type === 'colorCategory') {
        await dispatch(deleteColourCategory(id)).unwrap();
        message.success('Color category deleted successfully');
      }
    } catch (error) {
      message.error(error || 'Failed to delete workflow process');
    } finally {
      setDeleteModal({ open: false, type });
      setSelectedItem(null);
      setLoading(false);
    }
  };

  // Build category list options
  const categoryList = Color?.map((item: any) => ({
    value: item.colorId,
    label: item.colorName,
  }));

  // Build fields for copy flows dynamically based on copyModal.type
  const buildCopyFields = () => {
    return getBuildCopyFields(
      copyModal,
      copyInitialValues,
      Color?.length || 0,
      categoryList,
      copySubCategoryList
    );
  };
  const handleCopySubmit = async (values: any) => {
    console.log(values);
    // try {
    //   setLoading(true);
    //   if (editing) {
    //     await dispatch(
    //       updateColourSubCategory({
    //         name: values.name,
    //         description: values.description,
    //         colorSubCategoryId: selectedItem.colorSubCategoryId,
    //       })
    //     ).unwrap();
    //     message.success('Workflow process updated successfully');
    //   } else {
    //     await dispatch(createColourSubCategory({ ...values, colorCategoryId })).unwrap();
    //     message.success('Workflow process task created successfully');
    //   }
    //   setAddColourSubCategoryModal(false);
    // } catch (error) {
    //   message.error(error || 'Failed to create workflow process task');
    // } finally {
    //   setSelectedItem(null);
    //   setLoading(false);
    // }
  };

  return (
    <div className="p-4">
      <div>
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Colour Master
        </h2>
        {showSearchBar && <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 w-[60%]">
            <Input
              addonBefore={<IconSearch size={20} />}
              onChange={e => handleFilterChange({ search: e.target.value })}
              placeholder="Search by color, colorcategory or item code"
              style={{ width: '80%' }}
            />
          </div>
          <Button
            type="primary"
            disabled={status == Status.PENDING}
            onClick={() => {
              setEditing(false);
              setAddColourModal(true);
            }}
          >
            Add Color Master
          </Button>
        </div>}
      </div>

      {status == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Loading type="primary" />
        </div>
      ) : Color?.length > 0 ? (
        <div className="space-y-4">
          {Color?.map((colorCategory: Color) => {
            const isDropdownOpen = dropDowns[colorCategory?.colorId] || false;
            const isLoading = loadingItems[colorCategory?.colorId] || false;
            return (
              <div
                key={colorCategory?.colorId}
                className={`${isActive ? "bg-white" : "bg-gray-100"} shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg`}
              >
                {/* color category */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
                  onClick={() =>
                    handleColorCategoryExpand(
                      colorCategory?.colorId,
                      colorCategory?.isExpanded
                    )
                  }
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 break-words">
                        {colorCategory?.colorName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <TooltipButton
                      className="p-2 rounded-lg hover:!bg-green-50 transition border-none "
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedItem(colorCategory);
                        handleCategoryCopyModelOpen({ colorCategory, type: "category" });
                      }}
                      title="Copy"
                      icon={<IconCopy size={18} className="text-gray-600 hover:text-blue-600" />}
                    />
                    <TooltipButton
                      className="p-2 rounded-lg hover:!bg-green-50 transition border-none"
                      // disabled={!isActive}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAddColourSubCategoryModal(colorCategory?.colorId);
                      }}
                      title="Add Category"
                      icon={<IconPlus size={18} className="text-gray-600 hover:text-green-600" />}
                    />
                    <TooltipButton
                      className="p-2 rounded-lg hover:!bg-blue-50 transition border-none"
                      onClick={e => {
                        e.stopPropagation();
                        handleColourCategoryAction('edit', colorCategory);
                      }}
                      title='Edit Color'
                      icon={<IconEdit size={18} className="text-gray-600 hover:text-blue-600" />}

                    />
                    <TooltipButton
                      className="p-2 rounded-lg hover:!bg-red-50 transition border-none"
                      onClick={e => {
                        e.stopPropagation();
                        handleColourCategoryAction('delete', colorCategory);
                      }}
                      title='Delete'
                      icon={<IconTrash size={18} className="text-gray-600 hover:text-red-600" />}
                    />

                    <Button className="mt-1 flex-shrink-0 text-gray-600 hover:text-blue-500 transition border-none">
                      {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                    </Button>
                  </div>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="px-4 pb-4">
                    {isLoading ? (
                      <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
                        <Loading type="primary" />
                      </div>
                    ) : colorCategory?.colorCategories?.length > 0 ? (
                      <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 pr-2">
                        {colorCategory?.colorCategories?.map((item: Category) => (
                          <NestedItem
                            key={item?.colorCategoryId}
                            item={item}
                            subItems={item?.items || []}
                            handleCopy={handleSubCategoryCopyModelOpen}
                            onAdd={() => openAddColourSubCategoryItemModal(item.colorCategoryId)}
                            handleClick={handleColourSubCategoryAction}
                            onToggleDropdown={handleSubCategoryExpand}
                            isLoading={loadingItems[item.colorCategoryId]}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center flex flex-col justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                        <p className="text-base font-medium">No Task here yet.</p>
                        <p className="text-sm">Click on the + icon to add Task.</p>
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
          description={<span className="text-gray-500">No Workflow Process found.</span>}
          className="py-12"
        />
      )}

      {/* Modals */}
      {addColourModal && (
        <ActionDialogmodel
          title="Color"
          isEditing={editing}
          open={addColourModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddColourModal(false);
          }}
          initialValues={{
            ...selectedItem,
            sortOrder: selectedItem?.sortOrder || (Color?.length || 0) + 1,
            status: selectedItem?.status ? 'active' : 'inactive',
          }}
          onSubmit={handleAddColourCategorySubmit}
          fields={ColorMasterCategoryFields(Color?.length || 0)}
        />
      )}

      {addColourCategoryModal && (
        <ActionDialogmodel
          title={`${editing ? 'Edit' : 'Add'} Colour Category`}
          isEditing={editing}
          open={addColourCategoryModal}
          loading={loading}
          onCancel={() => {
            setEditing(false);
            setSelectedItem(null);
            setAddColourCategoryModal(false);
          }}
          initialValues={{
            ...selectedItem,
            sortOrder: editing ? selectedItem?.sortOrder : (() => {
              const selectedColor = Color?.find(c => c.colorId === colorId);
              console.log("Selected color", selectedColor?.colorCategories?.length);
              return ((selectedColor?.colorCategories?.length || 0) + 1);
            })(),
            status:  editing ? selectedItem?.status ? 'active' : 'inactive'   : 'active',
          }}
          onSubmit={handleAddColourSubCategorySubmit}
          fields={ColorSubCategoryFields({ group:ColorGroup, users: suppliers, totalCount: selectedItem?.subCategories?.length || 0 })}
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

      {/* Copy flows through ActionDialogmodel */}
      {copyModal.open && (
        <ActionDialogmodel
          title={
            copyModal.type === 'category'
              ? 'Copy Colour Category'
              : copyModal.type === 'subcategory'
                ? 'Copy Subcategory'
                : 'Copy Subcategory Item'
          }
          open={copyModal.open}
          loading={loading}
          onCancel={() => {
            setCopyModal(prev => ({ ...prev, open: false }));
            setCopySubCategoryList([]);
            setCopySelectedCategoryId('');
            setSelectedItem(null);
          }}
          initialValues={copyInitialValues}
          onSubmit={handleCopySubmit}
          fields={buildCopyFields()}
        />
      )}

      {deleteModal.open && (
        <ConfirmationModal
          loading={loading}
          open={deleteModal.open}
          onClose={() => {
            setSelectedItem(null);
            setDeleteModal({ open: false, type: deleteModal.type });
          }}
          onConfirm={() =>
            handleDelete(
              deleteModal.type,
              deleteModal.type === 'subCategoryItem'
                ? selectedItem?.colorItemId
                : deleteModal.type === 'subCategory'
                  ? selectedItem?.colorCategoryId
                  : selectedItem?.colorId
            )
          }
          type="danger"
          title="Confirm Deletion"
          message={
            deleteModal.type === 'subCategoryItem'
              ? 'Are you sure you want to delete this Sub Category Item? Deleting it will also remove it from any associated subcategory.'
              : deleteModal.type === 'subCategory'
                ? 'Are you sure you want to delete this Sub Category? Deleting it will also remove it from any associated Color category.'
                : 'Are you sure you want to delete this Category? Deleting it will also remove all the subcategories and subcategory items under it and affect any places where it is used.'
          }
        />
      )}
    </div>
  );
};

export default ColorView;
