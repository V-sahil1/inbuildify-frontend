import { SubCategory } from '@redux/feature/color/iColourState';
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconLink,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Tooltip } from 'antd';
import { useState } from 'react';
import Loading from '@/components/common/Loading';

interface NestedItemProps {
  item: SubCategory;
  handleClick: (action: string, categoryItem: any, actionType?: string) => void;
  subItems?: any[];
  onAdd?: () => void;
  isLoading?: boolean;
  onToggleDropdown?: (item: SubCategory) => void;
  actionType?: string;
}

export const NestedItem = ({
  item,
  handleClick,
  subItems = [],
  onAdd,
  isLoading = false,
  onToggleDropdown,
  actionType,
}: NestedItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = async () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    if (newState && onToggleDropdown) {
      await onToggleDropdown(item);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg mb-2">
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={handleDropdownClick}
      >
        <div className="flex-1">
          <p className="font-bold text-lg line-clamp-2">{item?.name}</p>
        </div>
        <div className="flex items-center gap-2">
          {onAdd && (
            <Tooltip title="Add item">
              <button
                className="p-1 rounded-md hover:bg-gray-100"
                onClick={e => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <IconPlus size={18} className="text-gray-600" />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <button
              className="p-1 rounded-md hover:bg-gray-100"
              onClick={e => {
                e.stopPropagation();
                handleClick('edit', item, actionType);
              }}
            >
              <IconEdit size={18} className="text-gray-600" />
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="p-1 rounded-md hover:bg-red-50"
              onClick={e => {
                e.stopPropagation();
                handleClick('delete', item, actionType);
              }}
            >
              <IconTrash size={18} className="text-red-500" />
            </button>
          </Tooltip>
          <button className="p-1">
            {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
          </button>
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
                  key={subItem.id}
                  className="bg-white p-3 rounded-md border border-gray-200 flex items-center justify-between"
                >
                  <span>{subItem.name}</span>
                  <div className="flex gap-2">
                    {subItem?.image && (
                      <Tooltip title="view attachment">
                        <button
                          className="rounded-md p-1 group"
                          onClick={() => window.open(subItem.image, '_blank')}
                        >
                          <IconLink size={20} className="text-font-color group-hover:text-blue" />
                        </button>
                      </Tooltip>
                    )}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('edit', subItem, 'subCategoryItem');
                      }}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <IconEdit size={16} className="text-gray-600" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('delete', subItem, 'subCategoryItem');
                      }}
                      className="p-1 hover:bg-red-50 rounded"
                    >
                      <IconTrash size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
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
