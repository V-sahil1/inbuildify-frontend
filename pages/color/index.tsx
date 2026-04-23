import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  copyColorCategory,
  copyColour,
  copyColourItem,
  createColour,
  createColourCategory,
  deleteColour,
  deleteColourCategory,
  deleteColourItem,
  fetchAllColour,
  fetchColourCategory,
  fetchColourItemCustomField,
  fetchColourItems,
  updateColour,
  updateColourCategory,
} from '@redux/feature/color/colorThunk';
import { message, Empty, Button, Input } from 'antd';
import {
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
} from '@tabler/icons-react';
import { Status } from '@lib/constants/enum';
import {
  toggleExpandColourCategory,
  toggleExpandColourCategoryItem,
} from '@redux/feature/color/ColourSlice';
import { Category, ColorItem, ColorType } from '@redux/feature/color/iColourState';
import Loading from '@/components/common/Loading';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import ColorCategoryItemModel from '@/components/common/Models/ColorCategoryItemModel';
import NestedItem from '@/components/common/NestedItem';
import { TableDrawer } from '@/components/common/TableDrawer';
import { ColorMasterCategoryFields } from '@/components/formFields/colorCategoryFields';
import { ColorSubCategoryFields } from '@/components/formFields/colorSubCategoryFields';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { CopyType } from 'types/common.types';
import TooltipButton from '@/components/common/TooltipButton';
import { useColorGroupHook } from '@hooks/useColorGroupHook';
import { useSupplierHook } from '@hooks/useSupplierHook';
import { CopyInitialValues, useBuildCopyFields } from '@/components/formFields/copyColorcategories';
import { QuotationHistoryColumn } from '@/components/table-columns/QuotationHistoryColumn';
import { QuotationHistory } from '@lib/utils/Reports/quotation/QuotationHistory';
import { IconDownload } from '@tabler/icons-react';

// add the popover  on the delete button if the status ia active and make it inactive , if ie is inactive then  delte it with conformation modal

interface ColorViewProps {
  showSearchBar?: boolean;
}

