import { Category, ColorItem } from '@redux/feature/color/iColourState';
import {
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Button, Dropdown, message, Tag } from 'antd';
import { useState } from 'react';
import Loading from '@/components/common/Loading';
import { MoveColorItemModel } from './Models/MoveColorItemModel';
import { CopyType } from 'types/common.types';
import { useAppDispatch, useAppSelector } from '@hooks/redux';
import TooltipButton from './TooltipButton';
import { moveColourItem } from '@redux/feature/color/colorThunk';

interface NestedItemProps {
  item: Category;
  handleClick: (action: string, categoryItem: Category | ColorItem, actionType?: string) => void;
  subItems?: ColorItem[];
  onAdd?: () => void;
  isLoading?: boolean;
  onToggleDropdown?: (item: Category) => void;
  actionType?: string;
  handleCopy?: (item: Category | ColorItem, type: CopyType) => void;
}

export const NestedItem = ({
  item,
  handleClick,
  subItems = [],
  onAdd,
  isLoading = false,
  onToggleDropdown,
  handleCopy,
  actionType,
}: NestedItemProps) => {
  const dispatch = useAppDispatch();
  const { colorGroup } = useAppSelector(state => state.colour);
  let isActive = true;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ColorItem | null>(null);

  const handleDropdownClick = async () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    if (newState && onToggleDropdown) {
      await onToggleDropdown(item);
    }
  };

  const handleMoveSubmit = async values => {
    try {
      await dispatch(
        moveColourItem({
          data: values,
          id: selectedItem?.colorItemId,
          colorCategoryId: selectedItem?.colorCategoryId,
        })
      ).unwrap();
      message.success('Item moved successfully');
      setSelectedItem(null);
    } catch (error) {
      message.error(error || 'Failed to move item');
    }
  };

  return (
    <div className={`bg-gray-100   border border-gray-200 rounded-lg mb-2`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={handleDropdownClick}
      >
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <p className={`font-bold text-lg line-clamp-2 ${isActive ? '' : 'text-gray-400'}`}>
              {item?.categoryName}
            </p>

            <div className="flex gap-2 ">
              {item?.colorGroups &&
                item?.colorGroups.map((group: string) => {
                  const groupvalue = colorGroup.find(c => c.colorGroupId === group);
                  return (
                    <span
                      key={group}
                      className="bg-amber-900 text-white px-2 py-1 rounded-md text-xs"
                    >
                      {groupvalue.name}
                    </span>
                  );
                })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipButton
            title="Copy item"
            type="text"
            size="small"
            className="p-2 !rounded-lg hover:!bg-green-50 transition !border-none !bg-transparent"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              handleCopy(item, 'subcategory');
            }}
            icon={<IconCopy size={18} />}
          />

          {onAdd && (
            <TooltipButton
              title="Add item"
              type="text"
              size="small"
              onClick={e => {
                e.stopPropagation();
                onAdd();
              }}
              icon={<IconPlus size={18} />}
            />
          )}

          <TooltipButton
            title="Edit"
            type="text"
            size="small"
            icon={<IconEdit size={18} />}
            onClick={e => {
              e.stopPropagation();
              handleClick('edit', item, actionType);
            }}
          />

          <TooltipButton
            title="Delete"
            type="text"
            size="small"
            icon={<IconTrash size={18} />}
            onClick={e => {
              e.stopPropagation();
              handleClick('delete', item, actionType);
            }}
          />

          <Button
            type="text"
            size="small"
            className="p-1 text-black !rounded-lg transition !border-none !bg-transparent"
          >
            {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
          </Button>
        </div>
      </div>

      {isDropdownOpen && (
        <div className="px-4 pb-4">
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loading type="primary" />
            </div>
          ) : subItems?.length > 0 ? (
            <div className="space-y-2">
              {subItems.map(subItem => (
                <div
                  key={subItem.colorItemId}
                  className={`${isActive ? 'bg-white' : 'bg-gray-100 text-gray-400'} p-3 rounded-md border border-gray-200 flex items-start justify-between`}
                >
                  <div className="flex flex-col gap-2">
                    <span>{subItem.itemName}</span>
                    <div className="flex gap-2 ">
                      {subItem?.costType && <Tag color="blue">{subItem?.costType}</Tag>}
                      {subItem?.cost && <Tag color="purple">cost : {subItem?.cost}</Tag>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <TooltipButton
                      title="Copy"
                      className="p-2 rounded-lg hover:!bg-green-50 transition border-none !bg-transparent"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(subItem, 'subcategoryitem');
                      }}
                      type="text"
                      size="small"
                      icon={<IconCopy size={18} />}
                    />

                    <TooltipButton
                      title="Edit"
                      size="small"
                      type="text"
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('edit', subItem, 'subCategoryItem');
                      }}
                      icon={<IconEdit size={18} />}
                    />

                    <TooltipButton
                      title="Delete"
                      size="small"
                      type="text"
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('delete', subItem, 'subCategoryItem');
                      }}
                      icon={<IconTrash size={18} color="red" />}
                    />

                    <div className="relative flex items-center">
                      <Dropdown
                        menu={{
                          items: [{ key: 'move', label: 'Move' }],
                          onClick: e => {
                            if (e.key === 'move') setSelectedItem(subItem);
                          },
                        }}
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<IconDotsVertical size={18} stroke={2} className="" />}
                        />
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ))}
              {/* Modals */}
              {!!selectedItem && (
                <MoveColorItemModel
                  open={!!selectedItem}
                  setMoveModel={() => {
                    setSelectedItem(null);
                  }}
                  onSubmit={handleMoveSubmit}
                />
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No items found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default NestedItem;
