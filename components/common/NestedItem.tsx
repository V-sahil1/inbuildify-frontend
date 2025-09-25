import { SubCategory } from "@redux/feature/color/iColourState";
import {
  IconChevronDown,
  IconChevronUp,
  IconEdit,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Spin } from "antd";
import { useState } from "react";

interface NestedItemProps {
  item: SubCategory;
  handleClick: (action: string, categoryItem: any, actionType?: string) => void;
  subItems?: any[];
  onAdd?: () => void;
  loading?: boolean;
  onToggleDropdown?: (item: SubCategory) => void;
  actionType?: string;
}

export const NestedItem = ({
  item,
  handleClick,
  subItems = [],
  onAdd,
  loading = false,
  onToggleDropdown,
  actionType,
}: NestedItemProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen && onToggleDropdown) {
      onToggleDropdown(item);
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
            <button
              className="p-2 rounded-lg hover:bg-green-50 transition"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              <IconPlus size={18} className="text-green-600" />
            </button>
          )}

          <button
            className="p-2 rounded-lg hover:bg-blue-50 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleClick("edit", item, actionType);
            }}
          >
            <IconEdit size={20} />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-red-50 transition"
            onClick={(e) => {
              e.stopPropagation();
              handleClick("delete", item, actionType);
            }}
          >
            <IconTrash size={20} />
          </button>

          {actionType !== "subCategoryItem" && (
            <button className="p-2 rounded-lg">
              {isDropdownOpen ? <IconChevronUp /> : <IconChevronDown />}
            </button>
          )}
        </div>
      </div>

      {isDropdownOpen && (
        <div className="px-4 pb-4">
          {loading ? (
            <div className="flex justify-center items-center py-10 gap-4 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 h-[85px]">
              <Spin size="large" />
            </div>
          ) : subItems.length > 0 ? (
            <div className="mt-2 space-y-2">
              {subItems.map((subItem) => (
                <NestedItem
                  key={subItem.colorItemId}
                  item={subItem}
                  handleClick={handleClick}
                  actionType="subCategoryItem"
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
              <p>No items here yet.</p>
              {onAdd && <p>Click on the + icon to add.</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