const ColorView = ({ showSearchBar = true }: ColorViewProps) => {
  const dispatch = useAppDispatch();
  const { color, status } = useAppSelector(state => state.colour);
  const [modalOpen, setModalOpen] = useState<
    | 'color'
    | 'category'
    | 'colorItem'
    | 'deleteColor'
    | 'deleteCategory'
    | 'deleteColorItem'
    | 'copyColor'
    | 'copyCategory'
    | 'copyColorItem'
    | null
  >(null);
  const [selectedColorId, setSelectedColorId] = useState('');
  const [colorSubCategoryId, setColorSubCategoryId] = useState('');
  const [dropDowns, setDropDowns] = useState<Record<string, boolean>>({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [copyInitialValues, setCopyInitialValues] = useState<CopyInitialValues>({});
  const [quotationDrawerOpen, setQuotationDrawerOpen] = useState(false);
  const [selectedSubItem, setSelectedSubItem] = useState<ColorItem | null>(null);
  const { colorGroupOptions } = useColorGroupHook();
  const { supplierOptions } = useSupplierHook();
  const copyFields = useBuildCopyFields({
    copyModal: modalOpen,
    copyInitialValues,
    color,
  });
  const { columns: quotationColumns, data } = QuotationHistoryColumn();
  const loading =
    status.color.create === Status.PENDING ||
    status.category.create === Status.PENDING ||
    status.colorItem.create === Status.PENDING;

  const { setParams } = debouncedURL({
    filtersKey: ['search'],
  });
  useEffect(() => {
    if (status.color.fetch === Status.IDLE) {
      fetchColourData();
    }
  }, [status.color.fetch]);

  const fetchColourData = async () => {
    try {
      await dispatch(fetchAllColour()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch colour category');
    }
  };

  const openAddColourSubCategoryModal = (colorCategoryId: string) => {
    setSelectedColorId(colorCategoryId);
    setModalOpen('category');
  };

  const openAddColourSubCategoryItemModal = async (colorSubCategoryId: string) => {
    setModalOpen('colorItem');
    setColorSubCategoryId(colorSubCategoryId);
    try {
      await dispatch(fetchColourItemCustomField(colorSubCategoryId)).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch custom fields');
    }
  };
  const handleColorCategoryExpand = async (colorCategory: ColorType) => {
    const currentDropdownState = dropDowns[colorCategory.colorId] || false;
    setDropDowns(prev => ({
      ...prev,
      [colorCategory?.colorId]: !currentDropdownState,
    }));
    if (!colorCategory.isExpanded) {
      try {
        dispatch(toggleExpandColourCategory(colorCategory.colorId));
        await dispatch(fetchColourCategory(colorCategory.colorId)).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch colour sub category');
      }
    }
  };

  const handleSubCategoryExpand = async (item: Category) => {
    const currentDropdownState = dropDowns[item.colorCategoryId] || false;
    setDropDowns(prev => ({
      ...prev,
      [item.colorCategoryId]: !currentDropdownState,
    }));
    if (!item.isExpanded) {
      try {
        dispatch(
          toggleExpandColourCategoryItem({
            colorCategoryId: item.colorCategoryId,
            colorId: item.colorId,
          })
        );
        await dispatch(
          fetchColourItems({
            colorCategoryId: item.colorCategoryId,
            colorId: item.colorId,
          })
        ).unwrap();
      } catch (error) {
        message.error(error || 'Failed to fetch colour sub category');
      }
    }
  };

  const handleColourSubCategoryAction = (
    action: string,
    subCategory: Category | ColorItem,
    actionType?: string
  ) => {
    setSelectedItem(subCategory);
    if (actionType === 'subCategoryItem') {
      const subCategoryItem = subCategory as ColorItem;
      if (action === 'edit') {
        openAddColourSubCategoryItemModal(subCategoryItem.colorItemId);
      } else if (action === 'delete') {
        setModalOpen('deleteColorItem');
      }
    } else {
      const category = subCategory as Category;
      if (action === 'edit') {
        openAddColourSubCategoryModal(category.colorCategoryId);
      } else if (action === 'delete') {
        setModalOpen('deleteCategory');
      }
    }
  };

  const handleColourCategoryAction = (action: 'edit' | 'delete', colorCategory: ColorType) => {
    setSelectedItem(colorCategory);
    if (action === 'edit') {
      setModalOpen('color');
    } else if (action === 'delete') {
      setModalOpen('deleteColor');
    }
  };

  //copy category model open
  const handleCategoryCopyModelOpen = (record: ColorType) => {
    setSelectedItem(record);
    setCopyInitialValues({
      categoryName: `${record.colorName} (Copy)`,
      sortOrder: (color?.length || 0) + 1,
    });
    setModalOpen('copyColor');
  };

  const handleSubCategoryCopyModelOpen = (data: Category | ColorItem, type: CopyType) => {
    setSelectedItem(data);
    if (type === 'subcategory') {
      const categoryData = data as Category;
      setCopyInitialValues({
        colorId: categoryData.colorId,
        categoryName: `${categoryData.categoryName} (Copy)`,
        sortOrder: categoryData?.sortOrder ? categoryData.sortOrder + 1 : 1,
      });
      setModalOpen('copyCategory');
    } else if (type === 'subcategoryitem') {
      const subCategoryItemData = data as ColorItem;
      setCopyInitialValues({
        colorId: '',
        colorCategoryId: '',
        itemName: `${subCategoryItemData.itemName} (Copy)`,
        sortOrder: subCategoryItemData?.sortOrder ? subCategoryItemData.sortOrder + 1 : 1,
      });
      setModalOpen('copyColorItem');
    }
  };

  const handleAddColourCategorySubmit = async (values: ColorType) => {
    try {
      const sortOrder = Math.min(Math.max(1, values?.sortOrder || 0), color?.length || 1);
      const payload = {
        ...values,
        status: values?.status === 'active',
        sortOrder,
      };

      if (!!selectedItem) {
        await dispatch(
          updateColour({
            id: selectedItem.colorId,
            payload: payload,
          })
        ).unwrap();
        message.success('Color category updated successfully');
      } else {
        await dispatch(createColour(payload)).unwrap();
        message.success('Color category created successfully');
      }
      setModalOpen(null);
      setSelectedItem(null);
    } catch (error) {
      message.error(error || 'Failed to process color category');
    }
  };

  const handleAddColourSubCategorySubmit = async values => {
    try {
      if (!!selectedItem) {
        await dispatch(
          updateColourCategory({
            data: { ...values, status: values.status === 'active' },
            colorCategoryId: selectedItem.colorCategoryId,
          })
        ).unwrap();
        message.success('Workflow process updated successfully');
      } else {
        await dispatch(
          createColourCategory({
            ...values,
            status: values.status === 'active',
            colorId: selectedColorId,
          })
        ).unwrap();
        message.success('Workflow process task created successfully');
      }
      setModalOpen(null);
      setSelectedItem(null);
    } catch (error) {
      message.error(error || 'Failed to create workflow process task');
    }
  };

  const handleDelete = async (
    type: string,
    colorId?: string,
    colorCategoryId?: string,
    colorItemId?: string
  ) => {
    try {
      if (type === 'deleteColorItem') {
        await dispatch(deleteColourItem({ id: colorItemId, colorCategoryId })).unwrap();
        message.success('Sub Category Item deleted successfully');
      } else if (type === 'deleteCategory') {
        await dispatch(
          deleteColourCategory({ colorCategoryId: colorCategoryId, colorId })
        ).unwrap();
        message.success('Sub Category deleted successfully');
      } else if (type === 'deleteColor') {
        await dispatch(deleteColour(colorId)).unwrap();
        message.success('Color category deleted successfully');
      }
      setModalOpen(null);
      setSelectedItem(null);
    } catch (error) {
      message.error(error || 'Failed to delete item');
    }
  };

  const handleCopySubmit = async values => {
    try {
      if (modalOpen === 'copyColor') {
        await dispatch(copyColour({ data: values, id: selectedItem?.colorId })).unwrap();
        message.success('Color copy successfully');
      } else if (modalOpen === 'copyCategory') {
        await dispatch(
          copyColorCategory({
            data: values,
            id: selectedItem?.colorCategoryId,
            colorId: selectedItem?.colorId,
          })
        ).unwrap();
        message.success('Color category copy successfully');
      } else {
        await dispatch(copyColourItem({ data: values, id: selectedItem?.colorItemId })).unwrap();
        message.success('Color item copy successfully');
      }
      setSelectedItem(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to copy item');
    }
  };

  const handleQuotationHistoryClick = (subItem: ColorItem) => {
    setSelectedSubItem(subItem);
    setQuotationDrawerOpen(true);
  };

  return (
    <div className="p-4">
      <div>
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Colour Master
        </h2>
        {showSearchBar && (
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 w-[60%]">
              <Input
                addonBefore={<IconSearch size={20} />}
                onChange={e => setParams({ search: e.target.value })}
                placeholder="Search by color, colorcategory or item code"
                style={{ width: '80%' }}
              />
            </div>
            <Button
              type="primary"
              disabled={status.color.create == Status.PENDING}
              onClick={() => {
                setModalOpen('color');
              }}
            >
              Add Color Master
            </Button>
          </div>
        )}
      </div>

      {status.color.fetch == Status.PENDING ? (
        <div className="flex justify-center items-center pt-[20vh]">
          <Loading type="primary" />
        </div>
      ) : color?.length > 0 ? (
        <div className="space-y-4">
          {color?.map((record: ColorType) => {
            const isDropdownOpen = dropDowns[record?.colorId] || false;
            return (
              <div
                key={record?.colorId}
                className="shadow-md rounded-xl border border-gray-200 transition hover:shadow-lg"
              >
                {/* color category */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer rounded-t-xl"
                  onClick={() => handleColorCategoryExpand(record)}
                >
                  <div className="flex items-center gap-2 w-full min-w-0">
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 break-words">
                        {record?.colorName}
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-shrink-0">
                    <TooltipButton
                      type="text"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedItem(record);
                        handleCategoryCopyModelOpen(record);
                      }}
                      title="Copy"
                      icon={<IconCopy size={16} />}
                    />
                    <TooltipButton
                      type="text"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        openAddColourSubCategoryModal(record?.colorId);
                      }}
                      title="Add Category"
                      icon={<IconPlus size={16} />}
                    />
                    <TooltipButton
                      type="text"
                      onClick={e => {
                        e.stopPropagation();
                        handleColourCategoryAction('edit', record);
                      }}
                      title="Edit Color"
                      icon={<IconEdit size={16} />}
                    />
                    <TooltipButton
                      type="text"
                      onClick={e => {
                        e.stopPropagation();
                        handleColourCategoryAction('delete', record);
                      }}
                      title="Delete"
                      icon={<IconTrash size={16} />}
                    />

                    <Button
                      type="text"
                      icon={isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                    />
                  </div>
                </div>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="px-4 pb-4">
                    {status.category.fetch === Status.PENDING ? (
                      <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
                        <Loading type="primary" />
                      </div>
                    ) : record?.colorCategories?.length > 0 ? (
                      <div className="mt-2 max-h-[300px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                        {record?.colorCategories?.map((item: Category) => (
                          <NestedItem
                            key={item?.colorCategoryId}
                            item={item}
                            subItems={item?.items || []}
                            handleCopy={handleSubCategoryCopyModelOpen}
                            onAdd={() => openAddColourSubCategoryItemModal(item.colorCategoryId)}
                            handleClick={handleColourSubCategoryAction}
                            onToggleDropdown={handleSubCategoryExpand}
                            isLoading={status.colorItem.fetch === Status.PENDING}
                            onQuotationHistoryClick={handleQuotationHistoryClick}
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
      {modalOpen === 'color' && (
        <ActionDialogmodel
          title="Color"
          isEditing={!!selectedItem}
          open={modalOpen === 'color'}
          loading={status.color.create === Status.PENDING}
          onCancel={() => {
            setSelectedItem(null);
            setModalOpen(null);
          }}
          initialValues={{
            ...selectedItem,
            sortOrder: selectedItem?.sortOrder || (color?.length || 0) + 1,
            status: selectedItem?.status ? 'active' : 'inactive',
          }}
          onSubmit={handleAddColourCategorySubmit}
          fields={ColorMasterCategoryFields(color?.length || 0)}
        />
      )}

      {modalOpen === 'category' && (
        <ActionDialogmodel
          title={`${!!selectedItem ? 'Edit' : 'Add'} Colour Category`}
          isEditing={!!selectedItem}
          open={modalOpen === 'category'}
          loading={status.category.create === Status.PENDING}
          onCancel={() => {
            setSelectedItem(null);
            setModalOpen(null);
          }}
          initialValues={{
            ...selectedItem,
            status: !!selectedItem ? (selectedItem?.status ? 'active' : 'inactive') : 'active',
          }}
          onSubmit={handleAddColourSubCategorySubmit}
          fields={ColorSubCategoryFields({
            groupOptions: colorGroupOptions,
            supplierOptions: supplierOptions,
            totalCount: selectedItem?.subCategories?.length || 0,
          })}
        />
      )}

      {modalOpen === 'colorItem' && (
        <ColorCategoryItemModel
          open={modalOpen === 'colorItem'}
          onClose={() => {
            setSelectedItem(null);
            setModalOpen(null);
          }}
          selectedColorCategoryId={colorSubCategoryId}
          categoryItem={color
            ?.find(c =>
              c.colorCategories?.find(cat =>
                cat.items?.find(item => item.colorItemId === selectedItem?.colorItemId)
              )
            )
            ?.colorCategories?.find(cat =>
              cat.items?.find(item => item.colorItemId === selectedItem?.colorItemId)
            )
            ?.items?.find(item => item.colorItemId === selectedItem?.colorItemId)}
        />
      )}

      {/* Copy flows through ActionDialogmodel */}
      {['copyColor', 'copyCategory', 'copyColorItem'].includes(modalOpen) && (
        <ActionDialogmodel
          title={
            modalOpen === 'copyColor'
              ? 'Copy Colour'
              : modalOpen === 'copyCategory'
                ? 'Copy Category'
                : 'Copy Category Item'
          }
          open={['copyColor', 'copyCategory', 'copyColorItem'].includes(modalOpen)}
          loading={loading}
          onCancel={() => {
            setModalOpen(null);
            setSelectedItem(null);
          }}
          initialValues={copyInitialValues}
          onSubmit={handleCopySubmit}
          fields={copyFields}
        />
      )}

      {['deleteColor', 'deleteCategory', 'deleteColorItem'].includes(modalOpen) && (
        <ConfirmationModal
          loading={loading}
          open={['deleteColor', 'deleteCategory', 'deleteColorItem'].includes(modalOpen)}
          onClose={() => {
            setSelectedItem(null);
            setModalOpen(null);
          }}
          onConfirm={() =>
            handleDelete(
              modalOpen,
              selectedItem?.colorId,
              selectedItem?.colorCategoryId,
              selectedItem?.colorItemId
            )
          }
          type="danger"
          title="Confirm Deletion"
          message={
            modalOpen === 'deleteColorItem'
              ? 'Are you sure you want to delete this Sub Category Item? Deleting it will also remove it from any associated subcategory.'
              : modalOpen === 'deleteCategory'
                ? 'Are you sure you want to delete this Sub Category? Deleting it will also remove it from any associated Color category.'
                : 'Are you sure you want to delete this Category? Deleting it will also remove all the subcategories and subcategory items under it and affect any places where it is used.'
          }
        />
      )}

      {/* Quotation History Drawer */}
      {quotationDrawerOpen && (
        <TableDrawer
          open={quotationDrawerOpen}
          width={1200}
          onClose={() => {
            setQuotationDrawerOpen(false);
            setSelectedSubItem(null);
          }}
          title={
            <div className="flex justify-between">
              <p>Quotation History - {selectedSubItem?.itemName}</p>
              <Button
                type="primary"
                onClick={() => QuotationHistory(data, 'Color Item QuotationList')}
                icon={<IconDownload size={20} />}
              />
            </div>
          }
          table={[{ columns: quotationColumns, data }]}
        />
      )}
    </div>
  );
};

export default ColorView;
