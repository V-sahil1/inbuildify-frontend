import { useEffect, useState } from 'react';
import {
  IconPencil,
  IconPlus,
  IconRotate2,
  IconSearch,
  IconTrash,
  IconX,
} from '@tabler/icons-react';
import { Button, Empty, Input, Select } from 'antd';
import { useUsersHook } from '@hooks/useUserHook';
import { ColorGroupFields } from '@/components/formFields/colorGroupFields';
import { colorGroup, ColorItems } from 'data/color/ColorData';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { ActionDialogmodel } from '@/components/common/Models/ActionDialogModel';
import ColorCategoryItemModel from '@/components/common/Models/ColorCategoryItemModel';
import { debouncedURL } from '@lib/utils/debounceURL';

const ColorGroupPage = () => {
  const { setParams, filters } = debouncedURL({
    filtersKey: ['search', 'supplier', 'groupSearch', 'selectedGroup'],
  });
  const [selectedView, setSelectedView] = useState<'all' | 'selected'>('all');
  const [colorItemData, setColorItemData] = useState(ColorItems);
  const [filterdItems, setFilterdItems] = useState<any[]>(ColorItems);
  const [modalOpen, setModalOpen] = useState<
    'addColorGroup' | 'addColorSubCategory' | 'group' | 'item' | null
  >(null);
  const [groupItemData, setGroupItemData] = useState<any[]>(colorGroup);
  const [selectedEditGroup, setSelectedEditGroup] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [selectedGroupItem, setSelectedGroupItem] = useState<any>();
  //replace this withe subcategoryId in the item object
  const colorSubCategoryId = '1';
  const { userOptions } = useUsersHook();
  let filteredGroups = filters.groupSearch
    ? groupItemData.filter(g => g.name.toLowerCase().includes(filters?.groupSearch?.toLowerCase()))
    : groupItemData;
  useEffect(() => {
    setParams({ selectedGroup: groupItemData[0]?.value });
  }, []);

  useEffect(() => {
    let data = [...colorItemData];
    // if view = selected → show only items that contain selectedGroup
    if (selectedView === 'selected') {
      data = data.filter(item =>
        item?.group?.some((group: any) => group === filters?.selectedGroup)
      );
    }
    if (filters?.supplier) {
      data = data.filter(item => item.supplierId === filters?.supplier);
    }

    if (filters.search && filters?.search?.trim() !== '') {
      const s = filters?.search?.toLowerCase();
      data = data.filter(
        item => item.name.toLowerCase().includes(s) || item.itemCode.toLowerCase().includes(s)
      );
    }
    setFilterdItems(data);
  }, [filters?.selectedGroup, selectedView, filters?.search, filters?.supplier]);
  useEffect(() => {
    setFilterdItems(colorItemData);
  }, [colorItemData]);

  const handleAddColorItem = values => {
    selectedGroupItem
      ? setColorItemData(prev =>
        prev.map(i => (i.id === selectedGroupItem.id ? { ...i, ...values } : i))
      )
      : setColorItemData(prev => [
        ...prev,
        { ...values, id: Math.floor(Math.random() * 100000).toString() },
      ]);
  };

  const handleRemoveItemFromGroup = (item: any) => {
    // Update the filtered items
    setFilterdItems(prevItems =>
      prevItems.map(i =>
        i.id === item.id
          ? { ...i, group: i.group.filter((g: any) => g !== filters?.selectedGroup) }
          : i
      )
    );

    // Update the original ColorItems array
    const index = colorItemData.findIndex(i => i.id === item.id);
    if (index !== -1) {
      colorItemData[index] = {
        ...colorItemData[index],
        group: colorItemData[index].group.filter((g: any) => g !== filters?.selectedGroup),
      };
    }
  };

  const handleAddItemToGroup = (item: any) => {
    const groupToAdd = groupItemData.find(g => g.value === filters?.selectedGroup);
    if (!groupToAdd) return;

    const newGroup = filters?.selectedGroup;

    // Update the filtered items
    setFilterdItems(prevItems =>
      prevItems.map(i =>
        i.id === item.id
          ? {
            ...i,
            group: i.group ? [...i.group, newGroup] : [newGroup],
          }
          : i
      )
    );

    // Update the original ColorItems array
    const index = colorItemData.findIndex(i => i.id === item.id);
    if (index !== -1) {
      const currentItem = colorItemData[index];
      colorItemData[index] = {
        ...currentItem,
        group: currentItem.group ? [...currentItem.group, newGroup] : [newGroup],
      };
    }
  };

  const handleAddColourGroupSubmit = (values: any) => {
    setLoading(true);
    selectedEditGroup
      ? setGroupItemData(prev => {
        const updated = prev.map(i =>
          i.id === selectedEditGroup.id ? { ...i, ...values, value: values.name } : i
        );
        filteredGroups = updated;
        return updated;
      })
      : setGroupItemData(prev => {
        const updated = [
          ...prev,
          { ...values, value: values.name, id: Math.floor(Math.random() * 100000).toString() },
        ];
        filteredGroups = updated;
        return updated;
      });
    setSelectedEditGroup(null);
    setModalOpen(null);
    setLoading(false);
  };

  const handleDeleteGroup = (id: string) => {
    modalOpen === 'item'
      ? setColorItemData(prev => prev.filter(i => i.id !== id))
      : setGroupItemData(prev => prev.filter(i => i.id !== id));
    setModalOpen(null);
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
              placeholder="Search Color Group...."
            />
          </div>
          <div className="flex flex-col ">
            {filteredGroups.map(item => (
              <div
                key={item.value}
                onClick={() => setParams({ selectedGroup: item.value })}
                className={` ${filters?.selectedGroup === item?.value ? 'bg-primary text-white' : ''} group flex justify-between items-center px-2 py-4 border-b cursor-pointer`}
              >
                <p>{item.name}</p>
                <div>
                  <Button
                    type="text"
                    onClick={() => {
                      setSelectedEditGroup(item);
                      setModalOpen('addColorGroup');
                    }}
                    icon={
                      <IconPencil
                        size={16}
                        className={` ${filters.selectedGroup === item?.value ? '!text-white' : '!text-primary'}  group-hover:text-black transition-all`}
                      />
                    }
                  />
                  <Button
                    type="text"
                    onClick={() => {
                      setSelectedGroupItem(item);
                      setModalOpen('group');
                    }}
                    icon={
                      <IconTrash
                        size={16}
                        className={` ${filters.selectedGroup === item?.value ? '!text-white' : '!text-primary'}  group-hover:text-black transition-all`}
                      />
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* right side */}
        <div className="w-full">
          <div className="flex  items-center justify-between mb-4">
            <div className="flex w-[60%] gap-2">
              <Select
                options={userOptions}
                value={filters?.supplier}
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
                value={filters?.search}
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
                  setFilterdItems(colorItemData);
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
            {filterdItems.length > 0 ? (
              filterdItems.map(item => (
                <div key={item.id} className="group w-full bg-card-color py-4 px-6 border-b">
                  <div className="w-full grid grid-cols-[2fr_2fr_2fr_auto] items-center gap-4">
                    <p className="font-semibold line-clamp-1">{item.name}</p>
                    <p className="text-sm line-clamp-1">{item.itemCode}</p>
                    <p className="text-sm line-clamp-1">{item.description}</p>
                    <div className="flex justify-end gap-2">
                      {/* this button is there in the UI but no functionality of it shown in the video */}
                      <Button type="text" icon={<IconRotate2 size={18} />} />
                      {item.group?.some((g: any) => g === filters.selectedGroup) ? (
                        <Button
                          type="text"
                          onClick={() => {
                            handleRemoveItemFromGroup(item);
                          }}
                          icon={<IconX size={18} />}
                        />
                      ) : (
                        <Button
                          type="text"
                          onClick={() => {
                            handleAddItemToGroup(item);
                          }}
                          icon={<IconPlus size={18} />}
                        />
                      )}
                      <Button
                        type="text"
                        onClick={() => {
                          setSelectedGroupItem(item);
                          setModalOpen('item');
                        }}
                        icon={<IconTrash size={16} />}
                      />
                      <Button
                        type="text"
                        onClick={() => {
                          setSelectedGroupItem(item);
                          setModalOpen('addColorSubCategory');
                          console.log('item', item);
                        }}
                        icon={<IconPencil size={16} />}
                      />
                    </div>

                    <div className="col-span-full flex flex-wrap gap-2 mt-2">
                      <span className="text-xs bg-orange-400 text-white px-2 py-1 rounded whitespace-nowrap">
                        {userOptions.filter(i => i.value === item.supplierId)[0]?.label}
                      </span>
                      {item.group &&
                        item.group.length > 0 &&
                        item.group.map((grp, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-500 text-white px-2 py-1 rounded whitespace-nowrap"
                          >
                            {grp}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              ))
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
          isEditing={!!selectedEditGroup}
          open={modalOpen === 'addColorGroup'}
          loading={loading}
          onCancel={() => {
            setSelectedEditGroup(null);
            setModalOpen(null);
          }}
          initialValues={{
            ...selectedEditGroup,
          }}
          onSubmit={handleAddColourGroupSubmit}
          fields={ColorGroupFields()}
        />
      )}

      {modalOpen === 'addColorSubCategory' && (
        <ColorCategoryItemModel
          open={modalOpen === 'addColorSubCategory'}
          onClose={() => {
            setSelectedGroupItem(null);
            setModalOpen(null);
          }}
          selectedColorSubCategoryId={colorSubCategoryId}
          categoryItem={selectedGroupItem}
          handleAddColorItem={handleAddColorItem}
        />
      )}

      {['group', 'item'].includes(modalOpen) && (
        <ConfirmationModal
          loading={loading}
          open={['group', 'item'].includes(modalOpen)}
          onClose={() => {
            setModalOpen(null);
          }}
          onConfirm={() => handleDeleteGroup(selectedGroupItem?.id)}
          type="danger"
          title="Conformation"
          confirmText="Inactivate"
          message={
            modalOpen === 'group'
              ? 'Color Group : ' +
              selectedGroupItem?.name +
              ' is been used in existing color selections.\n ' +
              selectedGroupItem.name +
              " can't be deleted . You can inactivate the color group if not required.\n Are you sure you want to inactivate"
              : 'Color Item : ' +
              selectedGroupItem.name +
              ' is been used in existing color item selections.\n ' +
              selectedGroupItem.name +
              " can't be deleted . You can inactivate the color item if not required.\n Are you sure you want to inactivate"
          }
        />
      )}
    </div>
  );
};
export default ColorGroupPage;
