import { useEffect, useState } from 'react';
import {
  IconPencil,
  IconPlus,
  IconRotate2,
  IconSearch,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { Button, Empty, Input, message, Select } from 'antd';
import { ColorGroupFields } from '@/components/formFields/colorGroupFields';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import ColorCategoryItemModel from '@/components/common/Models/ColorCategoryItemModel';
import { debouncedURL } from '@lib/utils/debounceURL';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import {
  createColourGroup,
  createColourGroupItem,
  deleteColourGroup,
  deleteColourGroupItem,
  deleteColourItem,
  fetchColourGroupItem,
  fetchColourGroupItems,
  fetchColourGroups,
  updateColourGroup,
} from '@redux/feature/color/colorThunk';
import { useSupplierHook } from '@hooks/useSupplierHook';
import TooltipButton from '@/components/common/TooltipButton';
import { Status } from '@lib/constants/enum';
import { ColorGroup, ColorItem } from '@redux/feature/color/iColourState';

const ColorGroupPage = () => {
  const dispatch = useAppDispatch();
  const { setParams, filters, instantFilters } = debouncedURL({
    filtersKey: ['search', 'supplier', 'groupSearch'],
  });
  const [selectedView, setSelectedView] = useState<'all' | 'selected'>('all');
  const [modalOpen, setModalOpen] = useState<
    'addColorGroup' | 'addColorSubCategory' | 'group' | 'item' | null
  >(null);
  const [selectedGroup, setSelectedGroup] = useState<ColorGroup | null>(null);
  const [selectedItem, setSelectedItem] = useState<ColorItem | null>(null);

  const { colorGroup, colorItems, status } = useAppSelector(state => state.colour);
  const { supplierOptions } = useSupplierHook();

  useEffect(() => {
    if (status.group.fetch === Status.IDLE) fetchColorGroup();
    if (status.colorGroupItem.fetch === Status.IDLE) {
      fetchColorItems();
    }
  }, [status.group.fetch, status.colorItem.fetch]);

  useEffect(() => {
    fetchColorGroupItems();
  }, [status.group.fetch]);

  const fetchColorGroup = async () => {
    try {
      await dispatch(fetchColourGroups()).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch color groups');
    }
  };

  const fetchColorGroupItems = async () => {
    try {
      await Promise.all(
        colorGroup.map(async i => await dispatch(fetchColourGroupItem(i.colorGroupId)).unwrap())
      );
    } catch (error) {
      message.error(error || 'Failed to fetch color group item');
    }
  };

  const fetchColorItems = async () => {
    try {
      await dispatch(
        fetchColourGroupItems({ color_group_id: selectedGroup?.colorGroupId })
      ).unwrap();
    } catch (error) {
      message.error(error || 'Failed to fetch color items');
    }
  };

  const handleRemoveItemFromGroup = async (id: string, itemId: string, groupId: string) => {
    try {
      if (!id || !itemId || !groupId) {
        message.error('error');
        return;
      }
      await dispatch(deleteColourGroupItem({ id, itemId, groupId })).unwrap();
      message.success('Item removed successfully');
    } catch (error) {
      message.error(error || 'Failed to remove item from group');
    }
  };

  const handleAddItemToGroup = async (item: ColorItem) => {
    try {
      if (!selectedGroup) {
        message.error('Group not selected');
        return;
      }
      await dispatch(
        createColourGroupItem({
          colorGroupId: selectedGroup?.colorGroupId,
          colorItemId: item.colorItemId,
        })
      ).unwrap();
      message.success('Item added successfully');
    } catch (error) {
      message.error(error || 'Failed to add item from group');
    }
  };

  const handleAddColourGroupSubmit = async values => {
    try {
      if (selectedGroup) {
        const payload = {
          ...values,
          status: values.status === 'active',
        };
        await dispatch(
          updateColourGroup({
            payload: payload,
            id: selectedGroup?.colorGroupId,
          })
        ).unwrap();
        message.success('Color group updated successfully');
      } else {
        await dispatch(createColourGroup(values)).unwrap();
        message.success('Color group created successfully');
      }
      setSelectedGroup(null);
      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Failed to save color group');
    }
  };

  const handleDeleteGroup = async () => {
    try {
      if (modalOpen === 'group') {
        await dispatch(deleteColourGroup(selectedGroup?.colorGroupId)).unwrap();
        message.success('Group deleted successfully');
        setSelectedGroup(null);
      } else {
        await dispatch(deleteColourItem({ id: selectedItem.colorItemId })).unwrap();
        message.success('Color Item deleted successfully');
        setSelectedItem(null);
      }

      setModalOpen(null);
    } catch (error) {
      message.error(error || 'Error deleting item');
    }
  };

  return (
    <div className="p-4">
      {/* header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[24px]/[30px] font-black my-4 text-[var(--font-color-bl)]">
          Color Group
        </h2>
        <div className="flex gap-3">
          <Button type="default" onClick={() => setModalOpen('addColorGroup')}>
            New Group
          </Button>
          <Button type="default" onClick={() => setModalOpen('addColorSubCategory')}>
            New Item
          </Button>
        </div>
      </div>
      {/* main content */}
      <div className="flex gap-4 ">
        {/* left side */}
        <div className="max-w-64 h-full !flex-shrink-0 flex flex-col gap-4 p-2 bg-card-color">
          <div>
            <Input
              addonBefore={<IconSearch size={20} />}
              onChange={e => {
                setParams({ groupSearch: e.target.value });
              }}
              value={instantFilters?.groupSearch}
              placeholder="Search Color Group...."
            />
          </div>
          <div className="flex flex-col ">
            {colorGroup?.map(item => (
              <div
                key={item.colorGroupId}
                onClick={() => setSelectedGroup(item)}
                className={` ${filters?.selectedGroup === item?.name || selectedGroup?.colorGroupId === item?.colorGroupId ? 'bg-primary text-white' : ''} group flex justify-between items-center px-2 py-4 border-b cursor-pointer`}
              >
                <p>{item.name}</p>
                {item.status ? (
                  <div>
                    <TooltipButton
                      type="text"
                      onClick={() => {
                        setSelectedGroup(item);
                        setModalOpen('addColorGroup');
                      }}
                      title="Edit"
                      icon={
                        <IconPencil
                          size={16}
                          className={` ${filters?.selectedGroup === item?.name ? '!text-white' : '!text-primary'}  group-hover:text-black transition-all`}
                        />
                      }
                    />
                    <TooltipButton
                      type="text"
                      onClick={() => {
                        setSelectedGroup(item);
                        setModalOpen('group');
                      }}
                      title="Delete"
                      icon={
                        <IconTrash
                          size={16}
                          className={` ${filters?.selectedGroup === item?.name ? '!text-white' : '!text-primary'}  group-hover:text-black transition-all`}
                        />
                      }
                    />
                  </div>
                ) : (
                  <TooltipButton title="Activate" type="text" icon={<IconPlus size={16} />} />
                )}
              </div>
            ))}
          </div>
        </div>
        {/* right side */}
        <div className="w-full">
          <div className="flex  items-center justify-between mb-4">
            <div className="flex w-[60%] gap-2">
              <Select
                options={supplierOptions}
                value={instantFilters?.supplier}
                onChange={e => {
                  setParams({ supplier: e });
                }}
                className="min-w-[200px]"
                placeholder="Select Supplier"
              />
              <Input
                addonBefore={<IconSearch size={20} />}
                onChange={e => {
                  setParams({ search: e.target.value });
                }}
                value={instantFilters?.search}
                placeholder="Search by Color item or item code"
                style={{ width: '60%' }}
              />

              <Button
                className={`block ${filters?.search || filters.supplier ? 'ml-4 !py-1 !px-2' : 'hidden'}`}
                onClick={() => {
                  setParams({ search: null, supplier: null });
                }}
              >
                Clear
              </Button>
            </div>
            <div className="flex">
              <Button
                type={selectedView === 'all' ? 'primary' : 'default'}
                className="!rounded-none"
                onClick={() => {
                  setSelectedView('all');
                  setParams({ search: null, supplier: null });
                }}
              >
                All
              </Button>
              <Button
                type={selectedView === 'selected' ? 'primary' : 'default'}
                className="!rounded-none"
                onClick={() => setSelectedView('selected')}
              >
                Selected
              </Button>
            </div>
          </div>

          <div className="flex flex-col">
            {colorItems.length > 0 ? (
              colorItems.map(item => {
                const i = item.colorGroups?.find(
                  g => g.colorGroupId === selectedGroup?.colorGroupId
                );

                const id = colorGroup
                  ?.find(i => i.colorGroupId === selectedGroup?.colorGroupId)
                  ?.items?.find(i => i.colorItemId === item.colorItemId)?.id;

                return (
                  <div
                    key={item.colorItemId}
                    className="group w-full bg-card-color py-4 px-6 border-b"
                  >
                    <div className="w-full grid grid-cols-[2fr_2fr_2fr_auto] items-center gap-4">
                      <p className="font-semibold line-clamp-1">{item.itemName}</p>
                      <p className="text-sm line-clamp-1">{item.itemCode}</p>
                      <p className="text-sm line-clamp-1">{item.description}</p>
                      <div className="flex justify-end gap-2">
                        {/* this button is there in the UI but no functionality of it shown in the video */}
                        <TooltipButton title="History" icon={<IconRotate2 size={18} />} />
                        {!!i ? (
                          <TooltipButton
                            title="Remove from group"
                            onClick={() => {
                              handleRemoveItemFromGroup(
                                id,
                                item.colorItemId,
                                selectedGroup?.colorGroupId
                              );
                            }}
                            icon={<IconX size={18} />}
                          />
                        ) : (
                          <TooltipButton
                            title="Add to group"
                            onClick={() => {
                              handleAddItemToGroup(item);
                            }}
                            icon={<IconPlus size={18} />}
                          />
                        )}
                        <TooltipButton
                          title="Delete"
                          onClick={() => {
                            setSelectedItem(item);
                            setModalOpen('item');
                          }}
                          icon={<IconTrash size={16} />}
                        />
                        <TooltipButton
                          title="Edit Item"
                          onClick={() => {
                            setSelectedItem(item);
                            setModalOpen('addColorSubCategory');
                          }}
                          icon={<IconPencil size={16} />}
                        />
                      </div>

                      <div className="col-span-full flex flex-wrap gap-2 mt-2">
                        {item.colorGroups &&
                          item.colorGroups.length > 0 &&
                          item.colorGroups.map((grp, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-gray-500 text-white px-2 py-1 rounded whitespace-nowrap"
                            >
                              {grp.colorGroupName}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <Empty
                description={<span className="text-gray-500">No Workflow Process found.</span>}
                className="py-12"
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {modalOpen === 'addColorGroup' && (
        <ActionDialogmodel
          title="Color"
          isEditing={!!selectedGroup}
          open={modalOpen === 'addColorGroup'}
          loading={false}
          onCancel={() => {
            setModalOpen(null);
          }}
          initialValues={{
            ...selectedGroup,
            status: selectedGroup?.status ? 'active' : 'inactive',
          }}
          onSubmit={handleAddColourGroupSubmit}
          fields={ColorGroupFields(!!selectedGroup)}
        />
      )}

      {modalOpen === 'addColorSubCategory' && (
        <ColorCategoryItemModel
          open={modalOpen === 'addColorSubCategory'}
          onClose={() => {
            setSelectedItem(null);
            setModalOpen(null);
          }}
          categoryItem={selectedItem}
          type="group"
        />
      )}

      {['group', 'item'].includes(modalOpen) && (
        <ConfirmationModal
          loading={false} //todo
          open={['group', 'item'].includes(modalOpen)}
          onClose={() => {
            setSelectedGroup(null);
            setSelectedItem(null);
            setModalOpen(null);
          }}
          onConfirm={() => {
            handleDeleteGroup();
          }}
          type="danger"
          title="Conformation"
          confirmText="Inactivate"
          message={
            modalOpen === 'group'
              ? 'Color Group : ' +
                selectedGroup?.name +
                ' is been used in existing color selections.\n ' +
                selectedGroup?.name +
                " can't be deleted . You can inactivate the color group if not required.\n Are you sure you want to inactivate"
              : 'Color Item : ' +
                selectedItem?.itemName +
                ' is been used in existing color item selections.\n ' +
                selectedItem?.itemName +
                " can't be deleted . You can inactivate the color item if not required.\n Are you sure you want to inactivate"
          }
        />
      )}
    </div>
  );
};
export default ColorGroupPage;
