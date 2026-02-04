import { Category } from '@redux/feature/color/iColourState';
import {
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconDotsVertical,
  IconEdit,
  IconPlus,
  IconTrash,
} from '@tabler/icons-react';
import { Button, Dropdown, Tooltip } from 'antd';
import { useState } from 'react';
import Loading from '@/components/common/Loading';
import { MoveColorItemModel } from './Models/MoveColorItemModel';
import { CopyType } from 'types/common.types';
import ImagePreview from './ImagePreview';
import { useAppSelector } from '@hooks/redux';

interface NestedItemProps {
  item: Category;
  handleClick: (action: string, categoryItem: any, actionType?: string) => void;
  subItems?: any[];
  onAdd?: () => void;
  isLoading?: boolean;
  onToggleDropdown?: (item: Category) => void;
  actionType?: string;
  handleCopy?: (item: Category, type: CopyType) => void;
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

   const { ColorGroup, Color, status } = useAppSelector(state => state.colour);
  let isActive = true;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [moveModel, setMoveModel] = useState(false);

  const handleDropdownClick = async () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    if (newState && onToggleDropdown) {
      await onToggleDropdown(item);
    }
  };

  const handleMove = () => {
    setMoveModel(true);
    handleClick('move', item, actionType);
  };

  const handleMoveSubmit = async (values) => {
    console.log(values);
    setMoveModel(false);
  };

  return (
    // <div className={`${isActive ? "bg-white" : "bg-gray-100"}   border border-gray-200 rounded-lg mb-2`}>
    <div className={`bg-gray-100   border border-gray-200 rounded-lg mb-2`}>
      <div
        className="flex items-center justify-between p-4 cursor-pointer"
        onClick={handleDropdownClick}
      >
        <div className="flex-1">
          <div className='flex items-center gap-3'>
            {/* <p className="font-bold text-lg line-clamp-2">{item?.name}</p> */}
            <p className={`font-bold text-lg line-clamp-2 ${isActive ? '' : 'text-gray-400'}`}>{item?.categoryName}</p>

            {/* {item?.group && item.group.map((group: string) => (
            <span key={group} className='bg-orange-400 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
            ))} */}
            <div className='flex gap-2 '>
              {item?.colorGroups && item?.colorGroups.map((group: string) => {
                const groupvalue = ColorGroup.find(c => c.colorGroupId === group) ;
                return(                  
                  <span key={group} className='bg-amber-900 text-white px-2 py-1 rounded-md text-xs'>{groupvalue.name}</span>
                )
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip title="Copy item">
            <Button
              className="p-2 !rounded-lg hover:!bg-green-50 transition !border-none !bg-transparent"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                handleCopy(item, "subcategory");

              }}
            >
              <IconCopy size={18} className="text-gray-600 hover:text-blue-600" />
            </Button>
          </Tooltip>
          {onAdd && (
            <Tooltip title="Add item">
              <Button
                className="p-1 rounded-md hover:!bg-gray-100 transition !border-none !bg-transparent"
                // disabled={item?.status !== "active"}
                onClick={e => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <IconPlus size={18} className='text-gray-600' />
                {/* <IconPlus size={18} className={`${item?.status === "active" ? 'text-gray-600' : 'text-gray-400'} `} /> */}
              </Button>
            </Tooltip>
          )}
          <Tooltip title="Edit">
            <Button
              className="p-1 rounded-md hover:!bg-gray-100 transition !border-none !bg-transparent"
              onClick={e => {
                e.stopPropagation();
                handleClick('edit', item, actionType);
              }}
            >
              <IconEdit size={18} className="text-gray-600" />
            </Button>
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              className="p-1 rounded-md hover:!bg-red-50 transition !border-none !bg-transparent"
              onClick={e => {
                e.stopPropagation();
                handleClick('delete', item, actionType);
              }}
            >
              <IconTrash size={18} className="text-gray-600 hover:text-red-600" />
            </Button>
          </Tooltip>
          <Button className="p-1 text-black !rounded-lg transition !border-none !bg-transparent">
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
                  key={subItem.id}
                  className={`${isActive ? "bg-white" : "bg-gray-100 text-gray-400"} p-3 rounded-md border border-gray-200 flex items-start justify-between`}
                >
                  <div className="flex flex-col gap-2">
                    <span>{subItem.name}</span>
                    {/* {item?.group && item.group.map((group: string) => (
            <span key={group} className='bg-orange-400 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
            ))} */}
                    <div className='flex gap-2 '>
                      {["Included"].map((group: string) => (
                        <span key={group} className='bg-indigo-500 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
                      ))}
                      {["Cost $100"].map((group: string) => (
                        <span key={group} className='bg-cyan-500 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
                      ))}
                      {["Premium"].map((group: string) => (
                        <span key={group} className='bg-violet-600 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
                      ))}
                      {["Fixed"].map((group: string) => (
                        <span key={group} className='bg-gray-500 text-white px-2 py-1 rounded-md text-xs'>{group}</span>
                      ))}
                    </div>

                  </div>
                  <div className="flex gap-2">
                    {subItem?.image && (
                      <ImagePreview src={subItem.image}
                      fileName={subItem.name} />
                    )}
                    <Button
                      className="p-2 rounded-lg hover:!bg-green-50 transition border-none !bg-transparent"
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopy(subItem, "subcategoryitem");
                      }}
                    >
                      <IconCopy size={18} className="text-gray-600 hover:text-blue-600" />
                    </Button>
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('edit', subItem, 'subCategoryItem');
                      }}
                      className="p-1 hover:bg-gray-100 rounded border-none !bg-transparent"
                    >
                      <IconEdit size={16} className="text-gray-600" />
                    </Button>
                    <Button
                      onClick={e => {
                        e.stopPropagation();
                        handleClick('delete', subItem, 'subCategoryItem');
                      }}
                      className="p-1 hover:bg-red-50 rounded border-none !bg-transparent"
                    >
                      <IconTrash size={16} className="text-gray-600 hover:text-red-600" />
                    </Button>
                    <div className="relative flex items-center">
                      <Dropdown
                        menu={{
                          items: [  
                            { key: 'move', label: 'Move' },
                          ],
                          onClick: e => {
                            if (e.key === 'move') handleMove();
                          },
                        }}
                      >
                        <span>
                          <IconDotsVertical size={18} stroke={2} className='' />
                        </span>
                      </Dropdown>
                    </div>
                  </div>
                </div>
              ))}
              {/* Modals */}
              {moveModel && (
                <MoveColorItemModel
                  open={moveModel}
                  setMoveModel={setMoveModel}
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
