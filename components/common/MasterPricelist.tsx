import { IPriceList, IPriceListItem } from '@redux/feature/masterPriceList/iMasterPriceListState';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconGripVertical,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Button, Popconfirm, Spin, Tooltip } from 'antd';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import TooltipButton from './TooltipButton';
import { PricingItem } from './PricingItem';
import { useAppSelector } from '@hooks/redux';

interface MasterPricelistProps {
  localCategories?: IPriceList[];
  setLocalCategories?: (categories: IPriceList[]) => void;
  dropDowns?: Record<string, boolean>;
  loadingItems?: Record<string, boolean>;
  handleExpand?: (categoryId: string, isExpanded: boolean) => void;
  handlePriceMasterStatus?: () => void;
  setModalOpen?: (
    modal:
      | 'copy'
      | 'create'
      | 'edit'
      | 'Itemcopy'
      | 'ItemCreate'
      | 'activePricelist'
      | 'import'
      | 'createLocation'
  ) => void;
  setDrawerOpen?: (
    drawer: 'create' | 'quotation' | 'copy' | 'location' | 'master' | 'edit' | null
  ) => void;
  setSelectedPriceMaster?: (priceMaster: IPriceList | null) => void;
  setSelectedPricelist?: (pricelist: IPriceListItem | null) => void;
  handleActivateItem?: () => void;
  isEditable?: boolean;
}

export const MasterPricelist = ({
  localCategories,
  setLocalCategories,
  dropDowns,
  loadingItems,
  handleExpand,
  handlePriceMasterStatus,
  setModalOpen,
  setDrawerOpen,
  setSelectedPriceMaster,
  setSelectedPricelist,
  handleActivateItem,
  isEditable = true,
}: MasterPricelistProps) => {
  const { priceMaster } = useAppSelector(state => state.masterPriceList);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const fromIndex = result.source.index;
    const toIndex = result.destination.index;

    // Keep the old state in case API fails
    const prevCategories = [...localCategories];

    // Clone categories to avoid mutation
    const newLocalCategories = localCategories.map(c => ({ ...c }));

    // Move the dragged category in the array
    const [movedCategory] = newLocalCategories.splice(fromIndex, 1);
    newLocalCategories.splice(toIndex, 0, movedCategory);

    // Collect affected categories
    const changedCategories: IPriceList[] = [];

    const oldDisplayOrder = movedCategory.sortOrder;

    if (fromIndex < toIndex) {
      // Moving down
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i <= toIndex; i++) {
        const c = { ...newLocalCategories[i] };
        const currentOrder = c?.sortOrder;
        c.sortOrder = previous;
        previous = currentOrder;
        changedCategories.push(c);
        newLocalCategories[i] = c;
      }
    } else if (fromIndex > toIndex) {
      // Moving up
      let previous = oldDisplayOrder;
      for (let i = fromIndex; i >= toIndex; i--) {
        const c = { ...newLocalCategories[i] };
        const currentOrder = c?.sortOrder;
        c.sortOrder = previous;
        previous = currentOrder;
        changedCategories.push(c);
        newLocalCategories[i] = c;
      }
    }
    setLocalCategories(newLocalCategories);
  };

  const isOrderChanged = () => {
    if (localCategories?.length !== priceMaster?.length) return true;
    return localCategories?.some((c, idx) => c?.priceListId !== priceMaster[idx]?.priceListId);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="categories">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
            {localCategories.map((category: IPriceList, index: number) => {
              const isDropdownOpen = dropDowns[category?.priceListId] || false;
              const isLoading = loadingItems[category?.priceListId] || false;

              return (
                <Draggable
                  key={category?.priceListId}
                  draggableId={String(category?.priceListId)}
                  index={index}
                >
                  {provided => (
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
                          handleExpand(category?.priceListId, category?.isExpanded)
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
                          </div>
                        </div>
                        {!isOrderChanged() && isEditable && (
                          <div className="flex gap-3 flex-shrink-0">
                            <Popconfirm
                              styles={{ root: { width: 350 } }}
                              disabled={category.isActive}
                              title={
                                <>
                                  <p>
                                    When you activate the price list, the system will automatically
                                    update the order in which this record appears, as well as all
                                    the records that come after it.
                                  </p>
                                  <p>
                                    Are you sure you want to go ahead and activate the price list?
                                  </p>
                                </>
                              }
                              onConfirm={() => handlePriceMasterStatus()}
                            >
                              <TooltipButton
                                title={`${category.isActive ? 'Create Pricelist Item' : ''}`}
                                type="text"
                                icon={<IconPlus size={18} />}
                                onClick={() => {
                                  category.isActive
                                    ? setModalOpen('ItemCreate')
                                    : setSelectedPriceMaster(category);
                                }}
                              />
                            </Popconfirm>
                            <TooltipButton
                              type="text"
                              title="Edit"
                              icon={<IconEdit size={18} />}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedPriceMaster(category);
                                setModalOpen('edit');
                              }}
                            />
                            <Tooltip title="Remove">
                              <Popconfirm
                                title="Do you want to inactive price master?"
                                onConfirm={() => {
                                  handlePriceMasterStatus();
                                }}
                                placement="topRight"
                              >
                                <Button
                                  type="text"
                                  className="text-blue"
                                  icon={<IconTrash size={18} color="red" />}
                                  onClick={() => setSelectedPriceMaster(category)}
                                />
                              </Popconfirm>
                            </Tooltip>
                            <Button
                              type="text"
                              className=" text-gray-600 hover:text-blue-500 transition"
                            >
                              {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
                            </Button>
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
                              {category?.items?.map((item: IPriceListItem) => (
                                <PricingItem
                                  key={item?.priceListItemId}
                                  item={item}
                                  setSelectedPricelist={setSelectedPricelist}
                                  setModalOpen={setModalOpen}
                                  setDrawerOpen={setDrawerOpen}
                                  handleActivateItem={handleActivateItem}
                                  isEditable={isEditable}
                                />
                              ))}
                            </div>
                          ) : (
                            <div className="text-center flex flex-col justify-center gap-2 p-6 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                              <p className="text-base font-medium">No items here yet.</p>
                              <p className="text-sm">Click on the + icon to add items.</p>
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
  );
};
